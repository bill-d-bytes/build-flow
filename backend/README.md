# Construction Material Supply Backend API

Backend API for the Construction Material Supply & Collaboration Web Application.

## Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Product Management**: CRUD operations for construction materials
- **Order Management**: Complete order processing workflow
- **Supplier Management**: Supplier registration and verification
- **Database Integration**: MongoDB with Mongoose ODM
- **Security**: Helmet, CORS, input validation, error handling
- **TypeScript**: Full TypeScript support with type safety

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: express-validator
- **Security**: Helmet, bcryptjs
- **Language**: TypeScript

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start MongoDB (make sure MongoDB is running on your system)

4. Run the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product (suppliers only)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/categories` - Get product categories
- `GET /api/products/supplier/:supplierId` - Get products by supplier

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (admin/supplier)
- `PUT /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/all` - Get all orders (admin only)

## Database Models

### User
- Personal information (name, email, phone)
- Role-based access (contractor, engineer, supplier, project_manager, admin)
- Company details (GST, PAN, address)
- Authentication and verification status

### Product
- Product details (name, description, specifications)
- Pricing and inventory management
- Supplier association
- Location and availability
- Ratings and reviews

### Order
- Order items and quantities
- Customer and shipping information
- Order status and tracking
- Payment and delivery details

## Environment Variables

```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/construction_materials_db
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:8081
```

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## API Documentation

Visit `http://localhost:3001/api` for complete API documentation.

## Health Check

Visit `http://localhost:3001/health` to check server status.
