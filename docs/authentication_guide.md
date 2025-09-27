# 🔐 Authentication Guide

Complete guide for authenticating with the Cinema Management API, including JWT token generation and Swagger UI usage.

## 📋 Overview

The Cinema Management API uses **JWT (JSON Web Token)** authentication with Bearer tokens for secure access to protected endpoints. This guide covers:

- Token generation methods
- Swagger UI authentication
- API authentication for developers
- Troubleshooting common issues

## 🚀 Quick Start

### Method 1: Generate Token for Swagger UI

For **Swagger UI** (http://localhost:3000/api/docs):

```bash
# Generate token WITHOUT "Bearer" prefix (for Swagger UI)
docker-compose exec api npm run swagger-token
```

Copy the output token and paste it in Swagger UI Authorization dialog.

### Method 2: Generate Token for API Calls

For **cURL/API calls**:

```bash
# Generate token WITH "Bearer" prefix (for direct API calls)
docker-compose exec api npm run token
```

Use this complete Bearer token in Authorization headers.

## 🔑 Token Generation Commands

| Command | Purpose | Output Format | Use Case |
|---------|---------|---------------|----------|
| `npm run swagger-token` | Swagger UI | `eyJhbGci...` | Paste in Swagger Authorization |
| `npm run token` | API calls | `Bearer eyJhbGci...` | cURL, Postman, code |
| `npm run token:verbose` | Detailed info | `Bearer eyJhbGci...` + details | Development/debugging |

## 📖 Step-by-Step Swagger UI Authentication

### Step 1: Generate Token
```bash
docker-compose exec api npm run swagger-token
```

**Example Output:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcGYiOiIxMjM0NTY3ODkwMSIsImVtcGxveWVlSWQiOiJBRE1JTjAwMSIsInJvbGUiOiJBRE1JTiIsInBlcm1pc3Npb25zIjp7ImFsbCI6dHJ1ZX0sImlhdCI6MTc1ODk0ODI0NSwiZXhwIjoxNzU4OTc3MDQ1fQ.CAdSPA4AKALCdo_On7UJn-ulYUIAaF3NqHCUasoXVrc
```

### Step 2: Access Swagger UI
Go to: http://localhost:3000/api/docs

### Step 3: Authorize
1. Click the 🔒 **"Authorize"** button (top right)
2. In the **"Value"** field, paste **ONLY the token** (no "Bearer" prefix):
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcGYiOiIxMjM0NTY3ODkwMSIsImVtcGxveWVlSWQiOiJBRE1JTjAwMSIsInJvbGUiOiJBRE1JTiIsInBlcm1pc3Npb25zIjp7ImFsbCI6dHJ1ZX0sImlhdCI6MTc1ODk0ODI0NSwiZXhwIjoxNzU4OTc3MDQ1fQ.CAdSPA4AKALCdo_On7UJn-ulYUIAaF3NqHCUasoXVrc
   ```
3. Click **"Authorize"**
4. Click **"Close"**

### Step 4: Test Endpoints
All 🔒 protected endpoints now work! Try:
- `GET /api/employees/me` - Get current employee profile
- `GET /api/employees` - List all employees
- `POST /api/employees/clock-in` - Clock in functionality

## 💻 API Authentication for Developers

### cURL Examples

```bash
# Generate complete Bearer token
TOKEN=$(docker-compose exec api npm run token)

# Use in cURL requests
curl -H "Authorization: $TOKEN" http://localhost:3000/api/employees/me

# Or directly
curl -H "Authorization: Bearer eyJhbGci..." http://localhost:3000/api/employees
```

### JavaScript/Node.js

```javascript
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI...';

const response = await fetch('http://localhost:3000/api/employees/me', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### Python

```python
import requests

token = 'eyJhbGciOiJIUzI1NiIsInR5cCI...'
headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json'
}

