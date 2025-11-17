# 🚀 QUICK START GUIDE

## CADETN National Database - Get Started in 5 Minutes

---

## ⚡ Quick Setup

### 1️⃣ Install Node.js
Download and install from: https://nodejs.org/ (v18 or higher)

### 2️⃣ Install MongoDB

**Option A: MongoDB Atlas (Cloud - Easiest)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free
3. Create cluster (takes 3-5 minutes)
4. Click "Connect" → Copy connection string

**Option B: Local MongoDB**
1. Download from https://www.mongodb.com/try/download/community
2. Install and start service:
   ```powershell
   net start MongoDB
   ```

### 3️⃣ Install Dependencies
```powershell
cd "g:\My Drive\NC4A\ICT\NATDB"
npm install
```

### 4️⃣ Configure Environment
```powershell
# Copy example file
Copy-Item ".env.example" -Destination ".env"

# Edit .env file and set:
# - MONGODB_URI (your connection string)
# - JWT_SECRET (any random string)
```

### 5️⃣ Create Admin User
```powershell
node init-admin.js
```

### 6️⃣ Start Server
```powershell
npm start
```

### 7️⃣ Open Browser
Go to: http://localhost:5000

---

## ✅ That's It!

Your server is now running and ready to accept officer data submissions!

### Default Admin Login:
- **Email**: admin@cadetn.org
- **Password**: Admin@2025

### What Data is Stored?
All form submissions are now stored in your MongoDB database with:
- ✅ Full officer information
- ✅ Service records
- ✅ Contact details
- ✅ Educational qualifications
- ✅ Next of kin information
- ✅ Timestamps and status tracking

---

## 📚 Full Documentation

- **Detailed Setup**: See `SERVER_SETUP.md`
- **API Documentation**: See `SERVER_SETUP.md` → API Endpoints section
- **General Info**: See `README.md`

---

## ❓ Need Help?

**Common Issues:**

1. **MongoDB connection error**
   - Check if MongoDB is running
   - Verify connection string in `.env`

2. **Port already in use**
   - Change PORT in `.env` file

3. **Dependencies not installing**
   - Delete `node_modules` folder
   - Run `npm install` again

---

## 🎯 Next Steps

1. ✅ Test form submission at http://localhost:5000
2. ✅ Test admin login using API
3. 📱 Build admin dashboard (optional)
4. 🚀 Deploy to production server

---

**Ready to deploy? See SERVER_SETUP.md for deployment options!**
