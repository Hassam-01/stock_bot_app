# Stock Bot - Full Stack Repository

## Overview
This repository contains the full-stack implementation of Stock Bot, a stock trading application with real-time recommendations. The project includes both the frontend and backend in a single repository, but please note that this version is behind the separately maintained repositories for the frontend and backend.

## ⚠ Important Note
This repository is **versions behind** the separately maintained repositories for the frontend and backend. For the latest updates and features, please refer to the individual repositories:
- **Frontend (React.js)**: [Stock Bot Client](https://github.com/Hassam-01/stock_bot_app)
- **Backend (Node.js)**: [Stock Bot Web Server](https://github.com/Hassam-01/stock_bot_web_server)
- **Prediction Model (Python)**: [Stock Bot Prediction Server](https://github.com/Hassam-01/Stock_bot)

## Features
### Frontend
- Built with React.js and Tailwind CSS
- User authentication and profile management
- Dashboard for viewing assets, transaction history, and balance
- Stock trading interface with buy/sell recommendations

### Backend
- Node.js with Express.js
- PostgreSQL database hosted on Supabase
- Authentication using JWT tokens and bcrypt password hashing
- Secure API endpoints for user management and trading

## Tech Stack
- **Frontend**: React.js, Tailwind CSS, Redux Toolkit, React Router DOM
- **Backend**: Node.js, Express.js, PostgreSQL (Supabase), TypeORM
- **Security**: JWT authentication, bcrypt password hashing, CORS

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Hassam-01/stock_bot_app.git
   ```
2. Navigate to the project folder:
   ```bash
   cd stock_bot_app
   ```
3. Install dependencies for both frontend and backend:
   ```bash
   npm install
   ```
4. Set up environment variables in a `.env` file:
   ```env
   DATABASE_URL=your_supabase_database_url
   JWT_SECRET=your_jwt_secret
   COOKIE_SECRET=your_cookie_secret
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

## Usage
- Open the application in your browser.
- Register or log in to your account.
- View assets, transaction history, and balance on the dashboard.
- Navigate to the "Trade Now" section to get stock recommendations and execute trades.


---
### Connect
For any questions or collaborations, feel free to reach out!

