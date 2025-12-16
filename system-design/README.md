# Simple Chat Application

A real-time chat application with username-based login, message persistence, and multi-device support.

## Features

- ✅ Simple username login (no passwords)
- ✅ Real-time messaging with Socket.IO
- ✅ Message persistence in MongoDB
- ✅ User list display
- ✅ Clear chat functionality
- ✅ Multi-device support via network IP

## Prerequisites

1. **Node.js** (v14 or higher)
2. **MongoDB** (running on localhost:27017)
3. **npm**

## Quick Start

### Option 1: Use the startup script (Windows)
```bash
# Double-click script.bat or run:
script.bat
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

4. **Start the frontend:**
```bash
cd frontend
npm start
```

## Application URLs

- **Local:** http://localhost:3000
- **Network:** http://192.168.112.110:3000 (share this with others)
- **Backend API:** http://localhost:5000

## How to Use

1. **Join Chat:** Enter any username and click "Join Chat"
2. **Send Messages:** Type and press Enter or click Send
3. **View Users:** See all users in the sidebar
4. **Clear Chat:** Click "Clear Chat" to delete all messages
5. **Multi-Device:** Share the network URL for others to join

## Data Storage

- **Users:** Stored in MongoDB with username and join date
- **Messages:** Stored in MongoDB with sender, content, and timestamp
- **Persistence:** All messages and users persist across app restarts

## Network Access

To allow other devices to join:
1. Make sure all devices are on the same WiFi
2. Share the network URL: `http://192.168.112.110:3000`
3. Others can join with any username

## Project Structure

```
system-design/
├── backend/
│   ├── models/
│   │   ├── User.js      # User model (username, joinedAt)
│   │   └── Message.js   # Message model (sender, content, timestamp)
│   ├── server.js        # Main server with API and Socket.IO
│   └── package.json
└── frontend/
    ├── src/
    │   ├── config/
    │   │   └── network.js # Network configuration
    │   ├── App.js       # Main chat application
    │   └── App.css      # Styling
    └── package.json
```