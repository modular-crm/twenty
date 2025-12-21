import { ActivityTargetableObject } from '@/activities/types/ActivityTargetableEntity';
import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { useCreateOneRecord } from '@/object-record/hooks/useCreateOneRecord';
import { useMultipleRecordPickerOpen } from '@/object-record/record-picker/multiple-record-picker/hooks/useMultipleRecordPickerOpen';

export const useLinkProduct = ({
  targetableObject,
}: {
  targetableObject: ActivityTargetableObject;
}) => {
  const { openMultipleRecordPicker } = useMultipleRecordPickerOpen();

  // We need metadata for Product to configure the picker
  const { objectMetadataItem: productMetadataItem } = useObjectMetadataItem({
    objectNameSingular: CoreObjectNameSingular.Product,
  });

  // Association Creators
  const { createOneRecord: createOppAssociation } = useCreateOneRecord({
    objectNameSingular: CoreObjectNameSingular.OpportunityProductAssociation,
  });
  const { createOneRecord: createLeadAssociation } = useCreateOneRecord({
    objectNameSingular: CoreObjectNameSingular.LeadProductAssociation,
  });
  const { createOneRecord: createDealAssociation } = useCreateOneRecord({
    objectNameSingular: CoreObjectNameSingular.DealProductAssociation,
  });

  const linkProducts = async (productIds: string[]) => {
    const targetIdName = `${targetableObject.targetObjectNameSingular}Id`;

    for (const productId of productIds) {
      const payload = {
        productId,
        [targetIdName]: targetableObject.id,
      };

      if (targetableObject.targetObjectNameSingular === CoreObjectNameSingular.Opportunity) {
        await createOppAssociation(payload);
      } else if (targetableObject.targetObjectNameSingular === CoreObjectNameSingular.Lead) {
        await createLeadAssociation(payload);
      } else if (targetableObject.targetObjectNameSingular === CoreObjectNameSingular.Deal) {
        await createDealAssociation(payload);
      }
    }
  };

  return {
    openLinkProductPicker: (dropdownId: string) => {
        // Open the picker
        openMultipleRecordPicker(dropdownId);
    },
    linkProducts,
    productMetadataItem
  };
};
