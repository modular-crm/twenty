import { FieldActorSource } from 'twenty-shared/types';
import { type EntityManager } from 'typeorm';

import {
    AIRBNB_ID,
    ANTHROPIC_ID,
    FIGMA_ID,
    NOTION_ID,
    STRIPE_ID,
} from 'src/engine/workspace-manager/standard-objects-prefill-data/prefill-companies';

export const LEAD_1_ID = '20202020-0001-0001-0001-000000000001';
export const LEAD_2_ID = '20202020-0001-0001-0001-000000000002';
export const LEAD_3_ID = '20202020-0001-0001-0001-000000000003';
export const LEAD_4_ID = '20202020-0001-0001-0001-000000000004';
export const LEAD_5_ID = '20202020-0001-0001-0001-000000000005';

export const prefillLeads = async (
  entityManager: EntityManager,
  schemaName: string,
) => {
  await entityManager
    .createQueryBuilder()
    .insert()
    .into(`${schemaName}.lead`, [
      'id',
      'name',
      'division',
      'market',
      'vertical',
      'license',
      'settlementType',
      'referralCode',
      'expectedVolume',
      'position',
      'createdBySource',
      'createdByWorkspaceMemberId',
      'createdByName',
      'companyId',
    ])
    .orIgnore()
    .values([
      {
        id: LEAD_1_ID,
        name: 'Airbnb Enterprise Expansion',
        division: 'North America',
        market: 'Enterprise',
        vertical: 'Vertical1',
        license: 'Enterprise',
        settlementType: 'Annual',
        referralCode: 'REF-ABNB',
        expectedVolume: '1000',
        position: 1,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
        companyId: AIRBNB_ID,
      },
      {
        id: LEAD_2_ID,
        name: 'Anthropic Research Partnership',
        division: 'Global',
        market: 'Research',
        vertical: 'Vertical2',
        license: 'Research',
        settlementType: 'Monthly',
        referralCode: 'REF-ANTH',
        expectedVolume: '500',
        position: 2,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
        companyId: ANTHROPIC_ID,
      },
      {
        id: LEAD_3_ID,
        name: 'Stripe Payments Integration',
        division: 'EMEA',
        market: 'FinTech',
        vertical: 'Vertical1',
        license: 'Standard',
        settlementType: 'Quarterly',
        referralCode: 'REF-STRP',
        expectedVolume: '2000',
        position: 3,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
        companyId: STRIPE_ID,
      },
      {
        id: LEAD_4_ID,
        name: 'Figma Design Tools',
        division: 'North America',
        market: 'SaaS',
        vertical: 'Vertical3',
        license: 'Enterprise',
        settlementType: 'Annual',
        referralCode: null,
        expectedVolume: null,
        position: 4,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
        companyId: FIGMA_ID,
      },
      {
        id: LEAD_5_ID,
        name: 'Notion Workspace Upgrade',
        division: 'Global',
        market: 'SaaS',
        vertical: 'Vertical2',
        license: 'Plus',
        settlementType: 'Annual',
        referralCode: 'REF-NOTN',
        expectedVolume: '150',
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
