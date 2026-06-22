# Simple Mode for LocalPDF (the Self-Hosted build)

Simple Mode is what powers the **Self-Hosted build** of LocalPDF (`localpdf-simple`). It is **functionally identical** to the Commercial build that powers localpdf.org — every PDF tool is present and behaves the same. It just hides the marketing chrome (hero, FAQ, testimonials, footer) that only makes sense on the public localpdf.org site or on a commercial public-facing deployment.

> **Simple Mode is not a feature-reduced "lite" version.** Every PDF tool — merge, split, edit, sign, OCR, Office conversion, every other tool — works identically in both builds. The only difference is the marketing UI around the tools.

The Commercial build (`ghcr.io/jacksnotes/LocalPDF:latest`) is used by localpdf.org itself and by commercial license holders running public-facing PDF deployments where the full marketing site makes sense.

## What Simple Mode Hides

When enabled, Simple Mode hides the following localpdf.org-specific marketing UI:

- Navigation bar
- Hero section with marketing content
- Features section
- Security/compliance section
- FAQ section
- Testimonials section
- Support section
- Footer

It also updates the page title to "PDF Tools" and makes the tools section more prominent. **No PDF tools are removed or disabled.**

## How to Enable Simple Mode

### Method 1: Using Pre-built Simple Mode Image (Recommended)

Use the pre-built Simple Mode image directly:

**Using GitHub Container Registry (Recommended):**

```bash
# Docker
docker run -p 3000:8080 ghcr.io/jacksnotes/LocalPDF-simple:latest

# Podman
podman run -p 3000:8080 ghcr.io/jacksnotes/LocalPDF-simple:latest
```

**Using Docker Hub:**

```bash
# Docker
docker run -p 3000:8080 localpdfteam/localpdf-simple:latest

# Podman
podman run -p 3000:8080 docker.io/localpdfteam/localpdf-simple:latest
```

Or with Docker Compose / Podman Compose:

```yaml
services:
  localpdf:
    # Using GitHub Container Registry (Recommended)
    image: ghcr.io/jacksnotes/LocalPDF-simple:latest
    # Or using Docker Hub
    # image: localpdfteam/localpdf-simple:latest
    container_name: localpdf
    restart: unless-stopped
    ports:
      - '3000:8080'
```

### Method 2: Using Docker Compose with Build

Build the image locally with Simple Mode enabled:

```bash
docker compose -f docker-compose.dev.yml build --build-arg SIMPLE_MODE=true
docker compose -f docker-compose.dev.yml up -d
```

### Method 3: Using Docker Build

Build the image with the SIMPLE_MODE build argument:

```bash
docker build --build-arg SIMPLE_MODE=true -t localpdf-simple .
docker run -p 3000:8080 localpdf-simple
```

### Method 4: Using npm Script (Easiest for Local Development)

Use the built-in npm script that handles everything:

```bash
npm run serve:simple
```

This command automatically:

- Sets `SIMPLE_MODE=true`
- Builds the project with Simple Mode enabled
- Serves the built files on `http://localhost:3000`

### Method 5: Using Environment Variables

Set the environment variable before building:

```bash
export SIMPLE_MODE=true
npm run build
npx serve dist -p 3000
```

## 🧪 Testing Simple Mode Locally

### Method 1: Using npm Script (Easiest for Development)

```bash
npm run serve:simple
```

This automatically builds and serves Simple Mode on `http://localhost:3000`.

### Method 2: Using Pre-built Image (Easiest for Production)

```bash
# Docker - Pull and run the Simple Mode image
docker pull ghcr.io/jacksnotes/LocalPDF-simple:latest
docker run -p 3000:8080 ghcr.io/jacksnotes/LocalPDF-simple:latest

# Podman
podman pull ghcr.io/jacksnotes/LocalPDF-simple:latest
podman run -p 3000:8080 ghcr.io/jacksnotes/LocalPDF-simple:latest
```

Open `http://localhost:3000` in your browser.

### Method 3: Build and Test Locally

```bash
# Build with simple mode
SIMPLE_MODE=true npm run build

# Serve the built files
npx serve dist -p 3000
```

Open `http://localhost:3000` in your browser.

### Method 4: Compare Both Builds Side-by-Side

```bash
# Commercial build (the localpdf.org look)
docker run -p 3000:8080 ghcr.io/jacksnotes/LocalPDF:latest

# Self-Hosted build (Simple Mode)
docker run -p 3001:8080 ghcr.io/jacksnotes/LocalPDF-simple:latest

# Podman users: replace 'docker' with 'podman'
```

- Commercial build: `http://localhost:3000`
- Self-Hosted build: `http://localhost:3001`

## 🔍 What to Look For

When Simple Mode is working correctly, you should see:

- ✅ Clean "PDF Tools" header (no marketing hero section)
- ✅ "Select a tool to get started" subtitle
- ✅ Search bar for tools
- ✅ All PDF tool cards organized by category
- ❌ No navigation bar
- ❌ No hero section with "The PDF Toolkit built for privacy"
- ❌ No features, FAQ, testimonials, or footer sections

## 📦 Available Container Images

### Self-Hosted build (Simple Mode) — recommended for self-hosting

**GitHub Container Registry (Recommended):**

- `ghcr.io/jacksnotes/LocalPDF-simple:latest`
- `ghcr.io/jacksnotes/LocalPDF-simple:v1.0.0` (versioned)

**Docker Hub:**

- `localpdfteam/localpdf-simple:latest`
- `localpdfteam/localpdf-simple:v1.0.0` (versioned)

### Commercial build — used by localpdf.org and commercial license holders

The full marketing site, including hero/FAQ/testimonials/footer. Pull this only if you specifically want the localpdf.org look — for example, you're running a public-facing PDF deployment under a commercial license.

**GitHub Container Registry (Recommended):**

- `ghcr.io/jacksnotes/LocalPDF:latest`
- `ghcr.io/jacksnotes/LocalPDF:v1.0.0` (versioned)

**Docker Hub:**

- `localpdfteam/localpdf:latest`
- `localpdfteam/localpdf:v1.0.0` (versioned)

## 🚀 Production Deployment Examples

### Docker Compose / Podman Compose

```yaml
services:
  localpdf:
    image: ghcr.io/jacksnotes/LocalPDF-simple:latest # Recommended
    # image: localpdfteam/localpdf-simple:latest     # Alternative: Docker Hub
    container_name: localpdf
    restart: unless-stopped
    ports:
      - '80:8080'
    environment:
      - PUID=1000
      - PGID=1000
```

### Podman Quadlet (Linux Systemd)

Create `~/.config/containers/systemd/localpdf-simple.container`:

```ini
[Unit]
Description=LocalPDF Simple Mode
After=network-online.target

[Container]
Image=ghcr.io/jacksnotes/LocalPDF-simple:latest
ContainerName=localpdf-simple
PublishPort=80:8080
AutoUpdate=registry

[Service]
Restart=always

[Install]
WantedBy=default.target
```

Enable and start:

```bash
systemctl --user daemon-reload
systemctl --user enable --now localpdf-simple
```

## ⚠️ Important Notes

- **Pre-built images**: Use `ghcr.io/jacksnotes/LocalPDF-simple:latest` for Simple Mode (recommended)
- **Environment variables**: `SIMPLE_MODE=true` only works during build, not runtime
- **Build-time optimization**: Simple Mode uses dead code elimination for smaller bundles
- **Same functionality**: All PDF tools work identically in both modes
