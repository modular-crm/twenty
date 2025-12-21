import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { type ObjectMetadataItem } from '@/object-metadata/types/ObjectMetadataItem';
import { getLabelIdentifierFieldMetadataItem } from '@/object-metadata/utils/getLabelIdentifierFieldMetadataItem';
import { generateDepthRecordGqlFieldsFromFields } from '@/object-record/graphql/record-gql-fields/utils/generateDepthRecordGqlFieldsFromFields';
import { isDefined } from 'twenty-shared/utils';

export type GenerateProductAssociationGqlFields = {
  objectMetadataItems: Pick<
    ObjectMetadataItem,
    'id' | 'nameSingular' | 'fields' | 'labelIdentifierFieldMetadataId'
  >[];
  sourceObjectNameSingular:
    | CoreObjectNameSingular.Opportunity
    | CoreObjectNameSingular.Lead
    | CoreObjectNameSingular.Deal
    | CoreObjectNameSingular.Product;
  associationObjectNameSingular:
    | CoreObjectNameSingular.OpportunityProductAssociation
    | CoreObjectNameSingular.LeadProductAssociation
    | CoreObjectNameSingular.DealProductAssociation;
};

export const generateProductAssociationGqlFields = ({
  objectMetadataItems,
  sourceObjectNameSingular,
  associationObjectNameSingular,
}: GenerateProductAssociationGqlFields) => {
  const associationObjectMetadataItem = objectMetadataItems.find(
    (objectMetadataItem) =>
      objectMetadataItem.nameSingular === associationObjectNameSingular,
  );

  const sourceObjectMetadataItem = objectMetadataItems.find(
    (objectMetadataItem) =>
      objectMetadataItem.nameSingular === sourceObjectNameSingular,
  );

  if (
    !isDefined(associationObjectMetadataItem) ||
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
      fields: associationObjectMetadataItem.fields.filter(
        (fieldMetadataItem) =>
          fieldMetadataItem.name !== sourceObjectNameSingular,
      ),
      objectMetadataItems,
      shouldOnlyLoadRelationIdentifiers: false,
    }),
  };
};
