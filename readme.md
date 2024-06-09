# Email Classifier using OpenAI GPT

This project provides a simple email classifier using OpenAI's GPT models to classify emails into different categories. It's built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and consists of a backend and a frontend component.

## Features

- Classify emails into different categories using OpenAI's GPT models.
- Backend API built with Node.js and Express.js.
- Frontend user interface built with React.js.

## Prerequisites

- Node.js and npm installed on your machine.
- MongoDB installed and running.
- OpenAI API key for accessing GPT models.

## Project Structure

- `backend/`: Contains the server-side code.
  - `server.js`: Main server file.
  - `classifyEmail.js`: Logic for email classification.
- `frontend/`: Contains the client-side code.
  - `src/`: React components and app logic.
  - `public/`: Static files.

## Setup

### Backend

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file in the `backend` directory and add your OpenAI API key:
   ```plaintext
   OPENAI_API_KEY=your_api_key_here
   ```

   Replace `your_api_key_here` with your actual OpenAI API key.

### Frontend

3. Navigate to the `frontend` folder:
   ```bash
   cd ../frontend
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Create a `.env` file in the `frontend` directory and add the following line:
   ```plaintext
   REACT_APP_BACKEND_URL=http://localhost:5000
   ```

6. Start the frontend development server:
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`.
