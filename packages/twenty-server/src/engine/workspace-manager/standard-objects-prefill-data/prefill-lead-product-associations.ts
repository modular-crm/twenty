import { type EntityManager } from 'typeorm';

import {
    LEAD_1_ID,
    LEAD_2_ID,
    LEAD_3_ID,
    LEAD_4_ID,
    LEAD_5_ID,
} from 'src/engine/workspace-manager/standard-objects-prefill-data/prefill-leads';
import {
    PRODUCT_1_ID,
    PRODUCT_2_ID,
    PRODUCT_3_ID,
    PRODUCT_4_ID,
    PRODUCT_5_ID,
} from 'src/engine/workspace-manager/standard-objects-prefill-data/prefill-products';

export const prefillLeadProductAssociations = async (
  entityManager: EntityManager,
  schemaName: string,
) => {
  await entityManager
    .createQueryBuilder()
    .insert()
    .into(`${schemaName}.leadProductAssociation`, ['leadId', 'productId'])
    .orIgnore()
    .values([
      { leadId: LEAD_1_ID, productId: PRODUCT_1_ID },
      { leadId: LEAD_2_ID, productId: PRODUCT_2_ID },
      { leadId: LEAD_2_ID, productId: PRODUCT_4_ID },
      { leadId: LEAD_3_ID, productId: PRODUCT_1_ID },
      { leadId: LEAD_3_ID, productId: PRODUCT_5_ID },
      { leadId: LEAD_4_ID, productId: PRODUCT_2_ID },
      { leadId: LEAD_5_ID, productId: PRODUCT_3_ID },
    ])
    .returning('*')
    .execute();
};
