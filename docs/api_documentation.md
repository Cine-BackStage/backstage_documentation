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

The API uses **JWT (JSON Web Token)** based authentication with role-based access control.

### Authentication Flow

1. **Login**: Send credentials to `/api/auth/login` to receive a JWT token
2. **Include Token**: Include the token in the `Authorization` header for all API requests
3. **Token Expiration**: Tokens expire after 24 hours (refresh required)

### Login Request
```bash
curl -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@cinema.com",
    "password": "your_password"
  }'
```

### Login Response
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "user@cinema.com",
      "name": "John Doe",
      "role": "admin",
      "companyId": 1
    }
  }
}
```

### Using the Token
All API requests must include the JWT token in the Authorization header:

```bash
curl -X GET "http://localhost:3000/api/movies" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### User Roles

| Role | Permissions |
|------|-------------|
| **admin** | Full system access, user management, reports |
| **manager** | Operations management, inventory, employees |
| **employee** | POS operations, ticket sales, basic access |

### Multi-Tenant Architecture

The system supports multiple cinema companies in a single database. **All requests are automatically scoped to the user's company** based on the `companyId` in their JWT token. This ensures data isolation between different cinema operators.

- No need to pass `companyId` in requests - it's extracted from the JWT
- Users can only access data belonging to their company
- Admin endpoints exist for system-wide management at `/api/system/admin`

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
| **Authentication** | `/api/auth` | User authentication and authorization |
| **Movies** | `/api/movies` | Movie catalog management |
| **Sessions** | `/api/sessions` | Movie session scheduling |
| **Tickets** | `/api/tickets` | Ticket sales and management |
| **Sales** | `/api/sales` | POS and transaction management |
| **Customers** | `/api/customers` | Customer management and loyalty |
| **Employees** | `/api/employees` | Employee management and time tracking |
| **Inventory** | `/api/inventory` | Inventory management and alerts |
| **Discounts** | `/api/discounts` | Discount code management |
| **Rooms** | `/api/rooms` | Cinema room and seat management |
| **Room Type Prices** | `/api/room-types/prices` | Pricing by room type |
| **Reports** | `/api/reports` | Business analytics and reports |

### System Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | System health check |
| `/api` | GET | API information and endpoints |
| `/api/system/admin/*` | * | Multi-tenant system administration |

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
curl -X GET "http://localhost:3000/api/movies" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Create Movie
```bash
curl -X POST "http://localhost:3000/api/movies" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
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
curl -X GET "http://localhost:3000/api/movies/search?title=Avatar" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get Movie Statistics
```bash
curl -X GET "http://localhost:3000/api/movies/1/stats" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
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

### Session Data Model
```json
{
  "id": 1,
  "movie_id": 1,
  "room_id": 1,
  "session_date": "2025-11-20",
  "session_time": "19:30:00",
  "price": 25.00,
  "available_seats": 45,
  "total_seats": 50,
  "movie": {
    "title": "Avatar: The Way of Water",
    "duration_min": 192
  },
  "room": {
    "name": "Room 1",
    "type": "standard"
  }
}
```

### Quick Examples

#### Get All Sessions
```bash
curl -X GET "http://localhost:3000/api/sessions" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Create Session
```bash
curl -X POST "http://localhost:3000/api/sessions" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "movie_id": 1,
    "room_id": 1,
    "session_date": "2025-11-25",
    "session_time": "19:30:00",
    "price": 25.00
  }'
```

#### Get Session Seats
```bash
curl -X GET "http://localhost:3000/api/sessions/1/seats" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
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

### Ticket Data Model
```json
{
  "id": 1,
  "session_id": 1,
  "seat_id": "A05",
  "price": 25.00,
  "customer_id": 5,
  "status": "sold",
  "purchase_date": "2025-11-20T14:30:00Z",
  "session": {
    "movie_title": "Avatar: The Way of Water",
    "session_date": "2025-11-20",
    "session_time": "19:30:00"
  }
}
```

### Quick Examples

#### Buy Single Ticket
```bash
curl -X POST "http://localhost:3000/api/tickets" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": 1,
    "seat_id": "A05",
    "price": 25.00,
    "customer_id": 5
  }'
```

#### Buy Multiple Tickets
```bash
curl -X POST "http://localhost:3000/api/tickets/bulk" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": 1,
    "seat_ids": ["A05", "A06", "A07"],
    "price": 25.00,
    "customer_id": 5
  }'
```

