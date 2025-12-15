// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { EntityManager, Repository } from 'typeorm';

// import { TwentyORMGlobalManager } from 'src/engine/twenty-orm/twenty-orm-global.manager';
// import { DealProductAssociationWorkspaceEntity } from 'src/modules/deal/standard-objects/deal-product-association.workspace-entity';
// import { DealWorkspaceEntity } from 'src/modules/deal/standard-objects/deal.workspace-entity';
// import { LeadProductAssociationWorkspaceEntity } from 'src/modules/lead/standard-objects/lead-product-association.workspace-entity';
// import { LeadWorkspaceEntity } from 'src/modules/lead/standard-objects/lead.workspace-entity'; // Assuming LeadWorkspaceEntity

// @Injectable()
// export class LeadToDealConversionService {
//   constructor(
//     @InjectRepository(LeadWorkspaceEntity, 'workspace')
//     private readonly leadRepository: Repository<LeadWorkspaceEntity>,
//     @InjectRepository(DealWorkspaceEntity, 'workspace')
//     private readonly dealRepository: Repository<DealWorkspaceEntity>,
//     @InjectRepository(LeadProductAssociationWorkspaceEntity, 'workspace')
//     private readonly leadProductRepository: Repository<LeadProductAssociationWorkspaceEntity>,
//     @InjectRepository(DealProductAssociationWorkspaceEntity, 'workspace')
//     private readonly dealProductRepository: Repository<DealProductAssociationWorkspaceEntity>,
//     private readonly twentyORMGlobalManager: TwentyORMGlobalManager,
//   ) {}

//   async convertLeadToDeal(
//     leadId: string,
//     workspaceId: string,
//     currentMemberId: string,
//   ): Promise<DealWorkspaceEntity> {
//     const datasource = await this.twentyORMGlobalManager.getDataSourceForWorkspace(workspaceId);

//     return await datasource.transaction(async (manager: EntityManager) => {
//       // 1. Fetch the Lead with relations
//       const lead = await manager.findOne(LeadWorkspaceEntity, {
//         where: { id: leadId },
//         relations: ['company', 'contact', 'leadProducts', 'leadProducts.product'],
//       });

//       if (!lead) {
//         throw new Error(`Lead with ID ${leadId} not found`);
//       }

//       // 2. Map Lead data to Deal
//       // NOTE: "title", "owner", "status", "company", "contact" are direct maps or explicit requirements.
//       // "estimatedAmount" mapped from "expectedVolume" (number).
//       // "closeDate" needs to be set. Defaulting to 30 days from now as a placeholder/logical default.
//       // "referralAttribution" mapped from "referralCode".
//       // "approvalStatus" needs a default. Setting to 'Pending'.

//       const newDeal = new DealWorkspaceEntity();
//       newDeal.title = lead.title;
//       newDeal.status = 'New'; // Default status for new Deal
//       newDeal.estimatedAmount = lead.expectedVolume ?? 0;

//       const nextMonth = new Date();
//       nextMonth.setDate(nextMonth.getDate() + 30);
//       newDeal.closeDate = nextMonth.toISOString();

//       newDeal.referralAttribution = lead.referralCode;
//       newDeal.owner = lead.owner;
//       newDeal.approvalStatus = 'Pending';
//       newDeal.company = lead.company;
//       newDeal.contact = lead.contact;

//       // Setting createdBy to the user performing the action or keeping original?
//       // Usually conversion is a new action.
//       // Creating a temporary object to satisfy relation type if needed or just ID.
//       // For now, let's assume standard object creation handles updatedBy/createdBy if context provided,
//       // but here we are manual.
//       // We will leave createdBy/updatedBy for default subscribers if possible,
//       // or set if we have the entity.

//       // 3. Save Deal
//       const savedDeal = await manager.save(DealWorkspaceEntity, newDeal);

//       // 4. Migrate Products (M2M)
//       if (lead.leadProducts && lead.leadProducts.length > 0) {
//         const dealProducts = lead.leadProducts.map((lp) => {
//             const dp = new DealProductAssociationWorkspaceEntity();
//             dp.dealId = savedDeal.id;
//             dp.productId = lp.productId;
//             return dp;
//         });
//         await manager.save(DealProductAssociationWorkspaceEntity, dealProducts);
//       }

//       // 5. Delete Lead
//       await manager.remove(LeadWorkspaceEntity, lead);

//       return savedDeal;
//     });
//   }
// }
