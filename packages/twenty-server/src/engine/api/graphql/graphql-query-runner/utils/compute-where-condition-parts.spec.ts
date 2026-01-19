
import { computeWhereConditionParts } from './compute-where-condition-parts';
import { FieldMetadataType } from 'twenty-shared/types';

describe('computeWhereConditionParts', () => {
  it('should generate correct SQL for notIn operator', () => {
    const result = computeWhereConditionParts({
      operator: 'notIn',
      objectNameSingular: 'company',
      key: 'id',
      value: ['uuid-1', 'uuid-2'],
      fieldMetadataType: FieldMetadataType.UUID,
    });

    expect(result.sql).toContain('"company"."id" NOT IN (:...id');
    expect(Object.values(result.params)[0]).toEqual(['uuid-1', 'uuid-2']);
  });

  it('should generate correct SQL for in operator (baseline)', () => {
      const result = computeWhereConditionParts({
        operator: 'in',
        objectNameSingular: 'company',
        key: 'id',
        value: ['uuid-1', 'uuid-2'],
        fieldMetadataType: FieldMetadataType.UUID,
      });

      expect(result.sql).toContain('"company"."id" IN (:...id');
      expect(Object.values(result.params)[0]).toEqual(['uuid-1', 'uuid-2']);
    });
});
