TakaPlus/
├── README.md                # Project overview & setup instructions
├── package.json             # Frontend dependencies
├── .env                     # API keys, DB URLs (never commit actual keys)
├── public/                  # Static assets (favicon, logos)
│   └── index.html
├── src/                     # All frontend code
│   ├── main.jsx             # Entry point (Vite/React)
│   ├── App.jsx              # Root component / router
│   ├── assets/              # Images, icons
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── MapView.jsx       # Map showing smart bins
│   │   ├── ListingCard.jsx   # Card for recyclables listings
│   │   └── ...
│   ├── pages/               # Page-level views
│   │   ├── Home.jsx
│   │   ├── Listings.jsx      # List recyclables for pickup
│   │   ├── AddListing.jsx
│   │   ├── MapPage.jsx       # Full screen bin map
│   │   ├── Dashboard.jsx
│   │   └── Login.jsx
│   ├── context/             # React context for auth, user, map data
│   │   ├── AuthContext.jsx
│   │   └── ListingsContext.jsx
│   ├── hooks/               # Custom React hooks (useFetch, useAuth)
│   ├── services/            # API calls
│   │   ├── api.js            # Axios/fetch wrappers
│   │   └── listingsService.js
│   ├── styles/              # Tailwind
│   └── utils/               # Helper functions (geolocation, impact calc)
│
├── server/                  # Backend 
│   ├── package.json
│   ├── server.js            # Express app entry point
│   ├── config/              # DB, env config
│   │   └── db.js
│   ├── routes/              # API endpoints
│   │   ├── listings.js
│   │   ├── bins.js
│   │   └── auth.js
│   ├── controllers/         # Request handlers
│   ├── models/              # DB models (User, Listing, Bin)
│   └── middleware/          # Auth, validation
│
└── docs/                    # Extra docs 
    ├── project-summary.md
    ├── wireframes/          # Images of mockups
    └── architecture-diagram.png
