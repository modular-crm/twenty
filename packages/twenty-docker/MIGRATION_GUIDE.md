# Twenty CRM - Database Migration Guide

This guide covers database migrations for Twenty CRM deployments using Docker (including Coolify).

## How Migrations Work

Twenty uses two types of migrations that run automatically on deployment:

1. **TypeORM Schema Migrations** (`yarn database:migrate:prod`)
   - Handles database schema changes (tables, columns, indexes, constraints)
   - Tracked in `core._typeorm_migrations` table
   - Idempotent: safe to run multiple times

2. **Workspace Upgrade Commands** (`yarn command:prod upgrade`)
   - Handles data migrations for multi-tenant workspaces
   - Version-specific transformations (e.g., v1.8 → v1.9 data changes)
   - Tracked per-workspace in the database

## Pre-Deployment Checklist

Before deploying a new version:

- [ ] Review the changelog for migration notes
- [ ] Ensure database backups are configured
- [ ] Test migrations in staging environment first
- [ ] Verify sufficient database storage space
- [ ] Consider deploying during low-traffic periods for major migrations

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DISABLE_DB_MIGRATIONS` | `false` | Skip all migrations on startup |
| `MIGRATION_DRY_RUN` | `false` | Show pending migrations without applying |
| `DISABLE_CRON_JOBS_REGISTRATION` | `false` | Skip background job registration |

## Verifying Pending Migrations

### Using Dry-Run Mode

Set `MIGRATION_DRY_RUN=true` in your environment to preview migrations:

```bash
# In docker-compose or Coolify environment variables
MIGRATION_DRY_RUN=true
```

The container will start, show pending migrations, then exit without applying them.

### Manual Verification

```bash
# Connect to running container
docker exec -it twenty-server sh

# Show migration status
npx typeorm migration:show -d dist/database/typeorm/core/core.datasource
```

## Rollback Procedures

### Rolling Back the Last Migration

```bash
# Connect to the server container
docker exec -it twenty-server sh

# Revert the most recent migration
yarn database:migrate:revert:prod

# Or using TypeORM directly
npx typeorm migration:revert -d dist/database/typeorm/core/core.datasource
```

### Rolling Back Multiple Migrations

Run the revert command multiple times (once per migration to revert):

```bash
# Revert 3 migrations
yarn database:migrate:revert:prod
yarn database:migrate:revert:prod
yarn database:migrate:revert:prod
```

### Rolling Back to a Specific Version

1. Check current migration status:
   ```bash
   npx typeorm migration:show -d dist/database/typeorm/core/core.datasource
   ```

2. Note the timestamp of the target migration

3. Revert migrations one by one until you reach the target

## Emergency Recovery

### If Migrations Fail During Deployment

1. **Check container logs** for error details:
   ```bash
   docker logs twenty-server
   ```

2. **Container won't start**: Migrations run before the HTTP server. If they fail:
   - Health check will fail
   - Coolify/orchestrator won't route traffic to the new container
   - Previous container continues serving (if zero-downtime enabled)

3. **Fix and redeploy**:
   - Identify the failing migration
   - Fix the migration code or data issue
   - Push new deployment

### Database Backup Restore

If rollback isn't sufficient:

1. Stop the application containers
2. Restore database from backup
3. Deploy the previous working version
4. Investigate and fix the migration issue

### Manual Migration Bypass (Emergency Only)

```bash
# Start container without migrations
DISABLE_DB_MIGRATIONS=true docker compose up -d server

# Connect and manually fix issues
docker exec -it twenty-server sh

# Then run migrations manually
yarn database:migrate:prod
```

## Coolify-Specific Notes

### Zero-Downtime Deployments

Coolify supports zero-downtime deployments. During a deployment:

1. New container starts and runs migrations
2. Health check verifies container is ready
3. Traffic switches to new container only after health check passes
4. Old container is removed

If migrations fail, the old container continues serving traffic.

### Health Check Configuration

The server health check includes:
- HTTP endpoint check (`/healthz`)
- Start period of 120s to allow for migrations

### Logs

View migration logs in Coolify:
1. Go to your application
2. Click "Deployments"
3. Select the deployment
4. View "Build" or "Container" logs

## Troubleshooting

### Migration Hangs

**Symptoms**: Deployment takes longer than expected, no logs after "Running database migrations..."

**Causes**:
- Large data migrations
- Database lock contention
- Insufficient database connections

**Solutions**:
- Check database connections and locks
- Increase `start_period` in health check
- Run migrations during off-peak hours

### Migration Fails with Lock Error

**Error**: `could not obtain lock on relation`

**Solution**:
1. Check for long-running queries: `SELECT * FROM pg_stat_activity WHERE state = 'active';`
2. Terminate blocking queries if safe
3. Retry deployment

### Schema Already Exists Error

**Error**: `relation already exists`

**Cause**: Migration partially applied before failure

**Solution**:
1. Check current schema state
2. Manually mark migration as complete if schema is correct:
   ```sql
   INSERT INTO core._typeorm_migrations (timestamp, name)
   VALUES (1234567890, 'MigrationName1234567890');
   ```
3. Or manually drop the conflicting object and retry

### Missing Column/Table After Migration

**Cause**: Migration not applied or failed silently

**Solution**:
1. Check `core._typeorm_migrations` for the migration entry
2. If missing, re-run migrations
3. If present but schema is wrong, the migration may have a bug

## Best Practices

1. **Always test migrations** in staging before production
2. **Keep migrations small** - one logical change per migration
3. **Write reversible migrations** - implement both `up()` and `down()`
4. **Backup before major migrations** - especially for data migrations
5. **Monitor during deployment** - watch logs for errors
6. **Use dry-run mode** to preview changes before applying
