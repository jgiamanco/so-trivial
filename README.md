# Trivia Quiz App

A full-stack trivia quiz application built with React, TypeScript, Node.js, and Express.

## Features

- Select from various trivia categories
- Choose difficulty level (Easy, Medium, Hard)
- Select number of questions (5, 10, 15, 20)
- Multiple choice questions with immediate feedback
- Score tracking
- Option to create new quizzes

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Setup

### Backend Setup

1. Navigate to the server directory:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm run dev
   ```

The server will run on http://localhost:5000

### Frontend Setup

1. Navigate to the client directory:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will open in your browser at http://localhost:3000

## Technologies Used

- Frontend:

  - React
  - TypeScript
  - Tailwind CSS
  - Axios

- Backend:
  - Node.js
  - Express
  - TypeScript
  - Axios

## API

The application uses the Open Trivia Database API (https://opentdb.com/) for fetching trivia questions.
