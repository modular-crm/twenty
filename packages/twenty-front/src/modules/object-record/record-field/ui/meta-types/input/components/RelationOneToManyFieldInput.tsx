import { useContext } from 'react';

import { useActivityTargetObjectRecords } from '@/activities/hooks/useActivityTargetObjectRecords';
import { useUpdateActivityTargetFromCell } from '@/activities/inline-cell/hooks/useUpdateActivityTargetFromCell';
import { type NoteTarget } from '@/activities/types/NoteTarget';
import { type TaskTarget } from '@/activities/types/TaskTarget';
import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { useObjectMetadataItems } from '@/object-metadata/hooks/useObjectMetadataItems';
import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { getFieldMetadataItemById } from '@/object-metadata/utils/getFieldMetadataItemById';
import { FieldContext } from '@/object-record/record-field/ui/contexts/FieldContext';
import { FieldInputEventContext } from '@/object-record/record-field/ui/contexts/FieldInputEventContext';
import { useRelationField } from '@/object-record/record-field/ui/meta-types/hooks/useRelationField';
import { useAddNewRecordAndOpenRightDrawer } from '@/object-record/record-field/ui/meta-types/input/hooks/useAddNewRecordAndOpenRightDrawer';
import { useUpdateProductAssociationFromCell } from '@/object-record/record-field/ui/meta-types/input/hooks/useUpdateProductAssociationFromCell';
import { useUpdateRelationOneToManyFieldInput } from '@/object-record/record-field/ui/meta-types/input/hooks/useUpdateRelationOneToManyFieldInput';
import { RecordFieldComponentInstanceContext } from '@/object-record/record-field/ui/states/contexts/RecordFieldComponentInstanceContext';
import { recordFieldInputLayoutDirectionComponentState } from '@/object-record/record-field/ui/states/recordFieldInputLayoutDirectionComponentState';
import { type FieldDefinition } from '@/object-record/record-field/ui/types/FieldDefinition';
import { type FieldRelationMetadata } from '@/object-record/record-field/ui/types/FieldMetadata';
import { MultipleRecordPicker } from '@/object-record/record-picker/multiple-record-picker/components/MultipleRecordPicker';
import { useMultipleRecordPickerPerformSearch } from '@/object-record/record-picker/multiple-record-picker/hooks/useMultipleRecordPickerPerformSearch';
import { multipleRecordPickerPickableMorphItemsComponentState } from '@/object-record/record-picker/multiple-record-picker/states/multipleRecordPickerPickableMorphItemsComponentState';
import { useAvailableComponentInstanceIdOrThrow } from '@/ui/utilities/state/component-state/hooks/useAvailableComponentInstanceIdOrThrow';
import { useRecoilComponentCallbackState } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentCallbackState';
import { useRecoilComponentValue } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentValue';
import { useRecoilCallback } from 'recoil';
import { CustomError, isDefined } from 'twenty-shared/utils';

