# Event Management API

A robust backend system for a virtual event management platform built with Node.js and Express.js. This API provides comprehensive functionality for user registration, event scheduling, and participant management with secure authentication and email notifications.

## Features

- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **Event Management**: Complete CRUD operations for events
- **User Management**: User registration, login, and profile management
- **Event Registration**: Users can register for events with email confirmations
- **Email Notifications**: Automated email notifications for registration and event updates
- **Database Support**: PostgreSQL database with migration system
- **Data Validation**: Comprehensive input validation using Joi
- **Authorization**: Role-based access control for event management

## Project Structure

```
event-management-api/
├── app.js                      # Main application entry point
├── package.json               # NPM dependencies and scripts
├── .gitignore                # Git ignore rules
│
├── configs/                   # Configuration files
│   ├── config.json           # Environment-specific database configurations
│   └── dbConfig.js           # Database connection configuration
│
├── controllers/               # Request handlers
│   ├── eventsController.js   # Event-related route handlers
│   └── usersController.js    # User-related route handlers
│
├── routes/                    # API route definitions
│   ├── eventsRoutes.js       # Event endpoints routing
│   └── usersRoutes.js        # User endpoints routing
│
├── services/                  # Business logic layer
│   ├── dbConnectionService.js # Database connection service
│   ├── emailService.js       # Email notification service
│   ├── eventService.js       # Event business logic
│   ├── eventsServices.js     # Additional event services
│   ├── userService.js        # User business logic
│   └── usersService.js       # Additional user services
│
├── middlewares/               # Express middleware functions
│   ├── auth.js               # Authentication middleware
│   ├── validateEvent.js      # Event validation middleware
│   ├── validateUser.js       # User validation middleware
│   ├── validateUserLogin.js  # Login validation middleware
│   └── validateRegisterUser.js # Registration validation middleware
│
├── schemas/                   # Data validation schemas
│   ├── eventSchema.js        # Event data validation schemas
│   └── userSchemas.js        # User data validation schemas
│
└── migrations/                # Database migrations
    ├── migrate.js            # Migration runner script
    ├── migratedFiles.txt     # Track completed migrations
    ├── order.txt            # Migration order tracking
    └── migrationFiles/      # SQL migration files
        ├── 20250420_create_users_tables.sql
        └── 20250421_create_events_tables.sql
```

## API Endpoints

### Authentication Endpoints

#### POST `/v1/users/register`
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "address": "123 Main St, City, Country"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### POST `/v1/users/login`
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### User Profile Endpoints

#### GET `/v1/users/me`
Get current user's profile information.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "address": "123 Main St, City, Country",
  "created_at": "2024-01-01T10:00:00.000Z"
}
```

#### GET `/v1/users/me/events`
Get events the current user is registered for.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Tech Conference 2024",
    "date": "2024-06-15T09:00:00.000Z",
    "location": "Convention Center",
    "description": "Annual technology conference"
  }
]
```

### Event Management Endpoints

#### GET `/v1/events`
Get all events (public endpoint).

**Response:**
```json
[
  {
    "id": 1,
    "name": "Tech Conference 2024",
    "date": "2024-06-15T09:00:00.000Z",
    "location": "Convention Center",
    "organizer_id": 2,
    "description": "Annual technology conference",
    "created_at": "2024-01-01T10:00:00.000Z"
  }
]
```

#### GET `/v1/events/:id`
Get specific event details (public endpoint).

**Response:**
```json
{
  "id": 1,
  "name": "Tech Conference 2024",
  "date": "2024-06-15T09:00:00.000Z",
  "location": "Convention Center",
  "organizer_id": 2,
  "description": "Annual technology conference",
  "created_at": "2024-01-01T10:00:00.000Z"
}
```

#### POST `/v1/events`
Create a new event (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "name": "Tech Conference 2024",
  "date": "2024-06-15T09:00:00.000Z",
  "location": "Convention Center",
  "description": "Annual technology conference"
}
```

**Response:**
```json
{
  "message": "Event created successfully",
  "event": {
    "id": 1,
    "name": "Tech Conference 2024",
    "date": "2024-06-15T09:00:00.000Z",
    "location": "Convention Center",
    "organizer_id": 2,
    "description": "Annual technology conference"
  }
}
```

#### PUT `/v1/events/:id`
Update an existing event (requires authentication and ownership).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "name": "Updated Tech Conference 2024",
  "date": "2024-06-16T09:00:00.000Z",
  "location": "New Convention Center",
  "description": "Updated annual technology conference"
}
```

