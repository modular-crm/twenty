import { msg } from '@lingui/core/macro';
import { STANDARD_OBJECT_IDS } from 'twenty-shared/metadata';
import { v4 } from 'uuid';

import { AggregateOperations } from 'src/engine/api/graphql/graphql-query-runner/constants/aggregate-operations.constant';
import { STANDARD_OBJECTS } from 'src/engine/core-modules/application/constants/standard-object.constant';
import { type FlatApplication } from 'src/engine/core-modules/application/types/flat-application.type';
import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { type ViewDefinition } from 'src/engine/workspace-manager/standard-objects-prefill-data/types/view-definition.interface';
import { DEAL_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';

export const dealsAllView = ({
  objectMetadataItems,
  useCoreNaming = false,
  twentyStandardFlatApplication,
}: {
  objectMetadataItems: ObjectMetadataEntity[];
  useCoreNaming?: boolean;
  twentyStandardFlatApplication: FlatApplication;
}): ViewDefinition => {
  const dealObjectMetadata = objectMetadataItems.find(
    (object) => object.standardId === STANDARD_OBJECT_IDS.deal,
  );

  if (!dealObjectMetadata) {
    throw new Error('Deal object metadata not found');
  }

  const viewUniversalIdentifier =
    STANDARD_OBJECTS.deal.views.allDeals.universalIdentifier;

  return {
    id: v4(),
    universalIdentifier: viewUniversalIdentifier,
    applicationId: twentyStandardFlatApplication.id,
    name: useCoreNaming ? msg`All {objectLabelPlural}` : 'All Deals',
    objectMetadataId: dealObjectMetadata.id,
    type: 'table',
    key: 'INDEX',
    position: 0,
    icon: 'IconList',
    filters: [],
    fields: [
      {
        fieldMetadataId:
          dealObjectMetadata.fields.find(
            (field) => field.standardId === DEAL_STANDARD_FIELD_IDS.title,
          )?.id ?? '',
        position: 0,
        isVisible: true,
        size: 150,
        universalIdentifier:
          STANDARD_OBJECTS.deal.views.allDeals.viewFields.title.universalIdentifier,
      },
      {
        fieldMetadataId:
          dealObjectMetadata.fields.find(
            (field) =>
              field.standardId === DEAL_STANDARD_FIELD_IDS.estimatedAmount,
          )?.id ?? '',
        position: 1,
        isVisible: true,
        size: 150,
        aggregateOperation: AggregateOperations.AVG,
        universalIdentifier:
          STANDARD_OBJECTS.deal.views.allDeals.viewFields.estimatedAmount.universalIdentifier,
      },
      {
        fieldMetadataId:
          dealObjectMetadata.fields.find(
            (field) =>
              field.standardId === DEAL_STANDARD_FIELD_IDS.createdBy,
          )?.id ?? '',
        position: 2,
        isVisible: true,
        size: 150,
        universalIdentifier:
          STANDARD_OBJECTS.deal.views.allDeals.viewFields.createdBy.universalIdentifier,
      },
      {
        fieldMetadataId:
          dealObjectMetadata.fields.find(
            (field) =>
              field.standardId === DEAL_STANDARD_FIELD_IDS.pointOfContact,
          )?.id ?? '',
        position: 3,
        isVisible: true,
        size: 150,
        aggregateOperation: AggregateOperations.MIN,
        universalIdentifier:
          STANDARD_OBJECTS.deal.views.allDeals.viewFields.pointOfContact.universalIdentifier,
      },
      {
        fieldMetadataId:
          dealObjectMetadata.fields.find(
            (field) =>
              field.standardId === DEAL_STANDARD_FIELD_IDS.owner,
          )?.id ?? '',
        position: 4,
        isVisible: true,
        size: 150,
        aggregateOperation: AggregateOperations.MIN,
        universalIdentifier:
          STANDARD_OBJECTS.deal.views.allDeals.viewFields.owner.universalIdentifier,
      },
      {
        fieldMetadataId:
          dealObjectMetadata.fields.find(
            (field) =>
              field.standardId === DEAL_STANDARD_FIELD_IDS.company,
          )?.id ?? '',
        position: 5,
        isVisible: true,
        size: 150,
        universalIdentifier:
          STANDARD_OBJECTS.deal.views.allDeals.viewFields.company.universalIdentifier,
      },
      {
        fieldMetadataId:
          dealObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              DEAL_STANDARD_FIELD_IDS.dealProducts,
          )?.id ?? '',
        position: 6,
        isVisible: true,
        size: 150,
        universalIdentifier:
          STANDARD_OBJECTS.deal.views.allDeals.viewFields.dealProducts.universalIdentifier,
      },
    ],
  };
};
