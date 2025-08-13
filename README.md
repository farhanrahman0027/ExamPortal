# Exam Application

A full-stack exam application built with React.js, Node.js, Express.js, and MongoDB. This application provides a complete exam-taking experience for students with JWT authentication, randomized questions, timer functionality, and automatic scoring.

## Features

### Authentication
- User registration and login with JWT tokens
- Secure password hashing with bcrypt
- Protected routes and API endpoints

### Exam Interface
- Randomized question fetching from database
- Multiple-choice questions with radio button selection
- 30-minute countdown timer with auto-submission
- Next/Previous navigation between questions
- Question overview with progress tracking
- Real-time answer saving

### Results & Scoring
- Automatic score calculation upon submission
- Detailed results with correct/incorrect answers
- Pass/fail determination (60% threshold)
- Performance summary and analytics

### Technical Features
- Responsive design for desktop and mobile
- Real-time timer synchronization
- Error handling and loading states
- RESTful API design
- MongoDB integration with Mongoose

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Axios** for API communication
- **React Router** for navigation

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone <repository-url>
cd exam-application
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/exam-app
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 4. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# For local MongoDB installation
mongod

# Or use MongoDB Atlas cloud service
```

### 5. Seed Sample Questions
The application includes sample programming questions. To populate the database:

1. Start the backend server
2. Make a POST request to `http://localhost:5000/api/exam/seed-questions`
3. Or use the included Postman collection

### 6. Run the Application

#### Start Backend Server
```bash
npm run dev:server
```
The server will start on `http://localhost:5000`

#### Start Frontend Development Server
```bash
npm run dev
```
The frontend will start on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)

### Exam Management
- `GET /api/exam/questions?limit=10` - Get randomized questions (protected)
- `POST /api/exam/submit` - Submit exam answers (protected)
- `POST /api/exam/seed-questions` - Populate database with sample questions

## API Testing with Postman

### Sample Requests

#### 1. Register New User
```json
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

#### 2. Login User
```json
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

#### 3. Get Questions (Protected)
```json
GET http://localhost:5000/api/exam/questions?limit=10
Authorization: Bearer <your-jwt-token>
```

#### 4. Submit Exam (Protected)
```json
POST http://localhost:5000/api/exam/submit
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "answers": [
    {
      "questionId": "question-id-1",
      "selectedOptionId": "option-id-1"
    },
    {
      "questionId": "question-id-2",
      "selectedOptionId": "option-id-2"
    }
  ]
}
```

## Project Structure

```
exam-application/
├── src/                          # Frontend source code
│   ├── components/               # React components
│   │   ├── Login.tsx            # Login form component
│   │   ├── Register.tsx         # Registration form component
│   │   ├── Dashboard.tsx        # Main dashboard
│   │   ├── ExamInterface.tsx    # Exam taking interface
│   │   └── ResultPage.tsx       # Results display
│   ├── contexts/                # React contexts
│   │   └── AuthContext.tsx      # Authentication context
│   ├── App.tsx                  # Main app component
│   └── main.tsx                 # App entry point
├── server/                      # Backend source code
│   ├── models/                  # Database models
│   │   ├── User.js             # User model
│   │   └── Question.js         # Question model
│   ├── routes/                  # API routes
│   │   ├── auth.js             # Authentication routes
│   │   └── exam.js             # Exam routes
│   ├── middleware/              # Custom middleware
│   │   └── auth.js             # JWT authentication middleware
│   └── server.js               # Express server setup
├── package.json                 # Dependencies and scripts
├── .env                        # Environment variables
└── README.md                   # Project documentation
```

## Key Features Implementation

### Timer Functionality
- 30-minute countdown timer with visual warnings
- Automatic submission when timer reaches zero
- Timer persists during question navigation

### Question Randomization
- MongoDB aggregation pipeline for random sampling
- Prevents answer exposure in question payload
- Configurable question limit

### Secure Authentication
- JWT tokens with configurable expiration
- Password hashing with bcrypt (10 salt rounds)
- Protected API routes with middleware

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Optimized for exam-taking experience
- Accessible UI components

## Development Notes

### Security Considerations
- JWT secrets should be complex in production
- API endpoints validate user authorization
- Passwords are never stored in plain text
- CORS configured for secure cross-origin requests

### Performance Optimization
- MongoDB indexing for efficient queries
- Client-side answer caching
- Optimized re-renders with React hooks

### Error Handling
- Comprehensive error messages for users
- Server-side validation and sanitization
- Network error recovery mechanisms

## Deployment Considerations

### Production Environment
1. Use environment variables for all sensitive data
2. Enable MongoDB authentication
3. Implement rate limiting for API endpoints
4. Use HTTPS for secure communication
5. Configure proper CORS origins

### Scaling Options
- Implement Redis for session management
- Use MongoDB Atlas for cloud database
- Deploy on services like Heroku, Vercel, or AWS
- Add CDN for static asset delivery

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is created for educational and assessment purposes.