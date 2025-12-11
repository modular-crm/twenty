import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { useCreateOneRecord } from '@/object-record/hooks/useCreateOneRecord';
import { useDeleteOneRecord } from '@/object-record/hooks/useDeleteOneRecord';
import { searchRecordStoreFamilyState } from '@/object-record/record-picker/multiple-record-picker/states/searchRecordStoreComponentFamilyState';
import { type RecordPickerPickableMorphItem } from '@/object-record/record-picker/types/RecordPickerPickableMorphItem';
import { recordStoreFamilyState } from '@/object-record/record-store/states/recordStoreFamilyState';
import { useRecoilCallback, useSetRecoilState } from 'recoil';
import { isDefined } from 'twenty-shared/utils';
import { v4 } from 'uuid';

export const useUpdateOpportunityProductFromCell = ({
  objectNameSingular,
  recordId,
}: {
  objectNameSingular:
    | CoreObjectNameSingular.Opportunity
    | CoreObjectNameSingular.Product;
  recordId: string;
}) => {
  const { createOneRecord: createOneOpportunityProduct } = useCreateOneRecord({
    objectNameSingular: CoreObjectNameSingular.OpportunityProductAssociation,
  });

  const { deleteOneRecord: deleteOneOpportunityProduct } = useDeleteOneRecord({
    objectNameSingular: CoreObjectNameSingular.OpportunityProductAssociation,
  });

  const setRecordFromStore = useSetRecoilState(
    recordStoreFamilyState(recordId),
  );

  const updateOpportunityProductFromCell = useRecoilCallback(
    ({ snapshot }) =>
      async ({
        morphItem,
        currentOpportunityProducts,
      }: {
        morphItem: RecordPickerPickableMorphItem;
        currentOpportunityProducts: any[];
      }) => {
        const isOpportunity =
          objectNameSingular === CoreObjectNameSingular.Opportunity;

        const relationFieldName = isOpportunity ? 'product' : 'opportunity';
        // The field on the junction object that points to the "other" side.
        // If we are on Opportunity, we are picking Products. So we set productId.
        // Field name is 'product'. Join column is 'productId'.

        // The field on the junction object that points to "us" (source).
        const sourceFieldName = isOpportunity ? 'opportunity' : 'product';

        let newOpportunityProducts = [...currentOpportunityProducts];

        const existingLink = currentOpportunityProducts.find(
          (op) => op[relationFieldName]?.id === morphItem.recordId,
        );

        if (isDefined(existingLink)) {
          if (!morphItem.isSelected) {
            // Remove
            newOpportunityProducts = newOpportunityProducts.filter(
              (op) => op.id !== existingLink.id,
            );
            await deleteOneOpportunityProduct(existingLink.id);
          }
        } else {
          if (morphItem.isSelected) {
            // Add
            const searchRecord = snapshot
              .getLoadable(searchRecordStoreFamilyState(morphItem.recordId))
              .getValue();

            if (!isDefined(searchRecord) || !isDefined(searchRecord?.record)) {
              return;
            }

            const targetRecord = searchRecord.record;

            const newId = v4();
            const newOp = {
              id: newId,
              __typename: 'OpportunityProductAssociation',
              [sourceFieldName]: { id: recordId },
              [`${sourceFieldName}Id`]: recordId,
              [relationFieldName]: targetRecord, // Set the full object for display
              [`${relationFieldName}Id`]: morphItem.recordId,
            };

            newOpportunityProducts.push(newOp);

            await createOneOpportunityProduct({
              ...newOp,
              [relationFieldName]: undefined, // Don't send the full object to API
              [sourceFieldName]: undefined,
            });
          }
        }

        setRecordFromStore((currentRecord) => {
          if (!isDefined(currentRecord)) {
            return null;
          }

          return {
            ...currentRecord,
            opportunityProducts: newOpportunityProducts,
          };
        });
      },
    [
      createOneOpportunityProduct,
      deleteOneOpportunityProduct,
      objectNameSingular,
      recordId,
      setRecordFromStore, // We'll use this if we implement optimistic update properly
    ],
  );

  return { updateOpportunityProductFromCell };
};
