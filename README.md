## 📂 Project structure

```text
♻️ TakaPlus/
├── .gitignore
├── README.md
├── .env.example
├── docs/
│   ├── architecture.md
│   ├── api-contracts.md
│   └── wireframes/
│       └── dashboard.png
│
├── client/                     # frontend (React)
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── index.js
│   │   ├── App.jsx
│   │   ├── main.css
│   │   ├── api/
│   │   │   └── api.js          # central API wrapper (axios/fetch)
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Listings.jsx
│   │   │   ├── AddListing.jsx
│   │   │   ├── ListingDetail.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Login.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ListingCard.jsx
│   │   │   ├── CreateListingForm.jsx
│   │   │   ├── BidModal.jsx
│   │   │   └── Pagination.jsx
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── utils/
│   │   │   └── impact.js       # CO₂ / impact calculations for UI
│   │   └── assets/
│   │       ├── logo.png
│   │       └── placeholder.jpg
│   └── vite.config.js          # Vite config / CRA files
│
└── server/                     # backend (Node + Express + Mongoose)
    ├── package.json
    ├── .env.example            # server-specific env vars
    ├── server.js
    ├── config/
    │   └── db.js               # mongoose connection helper
    ├── routes/
    │   ├── auth.js             # register/login
    │   ├── listings.js
    │   └── bids.js
    ├── controllers/
    │   ├── authController.js
    │   ├── listingsController.js
    │   └── bidsController.js
    ├── models/
    │   ├── User.js             # Mongoose schema
    │   ├── Listing.js
    │   └── Bid.js
    ├── middleware/
    │   ├── auth.js             # JWT auth middleware
    │   └── errorHandler.js
    │   ├── services/
    │   │   ├── paymentService.js      # optional (M-Pesa / Stripe)
    │   │   └── notificationService.js
    ├── utils/
    │   └── impact.js
    ├── seed/                   # optional scripts to seed demo data
    │   └── seedListings.js
    ├── tests/                  # optional: jest/mocha tests
    │   └── listings.test.js
    └── Dockerfile
