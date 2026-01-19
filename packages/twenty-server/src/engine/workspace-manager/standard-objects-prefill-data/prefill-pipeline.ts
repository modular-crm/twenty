import { type EntityManager } from 'typeorm';

export const PIPELINE_1_ID = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4e5d';

export const prefillPipeline = async (
  entityManager: EntityManager,
  schemaName: string,
) => {
  await entityManager
    .createQueryBuilder()
    .insert()
    .into(`${schemaName}.pipeline`, [
      'id',
      'name',
      'isDefault'
    ])
    .orIgnore()
    .values([
      {
        id: PIPELINE_1_ID,
        name: 'Sales',
        isDefault: true
      },
    ])
    .execute();
};
