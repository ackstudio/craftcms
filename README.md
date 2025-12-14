# CraftCMS Boilerplate

**v1.0.0**

An opinionated CraftCMS 5 boilerplate for rapid project setup and development. This boilerplate provides a clean, production-ready foundation for building client websites.

## Requirements

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [DDEV](https://ddev.readthedocs.io/en/stable/users/install/ddev-installation/) for local development

> DDEV handles PHP 8.3, MySQL 8.0, and Node.js 22 automatically inside containers.

---

## Quick Start (Public Clone)

Follow these steps to clone this boilerplate and start a new project:

### 1. Clone the Repository

```bash
git clone https://github.com/ackstudio/craftcms.git my-project
cd my-project
```

### 2. Rename the Project

Update the DDEV project name in `.ddev/config.yaml`:

```yaml
name: my-project  # Change "craftcms" to your project name
```

> **Important**: The project name must be lowercase with no spaces. Use hyphens for multi-word names (e.g., `my-awesome-site`).

### 3. Remove Git History (Optional)

Start fresh with your own Git history:

```bash
rm -rf .git
git init
git add .
git commit -m "Initial commit from CraftCMS boilerplate"
```

### 4. Start DDEV

```bash
ddev start
```

This will:
- Download and configure Docker containers
- Set up PHP 8.3, MySQL 8.0, and Node.js 22
- Create your local development URL at `https://my-project.ddev.site`

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
- Set your site URL (use `https://my-project.ddev.site`)
- Create your admin account (username, email, password)

### 8. Start Development Server

```bash
ddev npm run dev
```

### 9. Access Your Site

- **Frontend**: https://my-project.ddev.site
- **Admin Panel**: https://my-project.ddev.site/admin

---

## One-Liner Setup (After Clone)

For experienced users, here's the quick setup after cloning and renaming the project:

```bash
ddev start && ddev composer install && ddev npm install && cp .env.example.dev .env && ddev craft install
```

---

## Troubleshooting

### Port Conflicts
If you get port errors, another service may be using ports 80/443:
```bash
ddev poweroff
# Stop conflicting services (Apache, nginx, etc.)
ddev start
```

### Database Connection Issues
If Craft can't connect to the database:
```bash
ddev restart
```

### Vite Not Loading Assets
Make sure the Vite dev server is running:
```bash
ddev npm run dev
```

### Reset Everything
To start fresh:
```bash
ddev delete -O  # Removes containers and database
ddev start
ddev craft install
```

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