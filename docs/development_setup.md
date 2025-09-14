# 🛠️ Development Setup Guide

This guide will help you set up the Backstage Cinema development environment on your local machine.

## 📋 Prerequisites

### Required Software

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Docker & Docker Compose** - [Download](https://docs.docker.com/get-docker/)
- **Git** - [Download](https://git-scm.com/downloads)
- **Make** (optional, for convenience commands)

### Recommended Tools

- **Visual Studio Code** with extensions:
  - REST Client (for API testing)
  - PostgreSQL (for database management)
  - Docker (for container management)
- **Postman** or **Insomnia** (for API testing)
- **pgAdmin** (included in Docker setup)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/backstage-cinema
cd backstage-cinema
```

### 2. Backend Setup

```bash
cd backstage_backend

# Install dependencies
npm install

# Start services (PostgreSQL, pgAdmin, API)
make up

# Verify everything is running
make health
```

### 3. Documentation Setup

```bash
cd ../backstage_documentation

# Install dependencies
npm install

# Start documentation site
npm start
```

## 🔧 Detailed Setup

### Backend Environment

The backend uses Docker Compose for local development. Here's what gets started:

#### Services Overview

| Service | Port | Purpose |
|---------|------|---------|
| **PostgreSQL** | 5432 | Main database |
| **pgAdmin** | 8080 | Database administration |
| **Cinema API** | 3000 | REST API server |

#### Environment Variables

The system uses these default environment variables:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cinema_management
DB_USER=cinema_user
DB_PASSWORD=cinema_pass

# API Configuration
NODE_ENV=development
PORT=3000
```

#### Make Commands

The backend includes a comprehensive Makefile:

```bash
# Essential commands
make up          # Start all services
make down        # Stop all services  
make restart     # Restart all services
make health      # Check service health

# Development
make dev         # Start development mode
make test        # Run tests
make lint        # Run ESLint

# Database
make db-shell    # Connect to database
make db-reset    # Reset database (WARNING: destroys data)
make seed        # Seed with sample data

# Maintenance
make logs        # View logs
make clean       # Clean up containers
make status      # Show service status
```

## 🗄️ Database Setup

### Initial Setup

The database is automatically initialized when you run `make up`. The setup includes:

1. **Schema creation** from `/database/init/02_create_tables.sql`
2. **Sample data** from `/database/init/03_seed_data.sql`
3. **Enum types** from `/database/init/01_create_enums.sql`

### Database Access

#### Via pgAdmin (Recommended)
1. Open [http://localhost:8080](http://localhost:8080)
2. Login with:
   - Email: `admin@cinema.com`
   - Password: `admin123`
3. Add server connection:
   - Host: `postgres`
   - Port: `5432`
   - Database: `cinema_management`
   - Username: `cinema_user`
   - Password: `cinema_pass`

#### Via Command Line
```bash
# Connect to PostgreSQL shell
make db-shell

# Or directly with psql
docker-compose exec postgres psql -U cinema_user -d cinema_management
```

### Sample Data

The system comes with sample data including:
- 5 movies (Avatar, Top Gun, Black Panther, Spider-Man, The Batman)
- Multiple sessions per movie
- Room configurations with different types
- Sample inventory items

## 🧪 Testing

### Running Tests

```bash
# Run all tests
make test

# Run tests with coverage
npm run test -- --coverage

# Run specific test file
npm run test -- tests/movie.test.js
```

### Test Database

Tests use the same database as development. The test suite:
- Creates test data
- Cleans up after each test
- Uses transactions when possible
- Runs isolated from production data

### API Testing

#### Using cURL
```bash
# Check API health
curl http://localhost:3000/health

# Get all movies
curl http://localhost:3000/api/movies

# Create a movie
curl -X POST http://localhost:3000/api/movies \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Movie", "duration_min": 120}'
```

#### Using VS Code REST Client

Create a `api-tests.http` file:

```http
### Health Check
GET http://localhost:3000/health

### Get Movies
GET http://localhost:3000/api/movies

### Create Movie
POST http://localhost:3000/api/movies
Content-Type: application/json

{
  "title": "New Movie",
  "duration_min": 120,
  "genre": "Action",
  "description": "A test movie"
}
```

## 📝 Documentation Development

### Docusaurus Setup

The documentation uses Docusaurus v3:

```bash
cd backstage_documentation

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### Adding New Documentation

1. **Create new markdown files** in `/docs`
2. **Update sidebar** in `sidebars.ts`
3. **Add navigation** if needed in `docusaurus.config.ts`

#### Example: Adding New Page

```bash
# Create new doc
touch docs/new-feature.md

# Add to sidebar
# Edit sidebars.ts and add 'new-feature' to the array
```

## 🔄 Development Workflow

### Daily Development

1. **Start services**: `make up`
2. **Check health**: `make health`  
3. **Make changes** to code
4. **Run tests**: `make test`
5. **Check logs** if needed: `make logs`

### Code Quality

```bash
# Lint code
make lint

# Fix linting issues
npm run lint -- --fix

# Format code (if prettier is setup)
npm run format
```

### Database Changes

#### Schema Updates
1. Create migration file in `/database/migrations`
2. Update `/database/init` files for fresh installs
3. Test migration with `make db-reset` and `make up`

#### Sample Data Updates
1. Update `/database/init/03_seed_data.sql`
2. Reset database: `make db-reset`
3. Restart services: `make up`

## 🚨 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Check what's using the port
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or change the port
export PORT=3001
make up
```

#### Database Connection Issues
```bash
# Check PostgreSQL is running
make status

# View database logs
docker-compose logs postgres

# Reset database
make db-reset
```

#### Docker Issues
```bash
# Clean up all containers
make clean

# Rebuild from scratch
docker-compose down -v
docker system prune -f
make up
```

### Performance Issues

#### Database Queries
```bash
# Monitor database performance
make db-shell
# Then in PostgreSQL:
# \x on
# SELECT * FROM pg_stat_activity;
```

#### Memory Usage
```bash
# Check container memory usage
docker stats

# Check system resources
htop
```

## 🔧 Configuration

### Environment Files

Create custom environment files:

```bash
# Development environment
cp .env.example .env.development

# Production environment  
cp .env.example .env.production
```

### Docker Configuration

Modify `docker-compose.yml` for custom setups:

```yaml
# Example: Change PostgreSQL port
postgres:
  ports:
    - "5433:5432"  # Changed from 5432:5432
```

## 📚 Additional Resources

### Documentation Links
- [API Documentation](./api_documentation.md)
- [Database Schema](./database_schema.md)  
- [Class Diagrams](./classes_diagram.md)

### External Resources
- [Node.js Documentation](https://nodejs.org/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Express.js Guide](https://expressjs.com/)

### Community
- [Project Issues](https://github.com/your-org/backstage-cinema/issues)
- [Discussions](https://github.com/your-org/backstage-cinema/discussions)

## 🎯 Next Steps

After completing the setup:

1. **Explore the API** using the interactive documentation
2. **Review the codebase** structure and patterns
3. **Run the test suite** to understand functionality
4. **Try the demo script**: `make demo`
5. **Check out the user stories** for development priorities

Need help? Check the troubleshooting section or create an issue in the project repository.