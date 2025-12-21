import { PRODUCT_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/product-data-seeds.constant';
import { OPPORTUNITY_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/opportunity-data-seeds.constant';

type OpportunityProductDataSeed = {
  id: string;
  productId: string;
  opportunityId: string;
};

export const OPPORTUNITY_PRODUCT_DATA_SEED_COLUMNS: (keyof OpportunityProductDataSeed)[] = [
 'id',
 'productId',
 'opportunityId'
];

const GENERATE_OPPORTUNITY_PRODUCT_IDS = (): Record<string, string> => {
  const OPPORTUNITY_PRODUCT_IDS: Record<string, string> = {};

  for (let INDEX = 1; INDEX <= 800; INDEX++) {
    const HEX_INDEX = INDEX.toString(16).padStart(4, '0');

    OPPORTUNITY_PRODUCT_IDS[`ID_${INDEX}`] =
      `70707070-${HEX_INDEX}-4e7c-8001-123456789abc`;
  }

  return OPPORTUNITY_PRODUCT_IDS;
};

export const OPPORTUNITY_PRODUCT_DATA_SEED_IDS = GENERATE_OPPORTUNITY_PRODUCT_IDS();

// prettier-ignore
const GENERATE_OPPORTUNITY_PRODUCT_DATA_SEEDS =
  (): OpportunityProductDataSeed[] => {
    const ASSOCIATION_SEEDS: OpportunityProductDataSeed[] = [];

    const OPPORTUNITY_IDS = Object.values(OPPORTUNITY_DATA_SEED_IDS);

    const PRODUCT_IDS = [
      PRODUCT_DATA_SEED_IDS.ID_1,
      PRODUCT_DATA_SEED_IDS.ID_2,
      PRODUCT_DATA_SEED_IDS.ID_3,
      PRODUCT_DATA_SEED_IDS.ID_4,
      PRODUCT_DATA_SEED_IDS.ID_5,
    ];

    let associationCounter = 1;

    OPPORTUNITY_IDS.forEach((opportunityId) => {
      // Each opportunity gets 1–3 products (change if needed)
      const numProducts = Math.floor(Math.random() * 3) + 1;

      // Randomly pick unique products
      const chosenProducts = PRODUCT_IDS
        .sort(() => Math.random() - 0.5)
        .slice(0, numProducts);

      chosenProducts.forEach((productId) => {
        ASSOCIATION_SEEDS.push({
          id: OPPORTUNITY_PRODUCT_DATA_SEED_IDS[`ID_${associationCounter}`],
          productId,
          opportunityId
        });

        associationCounter++;
      });
    });

    return ASSOCIATION_SEEDS;
  };


export const OPPORTUNITY_PRODUCT_DATA_SEEDS =
  GENERATE_OPPORTUNITY_PRODUCT_DATA_SEEDS();
