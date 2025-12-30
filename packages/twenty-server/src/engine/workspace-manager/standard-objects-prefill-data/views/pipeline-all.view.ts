import { msg } from '@lingui/core/macro';
import { STANDARD_OBJECT_IDS } from 'twenty-shared/metadata';
import { v4 } from 'uuid';

import { STANDARD_OBJECTS } from 'src/engine/core-modules/application/constants/standard-object.constant';
import { type FlatApplication } from 'src/engine/core-modules/application/types/flat-application.type';
import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { type ViewDefinition } from 'src/engine/workspace-manager/standard-objects-prefill-data/types/view-definition.interface';
import { PIPELINE_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';

export const pipelineAllView = ({
  objectMetadataItems,
  useCoreNaming = false,
  twentyStandardFlatApplication,
}: {
  objectMetadataItems: ObjectMetadataEntity[];
  useCoreNaming?: boolean;
  twentyStandardFlatApplication: FlatApplication;
}): ViewDefinition => {
  const pipelineObjectMetadata = objectMetadataItems.find(
    (object) => object.standardId === STANDARD_OBJECT_IDS.pipeline,
  );

  if (!pipelineObjectMetadata) {
    throw new Error('Pipeline object metadata not found');
  }

  const viewUniversalIdentifier =
    STANDARD_OBJECTS.pipeline.views.allPipelines.universalIdentifier;

  return {
    id: v4(),
    universalIdentifier: viewUniversalIdentifier,
    applicationId: twentyStandardFlatApplication.id,
    name: useCoreNaming ? msg`All {objectLabelPlural}` : 'All Pipelines',
    objectMetadataId: pipelineObjectMetadata.id,
    type: 'table',
    key: 'INDEX',
    position: 0,
    icon: 'IconList',
    filters: [],
    fields: [
      {
        fieldMetadataId:
          pipelineObjectMetadata.fields.find(
            (field) => field.standardId === PIPELINE_STANDARD_FIELD_IDS.name,
          )?.id ?? '',
        position: 0,
        isVisible: true,
        size: 150,
        universalIdentifier:
          STANDARD_OBJECTS.pipeline.views.allPipelines.viewFields.name.universalIdentifier,
      },
      {
        fieldMetadataId:
          pipelineObjectMetadata.fields.find(
            (field) =>
              field.standardId === PIPELINE_STANDARD_FIELD_IDS.isDefault,
          )?.id ?? '',
        position: 1,
        isVisible: true,
        size: 150,
        universalIdentifier:
          STANDARD_OBJECTS.pipeline.views.allPipelines.viewFields.isDefault.universalIdentifier,
      },
      {
        fieldMetadataId:
          pipelineObjectMetadata.fields.find(
            (field) =>
              field.standardId === PIPELINE_STANDARD_FIELD_IDS.pipelineStages,
          )?.id ?? '',
        position: 2,
        isVisible: true,
        size: 150,
        universalIdentifier:
          STANDARD_OBJECTS.pipeline.views.allPipelines.viewFields.pipelineStages.universalIdentifier,
      },
    ],
  };
};
