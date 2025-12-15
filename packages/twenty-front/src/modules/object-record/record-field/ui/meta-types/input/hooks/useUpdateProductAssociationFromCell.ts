import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { useCreateOneRecord } from '@/object-record/hooks/useCreateOneRecord';
import { useDeleteOneRecord } from '@/object-record/hooks/useDeleteOneRecord';
import { searchRecordStoreFamilyState } from '@/object-record/record-picker/multiple-record-picker/states/searchRecordStoreComponentFamilyState';
import { type RecordPickerPickableMorphItem } from '@/object-record/record-picker/types/RecordPickerPickableMorphItem';
import { recordStoreFamilyState } from '@/object-record/record-store/states/recordStoreFamilyState';
import { useRecoilCallback, useSetRecoilState } from 'recoil';
import { isDefined } from 'twenty-shared/utils';
import { v4 } from 'uuid';

export const useUpdateProductAssociationFromCell = ({
  objectNameSingular,
  recordId,
  associationObjectNameSingular,
  fieldName,
  relationFieldName,
  sourceFieldName,
}: {
  objectNameSingular: CoreObjectNameSingular;
  recordId: string;
  associationObjectNameSingular: CoreObjectNameSingular;
  fieldName: string;
  relationFieldName: string;
  sourceFieldName: string;
}) => {
  const { createOneRecord: createOneAssociation } = useCreateOneRecord({
    objectNameSingular: associationObjectNameSingular,
  });

  const { deleteOneRecord: deleteOneAssociation } = useDeleteOneRecord({
    objectNameSingular: associationObjectNameSingular,
  });

  const setRecordFromStore = useSetRecoilState(
    recordStoreFamilyState(recordId),
  );

  const updateProductAssociationFromCell = useRecoilCallback(
    ({ snapshot }) =>
      async ({
        morphItem,
        currentRecordAssociations,
      }: {
        morphItem: RecordPickerPickableMorphItem;
        currentRecordAssociations: any[];
      }) => {
        let newAssociations = [...(currentRecordAssociations || [])];

        const existingLink = newAssociations.find(
          (op) => op[relationFieldName]?.id === morphItem.recordId,
        );

        if (isDefined(existingLink)) {
          if (!morphItem.isSelected) {
            // Remove
            newAssociations = newAssociations.filter(
              (op) => op.id !== existingLink.id,
            );
            await deleteOneAssociation(existingLink.id);
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
              __typename: associationObjectNameSingular.charAt(0).toUpperCase() + associationObjectNameSingular.slice(1),
              [sourceFieldName]: { id: recordId },
              [`${sourceFieldName}Id`]: recordId,
              [relationFieldName]: targetRecord,
              [`${relationFieldName}Id`]: morphItem.recordId,
            };

            newAssociations.push(newOp);

            await createOneAssociation({
              ...newOp,
              [relationFieldName]: undefined,
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
            [fieldName]: newAssociations,
          };
        });
      },
    [
      createOneAssociation,
      deleteOneAssociation,
      objectNameSingular,
      recordId,
      setRecordFromStore,
      associationObjectNameSingular,
      fieldName,
      relationFieldName,
      sourceFieldName
    ],
  );

  return { updateProductAssociationFromCell };
};
