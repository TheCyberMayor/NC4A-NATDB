# Dashboard Login Setup

## 🔐 Authentication System

The dashboard now has a secure login system to protect sensitive officer data.

## 🚀 First-Time Setup

### 1. Create Default Admin Account

Run this command **once** to create the default admin user:

```bash
npm run init-admin
```

This will create an admin account with:
- **Username:** `admin`
- **Password:** `Admin@123`

⚠️ **IMPORTANT:** Change this password immediately after your first login!

### 2. Access the Dashboard

1. Navigate to: `http://localhost:5000/login.html` (or your deployed URL)
2. Enter the default credentials
3. You'll be redirected to the dashboard

## 🔑 Login Features

- **Secure Authentication:** JWT-based token authentication
- **Remember Me:** Option to stay logged in for 7 days
- **Auto-logout:** Token expires after the selected period
- **Password Protection:** All passwords are hashed with bcrypt

## 📱 Using the Dashboard

### Local Development
- **Login Page:** http://localhost:5000/login.html
- **Dashboard:** http://localhost:5000/dashboard.html (requires login)
- **Data Entry:** http://localhost:5000/ (public, no login required)

### Production (Render)
- **Login Page:** https://nc4a-natdb.onrender.com/login.html
- **Dashboard:** https://nc4a-natdb.onrender.com/dashboard.html
- **Data Entry:** https://nc4a-natdb.onrender.com/

## 🛡️ Security Features

1. **JWT Tokens:** Secure token-based authentication
2. **Password Hashing:** bcrypt with salt rounds
3. **Token Expiration:** Automatic logout after expiry
4. **Protected Routes:** Dashboard requires authentication
5. **CORS Protection:** Configured for specific origins
6. **Rate Limiting:** Prevents brute force attacks

## 🔄 Logout

Click the **Logout** button in the dashboard header to sign out.

## ⚙️ Environment Variables

For production, set a secure JWT secret:

```env
JWT_SECRET=your-super-secure-random-secret-key-here
```

## 📝 Managing Admin Users

Currently, you can create the default admin via the init script. To add more admins or manage users, you'll need to:

1. Access Firestore Console: https://console.firebase.google.com/
2. Navigate to your project → Firestore Database
3. Go to the `admins` collection
4. Add/edit users manually (remember to hash passwords!)

## 🐛 Troubleshooting

### "Invalid credentials"
- Check that you're using the correct username and password
- Username is case-insensitive

### "Token expired"
- Your session has expired
- Simply login again

### "Account is inactive"
- Contact the system administrator
- Check the user's `status` field in Firestore (should be `active`)

## 📊 User Roles

- **superadmin:** Full access to all features
- **admin:** Standard admin access (for future use)

---

**Need Help?** Contact the Directorate of ICT, CADETN
