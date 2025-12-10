import { msg } from '@lingui/core/macro';
import { STANDARD_OBJECT_IDS } from 'twenty-shared/metadata';
import { v4 } from 'uuid';

import { STANDARD_OBJECTS } from 'src/engine/core-modules/application/constants/standard-object.constant';
import { type FlatApplication } from 'src/engine/core-modules/application/types/flat-application.type';
import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { type ViewDefinition } from 'src/engine/workspace-manager/standard-objects-prefill-data/types/view-definition.interface';
import { DEFAULT_VIEW_FIELD_SIZE } from 'src/engine/workspace-manager/standard-objects-prefill-data/views/constants/DEFAULT_VIEW_FIELD_SIZE';
import { PRODUCT_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';

export const productsAllView = ({
  objectMetadataItems,
  useCoreNaming = false,
  twentyStandardFlatApplication,
}: {
  objectMetadataItems: ObjectMetadataEntity[];
  useCoreNaming?: boolean;
  twentyStandardFlatApplication: FlatApplication;
}): ViewDefinition => {
  const productObjectMetadata = objectMetadataItems.find(
    (object) => object.standardId === STANDARD_OBJECT_IDS.product,
  );

  if (!productObjectMetadata) {
    throw new Error('Product object metadata not found');
  }

  const viewUniversalIdentifier =
    STANDARD_OBJECTS.product.views.allProducts.universalIdentifier;

  return {
    id: v4(),
    universalIdentifier: viewUniversalIdentifier,
    applicationId: twentyStandardFlatApplication.id,
    name: useCoreNaming ? msg`All {objectLabelPlural}` : 'All Products',
    objectMetadataId: productObjectMetadata.id ?? '',
    type: 'table',
    key: 'INDEX',
    position: 0,
    icon: 'IconPackage',
    filters: [],
    fields: [
      {
        fieldMetadataId:
          productObjectMetadata.fields.find(
            (field) => field.standardId === PRODUCT_STANDARD_FIELD_IDS.name,
          )?.id ?? '',
        position: 0,
        isVisible: true,
        size: DEFAULT_VIEW_FIELD_SIZE,
        universalIdentifier:
          STANDARD_OBJECTS.product.views.allProducts.viewFields.name
            .universalIdentifier,
      },
      {
        fieldMetadataId:
          productObjectMetadata.fields.find(
            (field) =>
              field.standardId === PRODUCT_STANDARD_FIELD_IDS.description,
          )?.id ?? '',
        position: 1,
        isVisible: true,
        size: 200,
        universalIdentifier:
          STANDARD_OBJECTS.product.views.allProducts.viewFields.description
            .universalIdentifier,
      },
      {
        fieldMetadataId:
          productObjectMetadata.fields.find(
            (field) => field.standardId === PRODUCT_STANDARD_FIELD_IDS.price,
          )?.id ?? '',
        position: 2,
        isVisible: true,
        size: 100,
        universalIdentifier:
          STANDARD_OBJECTS.product.views.allProducts.viewFields.price
            .universalIdentifier,
      },
      {
        fieldMetadataId:
          productObjectMetadata.fields.find(
            (field) => field.standardId === PRODUCT_STANDARD_FIELD_IDS.isActive,
          )?.id ?? '',
        position: 3,
        isVisible: true,
        size: 100,
        universalIdentifier:
          STANDARD_OBJECTS.product.views.allProducts.viewFields.isActive
            .universalIdentifier,
      },
    {
        fieldMetadataId:
          productObjectMetadata.fields.find(
            (field) => field.standardId === PRODUCT_STANDARD_FIELD_IDS.opportunities,
          )?.id ?? '',
        position: 4,
        isVisible: true,
        size: 100,
        universalIdentifier:
          STANDARD_OBJECTS.product.views.allProducts.viewFields.opportunities
            .universalIdentifier,
      },
    ],
  };
};
