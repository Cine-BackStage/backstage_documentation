# 🗄️ Database Setup & Access Guide

## 📋 **Overview**

This guide covers how to access and manage the PostgreSQL database for the Multi-Tenant Cinema Management System using pgAdmin and direct database connections.

---

## 🐳 **Docker Database Configuration**

The system uses PostgreSQL 15 running in Docker with the following configuration:

| Component | Details |
|-----------|---------|
| **Database Name** | `cinema_management` |
| **Username** | `cinema_user` |
| **Password** | `cinema_pass` |
| **Port** | `5432` (exposed to host) |
| **Container Name** | `cinema_postgres` |
| **Docker Network** | `cinema_network` |

---

## 🔧 **Setting Up pgAdmin Connection**

### **Step 1: Access pgAdmin**
- **URL**: `http://localhost:8080`
- **Login Email**: `admin@cinema.com`
- **Login Password**: `admin123`

### **Step 2: Add New Server Connection**
1. **Right-click** on "Servers" in the left panel (Object Explorer)
2. Select **"Create"** → **"Server..."**

### **Step 3: Configure Connection - General Tab**
```
Name: Cinema Management Database
Server Group: Servers (default)
Comments: Multi-Tenant Cinema Management System
```

### **Step 4: Configure Connection - Connection Tab**

#### **Option A: Internal Docker Network (Recommended)**
```
Host name/address: postgres
Port: 5432
Maintenance database: cinema_management
Username: cinema_user
Password: cinema_pass
```

#### **Option B: External Host Connection**
```
Host name/address: localhost
Port: 5432
Maintenance database: cinema_management
Username: cinema_user
Password: cinema_pass
```

### **Step 5: Advanced Settings (Optional)**
```
Connection Timeout: 10 seconds
SSL Mode: Prefer (or Disable if SSL errors occur)
```

### **Step 6: Save & Connect**
1. Click **"Save"** to create the connection
2. The server should appear under "Servers" in the left panel
3. Click to expand and explore the database

---

## 📊 **Multi-Tenant Database Structure**

### **Core Multi-Tenant Tables**

#### **Company Management**
- `company` - Cinema companies (tenants)
- `company_subscription` - Subscription plans and limits
- `system_admin` - Cross-tenant administrators

#### **Business Tables (All Multi-Tenant)**
- `movie` - Movies per company
- `session` - Movie sessions per company
- `employee` - Employees per company
- `customer` - Customers per company
- `ticket` - Tickets per company
- `sale` - Sales per company
- `sale_item` - Sale items per company
- `payment` - Payments per company
- `room` - Cinema rooms per company
- `inventory_item` - Inventory per company
- `discount_code` - Discount codes per company
- `audit_log` - Activity logs per company
- `time_entry` - Employee time tracking per company

### **Key Multi-Tenant Fields**
All business tables include:
- `company_id` - UUID foreign key to company table
- Compound primary keys where applicable (e.g., `[cpf, company_id]` for employees)

---

## 🔍 **Useful Database Queries**

### **Verify Multi-Tenant Setup**

```sql
-- Check all companies
SELECT id, name, cnpj, "tradeName", "isActive"
FROM company
ORDER BY "createdAt";

-- Check data distribution per company
SELECT
    c.name as company_name,
    COUNT(DISTINCT m.id) as movies,
    COUNT(DISTINCT e.cpf) as employees,
    COUNT(DISTINCT cu.cpf) as customers,
    COUNT(DISTINCT s.id) as sessions,
    COUNT(DISTINCT t.id) as tickets
FROM company c
LEFT JOIN movie m ON c.id = m."companyId"
LEFT JOIN employee e ON c.id = e."companyId"
LEFT JOIN customer cu ON c.id = cu."companyId"
LEFT JOIN session s ON c.id = s."companyId"
LEFT JOIN ticket t ON c.id = t."companyId"
GROUP BY c.id, c.name
ORDER BY c.name;
```

### **Tenant Data Isolation Verification**

