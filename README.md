# 🏠 Flex Living Reviews Dashboard

A comprehensive review management system for property managers to centralize, moderate, and showcase guest reviews from multiple platforms (Hostaway, Google, Airbnb) in one elegant dashboard.

![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![React](https://img.shields.io/badge/React-18%2B-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 🚀 Live Demo & Repository

| Resource | Link |
|----------|------|
| **Live Frontend** | https://flex-living-assessment-two.vercel.app |
| **API Endpoint** | https://flex-living-backend-wheat.vercel.app/api/reviews/hostaway |
| **GitHub Repository** | https://github.com/Doniaj/flex-living-assessment.git |

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## 🎯 Overview

Flex Living Reviews Dashboard is a full-stack application designed to help property managers:
- **Centralize** reviews from multiple booking platforms (Hostaway, Google, Airbnb)
- **Moderate** reviews with an intuitive approval workflow
- **Showcase** curated reviews on public property pages
- **Analyze** performance trends across properties

Built with modern technologies (React, Node.js, Express) and deployed on Vercel for production-grade reliability.

---

## ✨ Features

### 📊 Core Requirements – All Delivered ✅

| Requirement | Status | Implementation |
|---|---|---|
| Mocked Hostaway API integration | ✅ Done | `GET /api/reviews/hostaway` returns normalized data |
| Parse & normalize real-world JSON | ✅ Done | Handles `rating: null` → calculates overall from categories |
| Manager Dashboard with filters & sort | ✅ Done | Property, rating, channel, status filters + sorting |
| Toggle reviews for public display | ✅ Done | One-click approval workflow |
| Public Property Page | ✅ Done | Shows only selected reviews with modern design |
| Clean, responsive UI | ✅ Done | Fully responsive + Flex Living branded |
| Full-stack deployed on Vercel | ✅ Done | Frontend + backend live & connected |

### 🎨 Manager Dashboard
- **Advanced Filtering** – By property, rating, channel (Hostaway/Google/Airbnb), approval status
- **Smart Sorting** – By date, rating, or property name
- **One-Click Approval** – Instant toggle review visibility
- **KPI Analytics** – Real-time metrics (total, approved, avg rating)
- **Multi-Channel Support** – Reviews from all platforms in one place

### 🌐 Public Property Pages
- **Curated Reviews** – Only approved reviews displayed
- **Dynamic Ratings** – Average calculated from approved reviews only
- **Rich Details** – Images, amenities, pricing information
- **Professional Presentation** – Category ratings & guest testimonials

### 🔗 API Integrations
- **Hostaway API** – Native integration with normalization
- **Google Reviews** – Real-time data via Outscraper API (bonus)
- **Graceful Fallbacks** – Mock data ensures functionality if APIs unavailable

### 🎨 Modern UI/UX
- **Responsive Design** – Desktop, tablet, mobile optimized
- **Real-time Updates** – Instant UI feedback on actions
- **Brand Colors** – Professional Flex Living aesthetic
- **Tailwind CSS** – Clean, accessible styling

---

## 🛠️ Tech Stack

### Backend
```
Node.js 18+ Express Server
├── Express.js – HTTP routing & middleware
├── Axios – API client (Hostaway, Google, Outscraper)
├── dotenv – Environment configuration
└── CORS – Cross-origin request handling
```

### Frontend
```
React 18+ with Vite Bundler
├── Vite – Lightning-fast build tool
├── React Router v6 – Client-side routing
├── Tailwind CSS – Utility-first styling
├── Lucide React – Icon library
└── Axios – API communication
```

### Infrastructure
```
Vercel Serverless Functions
├── Frontend Hosting (Optimized)
├── Backend API (Serverless Node.js)
└── Environment Management
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Git
- A code editor (VS Code recommended)

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/Doniaj/flex-living-assessment.git
cd flexliving-reviews
```

#### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file (or copy .env.example)
echo "HOSTAWAY_API_KEY=your_key_here
OUTSCRAPER_API_KEY=your_key_here
NODE_ENV=development
PORT=3001" > .env

# Start development server
npm run dev
```

**Backend runs on:** `http://localhost:3001`

#### 3. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend runs on:** `http://localhost:5173`

#### 4. Access the Application
- **Manager Dashboard:** http://localhost:5173
- **API Health Check:** http://localhost:3001/api/reviews/hostaway

---

## 📁 Project Structure

```
flexliving-reviews/
├── backend/                              # Express API Server
│   ├── src/
│   │   ├── server.js                    # Entry point, middleware setup
│   │   ├── routes/
│   │   │   ├── reviews.js               # Review CRUD endpoints
│   │   │   └── properties.js            # Property endpoints
│   │   ├── services/
│   │   │   ├── hostawayService.js       # Hostaway integration
│   │   │   └── outscraperService.js     # Google Reviews API
│   │   ├── middleware/
│   │   │   └── errorHandler.js          # Error handling
│   │   └── utils/
│   │       ├── mockData.js              # Mock review data
│   │       └── normalizeReviews.js      # Data normalization
│   ├── .env                              # Environment variables
│   ├── package.json                      # Dependencies
│   └── vercel.json                       # Vercel config
│
├── frontend/                             # React Application
│   ├── src/
│   │   ├── main.jsx & App.jsx           # Entry & routing
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx            # Manager dashboard
│   │   │   └── PropertyPage.jsx         # Public property page
│   │   ├── components/
│   │   │   ├── dashboard/               # Dashboard components
│   │   │   ├── public/                  # Public page components
│   │   │   └── common/                  # Reusable components
│   │   ├── hooks/
│   │   │   ├── useReviews.js            # Review fetching
│   │   │   └── useCombinedReviews.js    # Multi-source hook
│   │   ├── services/api.js              # API client
│   │   ├── utils/dateHelpers.js         # Utility functions
│   │   └── styles/                      # Tailwind & CSS
│   ├── vite.config.js & tailwind.config.js
│   ├── package.json
│   └── vercel.json
│
└── Documentation
    ├── README.md 
```

---

## 🔌 API Documentation

### Base URLs
- **Development:** `http://localhost:3001/api`
- **Production:** `https://flex-living-backend-wheat.vercel.app/api`

### Review Endpoints

#### Get All Reviews
```
GET /reviews/hostaway
```

**Example Response:**
```json
{
  "status": "success",
  "count": 42,
  "data": [
    {
      "id": 7453,
      "listingName": "2B N1 A - 29 Shoreditch Heights",
      "guestName": "Shane Finkelstein",
      "overallRating": 10,
      "publicReview": "Amazing property!",
      "reviewCategory": [
        { "category": "cleanliness", "rating": 10 },
        { "category": "communication", "rating": 10 }
      ],
      "channel": "Hostaway",
      "approved": false,
      "submittedAt": "2024-11-15T14:30:22Z"
    }
  ]
}
```

#### Key Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/reviews/hostaway` | GET | All Hostaway reviews |
| `/reviews/hostaway/:id` | GET | Reviews for specific property |
| `/reviews/google` | GET | Google reviews via Outscraper |
| `/reviews/combined/:id` | GET | Hostaway + Google combined |
| `/reviews/approve` | POST | Toggle review approval |
| `/reviews/public/:id` | GET | Only approved reviews (public) |
| `/reviews/analytics/:id` | GET | Review statistics |

---

## ⚙️ Configuration

### Environment Variables (Backend)

Create `backend/.env`:
```bash
# Hostaway Configuration
HOSTAWAY_ACCOUNT_ID=61148
HOSTAWAY_API_KEY=your_api_key

# Google Reviews (Outscraper)
OUTSCRAPER_API_KEY=your_api_key

# Server
NODE_ENV=development
PORT=3001
```

### Frontend Configuration

Create `frontend/.env.local`:
```bash
# Use local backend in development
VITE_USE_LOCAL_API=true
```

---

## 🌐 Deployment

### Frontend (Vercel)

1. Connect repository:
   ```bash
   npm install -g vercel
   cd frontend
   vercel link
   ```

2. Deploy:
   ```bash
   vercel deploy
   ```

**Live:** https://flex-living-assessment-two.vercel.app

### Backend (Vercel Serverless)

1. Deploy:
   ```bash
   cd backend
   vercel deploy
   ```

2. Set environment variables:
   ```bash
   vercel env add HOSTAWAY_API_KEY
   vercel env add OUTSCRAPER_API_KEY
   ```

**Live:** https://flex-living-backend-wheat.vercel.app/api

---

## 🏛️ Key Engineering Decisions

### 1. Smart Rating Calculation
When `rating: null` but categories exist:
```javascript
// Calculate overall rating from category ratings
const overall = (cleanliness + communication + respect) / 3
```

### 2. Data Normalization Layer
Unified schema for all review sources:
```javascript
{
  id, listingName, guestName, overallRating,
  publicReview, reviewCategory[], channel, approved,
  submittedAt
}
```

### 3. Real Google Reviews Integration
- Uses Outscraper API (no Google Cloud billing required)
- Graceful fallback to mock data if API key missing
- Parallel fetching for performance

### 4. Optimistic UI Updates
- Approve button toggles instantly
- API call happens in background
- Auto-revert on error

### 5. Custom React Hooks
- `useReviews` – Single source fetching
- `useCombinedReviews` – Multi-source with Promise.all
- Encapsulates data logic, reusable across components

---



## 🤝 Contributing

### Development Workflow
```bash
# Create feature branch
git checkout -b feature/amazing-feature

# Make changes & commit
git add .
git commit -m "Add: amazing feature"

# Push & create PR
git push origin feature/amazing-feature
```

---

## 🚀 Future Enhancements

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User authentication (JWT)
- [ ] Batch approval operations
- [ ] Email notifications
- [ ] Advanced analytics & charts
- [ ] Manager reply to reviews
- [ ] Multi-language support
- [ ] Mobile app (iOS/Android)
- [ ] Automated moderation rules
- [ ] Comprehensive test suite

---

## 📞 Support

- **GitHub Issues:** https://github.com/Doniaj/flex-living-assessment/issues
- **Live Demo:** https://flex-living-assessment-two.vercel.app

---

## 📄 License

MIT License – See LICENSE file for details

---

**Author:** Donia Jlidi  
**Status:** Production Ready ✅  
**Last Updated:** November 2024
