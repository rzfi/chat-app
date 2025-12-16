# Network Setup for Multi-Device Chat

## Your Network Configuration
- **Host IP**: 192.168.112.110
- **Backend**: http://192.168.112.110:5000
- **Frontend**: http://192.168.112.110:3000

## For Other Users to Join:

### 1. Share This Link
Give other users this URL to access the chat:
```
http://192.168.112.110:3000
```

### 2. Ensure Same WiFi Network
All devices must be connected to the same WiFi network.

### 3. Firewall Settings
If users can't connect, temporarily disable Windows Firewall or add exceptions for ports 3000 and 5000.

## Starting the Application:

1. **Start Backend:**
```bash
cd backend
npm start
```

2. **Start Frontend:**
```bash
cd frontend
npm start
```

The backend will now listen on all network interfaces, allowing other devices to connect.

## Troubleshooting:
- Ensure all devices are on the same WiFi
- Check Windows Firewall settings
- Verify the IP address hasn't changed (run `ipconfig` to check)