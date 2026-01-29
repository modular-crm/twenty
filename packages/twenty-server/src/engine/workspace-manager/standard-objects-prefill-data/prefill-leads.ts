import { FieldActorSource } from 'twenty-shared/types';
import { type EntityManager } from 'typeorm';

import {
    AIRBNB_ID,
    ANTHROPIC_ID,
    FIGMA_ID,
    NOTION_ID,
    STRIPE_ID,
} from 'src/engine/workspace-manager/standard-objects-prefill-data/prefill-companies';

export const LEAD_1_ID = 'abd52fd5-d66f-4779-a1f5-0315e8bf5c86';
export const LEAD_2_ID = 'f2d74106-33ae-4fd7-be0e-ed6b40efb751'
export const LEAD_3_ID = '84cf6181-5a98-454c-a744-6d8f148feab6'
export const LEAD_4_ID = 'b874ea3c-f0fe-43bd-a009-f05a7eff5237'
export const LEAD_5_ID = '8eb6f086-548b-4439-8a99-90e87f4789cf'

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
        vertical: 'VERTICAL1',
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
        vertical: 'VERTICAL2',
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
        vertical: 'VERTICAL1',
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
        vertical: 'VERTICAL3',
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
        vertical: 'VERTICAL2',
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
