import { WORKSPACE_MEMBER_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/workspace-member-data-seeds.constant';
import { FieldActorSource } from 'twenty-shared/types';

type ProductDataSeed = {
  id: string;
  name: string;
  description: string;
  priceAmountMicros: number;
  priceCurrencyCode: string;
  isActive: boolean;
  position: number;
  createdBySource: string;
  createdByWorkspaceMemberId: string;
  createdByName: string;
};

export const PRODUCT_DATA_SEED_COLUMNS: (keyof ProductDataSeed)[] = [
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
];

// prettier-ignore
export const PRODUCT_DATA_SEED_IDS = {
  ID_1: '30303030-b112-4f09-a3ff-91bd18b4f9c2',
  ID_2: '30303030-c884-4c79-92fb-57a0e6dd3d44',
  ID_3: '30303030-d3aa-49d7-b67c-2c479b725f81',
  ID_4: '30303030-e55c-4e2f-9c62-6f1e4bb3a912',
  ID_5: '30303030-f996-4ab0-8d91-3a4c1e89cb55',
};

// prettier-ignore
const PRODUCT_DATA_SEEDS_RAW = [
    {
        id: PRODUCT_DATA_SEED_IDS.ID_1,
        name: 'AI Sales Automation Suite',
        description: 'Automated sales workflows powered by AI-driven lead scoring and outreach tools',
        priceAmountMicros: 18000000000, // $18,000
        priceCurrencyCode: 'USD',
        isActive: true,
        position: 1,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: WORKSPACE_MEMBER_DATA_SEED_IDS.TIM,
        createdByName: 'System',
    },
    {
        id: PRODUCT_DATA_SEED_IDS.ID_2,
        name: 'Customer Intelligence Platform',
        description: 'Unified customer insights with sentiment analysis and lifecycle monitoring',
        priceAmountMicros: 7000000000, // $7,000
        priceCurrencyCode: 'USD',
        isActive: true,
        position: 2,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: WORKSPACE_MEMBER_DATA_SEED_IDS.TIM,
        createdByName: 'System',
    },
    {
        id: PRODUCT_DATA_SEED_IDS.ID_3,
        name: 'Team Collaboration Hub',
        description: 'Centralized workspace for team communication, shared tasks, and knowledge bases',
        priceAmountMicros: 2500000000, // $2,500
        priceCurrencyCode: 'USD',
        isActive: true,
        position: 3,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: WORKSPACE_MEMBER_DATA_SEED_IDS.TIM,
        createdByName: 'System',
    },
    {
        id: PRODUCT_DATA_SEED_IDS.ID_4,
        name: 'Data Security Compliance Pack',
        description: 'Enhanced data protection tools with audit logging and regulatory compliance automation',
        priceAmountMicros: 4500000000, // $4,500
        priceCurrencyCode: 'USD',
        isActive: true,
        position: 4,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: WORKSPACE_MEMBER_DATA_SEED_IDS.TIM,
        createdByName: 'System',
    },
    {
        id: PRODUCT_DATA_SEED_IDS.ID_5,
        name: 'Workflow Automation Engine',
        description: 'Customizable automation engine for complex business processes and integrations',
        priceAmountMicros: 5500000000, // $5,500
        priceCurrencyCode: 'USD',
        isActive: true,
        position: 5,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: WORKSPACE_MEMBER_DATA_SEED_IDS.TIM,
        createdByName: 'System',
    }
];


export const PRODUCT_DATA_SEEDS: ProductDataSeed[] = PRODUCT_DATA_SEEDS_RAW.map(
  (product, index) => ({
    ...product,
    position: index + 1,
  }),
);