#### Cancel Ticket
```bash
curl -X DELETE "http://localhost:3000/api/tickets/1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
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

### Sale Data Model
```json
{
  "id": 1,
  "customer_id": 5,
  "employee_id": 2,
  "total_amount": 45.50,
  "discount_amount": 5.00,
  "final_amount": 40.50,
  "payment_method": "credit_card",
  "status": "completed",
  "sale_date": "2025-11-20T14:30:00Z",
  "items": [
    {
      "inventory_item_id": 10,
      "quantity": 2,
      "unit_price": 15.00,
      "total": 30.00
    }
  ]
}
```

### Quick Examples

#### Create Sale
```bash
curl -X POST "http://localhost:3000/api/sales" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 5,
    "items": [
      {
        "inventory_item_id": 10,
        "quantity": 2,
        "unit_price": 15.00
      }
    ],
    "payment_method": "credit_card"
  }'
```

#### Apply Discount
```bash
curl -X POST "http://localhost:3000/api/sales/1/discount" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "discount_code": "SUMMER20"
  }'
```

#### Finalize Sale
```bash
curl -X POST "http://localhost:3000/api/sales/1/finalize" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 👥 Customers API

Customer management with loyalty points and analytics.

### Endpoints Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/customers` | GET | List all customers |
| `/api/customers` | POST | Create new customer |
| `/api/customers/:id` | GET | Get customer details |
| `/api/customers/:id` | PUT | Update customer |
| `/api/customers/:id` | DELETE | Delete customer |
| `/api/customers/:id/loyalty` | GET | Get customer loyalty points |
| `/api/customers/:id/loyalty` | POST | Add loyalty points |
| `/api/customers/:id/purchase-history` | GET | Get purchase history |
| `/api/customers/analytics` | GET | Customer analytics |

### Customer Data Model
```json
{
  "id": 5,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "loyalty_points": 150,
  "total_purchases": 25,
  "total_spent": 625.00,
  "created_at": "2025-01-15T10:00:00Z",
  "last_purchase": "2025-11-19T18:30:00Z"
}
```

### Quick Examples

#### Create Customer
```bash
curl -X POST "http://localhost:3000/api/customers" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+1234567890"
  }'
```

#### Add Loyalty Points
```bash
curl -X POST "http://localhost:3000/api/customers/5/loyalty" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "points": 10,
    "reason": "Purchase"
  }'
```

#### Get Customer Analytics
```bash
curl -X GET "http://localhost:3000/api/customers/analytics" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 👔 Employees API

Employee management and time tracking.

### Endpoints Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/employees` | GET | List all employees |
| `/api/employees` | POST | Create new employee |
| `/api/employees/:id` | GET | Get employee details |
| `/api/employees/:id` | PUT | Update employee |
| `/api/employees/:id` | DELETE | Delete employee |
| `/api/employees/:id/clock-in` | POST | Clock in employee |
| `/api/employees/:id/clock-out` | POST | Clock out employee |
| `/api/employees/:id/hours` | GET | Get employee work hours |

### Employee Data Model
```json
{
  "id": 2,
  "name": "Sarah Johnson",
  "email": "sarah@cinema.com",
  "role": "employee",
  "phone": "+1234567890",
  "hire_date": "2025-01-01",
  "hourly_rate": 15.50,
  "is_active": true,
  "current_shift": {
    "clock_in": "2025-11-20T09:00:00Z",
    "status": "active"
  }
}
```

### Quick Examples

#### Create Employee
```bash
curl -X POST "http://localhost:3000/api/employees" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mike Wilson",
    "email": "mike@cinema.com",
    "role": "employee",
    "phone": "+1234567890",
    "hourly_rate": 15.50
  }'
```

#### Clock In
```bash
curl -X POST "http://localhost:3000/api/employees/2/clock-in" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get Work Hours
```bash
curl -X GET "http://localhost:3000/api/employees/2/hours?start_date=2025-11-01&end_date=2025-11-30" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📦 Inventory API

Inventory management with low stock alerts.

### Endpoints Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/inventory` | GET | List all inventory items |
| `/api/inventory` | POST | Create new item |
| `/api/inventory/:id` | GET | Get item details |
| `/api/inventory/:id` | PUT | Update item |
| `/api/inventory/:id` | DELETE | Delete item |
| `/api/inventory/:id/stock` | PATCH | Update stock quantity |
| `/api/inventory/low-stock` | GET | Get low stock alerts |
| `/api/inventory/categories` | GET | Get item categories |

### Inventory Data Model
```json
{
  "id": 10,
  "name": "Popcorn Large",
  "category": "Concessions",
  "unit_price": 8.50,
  "cost_price": 2.00,
  "quantity": 150,
  "min_stock_level": 50,
  "is_low_stock": false,
  "sku": "POPC-L-001",
  "created_at": "2025-01-01T00:00:00Z"
}
```

