#!/bin/sh
set -e

show_pending_migrations() {
    echo "Checking for pending migrations..."
    # TypeORM migration:show lists all migrations with their status
    npx -y typeorm migration:show -d dist/database/typeorm/core/core.datasource 2>/dev/null || echo "Unable to show migration status (this is normal on first run)"
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

    # Note: Database backups are handled by Coolify's native backup feature
    # Configure automatic backups in Coolify UI: Database > Backups tab

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
