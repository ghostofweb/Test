Please `npm i` to install packages.

### and then do **`npm run dev`** to run it


# Folders & File Breakdown
## controllers/authController.js
→ This is where the main logic lives: signup, login, OTP verify, and token refresh.

## middleware/authMiddleware.js
→ This protects routes using JWT. If you’re not logged in, it blocks access.

## models/User.js
→ MongoDB schema for user: name, email, password (hashed), and a flag for isVerified.

## models/Otp.js
→ A separate model just for OTPs. It stores email/number, the OTP, and expiry time.

## routes/authRoutes.js
→ All the API routes are defined here, like /signup, /login, etc.

## utils/otp.js
→ A helper file that generates a random OTP and calculates its expiry time (5 mins).

## .env
→ For storing sensitive stuff like MongoDB URL and JWT secret.

## db.js
→ Just connects the app to MongoDB using Mongoose.

## server.js
→ Entry point that sets up Express, middleware, loads routes, etc.

## Flow of Authentication

### 1. **Signup – `POST /signup`**
- User provides `name`, `email`, `mobile`, and `password`.
- Password is **hashed** using `bcrypt`.
- A new user is created with `isVerified: false`.
- A **6-digit OTP** is generated and saved for verification.

### 2. **Verify OTP – `POST /verify-otp`**
- User sends `email` and `otp`.
- OTP is checked for **validity and expiry**.
- If correct, the user's `isVerified` status is set to `true`.

### 3. **Login – `POST /login`**
- User logs in with `email` and `password`.
- Password is compared using bcrypt.
- If verified, a **JWT token** is generated.
- Token is sent back in a **HTTP-only cookie** for security.

### 4. **Refresh Token – `POST /refresh-token`**
- If the session cookie exists and is valid:
  - A new JWT is generated and refreshed.
  - Ensures persistent login without forcing frequent re-authentication.

### 5. **Protected Route – `GET /dashboard`**
- Uses middleware to check if a valid JWT token is present.
- Only logged-in users can access this route.
- If token is invalid or missing, returns `401 Unauthorized`.

---
