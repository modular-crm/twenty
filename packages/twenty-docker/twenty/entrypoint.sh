#!/bin/sh
set -e

show_pending_migrations() {
    echo "Checking for pending migrations..."
    # TypeORM migration:show lists all migrations with their status
    npx -y typeorm migration:show -d dist/database/typeorm/core/core.datasource 2>/dev/null || echo "Unable to show migration status (this is normal on first run)"
}

backup_database() {
    if [ "${ENABLE_DB_BACKUP}" != "true" ]; then
        echo "Database backup disabled, skipping..."
        return
    fi

    echo "Creating pre-migration database backup..."

    # Use shared DEPLOYMENT_ID or generate timestamp (ensures sync with NYCE CRM)
    # DEPLOYMENT_ID should be set by CI/CD or Coolify (e.g., git commit SHA or timestamp)
    if [ -z "${DEPLOYMENT_ID}" ]; then
        DEPLOYMENT_ID=$(date +%Y%m%d_%H%M%S)
        echo "Warning: DEPLOYMENT_ID not set, using generated timestamp: ${DEPLOYMENT_ID}"
        echo "For synchronized backups, set DEPLOYMENT_ID in environment"
    else
        echo "Using deployment ID: ${DEPLOYMENT_ID}"
    fi

    # Use /tmp for temporary storage (writable by all users)
    backup_file="/tmp/twenty_${DEPLOYMENT_ID}.sql"

    # Create backup using pg_dump
    if pg_dump "${PG_DATABASE_URL}" > "${backup_file}"; then
        echo "Database backed up locally: ${backup_file}"
        backup_size=$(du -h "${backup_file}" | cut -f1)
        echo "Backup size: ${backup_size}"

        # Upload to R2 if configured
        if [ -n "${R2_BACKUP_BUCKET}" ] && [ -n "${R2_ENDPOINT_URL}" ]; then
            echo "Uploading backup to Cloudflare R2..."

            # Configure AWS CLI for R2
            export AWS_ACCESS_KEY_ID="${R2_ACCESS_KEY_ID}"
            export AWS_SECRET_ACCESS_KEY="${R2_SECRET_ACCESS_KEY}"

            # Upload with synchronized deployment folder structure
            # Both NYCE and Twenty backups go in the same deployment folder
            r2_path="s3://${R2_BACKUP_BUCKET}/deployments/${DEPLOYMENT_ID}/twenty.sql"

            if aws s3 cp "${backup_file}" "${r2_path}" --endpoint-url "${R2_ENDPOINT_URL}"; then
                echo "✓ Backup uploaded to R2: ${r2_path}"
                echo "  This backup is synchronized with NYCE CRM backup"

                # Cleanup old deployment folders (keep last 30 deployments)
                echo "Cleaning up old deployment backups (keeping last 30 deployments)..."
                aws s3 ls "s3://${R2_BACKUP_BUCKET}/deployments/" --endpoint-url "${R2_ENDPOINT_URL}" \
                    | grep "PRE" | awk '{print $2}' | sed 's#/##' | sort -r | tail -n +31 | \
                    while read -r old_deployment; do
                        echo "Removing old deployment: ${old_deployment}"
                        aws s3 rm "s3://${R2_BACKUP_BUCKET}/deployments/${old_deployment}/" --recursive --endpoint-url "${R2_ENDPOINT_URL}"
                    done
            else
                echo "Warning: R2 upload failed, but backup exists locally"
            fi
        else
            echo "R2 not configured, backup stored locally only"
        fi

        # Remove local backup (save disk space, we have it in R2)
        rm -f "${backup_file}"
        echo "Local backup removed (preserved in R2)"
    else
        echo "Warning: Database backup failed, but continuing with migrations..."
        echo "This is acceptable for first-run when database is empty"
    fi
}

setup_and_migrate_db() {
    if [ "${DISABLE_DB_MIGRATIONS}" = "true" ]; then
        echo "Database setup and migrations are disabled, skipping..."
        return
    fi

    # Create migration lock file to signal migrations in progress
    touch /tmp/migrations.lock

    echo "Running database setup and migrations..."

    # Check if database needs initial setup (first deployment only)
    has_schema=$(psql -tAc "SELECT EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'core')" "${PG_DATABASE_URL}")
    if [ "$has_schema" = "f" ]; then
        echo "Database appears to be empty, running initial setup..."
        NODE_OPTIONS="--max-old-space-size=1500" tsx ./scripts/setup-db.ts
    fi

    # Dry-run mode: show pending migrations without applying
    if [ "${MIGRATION_DRY_RUN}" = "true" ]; then
        echo "=== DRY RUN MODE: Showing pending migrations ==="
        show_pending_migrations
        echo "=== Dry run complete. Set MIGRATION_DRY_RUN=false to apply migrations. ==="
        rm -f /tmp/migrations.lock
        exit 0
    fi

    # Show pending migrations before applying (informational)
    show_pending_migrations

    # Backup database before migrations
    backup_database

    # Always run migrations (idempotent - safe to run multiple times)
    # TypeORM tracks applied migrations in _typeorm_migrations table
    echo "Running database migrations..."
    yarn database:migrate:prod

    # Run workspace upgrade commands (data migrations for multi-tenant workspaces)
    yarn command:prod upgrade
    echo "Successfully completed database migrations!"

    # Remove migration lock file to signal completion
    rm -f /tmp/migrations.lock
}

register_background_jobs() {
    if [ "${DISABLE_CRON_JOBS_REGISTRATION}" = "true" ]; then
        echo "Cron job registration is disabled, skipping..."
        return
    fi

    echo "Registering background sync jobs..."
    if yarn command:prod cron:register:all; then
        echo "Successfully registered all background sync jobs!"
    else
        echo "ERROR: Failed to register background jobs"
        echo "Background tasks (calendar sync, messaging) will not run automatically"
        if [ "${FAIL_ON_CRON_ERROR}" = "true" ]; then
            echo "FAIL_ON_CRON_ERROR is set, exiting..."
            exit 1
        else
            echo "Continuing startup despite cron registration failure..."
        fi
    fi
}

setup_and_migrate_db
register_background_jobs

# Continue with the original Docker command
exec "$@"
