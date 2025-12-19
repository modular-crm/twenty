import { msg } from '@lingui/core/macro';
import { STANDARD_OBJECT_IDS } from 'twenty-shared/metadata';
import {
  ActorMetadata,
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
import { LEAD_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import {
  type FieldTypeAndNameMetadata,
  getTsVectorColumnExpressionFromFields,
} from 'src/engine/workspace-manager/workspace-sync-metadata/utils/get-ts-vector-column-expression.util';
import { AttachmentWorkspaceEntity } from 'src/modules/attachment/standard-objects/attachment.workspace-entity';
import { CompanyWorkspaceEntity } from 'src/modules/company/standard-objects/company.workspace-entity';
import { FavoriteWorkspaceEntity } from 'src/modules/favorite/standard-objects/favorite.workspace-entity';
import { LeadProductAssociationWorkspaceEntity } from 'src/modules/lead/standard-objects/lead-product-association.workspace-entity';
import { NoteTargetWorkspaceEntity } from 'src/modules/note/standard-objects/note-target.workspace-entity';
import { TaskTargetWorkspaceEntity } from 'src/modules/task/standard-objects/task-target.workspace-entity';
import { TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';
import { WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';
const NAME_FIELD_NAME = 'name';

export const SEARCH_FIELDS_FOR_LEAD: FieldTypeAndNameMetadata[] = [
  { name: NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
];

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.lead,

  namePlural: 'leads',
  labelSingular: msg`Lead`,
  labelPlural: msg`Leads`,
  description: msg`A lead`,
  icon: STANDARD_OBJECT_ICONS.lead,
  shortcut: 'O',
  labelIdentifierStandardId: LEAD_STANDARD_FIELD_IDS.title,
})
@WorkspaceIsSearchable()
export class LeadWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceField({
    standardId: LEAD_STANDARD_FIELD_IDS.title,
    type: FieldMetadataType.TEXT,
    label: msg`Name`,
    description: msg`The lead name`,
    icon: 'IconTargetArrow',
  })
  @WorkspaceIsNullable()
  name: string;

  @WorkspaceField({
    standardId: LEAD_STANDARD_FIELD_IDS.division,
    type: FieldMetadataType.TEXT,
    label: msg`Division`,
    description: msg`Division`,
    icon: 'IconCurrencyDollar',
  })
  @WorkspaceIsNullable()
  division: string;

  @WorkspaceField({
    standardId: LEAD_STANDARD_FIELD_IDS.market,
    type: FieldMetadataType.TEXT,
    label: msg`Market`,
    description: msg`Market`,
    icon: 'IconCalendarEvent',
  })
  @WorkspaceIsNullable()
  market: string;

  @WorkspaceField({
    standardId: LEAD_STANDARD_FIELD_IDS.vertical,
    type: FieldMetadataType.SELECT,
    label: msg`Vertical`,
    description: msg`Vertical`,
    icon: 'IconProgressCheck',
    options: [
      { value: 'Vertical1', label: 'Vertical1', position: 0, color: 'red' },
      { value: 'Vertical2', label: 'Vertical2', position: 1, color: 'purple' },
      { value: 'Vertical3', label: 'Vertical3', position: 2, color: 'sky' },
    ],
    defaultValue: "'Vertical1'",
  })
  @WorkspaceIsNullable()
  @WorkspaceFieldIndex()
  vertical: string;

  @WorkspaceField({
    standardId: LEAD_STANDARD_FIELD_IDS.license,
    type: FieldMetadataType.TEXT,
    label: msg`License`,
    description: msg`License`,
    icon: 'IconHierarchy2',
  })
  @WorkspaceIsNullable()
  license: string | null;

  @WorkspaceField({
    standardId: LEAD_STANDARD_FIELD_IDS.settlementType,
    type: FieldMetadataType.TEXT,
    label: msg`Settlement Type`,
    description: msg`Settlement Type`,
    icon: 'IconHierarchy2',
  })
  @WorkspaceIsNullable()
  settlementType: string | null;

  @WorkspaceField({
    standardId: LEAD_STANDARD_FIELD_IDS.referralCode,
    type: FieldMetadataType.TEXT,
    label: msg`Referral Code`,
    description: msg`Referral Code`,
    icon: 'IconHierarchy2',
  })
  @WorkspaceIsNullable()
  referralCode: string | null;

  @WorkspaceField({
    standardId: LEAD_STANDARD_FIELD_IDS.expectedVolume,
    type: FieldMetadataType.TEXT,
    label: msg`Expected Volume`,
    description: msg`Expected Volume`,
    icon: 'IconHierarchy2',
  })
  @WorkspaceIsNullable()
  expectedVolume: string | null;

  @WorkspaceField({
    standardId: LEAD_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.NUMBER,
    label: msg`Position`,
    icon: 'IconHierarchy2',
    description: msg`Lead record position`,
    defaultValue: 0,
  })
  @WorkspaceIsSystem()
  position: number;

  @WorkspaceField({
    standardId: LEAD_STANDARD_FIELD_IDS.createdBy,
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata;

  @WorkspaceRelation({
    standardId: LEAD_STANDARD_FIELD_IDS.company,
    type: RelationType.MANY_TO_ONE,
    label: msg`Company`,
    description: msg`company`,
    icon: 'IconBuildingSkyscraper',
    inverseSideTarget: () => CompanyWorkspaceEntity,
    inverseSideFieldKey: 'leads',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  company: Relation<CompanyWorkspaceEntity> | null;

  @WorkspaceJoinColumn('company')
  companyId: string | null;

  @WorkspaceRelation({
    standardId: LEAD_STANDARD_FIELD_IDS.owner,
    label: msg`Owner`,
    description: msg`Lead owner`,
    icon: 'IconUserCircle',
    type: RelationType.MANY_TO_ONE,
    inverseSideTarget: () => WorkspaceMemberWorkspaceEntity,
    inverseSideFieldKey: 'assignedLeads',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  owner: Relation<WorkspaceMemberWorkspaceEntity> | null;

  @WorkspaceJoinColumn('owner')
  ownerId: string | null;

  @WorkspaceRelation({
    standardId: LEAD_STANDARD_FIELD_IDS.leadProducts,
    type: RelationType.ONE_TO_MANY,
    label: msg`Product`,
    description: msg`Products linked to this Lead`,
    icon: 'IconPackage',
    inverseSideTarget: () => LeadProductAssociationWorkspaceEntity,
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  leadProducts: Relation<LeadProductAssociationWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: LEAD_STANDARD_FIELD_IDS.favorites,
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
    standardId: LEAD_STANDARD_FIELD_IDS.taskTargets,
    type: RelationType.ONE_TO_MANY,
    label: msg`Tasks`,
    description: msg`Tasks tied to the lead`,
    icon: 'IconCheckbox',
    inverseSideTarget: () => TaskTargetWorkspaceEntity,
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsFieldUIReadOnly()
  taskTargets: Relation<TaskTargetWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: LEAD_STANDARD_FIELD_IDS.noteTargets,
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
    standardId: LEAD_STANDARD_FIELD_IDS.attachments,
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
    standardId: LEAD_STANDARD_FIELD_IDS.timelineActivities,
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
    standardId: LEAD_STANDARD_FIELD_IDS.searchVector,
    type: FieldMetadataType.TS_VECTOR,
    label: SEARCH_VECTOR_FIELD.label,
    description: SEARCH_VECTOR_FIELD.description,
    icon: 'IconUser',
    generatedType: 'STORED',
    asExpression: getTsVectorColumnExpressionFromFields(
      SEARCH_FIELDS_FOR_LEAD,
    ),
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  @WorkspaceFieldIndex({ indexType: IndexType.GIN })
  searchVector: string;
}
