import { CardType } from '@/object-record/record-show/types/CardType';
import { type RecordLayout } from '@/object-record/record-show/types/RecordLayout';

export const DEAL_RECORD_LAYOUT: RecordLayout = {
  tabs: {
    products: {
      title: 'Products',
      position: 600,
      icon: 'IconPackage',
      cards: [{ type: CardType.ProductCard }],
      hide: {
        ifMobile: false,
        ifDesktop: false,
        ifInRightDrawer: false,
        ifFeaturesDisabled: [],
        ifRequiredObjectsInactive: [],
        ifRelationsMissing: [],
      },
    },
  },
};
