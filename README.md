# Expander360 - Vendor Matching Platform

A NestJS-based platfom that matches expansion projects with qualified vendors across different countries.

Live Demo: [http://109.106.244.241:3001](http://109.106.244.241:3001)

## 🔧 Setup & Installation

### Using Docker (Recommended)
1. Clone the repository:
```bash
git clone https://github.com/Mohamedaboda-bit/expanders360_task.git
cd app
```

2. Create .env file:
```bash
cp .env.example .env
```

3. Start with Docker:
```bash
docker-compose up -d
```

That's it! Docker will handle migrations and seeding automatically.

### Local Development
1. Prerequisites:
   - Node.js 18+
   - MySQL 8.0+
   - MongoDB 6.0+

2. Install dependencies:
```bash
npm install
```

3. Create and configure .env file:
```bash
cp .env.example .env
# Edit .env file with your local database credentials
```

4. Run migrations and seeds:
```bash
npm run migration:run
npm run seed
```

5. Start the application:
```bash
npm run start:dev
```

## 📊 Database Schema

```mermaid
erDiagram
    clients ||--o{ projects : has
    projects ||--o{ matches : has
    projects }|--|| project_services : has
    vendors ||--o{ matches : has
    vendors }|--|| vendor_services : has
    vendors }|--|| vendor_countries : has
    
    clients {
        int id PK
        string company_name
        string contact_email
    }

    projects {
        int id PK
        int client_id FK
        string country_code
        float budget
        string status
    }

    project_services {
        int project_id FK
        int service_id FK
    }

    vendors {
        int id PK
        string name
        float rating
        int response_sla_hours
        string sla_status
    }

    vendor_countries {
        int vendor_id FK
        string country_code
    }

    vendor_services {
        int vendor_id FK
        int service_id FK
    }

    matches {
        int id PK
        int project_id FK
        int vendor_id FK
        float score
        datetime created_at
    }
```

The platform uses a dual-database architecture:
- **MySQL**: For core business data and relationships
- **MongoDB**: For document storage and full-text search capabilities


## � API Endpoints

Full API documentation with examples and request/response schemas is available in our [Postman Collection](https://documenter.getpostman.com/view/22818117/2sB3BLk8CL)

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

## �📝 Development

### Commands
```bash
# Development
npm run start:dev      # Start with hot reload
npm run build         # Build for production
npm run start         # Start production build

# Database Management
npm run migration:run # Run migrations
npm run seed         # Run all seeders

```

### Configuration
- **Database**: Configure in `.env` file
  ```
  DB_HOST=localhost
  DB_PORT=3306
  DB_USER=your_user
  DB_PASS=your_pass
  DB_NAME=expander360
  ```
- **MongoDB**: Set connection URI
  ```
  MONGODB_URI=mongodb://localhost:27017/expander360
  ```
- **JWT**: Security settings
  ```
  JWT_SECRET=your_secret_key
  JWT_EXPIRES_IN=24h
  ```



---

**Built with ❤️ using NestJS**
