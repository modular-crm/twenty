import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { type ObjectMetadataItem } from '@/object-metadata/types/ObjectMetadataItem';
import { getLabelIdentifierFieldMetadataItem } from '@/object-metadata/utils/getLabelIdentifierFieldMetadataItem';
import { generateDepthRecordGqlFieldsFromFields } from '@/object-record/graphql/record-gql-fields/utils/generateDepthRecordGqlFieldsFromFields';
import { isDefined } from 'twenty-shared/utils';

export type GenerateOpportunityProductGqlFields = {
  objectMetadataItems: Pick<
    ObjectMetadataItem,
    'id' | 'nameSingular' | 'fields' | 'labelIdentifierFieldMetadataId'
  >[];
  sourceObjectNameSingular:
    | CoreObjectNameSingular.Opportunity
    | CoreObjectNameSingular.Product;
};

export const generateOpportunityProductGqlFields = ({
  objectMetadataItems,
  sourceObjectNameSingular,
}: GenerateOpportunityProductGqlFields) => {
  const opportunityProductObjectMetadataItem = objectMetadataItems.find(
    (objectMetadataItem) =>
      objectMetadataItem.nameSingular ===
      CoreObjectNameSingular.OpportunityProductAssociation,
  );

  const sourceObjectMetadataItem = objectMetadataItems.find(
    (objectMetadataItem) =>
      objectMetadataItem.nameSingular === sourceObjectNameSingular,
  );

  if (
    !isDefined(opportunityProductObjectMetadataItem) ||
    !isDefined(sourceObjectMetadataItem)
  ) {
    return {};
  }

  const sourceLabelIdentifierFieldMetadataItem =
    getLabelIdentifierFieldMetadataItem(sourceObjectMetadataItem);

  return {
    id: true,
    [sourceObjectNameSingular]: {
      id: true,
      ...(isDefined(sourceLabelIdentifierFieldMetadataItem)
        ? { [sourceLabelIdentifierFieldMetadataItem.name]: true }
        : {}),
    },
    ...generateDepthRecordGqlFieldsFromFields({
      depth: 1,
      fields: opportunityProductObjectMetadataItem.fields.filter(
        (fieldMetadataItem) =>
          fieldMetadataItem.name !== sourceObjectNameSingular,
      ),
      objectMetadataItems,
      shouldOnlyLoadRelationIdentifiers: false,
    }),
  };
};
