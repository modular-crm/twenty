import { useSetRecoilState } from 'recoil';

import { ActivityTargetableObject } from '@/activities/types/ActivityTargetableEntity';
import { useOpenRecordInCommandMenu } from '@/command-menu/hooks/useOpenRecordInCommandMenu';
import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { useCreateOneRecord } from '@/object-record/hooks/useCreateOneRecord';
import { viewableRecordIdState } from '@/object-record/record-right-drawer/states/viewableRecordIdState';
import { viewableRecordNameSingularState } from '@/object-record/record-right-drawer/states/viewableRecordNameSingularState';

interface UseOpenCreateProductDrawerProps {
  productObjectNameSingular: CoreObjectNameSingular.Product;
}

export const useOpenCreateProductDrawer = ({
  productObjectNameSingular,
}: UseOpenCreateProductDrawerProps) => {
  const { createOneRecord: createOneProduct } = useCreateOneRecord({
    objectNameSingular: productObjectNameSingular,
  });

  const { createOneRecord: createOneProductAssociation, loading: loadingAssociation } =
    useCreateOneRecord({
      objectNameSingular: CoreObjectNameSingular.OpportunityProductAssociation, // Default, will be dynamic based on target
    });

  const setViewableRecordId = useSetRecoilState(viewableRecordIdState);
  const setViewableRecordNameSingular = useSetRecoilState(
    viewableRecordNameSingularState,
  );

  const { openRecordInCommandMenu } = useOpenRecordInCommandMenu();

  const getAssociationObjectName = (targetObjectName: string) => {
    switch (targetObjectName) {
      case CoreObjectNameSingular.Opportunity:
        return CoreObjectNameSingular.OpportunityProductAssociation;
      case CoreObjectNameSingular.Lead:
        return CoreObjectNameSingular.LeadProductAssociation;
      case CoreObjectNameSingular.Deal:
        return CoreObjectNameSingular.DealProductAssociation;
      default:
        // Fallback or error - simplistic for now, assuming Opportunity based on user context
        return CoreObjectNameSingular.OpportunityProductAssociation;
    }
  };

    // We need a way to dynamically create the association based on input,
    // but useCreateOneRecord hook takes objectNameSingular at init time.
    // However, looking at useOpenCreateActivityDrawer, it instantiates useCreateOneRecord with specific types.
    // For products, the association object differs significantly (OpportunityProductAssociation vs LeadProductAssociation).
    // Let's instantiate all potential association creators or just valid ones if we can.
    // Or we can just use the generic createOneRecord if we bypass strict typing or assume useCreateOneRecord can handle it if we pass the singular name at call time?
    // Checking useCreateOneRecord definition... it takes config at init.

    // Strategy: We will define hooks for each known association type for now, or instantiate them inside the function if rules allow (hooksrules say no).
    // Better: Instantiate all 3 common association creators.

  const { createOneRecord: createOppAssociation } = useCreateOneRecord({
    objectNameSingular: CoreObjectNameSingular.OpportunityProductAssociation,
  });

  // const { createOneRecord: createLeadAssociation } = useCreateOneRecord({
  //   objectNameSingular: CoreObjectNameSingular.LeadProductAssociation,
  // });
    // CoreObjectNameSingular.LeadProductAssociation might not exist or be named differently, verified in view_file earlier?
    // Line 31: LeadProductAssociation = 'leadProductAssociation', -- Yes it exists.

  const { createOneRecord: createLeadAssociation } = useCreateOneRecord({
      objectNameSingular: CoreObjectNameSingular.LeadProductAssociation,
  });

   const { createOneRecord: createDealAssociation } = useCreateOneRecord({
      objectNameSingular: CoreObjectNameSingular.DealProductAssociation,
  });


  const openCreateProductDrawer = async ({
    targetableObject,
  }: {
    targetableObject: ActivityTargetableObject;
  }) => {
    setViewableRecordId(null);
    setViewableRecordNameSingular(productObjectNameSingular);

    // 1. Create Product
    const product = await createOneProduct({
        // Default fields if any
    });

    // 2. Create Association
    const targetIdName = `${targetableObject.targetObjectNameSingular}Id`; // e.g., opportunityId

    const associationPayload = {
        productId: product.id,
        [targetIdName]: targetableObject.id,
    };

    if (targetableObject.targetObjectNameSingular === CoreObjectNameSingular.Opportunity) {
        await createOppAssociation(associationPayload);
    } else if (targetableObject.targetObjectNameSingular === CoreObjectNameSingular.Lead) {
        await createLeadAssociation(associationPayload);
    } else if (targetableObject.targetObjectNameSingular === CoreObjectNameSingular.Deal) {
        await createDealAssociation(associationPayload);
    }

    // 3. Open Drawer
    openRecordInCommandMenu({
      recordId: product.id,
      objectNameSingular: productObjectNameSingular,
      isNewRecord: true,
    });

    setViewableRecordId(product.id);
  };

  return openCreateProductDrawer;
};
