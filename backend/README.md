# Future Academy Backend API

This is the backend API for the Future Academy educational platform. It provides endpoints for user authentication, progress tracking, and community forum functionality.

## Technologies Used

- Node.js
- Express.js
- MongoDB/Mongoose
- JWT Authentication
- bcrypt.js for password hashing

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGO_URI=mongodb://localhost:27017/future_academy
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=24h
   PORT=5000
   NODE_ENV=development
   ```
4. Start the server:
   ```bash
   # Development mode with nodemon
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication

- **Register User**: `POST /api/auth/register`
  - Body: `{ name, email, password, role (optional) }`
  - Role can be "student", "teacher", or "admin" (defaults to "student")

- **Login User**: `POST /api/auth/login`
  - Body: `{ email, password }`

- **Get User Profile**: `GET /api/auth/profile`
  - Requires authentication

- **Update User Profile**: `PUT /api/auth/profile`
  - Requires authentication
  - Body: `{ name, email }`

- **Update Password**: `PUT /api/auth/password`
  - Requires authentication
  - Body: `{ currentPassword, newPassword }`

- **Logout**: `GET /api/auth/logout`
  - Requires authentication

### Progress Tracking

- **Get All Progress**: `GET /api/progress`
  - Requires authentication

- **Get Subject Progress**: `GET /api/progress/subject/:subject`
  - Requires authentication
  - Valid subjects: "mathematics", "science", "programming", "languages"

- **Update Lesson Progress**: `POST /api/progress/lesson`
  - Requires authentication
  - Body: `{ subject, lessonId, timeSpent (optional) }`

- **Update Quiz Progress**: `POST /api/progress/quiz`
  - Requires authentication
  - Body: `{ subject, quizId, score, maxScore, timeSpent (optional), answers (optional) }`

- **Get Learning Streak**: `GET /api/progress/streak`
  - Requires authentication

- **Get User Badges**: `GET /api/progress/badges`
  - Requires authentication

### Community Forum

- **Get All Posts**: `GET /api/forum/posts`
  - Query parameters: `page`, `limit`, `category`, `sortBy`, `sortOrder`

- **Get Post by ID**: `GET /api/forum/posts/:id`

- **Create Post**: `POST /api/forum/posts`
  - Requires authentication
  - Body: `{ title, content, category, tags (optional) }`

- **Update Post**: `PUT /api/forum/posts/:id`
  - Requires authentication (must be author or admin)
  - Body: `{ title, content, category, tags (optional) }`

- **Delete Post**: `DELETE /api/forum/posts/:id`
  - Requires authentication (must be author or admin)

- **Add Comment**: `POST /api/forum/posts/:id/comments`
  - Requires authentication
  - Body: `{ content }`

- **Update Comment**: `PUT /api/forum/posts/:id/comments/:commentId`
  - Requires authentication (must be author or admin)
  - Body: `{ content }`

- **Delete Comment**: `DELETE /api/forum/posts/:id/comments/:commentId`
  - Requires authentication (must be author or admin)

- **Like/Unlike Post**: `PUT /api/forum/posts/:id/like`
  - Requires authentication

- **Like/Unlike Comment**: `PUT /api/forum/posts/:id/comments/:commentId/like`
  - Requires authentication

- **Search Posts**: `GET /api/forum/search`
  - Query parameter: `q` (search term)

## Authentication

Most endpoints require authentication. To authenticate, include the JWT token in the request header:

```
Authorization: Bearer <your_token>
```

The token is obtained after successful login/registration and is valid for 24 hours by default.

## Error Handling

The API returns standard HTTP status codes:

- 200: OK
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

Error responses have the following format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

## Models

### User

- name: String (required)
- email: String (required, unique)
- password: String (required, hashed)
- role: String (enum: "student", "teacher", "admin", default: "student")
- dateJoined: Date
- profilePicture: String

### Progress

- userId: ObjectId (reference to User)
- subject: String (enum: "mathematics", "science", "programming", "languages")
- lessonsCompleted: Array of { lessonId, completedAt, timeSpent }
- quizzesCompleted: Array of { quizId, score, maxScore, completedAt, timeSpent, answers }
- streak: { current, best, lastStudyDate }
- badges: Array of { badgeId, name, description, earnedOn }

### Post

- title: String (required)
- content: String (required)
- user: ObjectId (reference to User)
- category: String (enum: "mathematics", "science", "programming", "languages", "general")
- tags: Array of Strings
- comments: Array of { user, content, isEdited, likes }
- likes: Array of ObjectIds (reference to Users)
- views: Number 