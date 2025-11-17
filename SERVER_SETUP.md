# CADETN National Database - Server Setup Guide

## 🚀 Complete Node.js/Express/MongoDB Backend Setup

---

## 📁 Project Structure

```
NATDB/
├── server.js                 # Main server file
├── package.json             # Dependencies
├── .env.example             # Environment variables template
├── .env                     # Actual environment variables (create this)
├── .gitignore              # Git ignore file
├── models/
│   ├── Officer.js          # Officer data model
│   └── Admin.js            # Admin user model
├── controllers/
│   ├── officerController.js # Officer business logic
│   └── adminController.js   # Admin business logic
├── routes/
│   ├── officers.js         # Officer routes
│   └── admin.js            # Admin routes
├── middleware/
│   └── auth.js             # Authentication middleware
└── public/
    ├── index.html          # Form HTML
    ├── styles.css          # Form styles
    └── script.js           # Form JavaScript
```

---

## 📋 Prerequisites

1. **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2. **MongoDB** - Choose one:
   - **Local MongoDB** - [Download](https://www.mongodb.com/try/download/community)
   - **MongoDB Atlas** (Free Cloud) - [Sign up](https://www.mongodb.com/cloud/atlas)

---

## 🛠️ Installation Steps

### Step 1: Install Dependencies

```powershell
cd "g:\My Drive\NC4A\ICT\NATDB"
npm install
```

This installs:
- Express (web framework)
- Mongoose (MongoDB ODM)
- JWT (authentication)
- Express Validator (input validation)
- And more...

### Step 2: Set Up MongoDB

#### Option A: Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```powershell
   net start MongoDB
   ```

#### Option B: MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create a new cluster
4. Click "Connect" → "Connect your application"
5. Copy connection string

### Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```powershell
   Copy-Item ".env.example" -Destination ".env"
   ```

2. Edit `.env` file:
   ```env
   NODE_ENV=development
   PORT=5000
   
   # For local MongoDB:
   MONGODB_URI=mongodb://localhost:27017/cadetn_database
   
   # For MongoDB Atlas (replace with your connection string):
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cadetn_database
   
   JWT_SECRET=your_super_secret_key_change_this_123456
   JWT_EXPIRE=30d
   
   CLIENT_URL=http://localhost:5000
   
   ADMIN_EMAIL=admin@cadetn.org
   ADMIN_PASSWORD=Admin@2025
   ```

### Step 4: Create First Admin User

Create a script to initialize the first admin:

```powershell
# Create init-admin.js
New-Item -Path "init-admin.js" -ItemType File
```

Add this content to `init-admin.js`:
```javascript
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        const adminExists = await Admin.findOne({ email: 'admin@cadetn.org' });
        
        if (adminExists) {
            console.log('Admin already exists');
            process.exit(0);
        }
        
        await Admin.create({
            name: 'System Administrator',
            email: 'admin@cadetn.org',
            password: 'Admin@2025',
            role: 'superadmin'
        });
        
        console.log('Admin created successfully');
        console.log('Email: admin@cadetn.org');
        console.log('Password: Admin@2025');
        console.log('PLEASE CHANGE PASSWORD AFTER FIRST LOGIN');
        
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

createAdmin();
```

Run it:
```powershell
node init-admin.js
```

---

## ▶️ Running the Server

### Development Mode (with auto-restart):
```powershell
npm run dev
```

### Production Mode:
```powershell
npm start
```

You should see:
```
╔════════════════════════════════════════════════════════╗
║   CADETN National Database Server                      ║
║   Directorate of ICT                                   ║
╠════════════════════════════════════════════════════════╣
║   Server running on port: 5000                         ║
║   Environment: development                             ║
║   URL: http://localhost:5000                           ║
╚════════════════════════════════════════════════════════╝
```

---

## 🌐 Accessing the Application

- **Form**: http://localhost:5000
- **API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

---

## 🔐 API Endpoints

### Public Endpoints

**Submit Officer Data**
```
POST /api/officers
Content-Type: application/json

{
  "surname": "IGBINYEMI",
  "firstName": "ADEBOYE",
  "officerNumber": "CDT001",
  ... (all form fields)
}
```

**Admin Login**
```
POST /api/admin/login
Content-Type: application/json

{
  "email": "admin@cadetn.org",
  "password": "Admin@2025"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {...}
}
```

### Protected Endpoints (Require Token)

**Get All Officers**
```
GET /api/officers?page=1&limit=20&status=pending
Authorization: Bearer YOUR_JWT_TOKEN
```

**Get Statistics**
```
GET /api/officers/stats
Authorization: Bearer YOUR_JWT_TOKEN
```

**Get Single Officer**
```
GET /api/officers/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

**Update Officer**
```
PUT /api/officers/:id
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Approve Officer**
```
PATCH /api/officers/:id/approve
Authorization: Bearer YOUR_JWT_TOKEN
```

**Delete Officer** (Superadmin only)
```
DELETE /api/officers/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 🧪 Testing the API

### Using PowerShell:

**Test Health Check:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method GET
```

**Login as Admin:**
```powershell
$body = @{
    email = "admin@cadetn.org"
    password = "Admin@2025"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/login" -Method POST -Body $body -ContentType "application/json"
$token = $response.token
```

**Get Officers (with token):**
```powershell
$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:5000/api/officers" -Method GET -Headers $headers
```

### Using Postman:

1. Download [Postman](https://www.postman.com/downloads/)
2. Import the API collection
3. Set up environment variables
4. Test endpoints

---

## 📊 Database Management

### View Data in MongoDB

**Using MongoDB Compass** (GUI):
1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect to: `mongodb://localhost:27017`
3. Navigate to `cadetn_database` database

**Using Mongo Shell**:
```powershell
mongosh
use cadetn_database
db.officers.find().pretty()
db.admins.find().pretty()
```

### Backup Database
```powershell
mongodump --db cadetn_database --out ./backup
```

### Restore Database
```powershell
mongorestore --db cadetn_database ./backup/cadetn_database
```

---

## 🔒 Security Features

✅ **JWT Authentication** - Token-based auth  
✅ **Password Hashing** - bcrypt encryption  
✅ **Input Validation** - Express Validator  
✅ **Rate Limiting** - Prevent spam  
✅ **CORS Protection** - Cross-origin security  
✅ **Helmet** - Security headers  
✅ **Role-Based Access** - Admin/Superadmin roles  

---

## 🚀 Deployment Options

### Option 1: Heroku (Free Tier)

1. Install Heroku CLI
2. Create Heroku app:
   ```powershell
   heroku create cadetn-database
   ```
3. Add MongoDB Atlas addon:
   ```powershell
   heroku addons:create mongolab:sandbox
   ```
4. Deploy:
   ```powershell
   git push heroku main
   ```

### Option 2: Railway

1. Go to [Railway.app](https://railway.app)
2. Connect GitHub repo
3. Add MongoDB plugin
4. Deploy automatically

### Option 3: DigitalOcean

1. Create Droplet (Ubuntu)
2. Install Node.js and MongoDB
3. Clone repository
4. Run with PM2:
   ```bash
   pm2 start server.js --name cadetn-server
   ```

### Option 4: Azure

1. Create Azure Web App
2. Configure Node.js runtime
3. Add MongoDB connection string
4. Deploy from GitHub

---

## 🛠️ Maintenance

### View Logs
```powershell
# Development
npm run dev

# Production with PM2
pm2 logs cadetn-server
```

### Update Dependencies
```powershell
npm update
```

### Check for Vulnerabilities
```powershell
npm audit
npm audit fix
```

---

## 📱 Admin Dashboard (Future Enhancement)

Create a separate admin dashboard:
- View all submissions
- Approve/reject officers
- Generate reports
- Export data to Excel/CSV
- User management

---

## ❓ Troubleshooting

### Error: Cannot connect to MongoDB
**Solution**: Check if MongoDB is running
```powershell
# For local MongoDB
net start MongoDB

# Check connection string in .env
```

### Error: Port 5000 already in use
**Solution**: Change port in `.env` or kill process
```powershell
# Find process
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess

# Kill process
Stop-Process -Id PROCESS_ID
```

### Error: JWT must be provided
**Solution**: Include Authorization header
```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 📞 Support

**Directorate of ICT**  
Nigeria Cadet Network (CADETN)

**Director**: Aux. Igbinyemi Adeboye Amos  
**Date**: November 17, 2025

---

## 🎯 Next Steps

1. ✅ Install dependencies
2. ✅ Configure MongoDB
3. ✅ Create `.env` file
4. ✅ Create admin user
5. ✅ Start server
6. ✅ Test form submission
7. ✅ Test admin login
8. 📱 Build admin dashboard (optional)
9. 🚀 Deploy to production

---

**Server is now ready! Officers can submit data and it will be stored in MongoDB database.**
