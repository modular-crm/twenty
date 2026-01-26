#!/bin/sh
# Manual backup script for Twenty database
# Usage: ./scripts/backup.sh [optional-deployment-id]

set -e

# Use provided DEPLOYMENT_ID or generate timestamp
DEPLOYMENT_ID=${1:-$(date +%Y%m%d_%H%M%S)}

echo "🔄 Starting Twenty backup..."
echo "📦 Deployment ID: ${DEPLOYMENT_ID}"

# Validate required environment variables
if [ -z "${PG_DATABASE_PASSWORD}" ]; then
  echo "❌ Error: PG_DATABASE_PASSWORD environment variable is required"
  exit 1
fi

# Create backup locally
backup_file="/tmp/twenty_${DEPLOYMENT_ID}.sql"
PGPASSWORD="${PG_DATABASE_PASSWORD}" pg_dump \
  -h "${PG_DATABASE_HOST:-localhost}" \
  -p "${PG_DATABASE_PORT:-5432}" \
  -U "${PG_DATABASE_USER:-postgres}" \
  -d "${PG_DATABASE_NAME:-default}" \
  > "${backup_file}"

backup_size=$(du -h "${backup_file}" | cut -f1)
echo "✅ Local backup created: ${backup_size}"

# Upload to R2 if configured
if [ -n "${R2_BACKUP_BUCKET}" ]; then
  export AWS_ACCESS_KEY_ID="${R2_ACCESS_KEY_ID}"
  export AWS_SECRET_ACCESS_KEY="${R2_SECRET_ACCESS_KEY}"

  r2_path="s3://${R2_BACKUP_BUCKET}/scheduled/${DEPLOYMENT_ID}/twenty.sql"

  aws s3 cp "${backup_file}" "${r2_path}" \
    --endpoint-url "${R2_ENDPOINT_URL}"

  echo "☁️  Uploaded to R2: ${r2_path}"
  rm -f "${backup_file}"
else
  echo "⚠️  R2 not configured, backup kept locally: ${backup_file}"
fi

echo "✅ Twenty backup complete!"
