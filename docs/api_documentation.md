# 🚀 API Documentation

The Backstage Cinema Management System provides a comprehensive RESTful API for managing all aspects of cinema operations. This documentation covers endpoints, authentication, and integration guidelines.

## 📋 Quick Access

### API Base URLs
- **Development**: `http://localhost:3000`
- **Production**: `https://api.backstagecinema.com` (when deployed)

### Interactive Documentation
- **Swagger UI**: `http://localhost:3000/api/docs` - Interactive API documentation with live testing
- **Health Check**: `http://localhost:3000/health` - API health status
- **API Base**: `http://localhost:3000/api` - All API endpoints base path

## 🔐 Authentication

Currently, the API operates in **development mode** without authentication. Future versions will include:

- JWT token-based authentication
- Role-based access control (Admin, Manager, Employee)
- API key authentication for third-party integrations

## 📊 Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": {...},
  "count": 10,
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information",
  "statusCode": 400
}
```

## 🎯 Available Endpoints

### Core Resources

| Resource | Base Endpoint | Description |
|----------|---------------|-------------|
| **Movies** | `/api/movies` | Movie catalog management |
| **Sessions** | `/api/sessions` | Movie session scheduling |
| **Tickets** | `/api/tickets` | Ticket sales and management |
| **Sales** | `/api/sales` | POS and transaction management |

### System Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | System health check |
| `/api` | GET | API information and endpoints |

## 🎬 Movies API

Complete CRUD operations for movie management.

### Endpoints Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/movies` | GET | List all movies with filters |
| `/api/movies` | POST | Create new movie |
| `/api/movies/:id` | GET | Get movie by ID |
| `/api/movies/:id` | PUT | Update movie |
| `/api/movies/:id` | DELETE | Delete/deactivate movie |
| `/api/movies/:id/activate` | PATCH | Activate movie |
| `/api/movies/:id/stats` | GET | Get movie statistics |
| `/api/movies/search` | GET | Search movies by title |

### Movie Data Model

```json
{
  "id": 1,
  "title": "Avatar: The Way of Water",
  "duration_min": 192,
  "genre": "Sci-Fi/Action",
  "description": "Set more than a decade after the events of the first film...",
  "rating": "PG-13",
  "poster_url": "https://example.com/posters/avatar2.jpg",
  "is_active": true,
  "created_at": "2025-09-14T17:28:38.496Z",
  "updated_at": "2025-09-14T17:28:38.496Z",
  "total_sessions": "5",
  "upcoming_sessions": "3"
}
```

### Quick Examples

#### Get All Movies
```bash
curl -X GET "http://localhost:3000/api/movies"
```

#### Create Movie
```bash
curl -X POST "http://localhost:3000/api/movies" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Movie",
    "duration_min": 120,
    "genre": "Action",
    "description": "An exciting new movie",
    "rating": "PG-13"
  }'
```

#### Search Movies
```bash
curl -X GET "http://localhost:3000/api/movies/search?title=Avatar"
```

## 🎭 Sessions API

Movie session scheduling and seat management.

### Endpoints Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/sessions` | GET | List all sessions |
| `/api/sessions` | POST | Create new session |
| `/api/sessions/:id` | GET | Get session details |
| `/api/sessions/:id` | PUT | Update session |
| `/api/sessions/:id` | DELETE | Delete session |
| `/api/sessions/:id/seats` | GET | Get seat availability |

### Quick Examples

#### Get All Sessions
```bash
curl -X GET "http://localhost:3000/api/sessions"
```

#### Get Session Seats
```bash
curl -X GET "http://localhost:3000/api/sessions/1/seats"
```

## 🎫 Tickets API

Ticket sales and management system.

### Endpoints Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/tickets` | GET | List all tickets |
| `/api/tickets` | POST | Create single ticket |
| `/api/tickets/bulk` | POST | Create multiple tickets |
| `/api/tickets/:id` | GET | Get ticket details |
| `/api/tickets/:id` | DELETE | Cancel ticket |

