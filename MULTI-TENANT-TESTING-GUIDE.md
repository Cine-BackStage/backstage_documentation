# 🧪 Multi-Tenant Cinema Management System - Testing Guide

## 📋 **Overview**

This guide walks you through testing the multi-tenant architecture of the Cinema Management System. The system supports multiple cinema companies with complete data isolation and cross-tenant administration capabilities.

## 🏢 **Multi-Tenant Architecture**

### **Available Tenants**
1. **CineMax Entertainment**
   - Company ID: `11111111-1111-1111-1111-111111111111`
   - Plan: Basic (50 employees, 10 rooms)
   - Employees: ADM001, MGR001, CSH001

2. **MovieTime Cinemas**
   - Company ID: `22222222-2222-2222-2222-222222222222`
   - Plan: Basic (50 employees, 10 rooms)
   - Employees: ADM002, MGR002, CSH002

3. **Premium Screens**
   - Company ID: `33333333-3333-3333-3333-333333333333`
   - Plan: Premium (100 employees, 20 rooms)
   - Employees: ADM003, MGR003, CSH003

### **System Administrator**
- Username: `sysadmin`
- Cross-tenant access to all companies
- Platform management capabilities

---

## 🔐 **Authentication Setup**

### **1. Access Swagger Documentation**
Navigate to: `http://localhost:3000/api/docs/`

### **2. Generate Authentication Tokens**

#### **For Tenant Testing:**
```bash
# CineMax Entertainment Token
docker-compose exec api npm run token:multitenant 11111111-1111-1111-1111-111111111111 ADM001

# MovieTime Cinemas Token
docker-compose exec api npm run token:multitenant 22222222-2222-2222-2222-222222222222 ADM002

# Premium Screens Token
docker-compose exec api npm run token:multitenant 33333333-3333-3333-3333-333333333333 ADM003
```

#### **For System Admin Testing:**
```bash
# System Administrator Token
docker-compose exec api npm run token:sysadmin sysadmin
```

**⚠️ Important:** Copy tokens **WITHOUT** the "Bearer " prefix for Swagger authentication.

---

## 🎯 **Test Scenarios**

### **Scenario 1: Tenant Data Isolation**

#### **Step 1: Authenticate as CineMax**
1. In Swagger, click **🔒 Authorize** button
2. Paste **CineMax token** (without "Bearer ")
3. Click **Authorize**, then **Close**

#### **Step 2: Test CineMax Data Access**
Execute these endpoints and verify results:

| Endpoint | Expected Result |
|----------|----------------|
| `GET /api/movies` | **3 movies**: Action Hero 4, Space Adventure, Comedy Night |
| `GET /api/employees` | **3 employees**: ADM001, MGR001, CSH001 |
| `GET /api/sessions` | **21 sessions** (CineMax rooms only) |

#### **Step 3: Switch to MovieTime**
1. Click **🔒 Authorize** again
2. Clear previous token and paste **MovieTime token**
3. Click **Authorize**, then **Close**

#### **Step 4: Verify Data Isolation**
| Endpoint | Expected Result |
|----------|----------------|
| `GET /api/movies` | **3 different movies**: Drama of Hearts, Horror Mansion, Family Fun |
| `GET /api/employees` | **3 different employees**: ADM002, MGR002, CSH002 |
| `GET /api/sessions` | **21 different sessions** (MovieTime rooms only) |

**✅ Success Criteria:** You cannot see any CineMax data when authenticated as MovieTime.

---

### **Scenario 2: System Admin Cross-Tenant Access**

#### **Step 1: Authenticate as System Admin**
1. Click **🔒 Authorize**
2. Clear previous token and paste **System Admin token**
3. Click **Authorize**, then **Close**

#### **Step 2: Test System Admin Capabilities**

##### **A) Cross-Tenant Company Management**
- `GET /api/system-admin/companies` → Should return **3 companies**

##### **B) Platform Statistics**
- `GET /api/system-admin/stats` → Should show:
  ```json
  {
    "platform": {
      "totalCompanies": 3,
      "activeCompanies": 3
    },
    "users": {
      "totalEmployees": 9,
      "totalCustomers": 6
    }
  }
  ```

