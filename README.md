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
6. Run `craft migrate/all`
7. Run `craft project-config/apply`

## Support

For CraftCMS documentation, visit [craftcms.com/docs](https://craftcms.com/docs)

## License

[Add your license here]