# 🗄️ Database Schema Documentation

This document provides comprehensive documentation of the Backstage Cinema database schema, including tables, relationships, and data types.

## 📋 Overview

The cinema management system uses **PostgreSQL 15** as its primary database, following a relational design that supports:

- Movie catalog and session management
- Customer and employee management  
- Ticket sales and seat reservations
- Point of sale and inventory tracking
- Discount codes and promotions
- Comprehensive audit logging

## 🎬 Core Entities

### Movies and Sessions

```sql
-- Movies catalog
CREATE TABLE movie (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  duration_min INTEGER NOT NULL,
  genre VARCHAR(80),
  description TEXT,
  rating VARCHAR(10), -- G, PG, PG-13, R, NC-17, NR
  poster_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Theater rooms
CREATE TABLE room (
  id SERIAL PRIMARY KEY,
  name VARCHAR(80) UNIQUE NOT NULL,
  capacity INTEGER NOT NULL,
  room_type room_type NOT NULL, -- TWO_D, THREE_D, EXTREME
  seatmap_id INTEGER REFERENCES seat_map(id)
);

-- Movie sessions
CREATE TABLE session (
  id SERIAL PRIMARY KEY,
  movie_id INTEGER REFERENCES movie(id),
  room_id INTEGER REFERENCES room(id),
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status session_status DEFAULT 'SCHEDULED'
);
```

### Seat Management

```sql
-- Seat map configuration
CREATE TABLE seat_map (
  id SERIAL PRIMARY KEY,
  rows INTEGER NOT NULL,
  cols INTEGER NOT NULL,
  version INTEGER DEFAULT 1
);

-- Individual seats
CREATE TABLE seat (
  seatmap_id INTEGER REFERENCES seat_map(id),
  id VARCHAR(10), -- e.g., "A10"
  row_label VARCHAR(10) NOT NULL,
  number INTEGER NOT NULL,
  is_accessible BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (seatmap_id, id),
  UNIQUE (seatmap_id, row_label, number)
);
```

## 👥 People Management

### Person Hierarchy

```sql
-- Base person entity
CREATE TABLE person (
  cpf CHAR(11) PRIMARY KEY, -- Brazilian ID number
  full_name VARCHAR(200) NOT NULL,
  email VARCHAR(200) UNIQUE NOT NULL,
  phone VARCHAR(40),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customer extension
CREATE TABLE customer (
  cpf CHAR(11) PRIMARY KEY REFERENCES person(cpf) ON DELETE CASCADE,
  birth_date DATE
);

-- Employee extension  
CREATE TABLE employee (
  cpf CHAR(11) PRIMARY KEY REFERENCES person(cpf) ON DELETE CASCADE,
  employee_id VARCHAR(40) UNIQUE NOT NULL,
  role VARCHAR(80) NOT NULL,
  hire_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);

-- Administrator extension
CREATE TABLE admin (
  cpf CHAR(11) PRIMARY KEY REFERENCES employee(cpf) ON DELETE CASCADE,
  permissions TEXT
);
```

## 🎫 Sales and Transactions

### Ticket Sales

```sql
-- Individual tickets
CREATE TABLE ticket (
  id SERIAL PRIMARY KEY,
  session_id INTEGER REFERENCES session(id),
  seatmap_id INTEGER,
  seat_id VARCHAR(10),
  price DECIMAL(10,2) NOT NULL,
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (seatmap_id, seat_id) REFERENCES seat(seatmap_id, id),
  UNIQUE (session_id, seatmap_id, seat_id)
);
```

### Point of Sale

```sql
-- Sales transactions
CREATE TABLE sale (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status sale_status DEFAULT 'OPEN',
  buyer_cpf CHAR(11) REFERENCES customer(cpf),
  cashier_cpf CHAR(11) REFERENCES employee(cpf),
  sub_total DECIMAL(10,2) DEFAULT 0,
  discount_total DECIMAL(10,2) DEFAULT 0,
  grand_total DECIMAL(10,2) DEFAULT 0
);

-- Sale line items
CREATE TABLE sale_item (
  id SERIAL PRIMARY KEY,
  sale_id INTEGER REFERENCES sale(id) ON DELETE CASCADE,
  description VARCHAR(200) NOT NULL,
  sku VARCHAR(40) REFERENCES inventory_item(sku),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  line_total DECIMAL(10,2) NOT NULL
);

-- Payment records
CREATE TABLE payment (
  id SERIAL PRIMARY KEY,
  sale_id INTEGER REFERENCES sale(id) ON DELETE CASCADE,
  method payment_method NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  auth_code VARCHAR(60),
  paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🏪 Inventory Management

### Inventory Items

```sql
-- Base inventory items
CREATE TABLE inventory_item (
  sku VARCHAR(40) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  qty_on_hand INTEGER DEFAULT 0,
  reorder_level INTEGER DEFAULT 0,
  barcode VARCHAR(64)
);

-- Food items
CREATE TABLE food (
  sku VARCHAR(40) PRIMARY KEY REFERENCES inventory_item(sku) ON DELETE CASCADE,
  expiry_date DATE,
  is_combo BOOLEAN DEFAULT FALSE
);

-- Collectible items  
CREATE TABLE collectable (
  sku VARCHAR(40) PRIMARY KEY REFERENCES inventory_item(sku) ON DELETE CASCADE,
  category VARCHAR(80),
  brand VARCHAR(80)
);

