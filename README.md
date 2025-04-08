# Influenz - Influencer Marketing Platform

**Influenz** is a web application designed to connect influencers and brands for marketing campaigns. It provides features like influencer verification, social media integration, campaign management, and admin oversight. The platform supports multi-step verification for influencers, including email verification, identity card upload, and social media handle submission, with admin approval workflows.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Database Setup](#database-setup)
  - [Cloudinary Setup](#cloudinary-setup)
  - [Redis Setup](#redis-setup)
  - [Running the Application](#running-the-application)
- [Team Members](#team-members)
- [Contributing](#contributing)
- [License](#license)

## Features
- **User Authentication:** Separate login for influencers, brands, and admins with JWT-based authentication.
- **Influencer Verification:** Multi-step process including:
  - Email verification with OTP (stored in Redis).
  - National identity card upload (stored in Cloudinary).
  - Social media handle submission (Instagram, Facebook, TikTok, YouTube).
- **Admin Dashboard:** Admins can review and approve/reject influencer verification submissions.
- **Social Media Integration:** Connect YouTube accounts via OAuth for verification.
- **Protected Routes:** Role-based access control for influencers, brands, and admins.
- **State Management:** Redux for managing user state in the frontend.
- **Responsive UI:** Step-by-step verification UI with a progress indicator.

## Tech Stack

### Backend
- **Node.js** with **Express.js**: Server-side framework for building RESTful APIs.
- **PostgreSQL**: Relational database for persistent storage.
- **Redis**: In-memory data store for temporary OTP storage.
- **Nodemailer**: For sending OTP emails via Gmail.
- **Cloudinary**: Cloud storage for uploading and managing identity card images.
- **jsonwebtoken (JWT)**: For user authentication and authorization.
- **bcrypt**: For password hashing.
- **multer**: For handling file uploads.
- **ioredis**: Redis client for Node.js.
- **cors**: For enabling cross-origin resource sharing.
- **cookie-parser**: For parsing cookies in HTTP requests.

### Frontend
- **Next.js**: React framework for server-side rendering and routing.
- **React**: JavaScript library for building user interfaces.
- **Redux Toolkit**: For state management (user data like ID, name, role).
- **Axios**: For making HTTP requests to the backend.
- **CSS-in-JS**: Scoped styles using Next.js's `<style jsx>` for the verification page.

### Database
- **PostgreSQL**: Stores user data, influencer profiles, verification details, and more.
- **Redis**: Used for temporary storage of OTPs with a 5-minute expiration.

### Third-Party Services
- **Cloudinary**: For storing and serving identity card images.
- **Gmail (via Nodemailer)**: For sending OTP emails.
- **YouTube API**: For OAuth-based YouTube account connection.

## Setup Instructions

### Prerequisites
Ensure you have the following installed on your system:
- **Node.js** (v16 or higher)
- **npm** (v8 or higher) or **yarn**
- **PostgreSQL** (v12 or higher)
- **Redis** (v6 or higher)
- A **Cloudinary** account for image storage
- A **Gmail** account for sending emails (with an app password for Nodemailer)

### Backend Setup
1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/influenz.git
   cd influenz/backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   Create a `.env` file in the `backend` directory and add the following:
   ```env
   DATABASE_URL=postgres://username:password@localhost:5432/influenz_db
   JWT_SECRET=your_jwt_secret
   SESSION_SECRET=your_session_secret
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASS=your_gmail_app_password
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   REDIS_URL=redis://default:your_redis_password@your_redis_host:your_redis_port
   PORT=5000
   ```
   - Replace `DATABASE_URL` with your PostgreSQL connection string.
   - Replace `REDIS_URL` with your Redis connection string (e.g., from Redis Cloud).
   - Generate a secure `JWT_SECRET` and `SESSION_SECRET`.
   - Use a Gmail app password for `EMAIL_PASS` (not your regular password).

### Frontend Setup
1. **Navigate to the Frontend Directory**
   ```bash
   cd ../frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   Create a `.env.local` file in the `frontend` directory and add:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
   - This points to your backend API. Adjust if your backend runs on a different port or host.

### Database Setup
1. **Create the Database**
   ```bash
   psql -U postgres
   CREATE DATABASE influenz_db;
   \q
   ```

2. **Run the Schema**
   Execute the SQL schema to create the necessary tables. Assuming you have a `schema.sql` file in the `backend` directory:
   ```bash
   psql -U postgres -d influenz_db -f backend/schema.sql
   ```
   The schema should include tables like `users`, `influencers`, and any others defined in your project.

3. **Insert an Admin User (Optional)**
   Manually insert an admin user for testing:
   ```sql
   INSERT INTO users (email, password_hash, name, user_type)
   VALUES ('admin@example.com', '$2b$10$your_hashed_password', 'Admin User', 'admin');
   ```
   - Use `bcrypt` to hash the password before inserting.

### Cloudinary Setup
1. Sign up for a Cloudinary account at [cloudinary.com](https://cloudinary.com).
2. Get your `cloud_name`, `api_key`, and `api_secret` from the Cloudinary dashboard.
3. Add these to your backend `.env` file as shown above.

### Redis Setup
1. If using a local Redis instance:
   - Install Redis: Follow instructions for your OS (e.g., `brew install redis` on macOS).
   - Start Redis: `redis-server`.
2. If using a hosted Redis (e.g., Redis Cloud):
   - Sign up at [redis.com](https://redis.com) and get your connection URL.
   - Add the `REDIS_URL` to your backend `.env` file.

### Running the Application
1. **Start the Backend**
   ```bash
   cd backend
   npm start
   ```
   - The backend should run on `http://localhost:5000`.

2. **Start the Frontend**
   ```bash
   cd ../frontend
   npm run dev
   ```
   - The frontend should run on `http://localhost:3000`.

3. **Access the Application**
   - Open `http://localhost:3000` in your browser.
   - Log in as an influencer, brand, or admin to test the features.

## Team Members
- **Illangasinghe I.M.D.P**
- **Asith Dilusha**
- **Hiruna Nimesh**
- **Kasun Dilhara**
- **Gayathri Harshila**

## Contributing
1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Make your changes and commit: `git commit -m "Add your message"`.
4. Push to your branch: `git push origin feature/your-feature-name`.
5. Create a pull request to the `main` branch.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
```
