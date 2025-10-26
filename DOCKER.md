# 🐳 Docker Deployment Guide

This guide covers deploying the **Awesome App** using Docker and Docker Compose.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Compose Files](#compose-files)
- [Environment Variables](#environment-variables)
- [Production Deployment](#production-deployment)
- [Database Management](#database-management)
- [Traefik Integration](#traefik-integration)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Local Development

```bash
# Copy environment example
cp .env.example .env

# Edit .env with your configuration
nano .env

# Start the application
docker compose up -d

# View logs
docker compose logs -f awesome-app

# Stop the application
docker compose down
```

The app will be available at `http://localhost:3000`

---

## 📁 Compose Files

### `compose.yml` (Base Configuration)

The base compose file for local development and testing:
- Uses the pre-built Docker image from GitHub Container Registry
- Exposes port 3000 for local access
- Mounts a local volume for database persistence
- Includes health checks

### `compose.production.yml` (Production Override)

Production configuration that extends the base:
- Integrates with Traefik reverse proxy
- Removes exposed ports (handled by Traefik)
- Adds compression middleware
- Configures HTTPS/TLS
- Uses external `compose_network`

---

## 🔧 Environment Variables

### Required Variables

```env
# Project name
AWESOME_COMPOSE_PROJECT_NAME=awesome

# Docker image
AWESOME_IMAGE=ghcr.io/valknarness/awesome-app:latest
```

### Optional Variables

```env
# Local port (development only)
AWESOME_PORT=3000

# Node environment
NODE_ENV=production

# Database path inside container
AWESOME_DB_PATH=/app/awesome.db

# Database volume (production)
AWESOME_DB_VOLUME=/var/lib/awesome/data

# Webhook secret for updates
AWESOME_WEBHOOK_SECRET=your-secret-here

# GitHub token (for higher API rate limits)
AWESOME_GITHUB_TOKEN=ghp_your_token_here

# Timezone
TIMEZONE=UTC
```

### Traefik Variables (Production)

```env
# Enable Traefik integration
AWESOME_TRAEFIK_ENABLED=true

# Your domain
AWESOME_TRAEFIK_HOST=awesome.example.com
```

---

## 🌐 Production Deployment

### Prerequisites

1. **Docker & Docker Compose** installed
2. **Traefik** reverse proxy running (with `compose_network`)
3. **Domain** pointed to your server
4. **Environment variables** configured

### Step 1: Prepare Environment

```bash
# Create production environment file
cp .env.example .env.production

# Edit production settings
nano .env.production
```

Required production settings:
```env
AWESOME_COMPOSE_PROJECT_NAME=awesome
AWESOME_IMAGE=ghcr.io/valknarness/awesome-app:latest
AWESOME_TRAEFIK_ENABLED=true
AWESOME_TRAEFIK_HOST=awesome.yourdomain.com
AWESOME_WEBHOOK_SECRET=generate-random-secret-here
AWESOME_DB_VOLUME=/var/lib/awesome/data
NODE_ENV=production
```

### Step 2: Create Data Directory

```bash
# Create directory for database
sudo mkdir -p /var/lib/awesome/data
sudo chown -R 1001:1001 /var/lib/awesome/data
```

### Step 3: Deploy

```bash
# Pull latest image
docker compose -f compose.production.yml pull

# Start services
docker compose -f compose.production.yml up -d

# Check logs
docker compose -f compose.production.yml logs -f
```

### Step 4: Verify Deployment

```bash
# Check container status
docker compose -f compose.production.yml ps

# Check health
curl https://awesome.yourdomain.com/api/stats
```

---

## 💾 Database Management

### Using Pre-built Database

The easiest way is to use a pre-built database from GitHub Actions:

```bash
# Download database using GitHub CLI
gh run download --repo valknarness/awesome-app -n awesome-database

# Extract and place in data directory
sudo cp awesome.db /var/lib/awesome/data/
sudo chown 1001:1001 /var/lib/awesome/data/awesome.db
```

### Mounting External Database

You can mount a pre-existing database:

```yaml
# In compose.yml or compose.production.yml
volumes:
  - /path/to/your/awesome.db:/app/awesome.db:ro
```

### Database Updates

The app can receive webhook notifications for database updates:

1. Set `AWESOME_WEBHOOK_SECRET` in environment
2. Configure GitHub Actions webhook to POST to `https://your-domain.com/api/webhook`
3. The app will invalidate cache and notify clients

---

## 🔒 Traefik Integration

### Network Setup

Ensure Traefik's `compose_network` exists:

```bash
docker network create compose_network
```

### Traefik Configuration

The production compose file includes labels for:
- **HTTP to HTTPS redirect**
- **TLS/SSL certificates** (via Let's Encrypt)
- **Compression** middleware
- **Load balancing** configuration

Example Traefik labels:
```yaml
labels:
  - 'traefik.enable=true'
  - 'traefik.http.routers.awesome-web-secure.rule=Host(`awesome.example.com`)'
  - 'traefik.http.routers.awesome-web-secure.tls.certresolver=resolver'
  - 'traefik.http.routers.awesome-web-secure.entrypoints=web-secure'
```

### SSL Certificates

Traefik automatically handles SSL certificates using Let's Encrypt when properly configured.

---

## 🛠️ Troubleshooting

### Container Won't Start

```bash
# Check logs
docker compose logs awesome-app

# Check container status
docker compose ps

# Restart container
docker compose restart awesome-app
```

### Database Not Found

```bash
# Check if database exists
docker compose exec awesome-app ls -la /app/

# Check volume mounts
docker compose exec awesome-app df -h

# Verify permissions
docker compose exec awesome-app ls -la /app/data/
```

### Traefik Not Routing

```bash
# Check Traefik logs
docker logs traefik

# Verify network
docker network inspect compose_network

# Check labels
docker inspect awesome_app | grep traefik
```

### Performance Issues

```bash
# Check resource usage
docker stats awesome_app

# Check database size
docker compose exec awesome-app du -h /app/awesome.db

# Restart with fresh container
docker compose down
docker compose up -d
```

### Port Already in Use

```bash
# Change port in .env
AWESOME_PORT=3001

# Restart
docker compose up -d
```

---

## 🔄 Updates & Maintenance

### Update to Latest Version

```bash
# Pull latest image
docker compose pull

# Recreate container
docker compose up -d

# Or for production
docker compose -f compose.production.yml pull
docker compose -f compose.production.yml up -d
```

### Backup Database

```bash
# Copy database from container
docker compose cp awesome-app:/app/awesome.db ./backup-awesome.db

# Or from volume
sudo cp /var/lib/awesome/data/awesome.db ~/backup-awesome-$(date +%Y%m%d).db
```

### View Logs

```bash
# Follow logs
docker compose logs -f awesome-app

# Last 100 lines
docker compose logs --tail=100 awesome-app

# Since specific time
docker compose logs --since 1h awesome-app
```

---

## 📊 Health Checks

The container includes health checks that ping `/api/stats`:

```yaml
healthcheck:
  test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/api/stats"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

Check health status:
```bash
docker compose ps
# Should show "healthy" status
```

---

## 🎯 Best Practices

1. **Always use .env files** for configuration (never commit secrets)
2. **Use named volumes** for data persistence
3. **Monitor logs** regularly for errors
4. **Backup database** before major updates
5. **Use health checks** to ensure availability
6. **Keep images updated** for security patches
7. **Use Traefik** for SSL/TLS in production
8. **Set proper timezone** for accurate timestamps

---

## 🚀 Advanced Configuration

### Custom Build

Build from source instead of using pre-built image:

```yaml
# In compose.yml
services:
  awesome-app:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        INCLUDE_DATABASE: false
        NODE_ENV: production
```

### Multiple Instances

Run multiple instances with different databases:

```bash
# Instance 1
AWESOME_COMPOSE_PROJECT_NAME=awesome1 \
AWESOME_PORT=3001 \
docker compose up -d

# Instance 2
AWESOME_COMPOSE_PROJECT_NAME=awesome2 \
AWESOME_PORT=3002 \
docker compose up -d
```

### Resource Limits

Add resource constraints:

```yaml
services:
  awesome-app:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Traefik Documentation](https://doc.traefik.io/traefik/)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)

---

**Built with 💜💗💛 and maximum awesomeness!**
