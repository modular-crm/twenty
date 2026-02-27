import { Field, InputType } from '@nestjs/graphql';

import { IsBoolean, IsOptional, IsString } from 'class-validator';

@InputType()
export class ActivateWorkspaceInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  displayName?: string;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  skipSampleData?: boolean;
}