```sql
-- Movies per company (should be 3 each)
SELECT "companyId", COUNT(*) as movie_count
FROM movie
GROUP BY "companyId"
ORDER BY "companyId";

-- Employees per company (should be 3 each)
SELECT "companyId", COUNT(*) as employee_count
FROM employee
GROUP BY "companyId"
ORDER BY "companyId";

-- Sessions per company (should be 21 each)
SELECT "companyId", COUNT(*) as session_count
FROM session
GROUP BY "companyId"
ORDER BY "companyId";
```

### **System Admin Queries**

```sql
-- System administrators
SELECT id, username, email, "isActive", "lastLogin"
FROM system_admin;

-- Company subscriptions
SELECT
    c.name as company_name,
    cs.plan,
    cs."maxEmployees",
    cs."maxRooms",
    cs."monthlyFee",
    cs."isActive"
FROM company c
JOIN company_subscription cs ON c.id = cs."companyId"
ORDER BY c.name;
```

### **Platform Statistics**

```sql
-- Platform overview
SELECT
    'Total Companies' as metric,
    COUNT(*)::text as value
FROM company
WHERE "isActive" = true

UNION ALL

SELECT
    'Total Active Employees',
    COUNT(*)::text
FROM employee
WHERE "isActive" = true

UNION ALL

SELECT
    'Total Customers',
    COUNT(*)::text
FROM customer

UNION ALL

SELECT
    'Total Movies',
    COUNT(*)::text
FROM movie
WHERE "isActive" = true;
```

---

## 🚨 **Troubleshooting Database Connection**

### **Connection Failed Issues**

#### **Check Container Status**
```bash
# Verify all containers are running
docker-compose ps

# Check specific database container
docker-compose logs postgres --tail 20
```

#### **Test Database Connection**
```bash
# Test connection from host
docker-compose exec postgres psql -U cinema_user -d cinema_management -c "SELECT version();"

# Test pgAdmin container
docker-compose logs pgadmin --tail 20
```

#### **Common Solutions**

1. **Use correct hostname**:
   - Inside Docker network: `postgres`
   - From host machine: `localhost` or `127.0.0.1`

2. **Check firewall/ports**:
   - PostgreSQL: port 5432 should be accessible
   - pgAdmin: port 8080 should be accessible

3. **Restart containers if needed**:
   ```bash
   docker-compose restart postgres pgadmin
   ```

### **SSL Connection Issues**
If you get SSL errors, change SSL mode to:
- **SSL Mode**: `Disable`
- **SSL Compression**: `False`

### **Permission Issues**
If you can't access certain schemas or tables:
1. Verify you're using the correct credentials
2. Check that `cinema_user` has proper permissions
3. Ensure you're connected to the `cinema_management` database

---

## 📝 **Database Backup & Restore**

### **Create Backup**
```bash
# Full database backup
docker-compose exec postgres pg_dump -U cinema_user -d cinema_management > backup_$(date +%Y%m%d_%H%M%S).sql

# Schema-only backup
docker-compose exec postgres pg_dump -U cinema_user -d cinema_management -s > schema_backup.sql
```

### **Restore from Backup**
```bash
# Restore full backup
docker-compose exec -T postgres psql -U cinema_user -d cinema_management < backup_file.sql
```

### **Reset Database (Development Only)**
```bash
# WARNING: This will delete all data
docker-compose down --volumes
docker-compose up -d postgres pgadmin
docker-compose exec api npm run seed:multitenant
```

---

## 🔐 **Security Notes**

### **Production Considerations**
- Change default passwords in production
- Use environment-specific credentials
- Enable SSL connections for production
- Restrict network access to database ports
- Regular security updates for PostgreSQL and pgAdmin

### **Development Safety**
- Current setup is designed for development
- Default credentials are documented for easy access
- Database is exposed on localhost for development tools
- All data is containerized and easily replaceable

---

## 📚 **Related Documentation**

- [Multi-Tenant Testing Guide](./multi_tenant_testing_guide.md) - How to test the multi-tenant system
- [Authentication Guide](./authentication_guide.md) - Multi-tenant authentication setup
- [API Documentation](http://localhost:3000/api/docs/) - Swagger API documentation

**🗄️ Your database is now fully accessible and documented for development and administration!**