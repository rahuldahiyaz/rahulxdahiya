# Order Management System

A comprehensive Next.js application for managing orders with role-based access control, built with Prisma ORM and MySQL database.

## 🚀 Features

- **Authentication & Authorization**: Secure login/signup with NextAuth.js, Google OAuth, GitHub OAuth, and bcrypt
- **Password Reset**: Complete password reset functionality with secure token-based system
- **Role-Based Access Control**: Admin, User, and Operations Manager roles
- **Order Management**: Complete order lifecycle from creation to completion
- **Real-time Updates**: Live status updates using React Query
- **Audit Logging**: Track all system changes and user actions
- **Export Functionality**: CSV/Excel export capabilities
- **Modern UI**: Beautiful, responsive design with TailwindCSS and shadcn/ui
- **Profile Management**: User profile with photo upload functionality

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ (App Router), React, TypeScript
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: MySQL with Prisma ORM
- **Authentication**: NextAuth.js with Google & GitHub OAuth
- **Styling**: TailwindCSS, shadcn/ui components
- **Forms**: React Hook Form with Zod validation
- **State Management**: React Query (TanStack Query)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **MySQL** database server (v8.0 or higher)
- **Git** for version control

## 🔧 Installation & Setup

### 1. Clone the Repository

\`\`\`bash
git clone <repository-url>
cd order-management-system
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 3. Environment Configuration

Create a `.env` file in the root directory and add the following environment variables:

\`\`\`env
# Database Configuration
DATABASE_URL="mysql://username:password@localhost:3306/order_management_db"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-here"

# Google OAuth Configuration
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth Configuration
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"

# Optional: File Upload Configuration
UPLOAD_DIR="./public/uploads"
\`\`\`

**Important**: Replace the database credentials and OAuth credentials with your actual values.

### 4. OAuth Setup

#### Google OAuth Setup:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client IDs
5. Set authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to your `.env` file

#### GitHub OAuth Setup:
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Client Secret to your `.env` file

### 5. Database Setup

#### Step 5.1: Create MySQL Database

Connect to your MySQL server and create the database:

\`\`\`sql
CREATE DATABASE order_management_db;
\`\`\`

#### Step 5.2: Generate Prisma Client

\`\`\`bash
npx prisma generate
\`\`\`

#### Step 5.3: Push Database Schema

\`\`\`bash
npx prisma db push
\`\`\`

This command will:
- Create all the required tables (users, orders, rake_order_priority, rake_ord, audit_logs)
- Set up the database schema according to the Prisma schema
- Add password reset fields to the users table

#### Step 5.4: Seed Initial Data

Run the seed script to populate initial data:

\`\`\`bash
npx prisma db seed
\`\`\`

This will create:
- Initial priority levels in `rake_order_priority` table
- Sample steel company destinations and mills in `rake_ord` table
- Default admin user (email: admin@company.com, password: admin123)
- Sample operations manager and user accounts

## 🚀 Running the Application

### Development Mode

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

The application will be available at `http://localhost:3000`

### Production Build

