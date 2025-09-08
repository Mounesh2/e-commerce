# MongoDB Setup Instructions

## 1. Install MongoDB Dependency
```bash
npm install
```

## 2. Install MongoDB Community Server
Download and install MongoDB from: https://www.mongodb.com/try/download/community

## 3. Start MongoDB Service
### Windows:
```bash
# Start MongoDB service (run as administrator)
net start MongoDB

# Or start manually
mongod --dbpath "C:\data\db"
```

### Alternative: Use MongoDB Atlas (Cloud)
If you prefer cloud database, update the connection string in server.js:
```javascript
const MONGODB_URI = 'mongodb+srv://username:password@cluster.mongodb.net/ecommerce';
```

## 4. Start the Application
```bash
npm start
```

## 5. Verify Connection
Check the console for "Connected to MongoDB" message when starting the server.

## Database Schema
Users are now stored in MongoDB with the following structure:
- email (unique)
- password (hashed)
- fullName
- phone
- address
- memberSince
- createdAt

## Migration Notes
- Existing in-memory user data will be lost
- Users need to sign up again with the new MongoDB system
- Cart and items data still use in-memory storage for simplicity