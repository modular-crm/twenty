import { isNonEmptyString } from '@sniptt/guards';

import { type ActivityTargetableObject } from '@/activities/types/ActivityTargetableEntity';
import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { type RecordGqlOperationFilter } from 'twenty-shared/types';
import { sortByAscString } from '~/utils/array/sortByAscString';

type UseProductsProps = {
  targetableObject: ActivityTargetableObject;
};

export const useProducts = ({ targetableObject }: UseProductsProps) => {
  // Determine which association object to query based on source object
  let associationObjectName: CoreObjectNameSingular | null = null;
  let filterFieldName: string | null = null;

  if (
    targetableObject.targetObjectNameSingular ===
    CoreObjectNameSingular.Opportunity
  ) {
    associationObjectName = CoreObjectNameSingular.OpportunityProductAssociation;
    filterFieldName = 'opportunityId';
  } else if (
    targetableObject.targetObjectNameSingular === CoreObjectNameSingular.Lead
  ) {
    associationObjectName = CoreObjectNameSingular.LeadProductAssociation;
    filterFieldName = 'leadId';
  } else if (
    targetableObject.targetObjectNameSingular === CoreObjectNameSingular.Deal
  ) {
    associationObjectName = CoreObjectNameSingular.DealProductAssociation;
    filterFieldName = 'dealId';
  }

  const skip = !associationObjectName || !filterFieldName;

  // Step 1: Fetch product associations
  const {
    records: productAssociations,
    loading: loadingProductAssociations,
  } = useFindManyRecords({
    skip,
    objectNameSingular:
      associationObjectName ?? CoreObjectNameSingular.OpportunityProductAssociation,
    filter: filterFieldName
      ? {
          [filterFieldName]: {
            eq: targetableObject.id,
          },
        }
      : {},
  });

  // Step 2: Extract product IDs from associations
  const productIds = [
    ...new Set(
      productAssociations
        ? [
            ...productAssociations
              .map((association: any) => association.productId)
              .filter(isNonEmptyString),
          ].sort(sortByAscString)
        : [],
    ),
  ];

  const skipBecauseNoProductAssociationsFound = productIds.length === 0;

  const productFilter: RecordGqlOperationFilter = {
    id: {
      in: productIds,
    },
  };

  // Step 3: Fetch actual Product records
  const { records: products, loading: loadingProducts } = useFindManyRecords({
    skip:
      skip || loadingProductAssociations || skipBecauseNoProductAssociationsFound,
    objectNameSingular: CoreObjectNameSingular.Product,
    filter: productFilter,
    orderBy: [
      {
        createdAt: 'DescNullsFirst',
      },
    ],
  });

  // Step 4: Map products to include association ID
  const productsWithAssociationId = (products ?? []).map((product: any) => {
    const association = productAssociations?.find(
      (assoc: any) => assoc.productId === product.id,
    );
    return {
      ...product,
      associationId: association?.id,
    };
  });

  return {
    products: productsWithAssociationId,
    loading: loadingProducts || loadingProductAssociations,
  };
};
