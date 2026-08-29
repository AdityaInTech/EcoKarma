#  EcoKarma

EcoKarma is a full-stack, gamified environmental action platform. It empowers communities to organize cleanups, report ecological issues, and take real-world action. Users earn "Karma Points" for verified eco-friendly activities, which can be tracked on a global leaderboard and redeemed for exclusive real-world perks.

## 🚀 Features

* **Gamified Action Feed:** View, like, and interact with community cleanup posts and environmental SOS alerts.
* **Karma Economy:** Earn points and level up by completing verified eco-missions.
* **Reward System (Perks):** Redeem earned Karma points for digital or physical rewards.
* **Leaderboard:** Compete with other users globally to become the top environmental contributor.
* **Secure Authentication:** JWT-based user login and registration system.
* **Media Uploads:** Upload image and video proof of completed environmental work.

## 💻 Tech Stack

**Frontend (Client)**
* React.js (built with Vite for speed)
* Tailwind CSS (for responsive, modern styling)
* React Router DOM (for seamless navigation)
* Axios (for API communication)

**Backend (Server)**
* Node.js & Express.js (RESTful API architecture)
* MongoDB & Mongoose (NoSQL Database)
* JWT (JSON Web Tokens for secure authentication)
* CORS (Cross-Origin Resource Sharing configuration)

**Deployment**
* Frontend: Vercel (`https://eco-karma.vercel.app`)
* Backend: Render (`https://ecokarma.onrender.com`)

## 📂 Folder Structure

```text
EcoKarma/
│
├── backend/                     # Node.js / Express Server
│   ├── controllers/             # Core business logic
│   │   ├── authController.js
│   │   ├── missionController.js
│   │   ├── perkController.js
│   │   ├── postController.js
│   │   └── userController.js
│   ├── middleware/              # Custom middleware (e.g., file handling, auth checks)
│   │   └── upload.js
│   ├── models/                  # Mongoose Database Schemas
│   │   ├── Mission.js
│   │   ├── Perk.js
│   │   ├── Post.js
│   │   └── User.js
│   ├── routes/                  # API endpoints definition
│   │   ├── authRoutes.js
│   │   ├── missionRoutes.js
│   │   ├── perkRoutes.js
│   │   ├── postRoutes.js
│   │   └── userRoutes.js
│   ├── .env                     # Secret environment variables (ignored by Git)
│   ├── package.json             # Backend dependencies
│   └── server.js                # Main backend entry point
│
├── frontend/                    # React / Vite Client application
│   ├── public/                  # Static assets and images
│   ├── src/                     # Main source code
│   │   ├── api/
│   │   │   └── axios.js         # Centralized Axios configuration and base URL
│   │   ├── assets/              # Icons and global styling assets
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── layout/              # Page wrapper layouts
│   │   │   └── DashboardLayout.jsx
│   │   ├── pages/               # Main application views
│   │   │   ├── AboutUs.jsx
│   │   │   ├── ActionHub.jsx
│   │   │   ├── Auth.jsx
│   │   │   ├── CommunitySOS.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Perks.jsx
│   │   │   └── Profile.jsx
│   │   ├── App.jsx              # Application router and state provider
│   │   ├── index.css            # Global Tailwind imports
│   │   └── main.jsx             # React DOM rendering entry point
│   ├── eslint.config.js         # Linter rules
│   ├── postcss.config.js        # PostCSS setup for Tailwind
│   ├── tailwind.config.js       # Tailwind theme and utility configurations
│   ├── vite.config.js           # Vite bundler settings
│   └── package.json             # Frontend dependencies
│
└── .gitignore                   # Global git ignore rules (node_modules, .env, etc.)
```

## 🛠️ Local Development Setup

To run this project locally on your machine, follow these steps:

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [Git](https://git-scm.com/) installed on your computer. You will also need a free [MongoDB Atlas](https://www.mongodb.com/atlas) account for the database.

### 2. Clone the Repository
```bash
git clone [https://github.com/AdityaInTech/EcoKarma.git](https://github.com/AdityaInTech/EcoKarma.git)
cd EcoKarma
```

### 3. Backend Setup
Open a terminal and navigate to the backend folder:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder and add the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```
Start the backend server:

Bash
npm run dev

### 4. Frontend Setup
Open a new separate terminal window and navigate to the frontend folder:

Bash
cd frontend
npm install
Ensure your frontend/src/api/axios.js file is pointing to your local backend for testing:

JavaScript
// Change to http://localhost:5000/api for local development
baseURL: 'http://localhost:5000/api'
Start the React development server:

Bash
npm run dev
Your app should now be running locally at http://localhost:5173!

## Author
Built by **Aditya Parmale**

