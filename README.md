# User & Loyalty Service 👤

## Student D - User Microservice

This microservice handles user management and loyalty points for the flight management system.

## Technologies
- Node.js / Express
- MongoDB (with Mongoose)
- JWT Authentication
- Docker
- GitHub Actions
- Azure Container Apps

## Features
- User registration and login
- JWT authentication
- User profile management
- Loyalty points system
- Tier-based loyalty (bronze, silver, gold, platinum)
- Points history tracking
- Integration with Booking Service

## API Endpoints

### Health & Info
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/` | Service information |

### User Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Register new user |
| POST | `/api/users/login` | User login |
| GET | `/api/users/profile` | Get current user profile |
| GET | `/api/users/:userId` | Get user by ID |
| PUT | `/api/users/profile` | Update user profile |
| GET | `/api/users/:userId/bookings` | Get user's bookings |

### Loyalty Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/loyalty/points/:userId` | Get user's loyalty points |
| GET | `/api/loyalty/history/:userId` | Get points transaction history |
| POST | `/api/loyalty/points/add` | Add points to user (internal) |
| POST | `/api/loyalty/points/redeem` | Redeem points |

## Integration Points
This service is called by:
- **Booking Service (Student B)**: To validate users and get user details

This service calls:
- **Booking Service (Student B)**: To get user's booking history

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB
- Docker (optional)

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/user-service.git
cd user-service