import { FieldActorSource } from 'twenty-shared/types';
import { type EntityManager } from 'typeorm';

export const PRODUCT_1_ID = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';
export const PRODUCT_2_ID = 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e';
export const PRODUCT_3_ID = 'c3d4e5f6-a7b8-4c9d-8e1f-2a3b4c5d6e7f';
export const PRODUCT_4_ID = 'd4e5f6a7-b8c9-4d0e-8f2a-3b4c5d6e7f8a';
export const PRODUCT_5_ID = 'e5f6a7b8-c9d0-4e1f-8a3b-4c5d6e7f8a9b';
export const PRODUCT_6_ID = 'f6a7b8c9-d0e1-4f2a-8b4c-5d6e7f8a9b0c';

export const prefillProducts = async (
  entityManager: EntityManager,
  schemaName: string,
) => {
  await entityManager
    .createQueryBuilder()
    .insert()
    .into(`${schemaName}.product`, [
      'id',
      'name',
      'description',
      'priceAmountMicros',
      'priceCurrencyCode',
      'isActive',
      'position',
      'createdBySource',
      'createdByWorkspaceMemberId',
      'createdByName',
    ])
    .orIgnore()
    .values([
      {
        id: PRODUCT_1_ID,
        name: 'Enterprise CRM License',
        description: 'Full-featured enterprise CRM license with unlimited users',
        priceAmountMicros: 15000000000, // $15,000
        priceCurrencyCode: 'USD',
        isActive: true,
        position: 1,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
      },
      {
        id: PRODUCT_2_ID,
        name: 'Professional CRM License',
        description: 'Professional CRM license for growing teams',
        priceAmountMicros: 5000000000, // $5,000
        priceCurrencyCode: 'USD',
        isActive: true,
        position: 2,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
      },
      {
        id: PRODUCT_3_ID,
        name: 'Starter CRM License',
        description: 'Entry-level CRM license for small teams',
        priceAmountMicros: 1500000000, // $1,500
        priceCurrencyCode: 'USD',
        isActive: true,
        position: 3,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
      },
      {
        id: PRODUCT_4_ID,
        name: 'Analytics Add-on',
        description: 'Advanced analytics and reporting module',
        priceAmountMicros: 2500000000, // $2,500
        priceCurrencyCode: 'USD',
        isActive: true,
        position: 4,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
      },
      {
        id: PRODUCT_5_ID,
        name: 'Integration Suite',
        description: 'Third-party integrations and API access',
        priceAmountMicros: 3000000000, // $3,000
        priceCurrencyCode: 'USD',
        isActive: true,
        position: 5,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
      },
      {
        id: PRODUCT_6_ID,
        name: 'Support Package',
        description: 'Premium 24/7 support with dedicated account manager',
        priceAmountMicros: 5000000000, // $5,000
        priceCurrencyCode: 'USD',
        isActive: true,
        position: 6,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
      },
    ])
    .returning('*')
    .execute();
};
