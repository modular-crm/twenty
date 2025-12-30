import { msg } from '@lingui/core/macro';
import { STANDARD_OBJECT_IDS } from 'twenty-shared/metadata';
import { FieldMetadataType, RelationOnDeleteAction } from 'twenty-shared/types';
import { RelationType } from 'src/engine/metadata-modules/field-metadata/interfaces/relation-type.interface';
import { Relation } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/relation.interface';
import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { WorkspaceEntity } from 'src/engine/twenty-orm/decorators/workspace-entity.decorator';
import { WorkspaceField } from 'src/engine/twenty-orm/decorators/workspace-field.decorator';
import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
import { PIPELINE_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';

import { PipelineStageWorkspaceEntity } from './pipeline-stage.workspace-entity';
import { LeadWorkspaceEntity } from 'src/modules/lead/standard-objects/lead.workspace-entity';
import { DealWorkspaceEntity } from 'src/modules/deal/standard-objects/deal.workspace-entity';

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.pipeline,
  namePlural: 'pipelines',
  labelSingular: msg`Pipeline`,
  labelPlural: msg`Pipelines`,
  description: msg`A pipeline`,
  icon: 'IconLayoutKanban',
  shortcut: 'P',
  labelIdentifierStandardId: PIPELINE_STANDARD_FIELD_IDS.name,
})
export class PipelineWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceField({
    standardId: PIPELINE_STANDARD_FIELD_IDS.name,
    type: FieldMetadataType.TEXT,
    label: msg`Name`,
    description: msg`The pipeline name`,
    icon: 'IconLayoutKanban',
  })
  name: string;

  @WorkspaceField({
    standardId: PIPELINE_STANDARD_FIELD_IDS.isDefault,
    type: FieldMetadataType.BOOLEAN,
    label: msg`Is Default`,
    description: msg`Whether this is the default pipeline`,
    icon: 'IconCheck',
    defaultValue: false,
  })
  isDefault: boolean;

  @WorkspaceRelation({
    standardId: PIPELINE_STANDARD_FIELD_IDS.pipelineStages,
    type: RelationType.ONE_TO_MANY,
    label: msg`Stages`,
    description: msg`Stages in this pipeline`,
    icon: 'IconList',
    inverseSideTarget: () => PipelineStageWorkspaceEntity,
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  pipelineStages: Relation<PipelineStageWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: PIPELINE_STANDARD_FIELD_IDS.leads,
    type: RelationType.ONE_TO_MANY,
    label: msg`Leads`,
    description: msg`Leads in this pipeline`,
    icon: 'IconTargetArrow',
    inverseSideTarget: () => LeadWorkspaceEntity,
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  leads: Relation<LeadWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: PIPELINE_STANDARD_FIELD_IDS.deals,
    type: RelationType.ONE_TO_MANY,
    label: msg`Deals`,
    description: msg`Deals in this pipeline`,
    icon: 'IconCurrencyDollar',
    inverseSideTarget: () => DealWorkspaceEntity,
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  deals: Relation<DealWorkspaceEntity[]>;
}