\`\`\`bash
npm run build
npm start
# or
yarn build
yarn start
\`\`\`

## 🔐 Authentication Features

### Multiple Sign-In Options
- **Email/Password**: Traditional credential-based authentication
- **Google OAuth**: Sign in with Google account
- **GitHub OAuth**: Sign in with GitHub account

### Password Reset Flow
1. User clicks "Forgot Password" on sign-in page
2. Enters email address
3. System generates secure reset token
4. User receives reset instructions (logged to console in development)
5. User clicks reset link and enters new password
6. Password is securely updated with bcrypt hashing

### Security Features
- **Password Hashing**: bcrypt with salt rounds
- **Secure Tokens**: Crypto-generated reset tokens with expiration
- **Session Management**: Secure JWT tokens with NextAuth
- **OAuth Integration**: Secure third-party authentication
- **Route Protection**: Middleware-based access control

## 👥 User Roles & Permissions

### Admin
- **Dashboard**: `/admin/dashboard`
- **Permissions**: 
  - Manage all users and assign roles
  - View all orders and override status
  - Access system analytics and audit logs
  - Full CRUD operations on all entities

### User
- **Dashboard**: `/user/dashboard`
- **Permissions**:
  - Create new orders
  - Edit orders in "Draft" status
  - Finalize orders (Draft → Finalized)
  - View own orders and their status
  - Update profile information

### Operations Manager
- **Dashboard**: `/order-fulfillment`
- **Permissions**:
  - View all "Finalized" orders
  - Update fulfillment details
  - Mark orders as "Completed"
  - Export order data
  - Update profile information

## 🎨 Modern UI Features

### Enhanced Design Elements
- **Gradient Backgrounds**: Beautiful gradient overlays
- **Glass Morphism**: Backdrop blur effects on cards
- **Smooth Animations**: Transition effects throughout the app
- **Password Strength Indicators**: Visual feedback for password security
- **Interactive Icons**: Contextual icons with hover effects
- **Responsive Design**: Mobile-first approach with breakpoint optimization

### Improved User Experience
- **OAuth Integration**: One-click sign-in with Google/GitHub
- **Password Visibility Toggle**: Show/hide password functionality
- **Form Validation**: Real-time validation with visual feedback
- **Loading States**: Smooth loading indicators
- **Success/Error States**: Clear feedback for user actions

## 📊 Database Schema Overview

### Core Tables

1. **users**: User accounts with role-based access and OAuth support
2. **orders**: Order management with status tracking
3. **rake_order_priority**: Priority level definitions
4. **rake_ord**: Reference data for steel companies and mills
5. **audit_logs**: System activity tracking

### New Fields Added
- **resetToken**: Secure token for password reset
- **resetTokenExpiry**: Token expiration timestamp

## 🛡️ Security Enhancements

- **OAuth Security**: Secure third-party authentication
- **Token-Based Reset**: Cryptographically secure password reset
- **Session Security**: Enhanced JWT token management
- **Input Validation**: Comprehensive form validation
- **CSRF Protection**: Built-in Next.js CSRF protection
- **SQL Injection Prevention**: Prisma ORM parameterized queries

## 📱 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login (NextAuth)
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/callback/google` - Google OAuth callback
- `GET /api/auth/callback/github` - GitHub OAuth callback

### Admin APIs
- `GET /api/admin/users` - List all users
- `PATCH /api/admin/users/[id]/role` - Update user role
- `GET /api/admin/orders/recent` - Recent orders overview

### Order APIs
- `GET /api/orders` - List orders (filtered by role)
- `POST /api/orders` - Create new order
- `PATCH /api/orders/[id]` - Update order
- `DELETE /api/orders/[id]` - Delete order
- `POST /api/orders/[id]/complete` - Mark order as completed

## 🚨 Troubleshooting

### OAuth Issues

1. **Google OAuth Error**
   - Verify Google Client ID and Secret in `.env`
   - Check authorized redirect URIs in Google Console
   - Ensure Google+ API is enabled

2. **GitHub OAuth Error**
   - Verify GitHub Client ID and Secret in `.env`
   - Check authorization callback URL in GitHub settings
   - Ensure OAuth App is properly configured

3. **Password Reset Issues**
   - Check database schema includes resetToken fields
   - Verify NEXTAUTH_URL is correctly set
   - Check console logs for reset links in development

### Common Issues

1. **Database Connection Error**
   - Verify MySQL server is running
   - Check DATABASE_URL in .env file
   - Ensure database exists and credentials are correct

2. **NextAuth Session Error**
   - Verify NEXTAUTH_SECRET is set in .env
   - Check NEXTAUTH_URL matches your domain
   - Clear browser cookies and localStorage

## 🔄 Version History

- **v2.0.0** - Major UI overhaul and OAuth integration
  - Google and GitHub OAuth authentication
  - Complete password reset functionality
  - Modern UI with gradient backgrounds and glass morphism
  - Enhanced form validation and user feedback
  - Improved responsive design

- **v1.0.0** - Initial release with core functionality
  - User authentication and role-based access
  - Order management system
  - Admin panel for user management
  - Operations dashboard for order fulfillment

---

**Built with ❤️ using Next.js, Prisma, MySQL, and NextAuth.js**
