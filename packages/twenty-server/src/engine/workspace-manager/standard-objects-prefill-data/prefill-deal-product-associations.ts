import { type EntityManager } from 'typeorm';

import {
    DEAL_1_ID,
    DEAL_2_ID,
    DEAL_3_ID,
    DEAL_4_ID,
    DEAL_5_ID,
} from 'src/engine/workspace-manager/standard-objects-prefill-data/prefill-deals';
import {
    PRODUCT_1_ID,
    PRODUCT_2_ID,
    PRODUCT_3_ID,
    PRODUCT_4_ID,
    PRODUCT_5_ID,
} from 'src/engine/workspace-manager/standard-objects-prefill-data/prefill-products';

export const prefillDealProductAssociations = async (
  entityManager: EntityManager,
  schemaName: string,
) => {
  await entityManager
    .createQueryBuilder()
    .insert()
    .into(`${schemaName}.dealProductAssociation`, ['dealId', 'productId'])
    .orIgnore()
    .values([
      { dealId: DEAL_1_ID, productId: PRODUCT_1_ID },
      { dealId: DEAL_1_ID, productId: PRODUCT_5_ID },
      { dealId: DEAL_2_ID, productId: PRODUCT_2_ID },
      { dealId: DEAL_3_ID, productId: PRODUCT_1_ID },
      { dealId: DEAL_3_ID, productId: PRODUCT_4_ID },
      { dealId: DEAL_3_ID, productId: PRODUCT_5_ID },
      { dealId: DEAL_4_ID, productId: PRODUCT_2_ID },
      { dealId: DEAL_5_ID, productId: PRODUCT_3_ID },
    ])
    .returning('*')
    .execute();
};
