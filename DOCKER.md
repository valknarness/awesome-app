# Docker Deployment Guide

This guide covers building and deploying the awesome-app using Docker.

## Quick Start

### Using Pre-built Image (Recommended)

Pull and run the latest image from GitHub Container Registry:

```bash
docker pull ghcr.io/valknarness/awesome-app:latest
docker run -p 3000:3000 ghcr.io/valknarness/awesome-app:latest
```

The image includes a pre-built database, updated every 6 hours by GitHub Actions.

### Using Docker Compose

```bash
docker-compose up -d
```

## Build Options

The Dockerfile supports a build argument `INCLUDE_DATABASE` to control whether the database is embedded in the image or mounted at runtime.

### Option 1: Embedded Database (CI Default)

**Pros:**
- Self-contained image
- No external dependencies
- Faster startup
- Database version matches image version

**Cons:**
- Larger image size
- Database updates require new image build

```bash
docker build --build-arg INCLUDE_DATABASE=true -t awesome-app .
docker run -p 3000:3000 awesome-app
```

### Option 2: Volume-Mounted Database (Local Default)

**Pros:**
- Smaller image size
- Database can be updated independently
- Easier for development

**Cons:**
- Requires database setup/volume mount
- Extra configuration needed

```bash
docker build --build-arg INCLUDE_DATABASE=false -t awesome-app .
docker run -p 3000:3000 -v $(pwd)/data:/app/data awesome-app
```

## Docker Compose Configuration

Edit `docker-compose.yml` to control database inclusion:

```yaml
services:
  awesome-app:
    build:
      args:
        INCLUDE_DATABASE: false  # Change to true to embed database
    volumes:
      - ./data:/app/data  # Only needed when INCLUDE_DATABASE=false
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Node.js environment |
| `PORT` | `3000` | Application port |
| `HOSTNAME` | `0.0.0.0` | Bind hostname |

## Database Location

- **Embedded mode**: `/app/awesome.db`
- **Volume mode**: `/app/data/awesome.db` (mounted)

The application will automatically detect and use the database from either location.

## Multi-Platform Support

Images are built for multiple platforms:
- `linux/amd64` (x86_64)
- `linux/arm64` (ARM64/Apple Silicon)

Docker will automatically pull the correct architecture for your system.

## Health Checks

The image includes a built-in health check that pings the application every 30 seconds:

```bash
docker ps  # Check HEALTH status column
```

## Image Metadata

View database metadata embedded in the image:

```bash
docker inspect ghcr.io/valknarness/awesome-app:latest | jq '.[0].Config.Labels'
```

Metadata includes:
- `app.database.timestamp` - When the database was built
- `app.database.hash` - SHA256 hash of the database
- `app.database.lists_count` - Number of awesome lists
- `app.database.repos_count` - Number of repositories

## Production Deployment

### Using Pre-built Image

```bash
docker pull ghcr.io/valknarness/awesome-app:latest
docker run -d \
  --name awesome-app \
  -p 3000:3000 \
  --restart unless-stopped \
  ghcr.io/valknarness/awesome-app:latest
```

### With Volume Mount

```bash
docker run -d \
  --name awesome-app \
  -p 3000:3000 \
  -v awesome-data:/app/data \
  --restart unless-stopped \
  ghcr.io/valknarness/awesome-app:latest
```

### Using Docker Compose

```bash
docker-compose up -d
```

## Database Updates

### Embedded Database

Pull the latest image to get an updated database:

```bash
docker pull ghcr.io/valknarness/awesome-app:latest
docker-compose up -d  # Recreates container with new image
```

### Volume-Mounted Database

Update the database file in the mounted volume:

```bash
# Download latest database
wget https://github.com/your-repo/releases/latest/download/awesome.db

# Place in volume
cp awesome.db ./data/

# Restart container
docker-compose restart
```

## Troubleshooting

### Database not found

If the application can't find the database:

1. **Embedded mode**: Ensure `INCLUDE_DATABASE=true` was set during build
2. **Volume mode**: Check that the volume is mounted correctly

```bash
docker exec awesome-app ls -la /app/awesome.db     # Embedded
docker exec awesome-app ls -la /app/data/awesome.db # Volume
```

### Permission issues

Ensure the database file has correct permissions:

```bash
docker exec awesome-app chown nextjs:nodejs /app/data/awesome.db
```

### Rebuild from scratch

Remove cached layers and rebuild:

```bash
docker build --no-cache --build-arg INCLUDE_DATABASE=true -t awesome-app .
```

## Development

For local development with hot reload:

```bash
# Use the dev server instead of Docker
pnpm dev
```

For testing the production Docker build locally:

```bash
docker build -t awesome-app-test .
docker run -p 3000:3000 awesome-app-test
```

## Security

The container runs as a non-root user (`nextjs:nodejs`) with UID/GID 1001 for enhanced security.

## Support

For issues or questions:
- GitHub Issues: [your-repo/issues](https://github.com/your-repo/issues)
- Workflow Docs: [.github/workflows/README.md](.github/workflows/README.md)
