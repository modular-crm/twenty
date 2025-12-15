import { FieldActorSource } from 'twenty-shared/types';
import { type EntityManager } from 'typeorm';

import {
    AIRBNB_ID,
    ANTHROPIC_ID,
    FIGMA_ID,
    NOTION_ID,
    STRIPE_ID,
} from 'src/engine/workspace-manager/standard-objects-prefill-data/prefill-companies';

export const DEAL_1_ID = '20202020-0002-0002-0002-000000000001';
export const DEAL_2_ID = '20202020-0002-0002-0002-000000000002';
export const DEAL_3_ID = '20202020-0002-0002-0002-000000000003';
export const DEAL_4_ID = '20202020-0002-0002-0002-000000000004';
export const DEAL_5_ID = '20202020-0002-0002-0002-000000000005';

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
