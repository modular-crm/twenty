import { ArgsType, Field, ID } from '@nestjs/graphql';

import { IsEmail, IsOptional, IsUUID } from 'class-validator';

@ArgsType()
export class AddUserToWorkspaceInput {
  @Field(() => ID, {
    nullable: true,
    description: 'Twenty user ID to add to workspace',
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @Field(() => String, {
    nullable: true,
    description: 'Email of the user to find and add to workspace',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field(() => ID, {
    nullable: true,
    description: 'Role ID to assign (defaults to workspace default role)',
  })
  @IsOptional()
  @IsUUID()
  roleId?: string;
}