export const RelationOneToManyFieldInput = () => {
  const { fieldDefinition, recordId } = useContext(FieldContext);
  const instanceId = useAvailableComponentInstanceIdOrThrow(
    RecordFieldComponentInstanceContext,
  );

  const { onSubmit } = useContext(FieldInputEventContext);

  const { updateRelation } = useUpdateRelationOneToManyFieldInput();
  const fieldName = fieldDefinition.metadata.fieldName;
  const { objectMetadataItems } = useObjectMetadataItems();
  const { fieldMetadataItem, objectMetadataItem } = getFieldMetadataItemById({
    fieldMetadataId: fieldDefinition.fieldMetadataId,
    objectMetadataItems,
  });
  if (!fieldMetadataItem || !objectMetadataItem) {
    throw new CustomError(
      'Field metadata item or object metadata item not found',
      'FIELD_METADATA_ITEM_OR_OBJECT_METADATA_ITEM_NOT_FOUND',
    );
  }
  const objectMetadataNameSingular =
    fieldDefinition.metadata.objectMetadataNameSingular;

  const { updateActivityTargetFromCell } = useUpdateActivityTargetFromCell({
    activityObjectNameSingular: objectMetadataNameSingular as
      | CoreObjectNameSingular.Note
      | CoreObjectNameSingular.Task,
    activityId: recordId,
  });

  const { fieldValue } = useRelationField();

  const handleSubmit = () => {
    onSubmit?.({ skipPersist: true });
  };

  const isRelationFromActivityTargets =
    (fieldName === 'noteTargets' &&
      objectMetadataNameSingular === CoreObjectNameSingular.Note) ||
    (fieldName === 'taskTargets' &&
      objectMetadataNameSingular === CoreObjectNameSingular.Task);

  const { activityTargetObjectRecords } = useActivityTargetObjectRecords(
    recordId,
    fieldValue as NoteTarget[] | TaskTarget[],
  );

  const relationFieldDefinition =
    fieldDefinition as FieldDefinition<FieldRelationMetadata>;

  const { objectMetadataItem: relationObjectMetadataItem } =
    useObjectMetadataItem({
      objectNameSingular:
        relationFieldDefinition.metadata.relationObjectMetadataNameSingular,
    });

  const relationFieldMetadataItem = relationObjectMetadataItem.fields.find(
    ({ id }) => id === relationFieldDefinition.metadata.relationFieldMetadataId,
  );
  if (!relationFieldMetadataItem) {
    throw new CustomError(
      'Relation field metadata item not found',
      'RELATION_FIELD_METADATA_ITEM_NOT_FOUND',
    );
  }

  const { createNewRecordAndOpenRightDrawer } =
    useAddNewRecordAndOpenRightDrawer({
      fieldMetadataItem,
      objectMetadataItem,
      relationObjectMetadataNameSingular:
        relationFieldDefinition.metadata.relationObjectMetadataNameSingular,
      relationObjectMetadataItem,
      relationFieldMetadataItem,
      recordId,
    });

  const layoutDirection = useRecoilComponentValue(
    recordFieldInputLayoutDirectionComponentState,
  );

  const multipleRecordPickerPickableMorphItemsCallbackState =
    useRecoilComponentCallbackState(
      multipleRecordPickerPickableMorphItemsComponentState,
      instanceId,
    );
  const { performSearch: multipleRecordPickerPerformSearch } =
    useMultipleRecordPickerPerformSearch();

  const handleCreateNew = useRecoilCallback(
    ({ snapshot, set }) =>
      async (searchInput?: string) => {
        const newRecordId =
          await createNewRecordAndOpenRightDrawer?.(searchInput);

        if (!isDefined(newRecordId)) {
          return;
        }

        const multipleRecordPickerPickableMorphItems = snapshot
          .getLoadable(multipleRecordPickerPickableMorphItemsCallbackState)
          .getValue();

        const newMorphItems = multipleRecordPickerPickableMorphItems.concat({
          recordId: newRecordId,
          objectMetadataId: relationObjectMetadataItem.id,
          isSelected: true,
          isMatchingSearchFilter: true,
        });

        set(multipleRecordPickerPickableMorphItemsCallbackState, newMorphItems);

        multipleRecordPickerPerformSearch({
          multipleRecordPickerInstanceId: instanceId,
          forceSearchFilter: searchInput,
          forceSearchableObjectMetadataItems: [relationObjectMetadataItem],
          forcePickableMorphItems: newMorphItems,
        });
      },
    [
      createNewRecordAndOpenRightDrawer,
      relationObjectMetadataItem,
      instanceId,
      multipleRecordPickerPickableMorphItemsCallbackState,
      multipleRecordPickerPerformSearch,
    ],
  );

  const isRelationFromOpportunityProduct =
    fieldName === 'opportunityProducts' &&
    (objectMetadataNameSingular === CoreObjectNameSingular.Opportunity ||
      objectMetadataNameSingular === CoreObjectNameSingular.Product);

  const isRelationFromLeadProduct =
    fieldName === 'leadProducts' &&
    (objectMetadataNameSingular === CoreObjectNameSingular.Lead ||
      objectMetadataNameSingular === CoreObjectNameSingular.Product);

  const isRelationFromDealProduct =
    fieldName === 'dealProducts' &&
    (objectMetadataNameSingular === CoreObjectNameSingular.Deal ||
      objectMetadataNameSingular === CoreObjectNameSingular.Product);

  const isRelationFromProductAssociation = isRelationFromOpportunityProduct || isRelationFromLeadProduct || isRelationFromDealProduct;

  let associationObjectNameSingular: CoreObjectNameSingular = CoreObjectNameSingular.OpportunityProductAssociation;
  let relationFieldName = 'product';
  let sourceFieldName = 'opportunity';

  if (isRelationFromOpportunityProduct) {
    associationObjectNameSingular = CoreObjectNameSingular.OpportunityProductAssociation;
    if (objectMetadataNameSingular === CoreObjectNameSingular.Product) {
      relationFieldName = 'opportunity';
      sourceFieldName = 'product';
    } else {
      relationFieldName = 'product';
      sourceFieldName = 'opportunity';
    }
  } else if (isRelationFromLeadProduct) {
    associationObjectNameSingular = CoreObjectNameSingular.LeadProductAssociation;
    if (objectMetadataNameSingular === CoreObjectNameSingular.Product) {
      relationFieldName = 'lead';
      sourceFieldName = 'product';
    } else {
      relationFieldName = 'product';
      sourceFieldName = 'lead';
    }
  } else if (isRelationFromDealProduct) {
    associationObjectNameSingular = CoreObjectNameSingular.DealProductAssociation;
    if (objectMetadataNameSingular === CoreObjectNameSingular.Product) {
      relationFieldName = 'deal';
      sourceFieldName = 'product';
    } else {
      relationFieldName = 'product';
      sourceFieldName = 'deal';
    }
  }

  const { updateProductAssociationFromCell } =
    useUpdateProductAssociationFromCell({
      objectNameSingular: objectMetadataNameSingular as any,
      recordId,
      associationObjectNameSingular,
      fieldName,
      relationFieldName,
      sourceFieldName,
    });

  const canCreateNew =
    !isRelationFromActivityTargets && !isRelationFromProductAssociation;

  return (
    <MultipleRecordPicker
      focusId={instanceId}
      componentInstanceId={instanceId}
      onSubmit={handleSubmit}
      onChange={(morphItem) => {
        if (isRelationFromActivityTargets) {
          updateActivityTargetFromCell({
            morphItem,
            activityTargetWithTargetRecords: activityTargetObjectRecords,
            recordPickerInstanceId: instanceId,
          });
        } else if (isRelationFromProductAssociation) {
          updateProductAssociationFromCell({
            morphItem,
            currentRecordAssociations: fieldValue as any[],
          });
        } else {
          updateRelation(morphItem);
        }
      }}
      onCreate={canCreateNew ? handleCreateNew : undefined}
      objectMetadataItemIdForCreate={relationObjectMetadataItem.id}
      onClickOutside={handleSubmit}
      layoutDirection={
        layoutDirection === 'downward'
          ? 'search-bar-on-top'
          : 'search-bar-on-bottom'
      }
    />
  );
};