##### **C) Company-Specific Data Access**
- `GET /api/system-admin/companies/11111111-1111-1111-1111-111111111111/employees` → CineMax employees
- `GET /api/system-admin/companies/22222222-2222-2222-2222-222222222222/employees` → MovieTime employees

#### **Step 3: Verify Security Isolation**
- `GET /api/movies` → Should return **401 Unauthorized** (System admin cannot access tenant endpoints)

**✅ Success Criteria:** System admin can access all company data via system admin endpoints but is blocked from regular tenant endpoints.

---

### **Scenario 3: Data Consistency Verification**

#### **Test Cross-Tenant Data Consistency**
1. **As System Admin**: Note total counts from `GET /api/system-admin/stats`
2. **As CineMax**: Count items from `GET /api/movies`, `GET /api/employees`
3. **As MovieTime**: Count items from `GET /api/movies`, `GET /api/employees`
4. **As Premium**: Count items from `GET /api/movies`, `GET /api/employees`
5. **Verify**: Individual tenant counts should sum to system admin totals

**Expected Totals:**
- **Movies**: 9 total (3 per tenant)
- **Employees**: 9 total (3 per tenant)
- **Customers**: 6 total (2 per tenant)
- **Companies**: 3 total

---

## ✅ **Expected Test Results Matrix**

| Authentication Type | Movies Visible | Employees Visible | Companies Visible | Admin Endpoints |
|-------------------|----------------|-------------------|-------------------|-----------------|
| **CineMax Token** | 3 (CineMax only) | 3 (CineMax only) | 1 (own company) | ❌ No access |
| **MovieTime Token** | 3 (MovieTime only) | 3 (MovieTime only) | 1 (own company) | ❌ No access |
| **Premium Token** | 3 (Premium only) | 3 (Premium only) | 1 (own company) | ❌ No access |
| **System Admin Token** | ❌ No access | ❌ No access | 3 (all companies) | ✅ Full access |

---

## 🔍 **Troubleshooting**

### **Common Issues**

#### **Token Not Working**
- Ensure you copied token **without** "Bearer " prefix
- Tokens expire in 8 hours - generate fresh ones
- Check for extra spaces when pasting

#### **Getting 401 Errors**
- Click **🔒 Authorize** and re-enter your token
- Verify the token format is correct
- Ensure you're using the right token type for the endpoint

#### **No System Admin Endpoints Visible**
- Refresh the Swagger page
- Verify the API container is running: `docker-compose ps api`

#### **Wrong Data Count**
- Verify you're testing with fresh seeded data: `docker-compose exec api npm run seed:multitenant`
- Check that you're using the correct company ID for token generation

---

## 🚀 **Quick Test Commands**

For command-line testing:

```bash
# Test tenant isolation (should each return 3)
curl -H "Authorization: Bearer [CINEMAX_TOKEN]" http://localhost:3000/api/movies | jq '.count'
curl -H "Authorization: Bearer [MOVIETIME_TOKEN]" http://localhost:3000/api/movies | jq '.count'
curl -H "Authorization: Bearer [PREMIUM_TOKEN]" http://localhost:3000/api/movies | jq '.count'

# Test system admin (should return 3)
curl -H "Authorization: Bearer [SYSADMIN_TOKEN]" http://localhost:3000/api/system-admin/companies | jq '.data | length'

# Test security isolation (should return 401)
curl -H "Authorization: Bearer [SYSADMIN_TOKEN]" http://localhost:3000/api/movies
```

---

## 🎉 **Success Confirmation**

Your multi-tenant system is working correctly when:

1. ✅ **Tenant Isolation**: Each tenant sees only their own data (3 movies, 3 employees, 2 customers)
2. ✅ **System Admin Access**: Admin can view all companies via system admin endpoints
3. ✅ **Security Boundaries**: System admin cannot access tenant endpoints
4. ✅ **Data Consistency**: Individual tenant counts sum to platform totals
5. ✅ **Authentication Control**: Tokens properly control access to appropriate endpoints

**🎬 Congratulations! Your Multi-Tenant Cinema Management SaaS Platform is fully operational!**