**Response:**
```json
{
  "message": "Event updated successfully",
  "event": {
    "id": 1,
    "name": "Updated Tech Conference 2024",
    "date": "2024-06-16T09:00:00.000Z",
    "location": "New Convention Center",
    "organizer_id": 2,
    "description": "Updated annual technology conference"
  }
}
```

#### DELETE `/v1/events/:id`
Delete an event (requires authentication and ownership).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "message": "Event deleted successfully"
}
```

#### POST `/v1/events/:id/register`
Register for an event (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "message": "Successfully registered for event",
  "registration": {
    "id": 1,
    "event_id": 1,
    "user_id": 3,
    "created_at": "2024-01-01T10:00:00.000Z"
  }
}
```

#### GET `/v1/events/:id/participants`
Get participants for an event (requires authentication and event ownership).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
[
  {
    "id": 3,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "registered_at": "2024-01-01T10:00:00.000Z"
  }
]
```

## Technologies Used

- **Node.js** (>=18.0.0) - JavaScript runtime
- **Express.js** (v5.1.0) - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Joi** - Data validation
- **Nodemon** - Development server
- **Dotenv** - Environment variables management

## Setup and Installation

### Prerequisites

- Node.js (version 18 or higher)
- PostgreSQL database
- npm or yarn package manager

### 1. Clone the Repository

```bash
git clone https://github.com/kunal2899/event-management-api.git
cd event-management-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create environment files for different environments:

#### `.env` (for development)
```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=event_management_db
DB_PORT=5432

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=24h

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

# Server Configuration
PORT=3000
NODE_ENV=development
```

#### `.env.test` (for testing)
```env
# Test Database Configuration
DB_HOST=localhost
DB_USER=your_test_db_user
DB_PASSWORD=your_test_db_password
DB_NAME=event_management_test_db
DB_PORT=5432

# JWT Configuration
JWT_SECRET=test_jwt_secret
JWT_EXPIRES_IN=1h

# Server Configuration
PORT=3001
NODE_ENV=test
```

### 4. Database Setup

#### Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE event_management_db;
CREATE DATABASE event_management_test_db;  # For testing

# Create user (optional)
CREATE USER your_db_user WITH PASSWORD 'your_db_password';
GRANT ALL PRIVILEGES ON DATABASE event_management_db TO your_db_user;
GRANT ALL PRIVILEGES ON DATABASE event_management_test_db TO your_db_user;
```

#### Run Database Migrations

```bash
npm run migrate
```

This will create the necessary tables:
- `users` - Store user information
- `events` - Store event details
- `participants` - Store event registrations

### 5. Start the Application

#### Development Mode
```bash
npm run local
```
This starts the server with nodemon for automatic restarts on file changes.

#### Production Mode
```bash
npm start
```

The server will start on the port specified in your environment variables (default: 3000).

## Testing

Run the test suite to ensure everything is working correctly:

```bash
npm test
```

**Note:** Make sure you have configured the test environment variables in `.env.test` before running tests.

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Events Table
```sql
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    date TIMESTAMP NOT NULL,
    location VARCHAR(255) NOT NULL,
    organizer_id INT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizer_id) REFERENCES users(id)
);
```

### Participants Table
```sql
CREATE TABLE participants (
    id SERIAL PRIMARY KEY,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (event_id, user_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (event_id) REFERENCES events(id)
);
```

## Authentication

This API uses JWT (JSON Web Tokens) for authentication. After successful login, include the token in the Authorization header for protected routes:

```
Authorization: Bearer <your_jwt_token>
```

Protected routes include:
- All event creation, updating, and deletion operations
- Event registration
- User profile access
- Viewing event participants

## Email Notifications

The system sends automated email notifications for:
- User registration confirmation
- Event registration confirmation

Configure email settings in your environment variables to enable this feature.

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resources)
- `500` - Internal Server Error
