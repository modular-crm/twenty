import { msg } from '@lingui/core/macro';
import { STANDARD_OBJECT_IDS } from 'twenty-shared/metadata';
import { FieldMetadataType, RelationOnDeleteAction } from 'twenty-shared/types';
import { RelationType } from 'src/engine/metadata-modules/field-metadata/interfaces/relation-type.interface';
import { Relation } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/relation.interface';
import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { WorkspaceEntity } from 'src/engine/twenty-orm/decorators/workspace-entity.decorator';
import { WorkspaceField } from 'src/engine/twenty-orm/decorators/workspace-field.decorator';
import { WorkspaceJoinColumn } from 'src/engine/twenty-orm/decorators/workspace-join-column.decorator';
import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
import { PIPELINE_STAGE_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { PipelineWorkspaceEntity } from './pipeline.workspace-entity';
import { LeadWorkspaceEntity } from 'src/modules/lead/standard-objects/lead.workspace-entity';
import { DealWorkspaceEntity } from 'src/modules/deal/standard-objects/deal.workspace-entity';

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.pipelineStage,
  namePlural: 'pipelineStages',
  labelSingular: msg`Pipeline Stage`,
  labelPlural: msg`Pipeline Stages`,
  description: msg`A stage in a pipeline`,
  icon: 'IconList', 
  shortcut: 'S',
  labelIdentifierStandardId: PIPELINE_STAGE_STANDARD_FIELD_IDS.name,
})
export class PipelineStageWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceField({
    standardId: PIPELINE_STAGE_STANDARD_FIELD_IDS.name,
    type: FieldMetadataType.TEXT,
    label: msg`Name`,
    description: msg`The stage name`,
    icon: 'IconList',
  })
  name: string;

  @WorkspaceField({
    standardId: PIPELINE_STAGE_STANDARD_FIELD_IDS.color,
    type: FieldMetadataType.TEXT,
    label: msg`Color`,
    description: msg`The stage color`,
    icon: 'IconColorSwatch',
    defaultValue: "'grey'",
  })
  color: string;

  @WorkspaceField({
    standardId: PIPELINE_STAGE_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.NUMBER,
    label: msg`Position`,
    description: msg`The stage position`,
    icon: 'IconSortAscending',
    defaultValue: 0,
  })
  position: number;

  @WorkspaceRelation({
    standardId: PIPELINE_STAGE_STANDARD_FIELD_IDS.pipeline,
    type: RelationType.MANY_TO_ONE,
    label: msg`Pipeline`,
    description: msg`The pipeline this stage belongs to`,
    icon: 'IconLayoutKanban',
    inverseSideTarget: () => PipelineWorkspaceEntity,
    inverseSideFieldKey: 'pipelineStages',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  pipeline: Relation<PipelineWorkspaceEntity>;

  @WorkspaceJoinColumn('pipeline')
  pipelineId: string;

  @WorkspaceRelation({
    standardId: PIPELINE_STAGE_STANDARD_FIELD_IDS.leads,
    type: RelationType.ONE_TO_MANY,
    label: msg`Leads`,
    description: msg`Leads in this stage`,
    icon: 'IconTargetArrow',
    inverseSideTarget: () => LeadWorkspaceEntity,
    inverseSideFieldKey: 'pipelineStage',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  leads: Relation<LeadWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: PIPELINE_STAGE_STANDARD_FIELD_IDS.deals,
    type: RelationType.ONE_TO_MANY,
    label: msg`Deals`,
    description: msg`Deals in this stage`,
    icon: 'IconCurrencyDollar',
    inverseSideTarget: () => DealWorkspaceEntity,
    inverseSideFieldKey: 'pipelineStage',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  deals: Relation<DealWorkspaceEntity[]>;
}
