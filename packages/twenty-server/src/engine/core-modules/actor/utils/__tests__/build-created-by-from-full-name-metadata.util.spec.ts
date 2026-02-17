import { buildCreatedByFromFullNameMetadata } from '../build-created-by-from-full-name-metadata.util';
import { FieldActorSource } from 'twenty-shared/types';

describe('buildCreatedByFromFullNameMetadata', () => {
  const baseArgs = {
    fullNameMetadata: { firstName: 'John', lastName: 'Doe' },
    workspaceMemberId: 'member-1',
  };

  it('should return null userGroupId when not provided', () => {
    const result = buildCreatedByFromFullNameMetadata(baseArgs);
    expect(result.userGroupId).toBeNull();
  });

  it('should pass through userGroupId when provided', () => {
    const result = buildCreatedByFromFullNameMetadata({
      ...baseArgs,
      userGroupId: 'group-abc',
    });
    expect(result.userGroupId).toBe('group-abc');
  });

  it('should default to null when userGroupId is undefined', () => {
    const result = buildCreatedByFromFullNameMetadata({
      ...baseArgs,
      userGroupId: undefined,
    });
    expect(result.userGroupId).toBeNull();
  });

  it('should build correct name and source', () => {
    const result = buildCreatedByFromFullNameMetadata(baseArgs);
    expect(result).toEqual({
      workspaceMemberId: 'member-1',
      source: FieldActorSource.MANUAL,
      name: 'John Doe',
      userGroupId: null,
      context: {},
    });
  });
});