response = requests.get('http://localhost:3000/api/employees/me', headers=headers)
```

## 🔧 Employee Management Setup

### Default Admin Credentials

The system comes with a default admin employee:

- **Employee ID**: `ADMIN001`
- **Role**: `ADMIN` (full system access)
- **CPF**: `12345678901`
- **Name**: `System Administrator`
- **Email**: `admin@cinema.com`

### Creating Additional Employees

```bash
# Interactive admin setup (if needed)
docker-compose exec api npm run setup-admin

# Login with existing credentials
docker-compose exec api npm run get-token
```

## 🎯 Token Details

### JWT Payload Structure

```json
{
  "cpf": "12345678901",
  "employeeId": "ADMIN001",
  "role": "ADMIN",
  "permissions": {
    "all": true
  },
  "iat": 1758948245,
  "exp": 1758977045
}
```

### Token Properties

- **Validity**: 8 hours (configurable via `JWT_EXPIRES_IN`)
- **Algorithm**: HS256
- **Secret**: Configured in `.env` file (`JWT_SECRET`)
- **Claims**: Employee CPF, ID, role, and permissions

### Role Permissions

| Role | Permissions | Description |
|------|------------|-------------|
| `ADMIN` | All access | Full system administration |
| `MANAGER` | Employee + Operations | Staff and operational management |
| `CASHIER` | Sales + Basic | POS operations and basic functions |
| `MAINTENANCE` | System maintenance | Technical system access |
| `SECURITY` | Security monitoring | Security-related functions |

## 🚨 Troubleshooting

### Common Issues

#### 1. "Invalid or expired token" in Swagger UI

**Problem**: Pasted token with "Bearer" prefix
**Solution**: Use `npm run swagger-token` and paste ONLY the token part

❌ **Wrong**: `Bearer eyJhbGci...`
✅ **Correct**: `eyJhbGci...`

#### 2. "Access token required"

**Problem**: Missing or malformed Authorization header
**Solution**: Ensure proper header format:
```
Authorization: Bearer eyJhbGci...
```

#### 3. Token works in cURL but not Swagger

**Problem**: Different token format requirements
**Solution**:
- **Swagger UI**: Use `npm run swagger-token` (no Bearer prefix)
- **cURL/API**: Use `npm run token` (with Bearer prefix)

#### 4. "Employee not found or inactive"

**Problem**: Token valid but employee doesn't exist or is deactivated
**Solution**: Check employee status:
```bash
docker-compose exec api node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.employee.findFirst({ where: { cpf: '12345678901' }, include: { person: true } })
  .then(console.log).finally(() => prisma.\$disconnect());
"
```

### Debug Token

```bash
# Verify token is valid
docker-compose exec api node -e "
const jwt = require('jsonwebtoken');
const token = 'your-token-here';
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
  console.log('✅ Token valid:', decoded);
} catch (error) {
  console.error('❌ Token invalid:', error.message);
}
"
```

### Check API Health

```bash
# Test API connectivity
curl http://localhost:3000/api/health

# Test authentication endpoint
curl -X POST -H "Content-Type: application/json" \
  -d '{"employeeId":"ADMIN001","password":"admin123"}' \
  http://localhost:3000/api/employees/login
```

## 📚 Related Documentation

- [API Documentation](./api_documentation.md) - Complete API endpoint reference
- [Database Schema](./database_schema.md) - Employee and authentication tables
- [Development Setup](./development_setup.md) - Environment configuration

## 🔄 Token Refresh

Tokens are valid for 8 hours. When expired:

1. **Generate new token**: `npm run swagger-token`
2. **Re-authorize** in Swagger UI with the new token
3. **Update** API clients with the fresh token

For production environments, consider implementing token refresh mechanisms.

## 🛡️ Security Best Practices

1. **Never commit tokens** to version control
2. **Use HTTPS** in production environments
3. **Rotate JWT secrets** regularly
4. **Monitor token usage** via audit logs
5. **Implement token refresh** for long-running applications
6. **Validate permissions** at the application level
7. **Log authentication events** for security monitoring

---

*This authentication system implements the Employee Management and Access Control epic (US-022, US-023, US-024, US-025) with comprehensive JWT-based security.*