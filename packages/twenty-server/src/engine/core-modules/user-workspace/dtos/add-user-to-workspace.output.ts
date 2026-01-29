import { Field, ObjectType } from '@nestjs/graphql';

import { WorkspaceMemberDTO } from 'src/engine/core-modules/user/dtos/workspace-member.dto';

@ObjectType()
export class AddUserToWorkspaceOutput {
  @Field(() => Boolean, {
    description: 'Whether the operation was successful',
  })
  success: boolean;

  @Field(() => String, {
    nullable: true,
    description: 'Error message if the operation failed',
  })
  error?: string;

  @Field(() => WorkspaceMemberDTO, {
    nullable: true,
    description: 'The created or existing workspace member',
  })
  workspaceMember?: WorkspaceMemberDTO;

  @Field(() => String, {
    nullable: true,
    description:
      'One-time login token for the added user, can be exchanged for access tokens via getAuthTokensFromLoginToken',
  })
  loginToken?: string;
}
