# Airbnb App - Database and Error Fix Guide

## ✅ **What Was Fixed**

### 1. **Missing User/Booking Population**
- ✅ Added `.populate("user", "name email")` to bookings queries
- ✅ Added `getHostBookings` function for hosts to view their property bookings
- ✅ Ensured all API responses include complete user and property details

### 2. **JWT Token and User ID Consistency**
- ✅ Fixed JWT token generation to use `userId.toString()`
- ✅ Updated auth responses to include all user fields: `name`, `email`, `role`, `isHost`, `hostDescription`, `profilePhoto`
- ✅ Added error handling for null user IDs

### 3. **Database Seeding**
- ✅ Created comprehensive seed script that populates:
  - **3 Sample Users** (2 regular users, 1 host)
  - **1000 Properties** (with 3 assigned to host)
  - **2 Bookings** (linking users to properties)

### 4. **Debug Endpoints Added**
- ✅ `/api/debug/users` - View all users
- ✅ `/api/debug/bookings` - View all bookings with populated details
- ✅ `/api/debug/properties` - View properties with host info

---

## 📊 **Database Structure**

### **Database Location**
- **Type**: MongoDB Atlas (Cloud Database)
- **URL**: Available in your `.env` file as `MONGO_URI`
- **Format**: `mongodb+srv://username:password@cluster.mongodb.net/database_name`

### **Collections**

#### **1. Users Collection** (`db.users`)
```javascript
{
  "_id": ObjectId,
  "name": String,
  "email": String (unique),
  "password": String (hashed),
  "role": "user" | "host",
  "isHost": Boolean,
  "hostDescription": String,
  "profilePhoto": String (URL),
  "createdAt": Date,
  "updatedAt": Date
}
```

#### **2. Bookings Collection** (`db.bookings`)
```javascript
{
  "_id": ObjectId,
  "user": ObjectId (Reference to User),
  "property": ObjectId (Reference to Property),
  "fromDate": Date,
  "toDate": Date,
  "guests": Number,
  "totalPrice": Number,
  "status": "confirmed" | "cancelled" | "completed",
  "createdAt": Date,
  "updatedAt": Date
}
```

#### **3. Properties Collection** (`db.properties`)
```javascript
{
  "_id": ObjectId,
  "host": ObjectId (Reference to User),
  "title": String,
  "location": String,
  "price": Number,
  "images": Array,
  "description": String,
  "maxGuests": Number,
  "createdAt": Date,
  "updatedAt": Date
}
```

---

## 🔍 **How to Verify Your Data**

### **Method 1: Using Debug Endpoints** (Easiest)

1. **Start your backend:**
   ```powershell
   cd c:\Users\abhig\Desktop\airbnb\airbnb-backend
   npm start
   ```

2. **Open a new terminal and run these commands:**
   ```powershell
   # Check users
   curl http://localhost:5000/api/debug/users
   
   # Check bookings with populated details
   curl http://localhost:5000/api/debug/bookings
   
   # Check properties
   curl http://localhost:5000/api/debug/properties
   ```

3. **Expected Output:**
   - Users should show 3 documents with valid `_id`
   - Bookings should show user and property details (not just IDs)
   - Properties should show host information

### **Method 2: Using MongoDB Compass** (GUI)

1. **Download MongoDB Compass**: [mongodb.com/products/compass](https://www.mongodb.com/products/compass)

2. **Connect to your database:**
   - Open Compass
   - Paste your `MONGO_URI` from `.env`
   - Click "Connect"

3. **Browse collections:**
   - Select your database (e.g., "airbnb")
   - Click on "users", "bookings", or "properties" collections
   - View documents in table format

### **Method 3: Using MongoDB Atlas Web UI**

1. **Log in to**: [cloud.mongodb.com](https://cloud.mongodb.com)
2. **Navigate**: Clusters → Your Cluster → Collections
3. **Select database** → Browse collections

---

## 🔧 **Available API Endpoints**

### **Authentication**
```
POST   /api/auth/register     # Register new user
POST   /api/auth/login        # Login user
PUT    /api/auth/become-host  # Convert user to host
GET    /api/auth/me           # Get current user info
```

### **Properties**
```
GET    /api/properties        # Get all properties (with filters)
GET    /api/properties/:id    # Get single property
POST   /api/properties        # Create property (requires auth)
```

### **Bookings**
```
POST   /api/bookings          # Create booking (requires auth)
GET    /api/bookings/my       # Get logged-in user's bookings
GET    /api/bookings/host     # Get host's property bookings (requires host)
PUT    /api/bookings/:id/cancel # Cancel booking
```

### **Debug Endpoints** (Remove in production)
```
GET    /api/debug/users       # View all users
GET    /api/debug/bookings    # View all bookings with details
GET    /api/debug/properties  # View sample properties
```

---

## 📝 **Sample Login Credentials** (After Running Seed)

| Email | Password | Role |
|-------|----------|------|
| john@example.com | password123 | User (has bookings) |
| jane@example.com | password123 | Host (owns properties) |
| alice@example.com | password123 | User (has bookings) |

---

## 🐛 **Troubleshooting**

### **Error: "Cannot read properties of null (reading '_id')"**
**Solution**: 
- Ensure database is seeded: `node seed.js`
- Verify user is logged in
- Check localStorage has token and user data
- Clear browser cache and localStorage

### **Error: "Port 5000 already in use"**
**Solution**:
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

### **Bookings show no user details**
**Solution**:
- Confirm bookings use `.populate("user", "name email")`
- Check that `user` field in bookings contains valid ObjectId
- Re-run: `node seed.js`

### **Properties show no host info**
**Solution**:
- Ensure properties have `host` field set (from seed)
- Use `.populate("host", "name email")` in queries
- Verify host user exists in users collection

---

## 📋 **Checklist Before Testing**

- [ ] MongoDB Atlas cluster is running
- [ ] `.env` file contains correct `MONGO_URI`
- [ ] Database has been seeded (`node seed.js`)
- [ ] Backend server is running (`npm start`)
- [ ] Frontend is running (`npm start` in airbnb-frontend)
- [ ] Browser localStorage is cleared (or use incognito mode)
- [ ] You've logged in with one of the seed credentials

---

## 🚀 **Next Steps**

1. **Verify data with debug endpoints**
2. **Test login flow** with seed credentials
3. **Check bookings appear** on Bookings page
4. **Become a host** and create a property
5. **View host bookings** at `/api/bookings/host`

All data is now properly connected! 🎉
