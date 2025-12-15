import { type DataSource, type EntityManager } from 'typeorm';

import { type FlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/types/flat-entity-maps.type';
import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';
import { type FlatObjectMetadata } from 'src/engine/metadata-modules/flat-object-metadata/types/flat-object-metadata.type';
import { prefillCompanies } from 'src/engine/workspace-manager/standard-objects-prefill-data/prefill-companies';
import { prefillDealProductAssociations } from 'src/engine/workspace-manager/standard-objects-prefill-data/prefill-deal-product-associations';
import { prefillDeals } from 'src/engine/workspace-manager/standard-objects-prefill-data/prefill-deals';
import { prefillLeadProductAssociations } from 'src/engine/workspace-manager/standard-objects-prefill-data/prefill-lead-product-associations';
import { prefillLeads } from 'src/engine/workspace-manager/standard-objects-prefill-data/prefill-leads';
import { prefillPeople } from 'src/engine/workspace-manager/standard-objects-prefill-data/prefill-people';
import { prefillProducts } from 'src/engine/workspace-manager/standard-objects-prefill-data/prefill-products';
import { prefillWorkflows } from 'src/engine/workspace-manager/standard-objects-prefill-data/prefill-workflows';

export const standardObjectsPrefillData = async (
  dataSource: DataSource,
  schemaName: string,
  flatObjectMetadataMaps: FlatEntityMaps<FlatObjectMetadata>,
  flatFieldMetadataMaps: FlatEntityMaps<FlatFieldMetadata>,
) => {
  dataSource.transaction(async (entityManager: EntityManager) => {
    await prefillCompanies(entityManager, schemaName);

    await prefillPeople(entityManager, schemaName);

    await prefillProducts(entityManager, schemaName);

    await prefillLeads(entityManager, schemaName);
    await prefillLeadProductAssociations(entityManager, schemaName);

    await prefillDeals(entityManager, schemaName);
    await prefillDealProductAssociations(entityManager, schemaName);

    await prefillWorkflows(
      entityManager,
      schemaName,
      flatObjectMetadataMaps,
      flatFieldMetadataMaps,
    );
  });
};
