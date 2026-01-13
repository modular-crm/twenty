import { type EntityManager } from 'typeorm';
import { PIPELINE_1_ID } from './prefill-pipeline';

export const PIPELINE_STAGE_1_ID = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4a5d';
export const PIPELINE_STAGE_2_ID = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4b5d';
export const PIPELINE_STAGE_3_ID = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4d5d';

export const prefillPipelineStages = async (
  entityManager: EntityManager,
  schemaName: string,
) => {
  await entityManager
    .createQueryBuilder()
    .insert()
    .into(`${schemaName}.pipelineStage`, [
      'id',
      'name',
      'color',
      'position',
      'pipelineId'
    ])
    .orIgnore()
    .values([
      {
        id: PIPELINE_STAGE_1_ID,
        name: 'New',
        color: '#EF4444',
        position: 1,
        pipelineId: PIPELINE_1_ID,
      },
      {
        id: PIPELINE_STAGE_2_ID,
        name: 'In Progress',
        color: '#6366F1',
        position: 2,
        pipelineId: PIPELINE_1_ID,
      },
      {
        id: PIPELINE_STAGE_3_ID,
        name: 'Done',
        color: '#84CC16',
        position: 3,
        pipelineId: PIPELINE_1_ID,
      },
    ])
    .execute();
};
