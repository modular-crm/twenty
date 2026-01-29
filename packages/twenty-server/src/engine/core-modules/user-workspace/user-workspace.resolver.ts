import { Logger, UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { type FileUpload } from 'graphql-upload/processRequest.mjs';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import { isDefined } from 'twenty-shared/utils';

import { FileFolder } from 'src/engine/core-modules/file/interfaces/file-folder.interface';

import { LoginTokenService } from 'src/engine/core-modules/auth/token/services/login-token.service';
import { SignedFileDTO } from 'src/engine/core-modules/file/file-upload/dtos/signed-file.dto';
import { FileUploadService } from 'src/engine/core-modules/file/file-upload/services/file-upload.service';
import { FileService } from 'src/engine/core-modules/file/services/file.service';
import { PreventNestToAutoLogGraphqlErrorsFilter } from 'src/engine/core-modules/graphql/filters/prevent-nest-to-auto-log-graphql-errors.filter';
import { ResolverValidationPipe } from 'src/engine/core-modules/graphql/pipes/resolver-validation.pipe';
import { AddUserToWorkspaceInput } from 'src/engine/core-modules/user-workspace/dtos/add-user-to-workspace.input';
import { AddUserToWorkspaceOutput } from 'src/engine/core-modules/user-workspace/dtos/add-user-to-workspace.output';
import { UserWorkspaceService } from 'src/engine/core-modules/user-workspace/user-workspace.service';
import {
  type FullNameDTO,
  type WorkspaceMemberDTO,
} from 'src/engine/core-modules/user/dtos/workspace-member.dto';
import { AuthProviderEnum } from 'src/engine/core-modules/workspace/types/workspace.type';
import { type WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { AuthWorkspace } from 'src/engine/decorators/auth/auth-workspace.decorator';
import { SettingsPermissionGuard } from 'src/engine/guards/settings-permission.guard';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import { PermissionFlagType } from 'src/engine/metadata-modules/permissions/constants/permission-flag-type.constants';
import { PermissionsGraphqlApiExceptionFilter } from 'src/engine/metadata-modules/permissions/utils/permissions-graphql-api-exception.filter';
import { fromRoleEntitiesToRoleDtos } from 'src/engine/metadata-modules/role/utils/fromRoleEntityToRoleDto.util';
import { UserRoleService } from 'src/engine/metadata-modules/user-role/user-role.service';
import {
  type WorkspaceMemberDateFormatEnum,
  type WorkspaceMemberNumberFormatEnum,
  type WorkspaceMemberTimeFormatEnum,
} from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';
import { streamToBuffer } from 'src/utils/stream-to-buffer';

@Resolver()
export class UserWorkspaceResolver {
  private readonly logger = new Logger(UserWorkspaceResolver.name);

  constructor(
    private readonly fileUploadService: FileUploadService,
    private readonly fileService: FileService,
    private readonly userWorkspaceService: UserWorkspaceService,
    private readonly userRoleService: UserRoleService,
    private readonly loginTokenService: LoginTokenService,
  ) {}

  @Mutation(() => SignedFileDTO)
  @UseGuards(
    WorkspaceAuthGuard,
    SettingsPermissionGuard(PermissionFlagType.WORKSPACE_MEMBERS),
  )
  async uploadWorkspaceMemberProfilePicture(
    @AuthWorkspace() { id: workspaceId }: WorkspaceEntity,
    @Args({ name: 'file', type: () => GraphQLUpload })
    { createReadStream, filename, mimetype }: FileUpload,
  ): Promise<SignedFileDTO> {
    const stream = createReadStream();
    const buffer = await streamToBuffer(stream);
    const fileFolder = FileFolder.ProfilePicture;

    const { files } = await this.fileUploadService.uploadImage({
      file: buffer,
      filename,
      mimeType: mimetype,
      fileFolder,
      workspaceId,
    });

    return files[0];
  }

  @Mutation(() => AddUserToWorkspaceOutput)
  @UseGuards(
    WorkspaceAuthGuard,
    SettingsPermissionGuard(PermissionFlagType.WORKSPACE_MEMBERS),
  )
  @UsePipes(ResolverValidationPipe)
  @UseFilters(
    PermissionsGraphqlApiExceptionFilter,
    PreventNestToAutoLogGraphqlErrorsFilter,
  )
  async addUserToWorkspace(
    @Args() input: AddUserToWorkspaceInput,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<AddUserToWorkspaceOutput> {
    const { userId, email, roleId } = input;

    if (!isDefined(userId) && !isDefined(email)) {
      return {
        success: false,
        error: 'Either userId or email must be provided',
      };
    }

    const user = isDefined(userId)
      ? await this.userWorkspaceService.findUserById(userId)
      : await this.userWorkspaceService.findUserByEmail(email as string);

    if (!user) {
      const identifier = isDefined(userId) ? `ID ${userId}` : `email ${email}`;

      return {
        success: false,
        error: `User with ${identifier} not found`,
      };
    }

    if (isDefined(roleId)) {
      const role = await this.userWorkspaceService.findRoleByIdInWorkspace(
        roleId,
        workspace.id,
      );

      if (!role) {
        return {
          success: false,
          error: `Role with ID ${roleId} not found in this workspace`,
        };
      }
    }

    const { workspaceMember, isNewMember } =
      await this.userWorkspaceService.addUserToWorkspace({
        user,
        workspace,
        roleId,
      });

    const userWorkspace =
      await this.userWorkspaceService.getUserWorkspaceForUserOrThrow({
        userId: user.id,
        workspaceId: workspace.id,
      });

    const rolesMap = await this.userRoleService.getRolesByUserWorkspaces({
      userWorkspaceIds: [userWorkspace.id],
      workspaceId: workspace.id,
    });
    const userWorkspaceRoles = rolesMap.get(userWorkspace.id) ?? [];

    const avatarUrl = workspaceMember.avatarUrl
      ? this.fileService.signFileUrl({
          url: workspaceMember.avatarUrl,
          workspaceId: workspace.id,
        })
      : '';

    const workspaceMemberDto: WorkspaceMemberDTO = {
      id: workspaceMember.id,
      name: workspaceMember.name as FullNameDTO,
      userEmail: workspaceMember.userEmail ?? '',
      avatarUrl,
      userWorkspaceId: userWorkspace.id,
      colorScheme: workspaceMember.colorScheme,
      dateFormat: workspaceMember.dateFormat as WorkspaceMemberDateFormatEnum,
      locale: workspaceMember.locale,
      timeFormat: workspaceMember.timeFormat as WorkspaceMemberTimeFormatEnum,
      timeZone: workspaceMember.timeZone,
      roles: fromRoleEntitiesToRoleDtos(userWorkspaceRoles),
      calendarStartDay: workspaceMember.calendarStartDay,
      numberFormat:
        workspaceMember.numberFormat as WorkspaceMemberNumberFormatEnum,
    };

    let loginToken: string | undefined;

    if (isNewMember) {
      const token = await this.loginTokenService.generateLoginToken(
        user.email,
        workspace.id,
        AuthProviderEnum.Password,
      );

      loginToken = token.token;

      this.logger.log(
        `Login token generated for user ${user.email} (userId: ${user.id}) in workspace ${workspace.id}`,
      );
    }

    return {
      success: true,
      workspaceMember: workspaceMemberDto,
      loginToken,
      error: isNewMember
        ? undefined
        : 'User was already a member of this workspace',
    };
  }
}
