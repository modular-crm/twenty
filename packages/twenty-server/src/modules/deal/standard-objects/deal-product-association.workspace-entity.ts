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
import { DEAL_PRODUCT_ASSOCIATION_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { ProductWorkspaceEntity } from 'src/modules/product/standard-objects/product.workspace-entity';
import { WorkspaceIsNullable } from 'src/engine/twenty-orm/decorators/workspace-is-nullable.decorator';
import { WorkspaceDynamicRelation } from 'src/engine/twenty-orm/decorators/workspace-dynamic-relation.decorator';
import { CustomWorkspaceEntity } from 'src/engine/twenty-orm/custom.workspace-entity';
import { FieldTypeAndNameMetadata } from 'src/engine/metadata-modules/field-metadata/utils/compute-column-name.util';
import { DealWorkspaceEntity } from 'src/modules/deal/standard-objects/deal.workspace-entity';

export const SEARCH_FIELDS_FOR_DEAL_PRODUCT: FieldTypeAndNameMetadata[] = [
  { name: 'id', type: FieldMetadataType.TEXT },
  { name: 'product.name', type: FieldMetadataType.TEXT },
];

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.dealProductAssociation,
  namePlural: 'dealProductAssociations',
  labelSingular: msg`Deal Product Association`,
  labelPlural: msg`Deal Product Associations`,
  description: msg`Deal Product Association`,
  icon: STANDARD_OBJECT_ICONS.product,
})
@WorkspaceIsSystem()
export class DealProductAssociationWorkspaceEntity extends BaseWorkspaceEntity {

  @WorkspaceRelation({
    standardId:
      DEAL_PRODUCT_ASSOCIATION_STANDARD_FIELD_IDS.product,
    type: RelationType.MANY_TO_ONE,
    label: msg`Product`,
    description: msg`Product`,
    icon: 'IconPackage',
    inverseSideTarget: () => ProductWorkspaceEntity,
    inverseSideFieldKey: 'dealProducts',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  product: Relation<ProductWorkspaceEntity> | null;

  @WorkspaceJoinColumn('product')
  productId: string | null;

  @WorkspaceRelation({
    standardId:
      DEAL_PRODUCT_ASSOCIATION_STANDARD_FIELD_IDS.deal,
    type: RelationType.MANY_TO_ONE,
    label: msg`Deal`,
    description: msg`Deal`,
    icon: 'IconTargetArrow',
    inverseSideTarget: () => DealWorkspaceEntity,
    inverseSideFieldKey: 'dealProducts',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  deal: Relation<DealWorkspaceEntity> | null;

  @WorkspaceJoinColumn('deal')
  dealId: string | null;

  @WorkspaceDynamicRelation({
    type: RelationType.MANY_TO_ONE,
    argsFactory: (oppositeObjectMetadata) => ({
      standardId: DEAL_PRODUCT_ASSOCIATION_STANDARD_FIELD_IDS.custom,
      name: oppositeObjectMetadata.nameSingular,
      label: oppositeObjectMetadata.labelSingular,
      description: `DealProduct ${oppositeObjectMetadata.labelSingular}`,
      joinColumn: `${oppositeObjectMetadata.nameSingular}Id`,
      icon: 'IconBuildingSkyscraper',
    }),
    inverseSideTarget: () => CustomWorkspaceEntity,
    inverseSideFieldKey: 'dealProducts',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  custom: Relation<CustomWorkspaceEntity>;
}
