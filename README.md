# 🎬 Backstage Cinema Documentation

**No Drama** - Comprehensive documentation for the Backstage Cinema Management System.

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Open browser to http://localhost:3000
```

## 📚 Documentation Sections

### 🎨 Brand & Design
- **[Branding](docs/branding.md)**: Visual identity and brand standards
- **[Style Guide](docs/style_guide.md)**: Design principles and color palette

### 🏗️ System Architecture
- **[Class Diagrams](docs/classes_diagram.md)**: System architecture and relationships
- **[Database Schema](docs/database_schema.md)**: Complete database documentation

### 🚀 API & Development
- **[API Documentation](docs/api_documentation.md)**: REST API reference and Swagger access
- **[Development Setup](docs/development_setup.md)**: Local environment setup guide

## 🔗 Quick Access Links

| Resource | URL | Description |
|----------|-----|-------------|
| **API Server** | `http://localhost:3000` | REST API base URL |
| **Swagger UI** | `http://localhost:3000/api/docs` | Interactive API documentation |
| **Database Admin** | `http://localhost:8080` | pgAdmin interface |
| **Health Check** | `http://localhost:3000/health` | API health status |
| **Documentation** | `http://localhost:3000` (this site) | Full documentation |

## 🛠️ Development

### Local Development

```bash
npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build for Production

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Using SSH:

```bash
USE_SSH=true npm run deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> npm run deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.

## 📝 Contributing

### Adding New Documentation

1. Create new `.md` files in the `/docs` directory
2. Update `sidebars.ts` to include new pages in navigation
3. Follow the existing documentation style and structure
4. Test locally with `npm start`

### Documentation Structure

```
docs/
├── intro.md                    # Main landing page
├── branding.md                 # Brand guidelines
├── style_guide.md             # Design system
├── classes_diagram.md          # System architecture
├── database_schema.md          # Database documentation
├── api_documentation.md        # API reference
└── development_setup.md        # Setup instructions
```

## 🔧 Configuration

The site is configured via `docusaurus.config.ts`. Key settings:

- **Theme**: Dark/light mode support
- **Navigation**: Top navigation and sidebar
- **Plugins**: Search, blog, documentation
- **SEO**: Meta tags and social cards

## 📋 Requirements

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git** (for deployment)

## 🎯 Features

- 📱 **Mobile Responsive**: Works on all devices
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 🔍 **Search**: Built-in documentation search
- 📖 **Version Control**: Support for multiple documentation versions
- 🚀 **Fast Loading**: Optimized static site generation
- 📊 **Analytics Ready**: Easy Google Analytics integration

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-org/backstage-cinema/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/backstage-cinema/discussions)
- **Documentation**: This site serves as the primary documentation source

---

Built with ❤️ using [Docusaurus](https://docusaurus.io/) for the Backstage Cinema project.





