# CraftCMS Boilerplate

An opinionated CraftCMS 5 boilerplate for rapid project setup and development. This boilerplate provides a clean, production-ready foundation for building client websites.

## Requirements

- PHP 8.3 or higher
- [DDEV](https://ddev.readthedocs.io/) for local development
- MySQL 8.0 or higher / PostgreSQL 13 or higher

## Installation

1. Clone this repository:
```bash
git clone <repository-url> <project-name>
cd <project-name>
```

2. Start DDEV:
```bash
ddev start
```

3. Install dependencies:
```bash
ddev composer install
```

4. Copy and configure environment file:
```bash
cp .env.example.dev .env
```

5. Run the CraftCMS installer:
```bash
ddev craft install
```

Follow the prompts to set up your admin account and site settings.

## Environment Configuration

The boilerplate includes environment templates for different deployment stages:

- `.env.example.dev` - Local development environment
- `.env.example.staging` - Staging environment
- `.env.example.production` - Production environment

Copy the appropriate template to `.env` and update the values according to your environment.

### Key Environment Variables

```env
# Database
CRAFT_DB_DRIVER=mysql
CRAFT_DB_SERVER=db
CRAFT_DB_PORT=3306
CRAFT_DB_DATABASE=db
CRAFT_DB_USER=db
CRAFT_DB_PASSWORD=db

# General
CRAFT_SECURITY_KEY=<generate-secure-key>
CRAFT_ENVIRONMENT=dev
CRAFT_DEV_MODE=true

# Site URL
PRIMARY_SITE_URL=https://<project-name>.ddev.site
```

## Development Workflow

### Starting the project:
```bash
ddev start
```

### Access the control panel:
Visit `https://<project-name>.ddev.site/admin` in your browser.

### Running Craft CLI commands:
```bash
ddev craft <command>
```

### Stopping the project:
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
├── .env                # Environment variables (gitignored)
├── composer.json       # PHP dependencies
└── craft               # Craft console application
```

## Vite & Asset Pipeline

This boilerplate uses [Vite](https://vitejs.dev/) with [nystudio107/craft-vite](https://nystudio107.com/docs/vite/) for asset bundling.

### Frontend Dependencies

Install Node.js dependencies:
```bash
ddev npm install
```

### Development Server

Start Vite dev server with hot module replacement:
```bash
ddev npm run dev
```

### Production Build

Build optimized assets for production:
```bash
ddev npm run build
```

### Key Files

| File | Purpose |
|------|---------|
| `vite.config.js` | Vite configuration |
| `config/vite.php` | Craft Vite plugin settings |
| `src/index.ts` | Main entry point |
| `src/css/style.css` | Main stylesheet (Tailwind) |

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

## Useful Commands

### Clear caches:
```bash
ddev craft clear-caches/all
```

### Run database migrations:
```bash
ddev craft migrate/all
```

### Generate a security key:
```bash
ddev craft setup/security-key
```

### Project config sync:
```bash
ddev craft project-config/apply
```

## Deployment

1. Set `CRAFT_DEV_MODE=false` in your production `.env`
2. Set `CRAFT_ENVIRONMENT=production`
3. Generate a unique `CRAFT_SECURITY_KEY`
4. Configure your database credentials
5. Run `composer install --no-dev --optimize-autoloader`
6. Run `npm install && npm run build` (generates assets + critical CSS)
7. Run `craft migrate/all`
8. Run `craft project-config/apply`

> **Important**: The production build must run on a server where the site is accessible (for critical CSS generation). For CI/CD pipelines, you may need to build critical CSS separately or use a staging URL.

## Support

For CraftCMS documentation, visit [craftcms.com/docs](https://craftcms.com/docs)

## License

[Add your license here]