### Quick Examples

#### Buy Single Ticket
```bash
curl -X POST "http://localhost:3000/api/tickets" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": 1,
    "seat_id": "A05",
    "price": 25.00
  }'
```

#### Buy Multiple Tickets
```bash
curl -X POST "http://localhost:3000/api/tickets/bulk" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": 1,
    "seat_ids": ["A05", "A06", "A07"],
    "price": 25.00
  }'
```

## 🛒 Sales API

Point of Sale system for concessions and transactions.

### Endpoints Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/sales` | GET | List all sales |
| `/api/sales` | POST | Create new sale |
| `/api/sales/:id` | GET | Get sale details |
| `/api/sales/:id/items` | POST | Add item to sale |
| `/api/sales/:id/discount` | POST | Apply discount |
| `/api/sales/:id/finalize` | POST | Complete sale |
| `/api/sales/:id/cancel` | POST | Cancel sale |

## 📈 Rate Limiting

The API implements rate limiting to ensure fair usage:

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| General | 100 requests | 15 minutes |
| Tickets | 20 requests | 5 minutes |
| Sales | 50 requests | 10 minutes |

Rate limit headers included in responses:
```
RateLimit-Limit: 100
RateLimit-Remaining: 95
RateLimit-Reset: 1640123456
```

## 🔧 Error Handling

### Common HTTP Status Codes

| Code | Status | Description |
|------|---------|-------------|
| 200 | OK | Success |
| 201 | Created | Resource created |
| 400 | Bad Request | Validation error |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource conflict (e.g., seat taken) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Error | Server error |

### Validation Errors

Validation errors return detailed information:

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    "\"title\" is required",
    "\"duration_min\" must be a positive number"
  ]
}
```

## 🧪 Testing the API

### Using cURL

Most examples in this documentation use cURL. Make sure the API server is running:

```bash
# Check if API is running
curl http://localhost:3000/health

# Get API information
curl http://localhost:3000/api
```

### Using Postman

1. Import the OpenAPI/Swagger specification from `http://localhost:3000/api`
2. Set base URL to `http://localhost:3000`
3. Test endpoints using the imported collection

### Interactive Testing

Visit `http://localhost:3000/api` in your browser for an interactive API explorer.

## 🚀 Getting Started

1. **Start the API server**:
   ```bash
   cd backstage_backend
   make up
   ```

2. **Verify it's running**:
   ```bash
   curl http://localhost:3000/health
   ```

3. **Explore available endpoints**:
   ```bash
   curl http://localhost:3000/api
   ```

4. **Test with a simple request**:
   ```bash
   curl http://localhost:3000/api/movies
   ```

## 📚 Additional Resources

- [Database Schema Documentation](./database_schema.md)
- [User Stories and Epics](../epics-and-user-stories.md)
- [System Architecture](./classes_diagram.md)
- [Development Setup](./development_setup.md)

For detailed endpoint documentation with request/response schemas, visit the interactive **Swagger UI** at `http://localhost:3000/api/docs` when the server is running.

## 🔧 Swagger UI Features

The interactive API documentation includes:

- **Live API Testing**: Test endpoints directly from the browser
- **Request/Response Examples**: See actual data formats
- **Schema Validation**: Understand required fields and data types
- **Authentication Testing**: Test secured endpoints (when implemented)
- **Response Codes**: Complete HTTP status code documentation

### Browser Compatibility

The Swagger UI is optimized for:
- ✅ **Chrome/Chromium**: Full compatibility
- ✅ **Firefox**: Full compatibility  
- ✅ **Safari**: Compatible with relaxed security policies for development
- ✅ **Edge**: Full compatibility

### Accessing Swagger UI

1. Ensure the backend server is running: `make up`
2. Open your browser to: `http://localhost:3000/api/docs`
3. Explore and test the Movie API endpoints interactively