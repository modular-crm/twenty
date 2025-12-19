import { FieldActorSource } from 'twenty-shared/types';
import { type EntityManager } from 'typeorm';

import {
    AIRBNB_ID,
    ANTHROPIC_ID,
    FIGMA_ID,
    NOTION_ID,
    STRIPE_ID,
} from 'src/engine/workspace-manager/standard-objects-prefill-data/prefill-companies';

export const DEAL_1_ID = 'fcabde59-f866-4b49-83a3-b17a6cd33e50'
export const DEAL_2_ID = '807a9702-dc28-4c6c-ad24-a24788a72529'
export const DEAL_3_ID = 'e6af2acf-8c92-4e0d-b318-fa2af3b36e1e'
export const DEAL_4_ID = '8801087f-187a-4458-a500-83ca5ac80b6d'
export const DEAL_5_ID = '0342b6e8-87f6-4554-803d-1d1730a8d0bc'

export const prefillDeals = async (
  entityManager: EntityManager,
  schemaName: string,
) => {
  await entityManager
    .createQueryBuilder()
    .insert()
    .into(`${schemaName}.deal`, [
      'id',
      'name',
      'status',
      'estimatedAmountAmountMicros',
      'estimatedAmountCurrencyCode',
      'closeDate',
      'referralAttribution',
      'approvalStatus',
      'position',
      'createdBySource',
      'createdByWorkspaceMemberId',
      'createdByName',
      'companyId',
    ])
    .orIgnore()
    .values([
      {
        id: DEAL_1_ID,
        name: 'Airbnb Enterprise Deal',
        status: 'IN_PROGRESS',
        estimatedAmountAmountMicros: 50000000000, // $50,000
        estimatedAmountCurrencyCode: 'USD',
        closeDate: new Date('2024-12-31'),
        referralAttribution: 'Partner',
        approvalStatus: 'PENDING',
        position: 1,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
        companyId: AIRBNB_ID,
      },
      {
        id: DEAL_2_ID,
        name: 'Anthropic AI Licenses',
        status: 'TODO',
        estimatedAmountAmountMicros: 20000000000, // $20,000
        estimatedAmountCurrencyCode: 'USD',
        closeDate: new Date('2024-11-15'),
        referralAttribution: 'Cold Outbound',
        approvalStatus: 'APPROVED',
        position: 2,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
        companyId: ANTHROPIC_ID,
      },
      {
        id: DEAL_3_ID,
        name: 'Stripe Global Rollout',
        status: 'DONE',
        estimatedAmountAmountMicros: 100000000000, // $100,000
        estimatedAmountCurrencyCode: 'USD',
        closeDate: new Date('2024-10-01'),
        referralAttribution: 'Inbound',
        approvalStatus: 'APPROVED',
        position: 3,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
        companyId: STRIPE_ID,
      },
      {
        id: DEAL_4_ID,
        name: 'Figma Teams Plan',
        status: 'TODO',
        estimatedAmountAmountMicros: 5000000000, // $5,000
        estimatedAmountCurrencyCode: 'USD',
        closeDate: new Date('2025-01-15'),
        referralAttribution: null,
        approvalStatus: 'PENDING',
        position: 4,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
        companyId: FIGMA_ID,
      },
      {
        id: DEAL_5_ID,
        name: 'Notion Renewal',
        status: 'IN_PROGRESS',
        estimatedAmountAmountMicros: 12000000000, // $12,000
        estimatedAmountCurrencyCode: 'USD',
        closeDate: new Date('2024-09-30'),
        referralAttribution: 'Customer Success',
        approvalStatus: 'REJECTED',
        position: 5,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
        companyId: NOTION_ID,
      },
    ])
    .returning('*')
    .execute();
};
