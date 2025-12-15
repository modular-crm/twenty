import { ActivityTargetableObject } from '@/activities/types/ActivityTargetableEntity';
import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { useDestroyOneRecord } from '@/object-record/hooks/useDestroyOneRecord';

export const useDetachProduct = ({
  targetableObject,
}: {
  targetableObject: ActivityTargetableObject;
}) => {
  const getAssociationObjectName = () => {
    switch (targetableObject.targetObjectNameSingular) {
      case CoreObjectNameSingular.Opportunity:
        return CoreObjectNameSingular.OpportunityProductAssociation;
      case CoreObjectNameSingular.Lead:
        return CoreObjectNameSingular.LeadProductAssociation;
      case CoreObjectNameSingular.Deal:
        return CoreObjectNameSingular.DealProductAssociation;
      default:
        throw new Error(`Unsupported target object: ${targetableObject.targetObjectNameSingular}`);
    }
  };

  const associationObjectName = getAssociationObjectName();

  const { destroyOneRecord } = useDestroyOneRecord({
    objectNameSingular: associationObjectName,
  });

  const detachProduct = async (associationId: string) => {
    await destroyOneRecord(associationId);
  };

  return { detachProduct };
};
