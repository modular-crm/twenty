import { msg } from '@lingui/core/macro';
import { STANDARD_OBJECT_IDS } from 'twenty-shared/metadata';
import { v4 } from 'uuid';

import { STANDARD_OBJECTS } from 'src/engine/core-modules/application/constants/standard-object.constant';
import { type FlatApplication } from 'src/engine/core-modules/application/types/flat-application.type';
import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { type ViewDefinition } from 'src/engine/workspace-manager/standard-objects-prefill-data/types/view-definition.interface';
import { PIPELINE_STAGE_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';

export const pipelineStageAllView = ({
  objectMetadataItems,
  useCoreNaming = false,
  twentyStandardFlatApplication,
}: {
  objectMetadataItems: ObjectMetadataEntity[];
  useCoreNaming?: boolean;
  twentyStandardFlatApplication: FlatApplication;
}): ViewDefinition => {
  const pipelineStageObjectMetadata = objectMetadataItems.find(
    (object) => object.standardId === STANDARD_OBJECT_IDS.pipelineStage,
  );

  if (!pipelineStageObjectMetadata) {
    throw new Error('Pipeline stage object metadata not found');
  }

  const viewUniversalIdentifier =
    STANDARD_OBJECTS.pipelineStage.views.allPipelineStages.universalIdentifier;

  return {
    id: v4(),
    universalIdentifier: viewUniversalIdentifier,
    applicationId: twentyStandardFlatApplication.id,
    name: useCoreNaming ? msg`All {objectLabelPlural}` : 'All Pipeline Stages',
    objectMetadataId: pipelineStageObjectMetadata.id,
    type: 'table',
    key: 'INDEX',
    position: 0,
    icon: 'IconList',
    filters: [],
    fields: [
      {
        fieldMetadataId:
          pipelineStageObjectMetadata.fields.find(
            (field) => field.standardId === PIPELINE_STAGE_STANDARD_FIELD_IDS.name,
          )?.id ?? '',
        position: 0,
        isVisible: true,
        size: 150,
        universalIdentifier:
          STANDARD_OBJECTS.pipelineStage.views.allPipelineStages.viewFields.name.universalIdentifier,
      },
      {
        fieldMetadataId:
          pipelineStageObjectMetadata.fields.find(
            (field) =>
              field.standardId === PIPELINE_STAGE_STANDARD_FIELD_IDS.color,
          )?.id ?? '',
        position: 1,
        isVisible: true,
        size: 150,
        universalIdentifier:
          STANDARD_OBJECTS.pipelineStage.views.allPipelineStages.viewFields.color.universalIdentifier,
      },
      {
        fieldMetadataId:
          pipelineStageObjectMetadata.fields.find(
            (field) =>
              field.standardId === PIPELINE_STAGE_STANDARD_FIELD_IDS.pipeline,
          )?.id ?? '',
        position: 2,
        isVisible: true,
        size: 150,
        universalIdentifier:
          STANDARD_OBJECTS.pipelineStage.views.allPipelineStages.viewFields.pipeline.universalIdentifier,
      },
    ],
  };
};
