# Expander360 Backend API

A comprehensive NestJS backend API for managing expansion projects, vendor matching, and research documents.

## 🚀 Features

- **JWT Authentication** with role-based access control (Client/Admin)
- **Project Management** with intelligent vendor matching
- **Vendor Management** with service and country support
- **Analytics** with cross-database queries
- **Document Storage** (MongoDB integration)
- **MySQL Database** with normalized schema
- **TypeORM** for database operations
- **Comprehensive API** with proper validation

## 🏗️ Architecture

- **Framework**: NestJS with TypeScript
- **Database**: MySQL (primary) + MongoDB (documents)
- **ORM**: TypeORM for MySQL, Mongoose for MongoDB
- **Authentication**: JWT with Passport.js
- **Validation**: Class-validator DTOs
- **Security**: Role-based guards and ownership validation

## 📋 Prerequisites

- Node.js 18+
- MySQL 8.0+
- MongoDB 6.0+ (for document storage)
- npm or yarn

## 🛠️ Installation

1. **Clone and Install Dependencies:**
```bash
   cd app
   npm install
   ```

2. **Environment Configuration:**
   Create a `.env` file in the `app` directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=expander_user
   DB_PASSWORD=your_secure_password
   DB_NAME=expander360

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/expander360

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   JWT_EXPIRES_IN=24h

   # Server Configuration
   PORT=3000
   NODE_ENV=development
   ```

3. **Database Setup:**
```bash
   # Run migrations
   npm run migration:run

   # Seed initial data
   npm run seed
   ```

4. **Start Development Server:**
   ```bash
   npm run start:dev
   ```

## 🔐 Authentication & Authorization

### User Roles
- **Client**: Can manage their own projects and view matches
- **Admin**: Full access to all resources and analytics

### JWT Configuration
- **Secret**: Configured via `JWT_SECRET` environment variable
- **Expiration**: Default 24 hours, configurable via `JWT_EXPIRES_IN`
- **Algorithm**: HS256 (HMAC SHA-256)

### Protected Endpoints
All endpoints (except auth) require JWT authentication via Bearer token.

## 📊 Database Schema

### Core Tables
- **users**: Authentication and role management
- **clients**: Company information and contact details
- **projects**: Expansion project details with requirements
- **vendors**: Service providers with capabilities
- **services**: Available service categories
- **countries**: Geographic support regions
- **matches**: Project-vendor compatibility scores

### Junction Tables
- **vendor_services**: Vendor-service relationships
- **vendor_countries**: Vendor geographic coverage
- **project_services**: Project service requirements

## 🚀 API Endpoints

### Authentication
- `POST /auth/register` - Client registration
- `POST /auth/login` - User login

### Clients (Protected)
- `GET /clients` - List all clients (Admin only)
- `GET /clients/:id` - Get client details (Owner/Admin)
- `POST /clients` - Create client (Admin only)
- `PATCH /clients/:id` - Update client (Owner/Admin)
- `DELETE /clients/:id` - Delete client (Admin only)

### Projects (Protected)
- `GET /projects` - List projects (Client sees own, Admin sees all)
- `GET /projects/:id` - Get project details (Owner/Admin)
- `POST /projects` - Create project (Client only)
- `PATCH /projects/:id` - Update project (Owner/Admin)
- `DELETE /projects/:id` - Delete project (Owner/Admin)
- `POST /projects/:id/matches/rebuild` - Rebuild vendor matches

### Vendors (Protected)
- `GET /vendors` - List all vendors (Admin only)
- `GET /vendors/:id` - Get vendor details (Admin only)
- `POST /vendors` - Create vendor (Admin only)
- `PATCH /vendors/:id` - Update vendor (Admin only)
- `DELETE /vendors/:id` - Delete vendor (Admin only)

### Matches (Protected)
- `GET /matches` - List matches (Client sees own, Admin sees all)
- `GET /matches/:id` - Get match details (Owner/Admin)
- `GET /matches/project/:projectId` - Get matches for project
- `GET /matches/vendor/:vendorId` - Get matches for vendor (Admin only)
- `DELETE /matches/:id` - Delete match (Admin only)

### Analytics (Protected)
- `GET /analytics/top-vendors` - Top vendors by country (Admin only)

## 🔒 Security Features

### Role-Based Access Control
- **Client Endpoints**: Limited to own data
- **Admin Endpoints**: Full system access
- **Ownership Validation**: Clients can only access their resources

### JWT Security
- **Token Validation**: Automatic token verification
- **Role Extraction**: User roles embedded in tokens
- **Expiration Handling**: Automatic token expiration

### Data Protection
- **Password Hashing**: Bcrypt with salt rounds
- **SQL Injection Prevention**: Parameterized queries
- **Input Validation**: DTO-based request validation

## 🧪 Testing

### Manual Testing
1. **Register a new client:**
```bash
   curl -X POST http://localhost:3000/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "client@example.com",
       "password": "password123",
       "company_name": "Example Corp",
       "contact_email": "contact@example.com"
     }'
   ```

2. **Login:**
   ```bash
   curl -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "client@example.com",
       "password": "password123"
     }'
   ```

3. **Use the returned JWT token for authenticated requests:**
   ```bash
   curl -X GET http://localhost:3000/projects \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

## 🐳 Docker Deployment

### Docker Compose
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=mysql
      - MONGODB_URI=mongodb://mongo:27017/expander360
    depends_on:
      - mysql
      - mongo

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: expander360
      MYSQL_USER: expander_user
      MYSQL_PASSWORD: your_password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  mongo:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mysql_data:
  mongo_data:
```

## 📝 Development Commands

```bash
# Development
npm run start:dev          # Start with hot reload
npm run build             # Build for production
npm run start             # Start production build

# Database
npm run migration:generate # Generate new migration
npm run migration:run     # Run pending migrations
npm run migration:revert  # Revert last migration

# Seeding
npm run seed              # Run all seeders
npm run seed:countries    # Seed countries only
npm run seed:services     # Seed services only
npm run seed:admin        # Seed admin user only
```

## 🔧 Configuration

### Environment Variables
- **Database**: Host, port, credentials, name
- **JWT**: Secret key, expiration time
- **MongoDB**: Connection URI
- **Server**: Port, environment

### Database Indexes
- **Primary Keys**: All tables have auto-incrementing IDs
- **Foreign Keys**: Properly indexed for performance
- **Unique Constraints**: Email addresses, country codes
- **Composite Indexes**: Optimized for common queries

## 🚀 Next Steps

- [ ] Implement document upload/download
- [ ] Add email notifications
- [ ] Implement scheduled jobs
- [ ] Add comprehensive logging
- [ ] Implement rate limiting
- [ ] Add API documentation (Swagger)
- [ ] Implement caching layer
- [ ] Add monitoring and health checks

---

**Built with ❤️ using NestJS**
