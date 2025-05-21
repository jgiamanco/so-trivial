# Trivia Quiz App

A full-stack trivia quiz application built with React, TypeScript, Node.js, and Express. The application is containerized with Docker and deployed on Vercel.

## Features

- Select from various trivia categories
- Choose difficulty level (Easy, Medium, Hard)
- Select number of questions (5, 10, 15, 20)
- Multiple choice questions with immediate feedback
- Score tracking
- Option to create new quizzes
- Persistent storage of quiz results
- Responsive design for all devices

## Prerequisites

- Node.js (v18 or higher)
- npm or pnpm
- Docker and Docker Compose (for local development)
- MongoDB Atlas account (for production)

## Local Development

### Using Docker (Recommended)

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd trivia-quiz
   ```

2. Start the application using Docker Compose:
   ```bash
   docker-compose up --build
   ```

The application will be available at:

- Frontend: http://localhost
- Backend API: http://localhost:3000
- MongoDB: mongodb://localhost:27017

### Manual Setup

#### Backend Setup

1. Navigate to the server directory:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:

   ```
   MONGODB_URI=mongodb://localhost:27017/trivia
   JWT_SECRET=your-secret-key
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

The server will run on http://localhost:3000

#### Frontend Setup

1. Navigate to the client directory:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file with:

   ```
   REACT_APP_API_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm start
   ```

The application will open in your browser at http://localhost:3000

## Deployment

The application is deployed on Vercel:

- Frontend: https://so-trivial.vercel.app
- Backend API: https://trivial-server-\*.vercel.app

### Environment Variables

For production deployment, set the following environment variables in Vercel:

#### Backend

- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: A secure random string for JWT signing

#### Frontend

- `REACT_APP_API_URL`: Your backend API URL

## Technologies Used

### Frontend

- React
- TypeScript
- Tailwind CSS
- Redux Toolkit
- Axios
- Vite

### Backend

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- Axios

### Infrastructure

- Docker
- Docker Compose
- Vercel
- MongoDB Atlas

## API

The application uses the Open Trivia Database API (https://opentdb.com/) for fetching trivia questions and stores quiz results in MongoDB.

### API Endpoints

- `GET /api/categories`: Get all trivia categories
- `POST /api/quiz`: Create a new quiz
- `POST /api/quiz/:quizId/submit`: Submit quiz answers
- `GET /health`: Health check endpoint
