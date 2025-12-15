# Position Coach Review App

A full-stack web application for finding, reviewing, and managing position coaches. Built with ASP.NET Core Web API (C#) backend and Next.js (TypeScript) frontend.

## Features

### Core Features
- **User Authentication**: Separate authentication for users and coaches with JWT tokens
- **Coach Profiles**: Create, view, and update detailed coach profiles with specializations
- **Review System**: Users can submit ratings and reviews for coaches
- **Zipcode Search**: Find coaches near you using zipcode-based search
- **Coach Dashboard**: 
  - View all clients
  - Manage client list
  - View all reviews
  - Track performance statistics
- **Subscription Tiers**: Three-tier system (Free, Basic, Premium) with different features
- **Aggregated Ratings**: Automatic calculation of average ratings and review counts

## Technology Stack

### Backend
- ASP.NET Core 10.0 Web API
- Entity Framework Core with SQLite
- JWT Authentication
- BCrypt for password hashing

### Frontend
- Next.js 16 with App Router
- TypeScript
- Tailwind CSS
- Axios for API calls
- Context API for state management

## Project Structure

```
position-coach-review-app/
├── backend/
│   └── PositionCoachReviewApi/
│       ├── Controllers/        # API endpoints
│       ├── Models/            # Data models and DTOs
│       ├── Data/              # Database context
│       ├── Services/          # Business logic
│       └── Program.cs         # App configuration
└── frontend/
    ├── app/                   # Next.js pages
    ├── components/            # Reusable components
    ├── contexts/              # React contexts
    ├── lib/                   # Utilities
    └── types/                 # TypeScript types
```

## Prerequisites

- .NET SDK 10.0 or higher
- Node.js 18+ and npm
- Git

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd position-coach-review-app
```

### 2. Backend Setup

```bash
cd backend/PositionCoachReviewApi

# Restore dependencies (if needed)
dotnet restore

# Build the project
dotnet build

# Run the API (default port: 5000)
dotnet run
```

The API will be available at `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Running the Application

1. **Start the Backend**:
   ```bash
   cd backend/PositionCoachReviewApi
   dotnet run
   ```

2. **Start the Frontend** (in a new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Database

The application uses SQLite for data storage. The database file (`positioncoach.db`) is automatically created when the application first runs. It includes:

- Seeded subscription tiers (Free, Basic, Premium)
- Automatic schema creation
- Three subscription tiers pre-configured

## API Endpoints

### Authentication
- `POST /api/auth/register/user` - Register a new user
- `POST /api/auth/register/coach` - Register a new coach
- `POST /api/auth/login/user` - User login
- `POST /api/auth/login/coach` - Coach login

### Coaches
- `GET /api/coaches` - Get all coaches
- `GET /api/coaches/{id}` - Get coach by ID
- `GET /api/coaches/search?zipCode={zipCode}` - Search coaches by zipcode
- `PUT /api/coaches/{id}` - Update coach profile (requires authentication)

### Reviews
- `POST /api/reviews` - Create a review (requires user authentication)
- `GET /api/reviews/{id}` - Get review by ID
- `GET /api/reviews/coach/{coachId}` - Get all reviews for a coach

### Dashboard (Coach Only)
- `GET /api/dashboard/clients` - Get coach's clients
- `POST /api/dashboard/clients` - Add a new client
- `GET /api/dashboard/reviews` - Get coach's reviews
- `GET /api/dashboard/stats` - Get dashboard statistics

### Subscriptions
- `GET /api/subscriptions` - Get all subscription tiers
- `PUT /api/subscriptions/upgrade` - Upgrade subscription (requires coach authentication)

## User Roles

### Regular Users
- Browse and search for coaches
- View coach profiles and reviews
- Submit reviews for coaches
- Rate coaches (1-5 stars)

### Coaches
- Create and manage profile
- View client list
- Add new clients
- View all reviews
- Access dashboard with statistics
- Manage subscription tier

## Subscription Tiers

1. **Free Tier** ($0/month)
   - Up to 5 clients
   - Basic listing
   - No analytics

2. **Basic Tier** ($29.99/month)
   - Up to 20 clients
   - Enhanced listing
   - Analytics access

3. **Premium Tier** ($79.99/month)
   - Unlimited clients (999 max)
   - Featured listing
   - Full analytics access

## Configuration

### Backend Configuration (`appsettings.json`)
- JWT settings (key, issuer, audience)
- Database connection string
- CORS policy

### Frontend Configuration (`.env.local`)
- `NEXT_PUBLIC_API_URL` - API base URL (default: http://localhost:5000/api)

## Development

### Building for Production

**Backend:**
```bash
cd backend/PositionCoachReviewApi
dotnet publish -c Release
```

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

## Security Features

- Password hashing with BCrypt
- JWT token-based authentication
- Role-based authorization
- CORS protection
- Input validation on all endpoints

## Future Enhancements

- Email notifications
- Payment processing for subscriptions
- Advanced search filters
- Coach availability calendar
- Direct messaging between users and coaches
- Photo uploads for coach profiles
- Session booking system

## License

MIT

## Support

For issues and questions, please open an issue in the repository.
