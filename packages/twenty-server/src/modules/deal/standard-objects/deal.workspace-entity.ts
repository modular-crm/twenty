import { msg } from '@lingui/core/macro';
import { STANDARD_OBJECT_IDS } from 'twenty-shared/metadata';
import {
  ActorMetadata,
  type CurrencyMetadata,
  FieldMetadataType,
  RelationOnDeleteAction,
} from 'twenty-shared/types';

import { RelationType } from 'src/engine/metadata-modules/field-metadata/interfaces/relation-type.interface';
import { Relation } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/relation.interface';

import { IndexType } from 'src/engine/metadata-modules/index-metadata/types/indexType.types';
import { SEARCH_VECTOR_FIELD } from 'src/engine/metadata-modules/search-field-metadata/constants/search-vector-field.constants';
import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { WorkspaceEntity } from 'src/engine/twenty-orm/decorators/workspace-entity.decorator';
import { WorkspaceFieldIndex } from 'src/engine/twenty-orm/decorators/workspace-field-index.decorator';
import { WorkspaceField } from 'src/engine/twenty-orm/decorators/workspace-field.decorator';
import { WorkspaceIsFieldUIReadOnly } from 'src/engine/twenty-orm/decorators/workspace-is-field-ui-readonly.decorator';
import { WorkspaceIsNullable } from 'src/engine/twenty-orm/decorators/workspace-is-nullable.decorator';
import { WorkspaceIsSearchable } from 'src/engine/twenty-orm/decorators/workspace-is-searchable.decorator';
import { WorkspaceIsSystem } from 'src/engine/twenty-orm/decorators/workspace-is-system.decorator';
import { WorkspaceJoinColumn } from 'src/engine/twenty-orm/decorators/workspace-join-column.decorator';
import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
import { DEAL_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import {
  type FieldTypeAndNameMetadata,
  getTsVectorColumnExpressionFromFields,
} from 'src/engine/workspace-manager/workspace-sync-metadata/utils/get-ts-vector-column-expression.util';
import { AttachmentWorkspaceEntity } from 'src/modules/attachment/standard-objects/attachment.workspace-entity';
import { CompanyWorkspaceEntity } from 'src/modules/company/standard-objects/company.workspace-entity';
import { DealProductAssociationWorkspaceEntity } from 'src/modules/deal/standard-objects/deal-product-association.workspace-entity';
import { FavoriteWorkspaceEntity } from 'src/modules/favorite/standard-objects/favorite.workspace-entity';
import { NoteTargetWorkspaceEntity } from 'src/modules/note/standard-objects/note-target.workspace-entity';
import { PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';
import { TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';
import { WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';
import { PipelineWorkspaceEntity } from 'src/modules/pipeline/standard-objects/pipeline.workspace-entity';
import { PipelineStageWorkspaceEntity } from 'src/modules/pipeline/standard-objects/pipeline-stage.workspace-entity';
const NAME_FIELD_NAME = 'name';

export const SEARCH_FIELDS_FOR_DEAL: FieldTypeAndNameMetadata[] = [
  { name: NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
];

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.deal,

  namePlural: 'deals',
  labelSingular: msg`Deal`,
  labelPlural: msg`Deals`,
  description: msg`A deal`,
  icon: STANDARD_OBJECT_ICONS.deal,
  shortcut: 'O',
  labelIdentifierStandardId: DEAL_STANDARD_FIELD_IDS.title,
})
@WorkspaceIsSearchable()
export class DealWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceField({
    standardId: DEAL_STANDARD_FIELD_IDS.title,
    type: FieldMetadataType.TEXT,
    label: msg`Name`,
    description: msg`The lead name`,
    icon: 'IconTargetArrow',
  })
  @WorkspaceIsNullable()
  name: string;

    @WorkspaceField({
        standardId: DEAL_STANDARD_FIELD_IDS.status,
        type: FieldMetadataType.SELECT,
        label: msg`Status`,
        description: msg`Deal status`,
        icon: 'IconCheck',
        defaultValue: "'TODO'",
        options: [
            { value: 'TODO', label: 'To do', position: 0, color: 'sky' },
            {
                value: 'IN_PROGRESS',
                label: 'In progress',
                position: 1,
                color: 'purple',
            },
            {
                value: 'DONE',
                label: 'Done',
                position: 2,
                color: 'green',
            },
        ],
    })
    @WorkspaceIsNullable()
    status: string | null;

  @WorkspaceField({
    standardId: DEAL_STANDARD_FIELD_IDS.estimatedAmount,
    type: FieldMetadataType.CURRENCY,
    label: msg`Estimated Amount`,
    description: msg`Estimated Amount`,
    icon: 'IconCurrencyDollar',
  })
  @WorkspaceIsNullable()
  estimatedAmount: CurrencyMetadata | null;

  @WorkspaceField({
    standardId: DEAL_STANDARD_FIELD_IDS.closeDate,
    type: FieldMetadataType.DATE_TIME,
    label: msg`Close Date`,
    description: msg`Deal close date`,
    icon: 'IconCalendarEvent',
  })
  @WorkspaceIsNullable()
  @WorkspaceFieldIndex()
  closeDate: Date | null;

  @WorkspaceField({
    standardId: DEAL_STANDARD_FIELD_IDS.referralAttribution,
    type: FieldMetadataType.TEXT,
    label: msg`Referral Attribution`,
    description: msg`Referral Attribution`,
    icon: 'IconHierarchy2',
  })
  @WorkspaceIsNullable()
  referralAttribution: string | null;

  @WorkspaceField({
    standardId: DEAL_STANDARD_FIELD_IDS.approvalStatus,
    type: FieldMetadataType.SELECT,
    label: msg`Approval Status`,
    description: msg`Deal approval status`,
    icon: 'IconCheck',
    defaultValue: "'PENDING'",
    options: [
        { value: 'PENDING', label: 'Pending', position: 0, color: 'sky' },
        {
            value: 'APPROVED',
            label: 'Approved',
            position: 1,
            color: 'purple',
        },
        {
            value: 'REJECTED',
            label: 'Rejected',
            position: 2,
            color: 'red',
        },
    ],
  })
  @WorkspaceIsNullable()
  approvalStatus: string | null;

  @WorkspaceField({
    standardId: DEAL_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.NUMBER,
    label: msg`Position`,
    icon: 'IconHierarchy2',
    description: msg`Lead record position`,
    defaultValue: 0,
  })
  @WorkspaceIsSystem()
  position: number;

  @WorkspaceField({
    standardId: DEAL_STANDARD_FIELD_IDS.createdBy,
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata;

  @WorkspaceRelation({
    standardId: DEAL_STANDARD_FIELD_IDS.company,
    type: RelationType.MANY_TO_ONE,
    label: msg`Company`,
    description: msg`Company`,
    icon: 'IconBuildingSkyscraper',
    inverseSideTarget: () => CompanyWorkspaceEntity,
    inverseSideFieldKey: 'deals',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  company: Relation<CompanyWorkspaceEntity> | null;

  @WorkspaceJoinColumn('company')
  companyId: string | null;

  @WorkspaceRelation({
    standardId: DEAL_STANDARD_FIELD_IDS.owner,
    label: msg`Owner`,
    description: msg`Deal owner`,
    icon: 'IconUserCircle',
    type: RelationType.MANY_TO_ONE,
    inverseSideTarget: () => WorkspaceMemberWorkspaceEntity,
    inverseSideFieldKey: 'assignedDeals',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  owner: Relation<WorkspaceMemberWorkspaceEntity> | null;

  @WorkspaceJoinColumn('owner')
  ownerId: string | null;

  @WorkspaceRelation({
    standardId: DEAL_STANDARD_FIELD_IDS.pointOfContact,
    label: msg`Point of Contact`,
    description: msg`Deal point of contact`,
    icon: 'IconUser',
    type: RelationType.MANY_TO_ONE,
    inverseSideTarget: () => PersonWorkspaceEntity,
    inverseSideFieldKey: 'pointOfContactForDeals',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  pointOfContact: Relation<PersonWorkspaceEntity> | null;

  @WorkspaceJoinColumn('pointOfContact')
  pointOfContactId: string | null;

  @WorkspaceRelation({
    standardId: DEAL_STANDARD_FIELD_IDS.dealProducts,
    type: RelationType.ONE_TO_MANY,
    label: msg`Product`,
    description: msg`Products linked to this Deal`,
    icon: 'IconPackage',
    inverseSideTarget: () => DealProductAssociationWorkspaceEntity,
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  dealProducts: Relation<DealProductAssociationWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: DEAL_STANDARD_FIELD_IDS.favorites,
    type: RelationType.ONE_TO_MANY,
    label: msg`Favorites`,
    description: msg`Favorites linked to the lead`,
    icon: 'IconHeart',
    inverseSideTarget: () => FavoriteWorkspaceEntity,
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  favorites: Relation<FavoriteWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: DEAL_STANDARD_FIELD_IDS.noteTargets,
    type: RelationType.ONE_TO_MANY,
    label: msg`Notes`,
    description: msg`Notes tied to the lead`,
    icon: 'IconNotes',
    inverseSideTarget: () => NoteTargetWorkspaceEntity,
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsFieldUIReadOnly()
  noteTargets: Relation<NoteTargetWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: DEAL_STANDARD_FIELD_IDS.attachments,
    type: RelationType.ONE_TO_MANY,
    label: msg`Attachments`,
    description: msg`Attachments linked to the lead`,
    icon: 'IconFileImport',
    inverseSideTarget: () => AttachmentWorkspaceEntity,
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  attachments: Relation<AttachmentWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: DEAL_STANDARD_FIELD_IDS.timelineActivities,
    type: RelationType.ONE_TO_MANY,
    label: msg`Timeline Activities`,
    description: msg`Timeline Activities linked to the lead.`,
    icon: 'IconTimelineEvent',
    inverseSideTarget: () => TimelineActivityWorkspaceEntity,
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  timelineActivities: Relation<TimelineActivityWorkspaceEntity[]>;

  @WorkspaceField({
    standardId: DEAL_STANDARD_FIELD_IDS.searchVector,
    type: FieldMetadataType.TS_VECTOR,
    label: SEARCH_VECTOR_FIELD.label,
    description: SEARCH_VECTOR_FIELD.description,
    icon: 'IconUser',
    generatedType: 'STORED',
    asExpression: getTsVectorColumnExpressionFromFields(
      SEARCH_FIELDS_FOR_DEAL,
    ),
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  @WorkspaceFieldIndex({ indexType: IndexType.GIN })
  searchVector: string;

  @WorkspaceRelation({
    standardId: DEAL_STANDARD_FIELD_IDS.pipeline,
    type: RelationType.MANY_TO_ONE,
    label: msg`Pipeline`,
    description: msg`Pipeline`,
    icon: 'IconLayoutKanban',
    inverseSideTarget: () => PipelineWorkspaceEntity,
    inverseSideFieldKey: 'deals',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  pipeline: Relation<PipelineWorkspaceEntity> | null;

  @WorkspaceJoinColumn('pipeline')
  pipelineId: string | null;

  @WorkspaceRelation({
    standardId: DEAL_STANDARD_FIELD_IDS.pipelineStage,
    type: RelationType.MANY_TO_ONE,
    label: msg`Stage`,
    description: msg`Pipeline Stage`,
    icon: 'IconList',
    inverseSideTarget: () => PipelineStageWorkspaceEntity,
    inverseSideFieldKey: 'deals',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  pipelineStage: Relation<PipelineStageWorkspaceEntity> | null;

  @WorkspaceJoinColumn('pipelineStage')
  pipelineStageId: string | null;
}
