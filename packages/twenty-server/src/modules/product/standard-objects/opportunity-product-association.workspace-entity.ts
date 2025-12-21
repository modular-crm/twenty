import { msg } from '@lingui/core/macro';
import { STANDARD_OBJECT_IDS } from 'twenty-shared/metadata';
import { FieldMetadataType, RelationOnDeleteAction } from 'twenty-shared/types';

import { RelationType } from 'src/engine/metadata-modules/field-metadata/interfaces/relation-type.interface';
import { Relation } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/relation.interface';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { WorkspaceEntity } from 'src/engine/twenty-orm/decorators/workspace-entity.decorator';
import { WorkspaceIsSystem } from 'src/engine/twenty-orm/decorators/workspace-is-system.decorator';
import { WorkspaceJoinColumn } from 'src/engine/twenty-orm/decorators/workspace-join-column.decorator';
import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
import { OPPORTUNITY_PRODUCT_ASSOCIATION_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { OpportunityWorkspaceEntity } from 'src/modules/opportunity/standard-objects/opportunity.workspace-entity';
import { ProductWorkspaceEntity } from 'src/modules/product/standard-objects/product.workspace-entity';
import { WorkspaceIsNullable } from 'src/engine/twenty-orm/decorators/workspace-is-nullable.decorator';
import { WorkspaceDynamicRelation } from 'src/engine/twenty-orm/decorators/workspace-dynamic-relation.decorator';
import { CustomWorkspaceEntity } from 'src/engine/twenty-orm/custom.workspace-entity';
import { FieldTypeAndNameMetadata } from 'src/engine/metadata-modules/field-metadata/utils/compute-column-name.util';

export const SEARCH_FIELDS_FOR_OPPORTUNITY_PRODUCT: FieldTypeAndNameMetadata[] = [
  { name: 'id', type: FieldMetadataType.TEXT }
];

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.opportunityProductAssociation,
  namePlural: 'opportunityProductAssociations',
  labelSingular: msg`Opportunity Product Association`,
  labelPlural: msg`Opportunity Product Associations`,
  description: msg`Opportunity Product Association`,
  icon: STANDARD_OBJECT_ICONS.product,
})
@WorkspaceIsSystem()
export class OpportunityProductAssociationWorkspaceEntity extends BaseWorkspaceEntity {

  @WorkspaceRelation({
    standardId:
      OPPORTUNITY_PRODUCT_ASSOCIATION_STANDARD_FIELD_IDS.product,
    type: RelationType.MANY_TO_ONE,
    label: msg`Product`,
    description: msg`Product`,
    icon: 'IconPackage',
    inverseSideTarget: () => ProductWorkspaceEntity,
    inverseSideFieldKey: 'opportunityProducts',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  product: Relation<ProductWorkspaceEntity> | null;

  @WorkspaceJoinColumn('product')
  productId: string | null;

  @WorkspaceRelation({
    standardId:
      OPPORTUNITY_PRODUCT_ASSOCIATION_STANDARD_FIELD_IDS.opportunity,
    type: RelationType.MANY_TO_ONE,
    label: msg`Opportunity`,
    description: msg`Opportunity`,
    icon: 'IconTargetArrow',
    inverseSideTarget: () => OpportunityWorkspaceEntity,
    inverseSideFieldKey: 'opportunityProducts',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  opportunity: Relation<OpportunityWorkspaceEntity> | null;

  @WorkspaceJoinColumn('opportunity')
  opportunityId: string | null;

  @WorkspaceDynamicRelation({
    type: RelationType.MANY_TO_ONE,
    argsFactory: (oppositeObjectMetadata) => ({
      standardId: OPPORTUNITY_PRODUCT_ASSOCIATION_STANDARD_FIELD_IDS.custom,
      name: oppositeObjectMetadata.nameSingular,
      label: oppositeObjectMetadata.labelSingular,
      description: `OpportunityProduct ${oppositeObjectMetadata.labelSingular}`,
      joinColumn: `${oppositeObjectMetadata.nameSingular}Id`,
      icon: 'IconBuildingSkyscraper',
    }),
    inverseSideTarget: () => CustomWorkspaceEntity,
    inverseSideFieldKey: 'opportunityProducts',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  custom: Relation<CustomWorkspaceEntity>;
}
