import { msg } from '@lingui/core/macro';
import { STANDARD_OBJECT_IDS } from 'twenty-shared/metadata';
import { v4 } from 'uuid';

import { STANDARD_OBJECTS } from 'src/engine/core-modules/application/constants/standard-object.constant';
import { type FlatApplication } from 'src/engine/core-modules/application/types/flat-application.type';
import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { type ViewDefinition } from 'src/engine/workspace-manager/standard-objects-prefill-data/types/view-definition.interface';
import { LEAD_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';

export const leadsAllView = ({
  objectMetadataItems,
  useCoreNaming = false,
  twentyStandardFlatApplication,
}: {
  objectMetadataItems: ObjectMetadataEntity[];
  useCoreNaming?: boolean;
  twentyStandardFlatApplication: FlatApplication;
}): ViewDefinition => {
  const leadObjectMetadata = objectMetadataItems.find(
    (object) => object.standardId === STANDARD_OBJECT_IDS.lead,
  );

  if (!leadObjectMetadata) {
    throw new Error('Lead object metadata not found');
  }

  const viewUniversalIdentifier =
    STANDARD_OBJECTS.lead.views.allLeads.universalIdentifier;

  return {
    id: v4(),
    universalIdentifier: viewUniversalIdentifier,
    applicationId: twentyStandardFlatApplication.id,
    name: useCoreNaming ? msg`All {objectLabelPlural}` : 'All Leads',
    objectMetadataId: leadObjectMetadata.id,
    type: 'table',
    key: 'INDEX',
    position: 0,
    icon: 'IconList',
    filters: [],
    fields: [
      {
        fieldMetadataId:
          leadObjectMetadata.fields.find(
            (field) => field.standardId === LEAD_STANDARD_FIELD_IDS.title,
          )?.id ?? '',
        position: 0,
        isVisible: true,
        size: 150,
        universalIdentifier:
          STANDARD_OBJECTS.lead.views.allLeads.viewFields.title.universalIdentifier,
      },
      {
        fieldMetadataId:
          leadObjectMetadata.fields.find(
            (field) =>
              field.standardId === LEAD_STANDARD_FIELD_IDS.division,
          )?.id ?? '',
        position: 1,
        isVisible: true,
        size: 150,
        universalIdentifier:
          STANDARD_OBJECTS.lead.views.allLeads.viewFields.division.universalIdentifier,
      },
      {
        fieldMetadataId:
          leadObjectMetadata.fields.find(
            (field) =>
              field.standardId === LEAD_STANDARD_FIELD_IDS.createdBy,
          )?.id ?? '',
        position: 2,
        isVisible: true,
        size: 150,
        universalIdentifier:
          STANDARD_OBJECTS.lead.views.allLeads.viewFields.createdBy.universalIdentifier,
      },
      {
        fieldMetadataId:
          leadObjectMetadata.fields.find(
            (field) =>
              field.standardId === LEAD_STANDARD_FIELD_IDS.market,
          )?.id ?? '',
        position: 3,
        isVisible: true,
        size: 150,
        universalIdentifier:
          STANDARD_OBJECTS.lead.views.allLeads.viewFields.market.universalIdentifier,
      },
      {
        fieldMetadataId:
          leadObjectMetadata.fields.find(
            (field) =>
              field.standardId === LEAD_STANDARD_FIELD_IDS.company,
          )?.id ?? '',
        position: 4,
        isVisible: true,
        size: 150,
        universalIdentifier:
          STANDARD_OBJECTS.lead.views.allLeads.viewFields.company.universalIdentifier,
      },
      {
        fieldMetadataId:
          leadObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              LEAD_STANDARD_FIELD_IDS.owner,
          )?.id ?? '',
        position: 5,
        isVisible: true,
        size: 150,
        universalIdentifier:
          STANDARD_OBJECTS.lead.views.allLeads.viewFields.owner.universalIdentifier,
      },
      {
        fieldMetadataId:
          leadObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              LEAD_STANDARD_FIELD_IDS.vertical,
          )?.id ?? '',
        position: 6,
        isVisible: true,
        size: 150,
        universalIdentifier:
          STANDARD_OBJECTS.lead.views.allLeads.viewFields.vertical.universalIdentifier,
      },
    ],
  };
};
