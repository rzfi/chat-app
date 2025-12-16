# Chat Application

A real-time chat application built with React frontend and Node.js backend.

## Prerequisites

1. **Node.js** (v14 or higher)
2. **MongoDB** (running on localhost:27017)
3. **npm** or **yarn**

## Quick Start

### Option 1: Use the startup script (Windows)
```bash
# Double-click start-app.bat or run:
start-app.bat
```

### Option 2: Manual startup

1. **Start MongoDB** (make sure it's running on localhost:27017)

2. **Install dependencies:**
```bash
# Backend
cd backend
npm install

# Frontend (in a new terminal)
cd frontend
npm install
```

3. **Start the backend server:**
```bash
cd backend
npm start
```

4. **Start the frontend (in a new terminal):**
```bash
cd frontend
npm start
```

## Application URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Socket.IO:** ws://localhost:5000

## Features

- User registration and authentication
- Real-time messaging with Socket.IO
- User list display
- JWT-based authentication

## Troubleshooting

1. **MongoDB Connection Error:**
   - Ensure MongoDB is installed and running
   - Check if MongoDB is accessible at `mongodb://localhost:27017/whatsapp`

2. **Port Already in Use:**
   - Backend (5000): Kill any process using port 5000
   - Frontend (3000): Kill any process using port 3000

3. **CORS Issues:**
   - The backend is configured to allow all origins for development
   - Make sure both servers are running on the correct ports

## Project Structure

```
system-design/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication middleware
│   ├── server.js        # Main server file
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/  # React components
    │   ├── context/     # React context
    │   └── services/    # API and socket services
    └── package.json
```