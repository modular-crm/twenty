import { ActivityTargetableObject } from '@/activities/types/ActivityTargetableEntity';
import { MultipleRecordPicker } from '@/object-record/record-picker/multiple-record-picker/components/MultipleRecordPicker';
import { useMultipleRecordPickerOpen } from '@/object-record/record-picker/multiple-record-picker/hooks/useMultipleRecordPickerOpen';
import { useMultipleRecordPickerPerformSearch } from '@/object-record/record-picker/multiple-record-picker/hooks/useMultipleRecordPickerPerformSearch';
import { multipleRecordPickerPickableMorphItemsComponentState } from '@/object-record/record-picker/multiple-record-picker/states/multipleRecordPickerPickableMorphItemsComponentState';
import { multipleRecordPickerSearchableObjectMetadataItemsComponentState } from '@/object-record/record-picker/multiple-record-picker/states/multipleRecordPickerSearchableObjectMetadataItemsComponentState';
import { multipleRecordPickerSearchFilterComponentState } from '@/object-record/record-picker/multiple-record-picker/states/multipleRecordPickerSearchFilterComponentState';
import { Dropdown } from '@/ui/layout/dropdown/components/Dropdown';
import { useCloseDropdown } from '@/ui/layout/dropdown/hooks/useCloseDropdown';
import { useSetRecoilComponentState } from '@/ui/utilities/state/component-state/hooks/useSetRecoilComponentState';
import { t } from '@lingui/core/macro';
import { useState } from 'react';
import { IconLink } from 'twenty-ui/display';
import { LightIconButton } from 'twenty-ui/input';
import { v4 } from 'uuid';
import { useDetachProduct } from '../hooks/useDetachProduct';
import { useLinkProduct } from '../hooks/useLinkProduct';

export const LinkProductButton = ({
  targetableObject,
  currentProducts,
}: {
  targetableObject: ActivityTargetableObject;
  currentProducts: any[];
}) => {
  const [dropdownId] = useState(() => v4());

  const { linkProducts, productMetadataItem } = useLinkProduct({
    targetableObject,
  });

  const { detachProduct } = useDetachProduct({
    targetableObject,
  });

  const { closeDropdown } = useCloseDropdown();
  const { openMultipleRecordPicker } = useMultipleRecordPickerOpen();
  const { performSearch } = useMultipleRecordPickerPerformSearch();

  const setMultipleRecordPickerSearchableObjectMetadataItems =
    useSetRecoilComponentState(
      multipleRecordPickerSearchableObjectMetadataItemsComponentState,
      dropdownId,
    );

  const setMultipleRecordPickerPickableMorphItems = useSetRecoilComponentState(
    multipleRecordPickerPickableMorphItemsComponentState,
    dropdownId,
  );

  const setMultipleRecordPickerSearchFilter = useSetRecoilComponentState(
    multipleRecordPickerSearchFilterComponentState,
    dropdownId,
  );

  const handleOpen = () => {
    // Configure Picker
    setMultipleRecordPickerSearchableObjectMetadataItems([productMetadataItem]);
    setMultipleRecordPickerSearchFilter('');

    // Set initial selection state based on currentProducts
    // Map current products to "PickableMorphItems"
    const currentItems = currentProducts.map(p => ({
        recordId: p.id,
        objectMetadataId: productMetadataItem.id,
        isSelected: true,
        isMatchingSearchFilter: true, // Initially true for visual consistency or based on search
    }));

    setMultipleRecordPickerPickableMorphItems(currentItems);

    openMultipleRecordPicker(dropdownId);

    performSearch({
      multipleRecordPickerInstanceId: dropdownId,
      forceSearchFilter: '',
      forceSearchableObjectMetadataItems: [productMetadataItem],
      forcePickableMorphItems: currentItems
    });
  };

  const handleChange = async (item: any) => {
    // item: RecordPickerPickableMorphItem
    if (item.isSelected) {
        // It became selected -> Link
        await linkProducts([item.recordId]);
    } else {
        // It became unselected -> Detach
        // We need the association ID.
        // We look it up in currentProducts.
        const product = currentProducts.find(p => p.id === item.recordId);
        if (product && product.associationId) {
            await detachProduct(product.associationId);
        }
    }
  };

  return (
    <Dropdown
      dropdownId={dropdownId}
      dropdownPlacement="left-start"
      onOpen={handleOpen}
      clickableComponent={
        <LightIconButton
            Icon={IconLink}
            accent="tertiary"
            title={t`Link Product`}
        />
      }
      dropdownComponents={
        <MultipleRecordPicker
          focusId={dropdownId}
          componentInstanceId={dropdownId}
          onChange={handleChange}
          onClickOutside={() => closeDropdown(dropdownId)}
        />
      }
    />
  );
};
