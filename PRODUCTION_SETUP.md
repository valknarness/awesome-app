# 🚀 Production Setup Guide - Quick Fix

## Current Issue

The app is running at `https://awesome.pivoine.art` but showing errors because **the database is missing**.

Errors you're seeing:
- `api/db-version: 404` - Database version endpoint can't find database
- `api/stats: 500` - Stats endpoint fails without database
- `api/lists: 500` - Lists endpoint fails without database

## Quick Fix (5 Minutes)

### Option 1: Automated Script (Recommended)

```bash
# On your production server
cd /opt/awesome  # or wherever your compose files are

# Download and run the setup script
curl -O https://raw.githubusercontent.com/valknarness/awesome-app/main/scripts/setup-production-db.sh
chmod +x setup-production-db.sh
sudo ./setup-production-db.sh
```

This script will:
1. ✅ Create the data directory
2. ✅ Download the latest database from GitHub Actions
3. ✅ Install it in the correct location
4. ✅ Set proper permissions (1001:1001 for nextjs user)
5. ✅ Restart the container

### Option 2: Manual Setup

```bash
# 1. Create data directory
sudo mkdir -p /var/lib/awesome/data

# 2. Download database using GitHub CLI
gh run list --repo valknarness/awesome-app --workflow "db.yml" --status success --limit 1

# Get the run ID from above, then:
gh run download <RUN_ID> --repo valknarness/awesome-app --name awesome-database

# 3. Install database
sudo cp awesome.db /var/lib/awesome/data/
sudo chown -R 1001:1001 /var/lib/awesome/data

# 4. Restart container
cd /opt/awesome
sudo docker compose -f compose.production.yml restart awesome-app

# 5. Verify
sudo docker compose -f compose.production.yml logs -f awesome-app
```

### Option 3: Use the Database from awesome-app Build

If you don't have the database artifact, you need to build it first:

```bash
# Trigger a database build
gh workflow run db.yml --repo valknarness/awesome-app

# Wait for it to complete (~5-10 minutes)
gh run watch

# Then follow Option 1 or 2 above
```

## Verify Installation

After setup, check:

```bash
# 1. Check database exists
sudo ls -lah /var/lib/awesome/data/

# Should show:
# awesome.db (50-200MB)
# db-metadata.json (optional)

# 2. Check container logs
sudo docker compose -f compose.production.yml logs awesome-app

# Should NOT show "Database file not found" errors

# 3. Test the API
curl https://awesome.pivoine.art/api/stats

# Should return JSON with stats, not 500 error

# 4. Visit the site
# https://awesome.pivoine.art
# Should show the homepage with real data
```

## Current Container Configuration

Your production setup should have:

```yaml
# compose.production.yml
services:
  awesome-app:
    volumes:
      - /var/lib/awesome/data:/app/data
    environment:
      AWESOME_DB_PATH: /app/data/awesome.db  # or /app/awesome.db
```

## Database Path Options

The app checks for database in this order:

1. `AWESOME_DB_PATH` environment variable
2. `/app/awesome.db` (if database was built into image)
3. `/app/data/awesome.db` (if using volume mount)
4. `~/.awesome/awesome.db` (fallback)

For production with volume mount, use:
```env
AWESOME_DB_PATH=/app/data/awesome.db
```

## Troubleshooting

### Container can't find database

```bash
# Check if database is mounted
sudo docker compose exec awesome-app ls -la /app/data/

# Check environment variable
sudo docker compose exec awesome-app env | grep AWESOME_DB_PATH

# Check volume mount
sudo docker compose config | grep -A 5 volumes
```

### Permission errors

```bash
# Fix permissions
sudo chown -R 1001:1001 /var/lib/awesome/data
sudo chmod -R 755 /var/lib/awesome/data
```

### Container not restarting

```bash
# View logs
sudo docker compose -f compose.production.yml logs awesome-app

# Force recreate
sudo docker compose -f compose.production.yml up -d --force-recreate
```

## Alternative: Build Database Locally

If GitHub Actions database isn't available, build locally:

```bash
# 1. Clone awesome CLI
cd /tmp
git clone https://github.com/valknarness/awesome.git
cd awesome

# 2. Install dependencies
pnpm install
pnpm rebuild better-sqlite3

# 3. Build database (takes 1-2 hours!)
./awesome index

# 4. Copy to production location
sudo cp ~/.awesome/awesome.db /var/lib/awesome/data/
sudo chown 1001:1001 /var/lib/awesome/data/awesome.db

# 5. Restart container
cd /opt/awesome
sudo docker compose -f compose.production.yml restart awesome-app
```

## Environment Variables Checklist

Make sure your `.env.production` has:

```env
# Required
AWESOME_COMPOSE_PROJECT_NAME=awesome
AWESOME_IMAGE=ghcr.io/valknarness/awesome-app:latest
AWESOME_DB_PATH=/app/data/awesome.db
AWESOME_DB_VOLUME=/var/lib/awesome/data

# Optional but recommended
AWESOME_WEBHOOK_SECRET=your-secret-here
AWESOME_GITHUB_TOKEN=ghp_your_token_here

# Traefik
AWESOME_TRAEFIK_ENABLED=true
AWESOME_TRAEFIK_HOST=awesome.pivoine.art
NETWORK_NAME=compose_network
```

## Next Steps

Once the database is installed and working:

1. **Set up automated updates**: Configure GitHub Actions webhook to notify the app when database updates
2. **Monitor logs**: `sudo docker compose logs -f awesome-app`
3. **Backup database**: Schedule regular backups of `/var/lib/awesome/data/awesome.db`
4. **Update regularly**: Pull new database builds every 6 hours

---

**Need help?** Check the main [DOCKER.md](./DOCKER.md) guide for more details.