-- Inventory adjustments
CREATE TABLE inventory_adjustment (
  id SERIAL PRIMARY KEY,
  sku VARCHAR(40) REFERENCES inventory_item(sku),
  delta INTEGER NOT NULL,
  reason VARCHAR(120),
  actor_cpf CHAR(11) REFERENCES person(cpf),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎟️ Discounts and Promotions

```sql
-- Discount codes
CREATE TABLE discount_code (
  code VARCHAR(40) PRIMARY KEY,
  description VARCHAR(200),
  type discount_type NOT NULL, -- PERCENT, AMOUNT
  value DECIMAL(10,2) NOT NULL,
  valid_from TIMESTAMP NOT NULL,
  valid_to TIMESTAMP NOT NULL,
  cpf_range_start CHAR(11),
  cpf_range_end CHAR(11)
);

-- Applied discounts
CREATE TABLE sale_discount (
  sale_id INTEGER REFERENCES sale(id) ON DELETE CASCADE,
  code VARCHAR(40) REFERENCES discount_code(code),
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (sale_id, code)
);
```

## 📊 System Tables

### Audit and Pricing

```sql
-- Audit log
CREATE TABLE audit_log (
  id SERIAL PRIMARY KEY,
  actor_cpf CHAR(11) REFERENCES person(cpf),
  action VARCHAR(80) NOT NULL,
  target_type VARCHAR(60) NOT NULL,
  target_id VARCHAR(60) NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  metadata_json TEXT
);

-- Room type pricing
CREATE TABLE room_type_price (
  room_type room_type PRIMARY KEY,
  price DECIMAL(10,2) NOT NULL
);
```

## 🔢 Enums

The database uses custom enum types for controlled values:

```sql
-- Sale statuses
CREATE TYPE sale_status AS ENUM ('OPEN', 'FINALIZED', 'CANCELED', 'REFUNDED');

-- Payment methods
CREATE TYPE payment_method AS ENUM ('CASH', 'CARD', 'PIX', 'OTHER');

-- Session statuses  
CREATE TYPE session_status AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'CANCELED', 'COMPLETED');

-- Room types
CREATE TYPE room_type AS ENUM ('TWO_D', 'THREE_D', 'EXTREME');

-- Discount types
CREATE TYPE discount_type AS ENUM ('PERCENT', 'AMOUNT');
```

## 📈 Indexes

Performance indexes are created for frequently queried columns:

```sql
-- Person and authentication
CREATE INDEX idx_person_email ON person(email);
CREATE INDEX idx_employee_active ON employee(is_active);

-- Sessions and scheduling
CREATE INDEX idx_session_start_time ON session(start_time);
CREATE INDEX idx_session_movie_room ON session(movie_id, room_id);

-- Tickets and sales
CREATE INDEX idx_ticket_session ON ticket(session_id);
CREATE INDEX idx_sale_created_at ON sale(created_at);
CREATE INDEX idx_sale_buyer ON sale(buyer_cpf);

-- Inventory
CREATE INDEX idx_inventory_qty ON inventory_item(qty_on_hand);

-- Audit logging
CREATE INDEX idx_audit_log_timestamp ON audit_log(timestamp);
CREATE INDEX idx_audit_log_actor ON audit_log(actor_cpf);
```

## 🔗 Key Relationships

### Entity Relationships

1. **Movie → Session → Ticket**: Movies are scheduled as sessions, sessions sell tickets
2. **Room → Session**: Sessions occur in specific rooms with defined capacity
3. **Person → Customer/Employee**: People can be customers, employees, or both
4. **Sale → SaleItem**: Sales contain multiple line items
5. **InventoryItem → Food/Collectable**: Items are specialized by type
6. **Session → Seat**: Sessions manage seat availability through seat maps

### Referential Integrity

- **CASCADE DELETE**: Sale items are deleted when sales are deleted
- **RESTRICT DELETE**: Cannot delete movies with existing sessions
- **FOREIGN KEY CONSTRAINTS**: Maintain data consistency across all relationships

## 🛠️ Database Operations

### Connection Details

```bash
# Development environment
Host: localhost
Port: 5432
Database: cinema_management
User: cinema_user
Password: cinema_pass
```

### Common Queries

#### Get Movie Sessions with Availability
```sql
SELECT 
  s.id as session_id,
  m.title as movie_title,
  r.name as room_name,
  s.start_time,
  (r.capacity - COALESCE(ticket_count.sold, 0)) as available_seats
FROM session s
JOIN movie m ON s.movie_id = m.id
JOIN room r ON s.room_id = r.id
LEFT JOIN (
  SELECT session_id, COUNT(*) as sold
  FROM ticket
  GROUP BY session_id
) ticket_count ON s.id = ticket_count.session_id
WHERE s.start_time > CURRENT_TIMESTAMP
ORDER BY s.start_time;
```

#### Get Sales with Items
```sql
SELECT 
  s.id as sale_id,
  s.grand_total,
  si.description,
  si.quantity,
  si.unit_price
FROM sale s
JOIN sale_item si ON s.id = si.sale_id
WHERE s.status = 'FINALIZED'
ORDER BY s.created_at DESC;
```

## 📚 Migration History

The database schema supports migrations for version control:

1. **v1.0**: Initial schema with core entities
2. **v1.1**: Added movie rating and poster fields  
3. **v1.2**: Enhanced audit logging
4. **Future**: Authentication tables, reporting views

## 🔒 Security Considerations

- **No plain text passwords**: Future authentication will use bcrypt
- **Input validation**: All inputs validated at application layer
- **SQL injection prevention**: Parameterized queries used throughout
- **Audit trail**: All significant operations are logged
- **Data privacy**: Customer data protected according to privacy regulations

## 📖 Additional Documentation

- [API Documentation](./api_documentation.md)
- [Class Diagram](./classes_diagram.md)  
- [User Stories](./epics_and_user_stories.md)

For database administration and maintenance procedures, see the backend repository's database documentation.