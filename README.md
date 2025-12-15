# CraftCMS Boilerplate

**v1.0.1**

An opinionated CraftCMS 5 boilerplate for rapid project setup and development. This boilerplate provides a clean, production-ready foundation for building client websites.

## Requirements

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [DDEV](https://ddev.readthedocs.io/en/stable/users/install/ddev-installation/) for local development

> DDEV handles PHP 8.3, MySQL 8.0, and Node.js 22 automatically inside containers.

## Plugins Included

| Plugin | Version | Description |
|--------|---------|-------------|
| [craft-vite](https://nystudio107.com/docs/vite/) | 5.0.1 | Vite integration for modern asset bundling with HMR |
| [craft-minify](https://nystudio107.com/plugins/minify) | 5.0.0 | HTML minification for production |

---

## Quick Start

Follow these steps to clone this boilerplate and start a new project:

### 1. Clone the Repository

```bash
git clone https://github.com/ackstudio/craftcms.git <your-project-name>
cd <your-project-name>
```

### 2. Rename the Project

```bash
ddev config --project-name=<your-project-name>
```

> **Important**: The project name must be lowercase with no spaces. Use hyphens for multi-word names (e.g., `my-awesome-site`).

### 3. Remove Git History (Optional)

Start fresh with your own Git history:

```bash
rm -rf .git
```

### 4. Start DDEV

```bash
ddev start
```

### 5. Install Dependencies

```bash
ddev composer install
ddev npm install
```

### 6. Configure Environment

```bash
cp .env.example.dev .env
```

### 7. Install Craft CMS

```bash
ddev craft install
```

Follow the prompts to:
- Set your site name
- Set your site URL (use `https://<your-project-name>.ddev.site`)
- Create your admin account (username, email, password)

### 8. Start Development Server

```bash
ddev npm run dev
```

### 9. Access Your Site

- **Frontend**: `https://<your-project-name>.ddev.site`
- **Admin Panel**: `https://<your-project-name>.ddev.site/admin`
---

## Development Workflow

### Starting the project
```bash
ddev start
```

### Development server
Start Vite dev server with hot module replacement:
```bash
ddev npm run dev
```

### Production build
Build optimized assets for production:
```bash
ddev npm run build
```

### Stopping the project
```bash
ddev stop
```

## Project Structure

```
.
├── config/             # CraftCMS configuration files
├── storage/            # Runtime files and user uploads
├── templates/          # Twig templates
├── web/                # Public web root
│   └── index.php       # Application entry point
├── src/                # Frontend source files
│   ├── index.ts        # Main entry point
│   └── css/style.css   # Main stylesheet (Tailwind)
├── vite.config.js      # Vite configuration
├── .env                # Environment variables (gitignored)
├── composer.json       # PHP dependencies
└── craft               # Craft console application
```

## Critical CSS

Critical CSS is automatically generated during production builds to eliminate Flash of Unstyled Content (FOUC).

### How It Works

1. **Build time**: Puppeteer visits your pages and extracts above-the-fold CSS
2. **Runtime**: Critical CSS is inlined in `<head>`, full CSS loads asynchronously

### Configuration

Critical CSS pages are configured in `vite.config.js`:

```js
PluginCritical({
  criticalUrl: process.env.DDEV_PRIMARY_URL,
  criticalBase: './web/dist/criticalcss/',
  criticalPages: [
    { uri: '', template: '_pages/homepage/index' },
    // Add more pages:
    // { uri: 'about', template: '_pages/about/index' },
  ],
  criticalConfig: {},
}),
```

### Adding New Pages

1. Add entry to `criticalPages` array in `vite.config.js`
2. The `uri` is the URL path (empty string for homepage)
3. The `template` must match the Twig template path Craft renders

### Template Setup

Include critical CSS in your base template before the main script:

```twig
{{ craft.vite.includeCriticalCssTags() }}
{{ craft.vite.script('/src/index.ts') }}
```

### Tailwind v4 Compatibility

This setup uses flat CSS imports (without `@layer`) for Penthouse compatibility:

```css
/* src/css/style.css */
@import "tailwindcss/theme.css";
@import "tailwindcss/preflight.css";
@import "tailwindcss/utilities.css";

@source "../../src";
@source "../../templates";
```

> **Note**: Using `.css` imports bypasses Tailwind's cascade layers. This is required because Penthouse cannot parse `@layer` rules.