### Quick Examples

#### Create Inventory Item
```bash
curl -X POST "http://localhost:3000/api/inventory" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Soda Medium",
    "category": "Beverages",
    "unit_price": 5.50,
    "cost_price": 1.50,
    "quantity": 200,
    "min_stock_level": 75,
    "sku": "SODA-M-001"
  }'
```

#### Update Stock
```bash
curl -X PATCH "http://localhost:3000/api/inventory/10/stock" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 100,
    "operation": "add"
  }'
```

#### Get Low Stock Items
```bash
curl -X GET "http://localhost:3000/api/inventory/low-stock" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🎟️ Discounts API

Discount code management and validation.

### Endpoints Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/discounts` | GET | List all discounts |
| `/api/discounts` | POST | Create new discount |
| `/api/discounts/:id` | GET | Get discount details |
| `/api/discounts/:id` | PUT | Update discount |
| `/api/discounts/:id` | DELETE | Delete discount |
| `/api/discounts/validate` | POST | Validate discount code |
| `/api/discounts/:id/usage` | GET | Get discount usage stats |

### Discount Data Model
```json
{
  "id": 1,
  "code": "SUMMER20",
  "description": "20% off summer promotion",
  "discount_type": "percentage",
  "discount_value": 20.00,
  "min_purchase": 50.00,
  "max_discount": 15.00,
  "start_date": "2025-06-01",
  "end_date": "2025-08-31",
  "usage_limit": 100,
  "times_used": 25,
  "is_active": true
}
```

### Quick Examples

#### Create Discount
```bash
curl -X POST "http://localhost:3000/api/discounts" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "WINTER25",
    "description": "25% off winter promotion",
    "discount_type": "percentage",
    "discount_value": 25.00,
    "start_date": "2025-12-01",
    "end_date": "2026-02-28",
    "usage_limit": 200
  }'
```

#### Validate Discount
```bash
curl -X POST "http://localhost:3000/api/discounts/validate" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "SUMMER20",
    "purchase_amount": 75.00
  }'
```

## 🎬 Rooms API

Cinema room and seat management.

### Endpoints Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/rooms` | GET | List all rooms |
| `/api/rooms` | POST | Create new room |
| `/api/rooms/:id` | GET | Get room details |
| `/api/rooms/:id` | PUT | Update room |
| `/api/rooms/:id` | DELETE | Delete room |
| `/api/rooms/:id/seats` | GET | Get room seat map |
| `/api/rooms/:id/availability` | GET | Check room availability |

### Room Data Model
```json
{
  "id": 1,
  "name": "Room 1",
  "type": "standard",
  "capacity": 50,
  "rows": 8,
  "seats_per_row": 8,
  "is_active": true,
  "features": ["3D", "Dolby Atmos"],
  "seat_map": [
    {"id": "A01", "row": "A", "number": 1, "type": "standard"},
    {"id": "A02", "row": "A", "number": 2, "type": "standard"}
  ]
}
```

### Quick Examples

#### Create Room
```bash
curl -X POST "http://localhost:3000/api/rooms" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Room 2",
    "type": "premium",
    "capacity": 40,
    "rows": 6,
    "seats_per_row": 8,
    "features": ["IMAX", "Dolby Atmos"]
  }'
```

#### Get Room Seat Map
```bash
curl -X GET "http://localhost:3000/api/rooms/1/seats" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📊 Reports API

Business analytics and reporting.

### Endpoints Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/reports/sales` | GET | Sales reports |
| `/api/reports/revenue` | GET | Revenue reports |
| `/api/reports/inventory` | GET | Inventory reports |
| `/api/reports/customers` | GET | Customer analytics |
| `/api/reports/employees` | GET | Employee performance |
| `/api/reports/dashboard` | GET | Dashboard summary |

### Quick Examples

#### Get Sales Report
```bash
curl -X GET "http://localhost:3000/api/reports/sales?start_date=2025-11-01&end_date=2025-11-30" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get Dashboard Summary
```bash
curl -X GET "http://localhost:3000/api/reports/dashboard" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔧 Room Type Prices API

Pricing configuration by room type.

### Endpoints Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/room-types/prices` | GET | List all room type prices |
| `/api/room-types/prices` | POST | Create price configuration |
| `/api/room-types/prices/:id` | PUT | Update price configuration |
| `/api/room-types/prices/:id` | DELETE | Delete price configuration |

### Quick Examples

#### Create Room Type Price
```bash
curl -X POST "http://localhost:3000/api/room-types/prices" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "room_type": "premium",
    "base_price": 30.00,
    "weekend_surcharge": 5.00,
    "holiday_surcharge": 10.00
  }'
```

## 🔐 System Admin API

Multi-tenant system administration (requires admin role).

### Endpoints Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/system/admin/companies` | GET | List all companies |
| `/api/system/admin/companies` | POST | Create new company |
| `/api/system/admin/companies/:id` | GET | Get company details |
| `/api/system/admin/companies/:id` | PUT | Update company |
| `/api/system/admin/users` | GET | List all users |
| `/api/system/admin/stats` | GET | System-wide statistics |

### Quick Examples

#### Get All Companies
```bash
curl -X GET "http://localhost:3000/api/system/admin/companies" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Note: System admin endpoints are only accessible to users with the **admin** role and provide cross-company access.

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

# Login to get JWT token
curl -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@cinema.com", "password": "your_password"}'

# Use token in subsequent requests
export JWT_TOKEN="your_jwt_token_here"
curl -X GET "http://localhost:3000/api/movies" \
  -H "Authorization: Bearer $JWT_TOKEN"
```

### Using Postman

1. Import the OpenAPI/Swagger specification from `http://localhost:3000/api`
2. Set base URL to `http://localhost:3000`
3. Login via `/api/auth/login` to get JWT token
4. Add token to Authorization header (Type: Bearer Token)
5. Test endpoints using the imported collection

### Interactive Testing

Visit `http://localhost:3000/api/docs` in your browser for Swagger UI with interactive API testing capabilities.

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

3. **Login to get authentication token**:
   ```bash
   curl -X POST "http://localhost:3000/api/auth/login" \
     -H "Content-Type: application/json" \
     -d '{"email": "admin@cinema.com", "password": "your_password"}'
   ```

4. **Test with an authenticated request**:
   ```bash
   curl -X GET "http://localhost:3000/api/movies" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

5. **Explore Swagger UI**:
   Open your browser to `http://localhost:3000/api/docs` for interactive documentation

## 📚 Additional Resources

- [Database Schema Documentation](./database_schema.md)
- [User Stories and Epics](./epics_and_user_stories.md)
- [System Architecture](./classes_diagram.md)
- [Development Setup](./development_setup.md)

For detailed endpoint documentation with request/response schemas, visit the interactive **Swagger UI** at `http://localhost:3000/api/docs` when the server is running.

## 🔧 Swagger UI Features

The interactive API documentation includes:

- **Live API Testing**: Test endpoints directly from the browser
- **Request/Response Examples**: See actual data formats
- **Schema Validation**: Understand required fields and data types
- **Authentication Testing**: Login and test secured endpoints with JWT tokens
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
3. Click "Authorize" and enter your JWT token (get it from `/api/auth/login`)
4. Explore and test all API endpoints interactively

## 📝 Common Query Parameters

Many endpoints support common query parameters for filtering and pagination:

### Pagination
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)

### Filtering
- `search` - Text search across relevant fields
- `status` - Filter by status (active, inactive, etc.)
- `start_date` - Filter by start date (ISO 8601 format)
- `end_date` - Filter by end date (ISO 8601 format)

### Sorting
- `sort_by` - Field to sort by
- `sort_order` - Sort direction (asc, desc)

### Example
```bash
curl -X GET "http://localhost:3000/api/movies?page=1&limit=10&search=Avatar&sort_by=title&sort_order=asc" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔒 Security Best Practices

1. **Token Storage**: Never store JWT tokens in localStorage - use httpOnly cookies or secure storage
2. **Token Refresh**: Implement token refresh before 24-hour expiration
3. **HTTPS Only**: Always use HTTPS in production (tokens sent in headers)
4. **Rate Limiting**: Respect rate limits to avoid being blocked
5. **Error Handling**: Never expose sensitive information in error messages
6. **Validation**: Always validate input on client side before sending requests

## 🌐 CORS Policy

The API implements CORS (Cross-Origin Resource Sharing) for web applications:

- **Allowed Origins**: Configurable per environment
- **Allowed Methods**: GET, POST, PUT, PATCH, DELETE
- **Allowed Headers**: Authorization, Content-Type
- **Credentials**: Supported for cookie-based authentication

## 🔄 API Versioning

Current API version: **v1** (implicit in all endpoints)

Future versions will be explicitly versioned:
- `/api/v2/movies` - Version 2
- `/api/v1/movies` - Version 1 (current, no version prefix needed)