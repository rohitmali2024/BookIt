# BookIt - Experience & Slots Booking Platform

A complete MERN stack application for booking travel experiences with slot management, user authentication, and promo code support.

## Features

- **User Authentication**: Register and login with secure JWT tokens
- **Experience Browsing**: Browse and filter travel experiences
- **Slot Selection**: View available dates and times for each experience
- **Checkout Flow**: Complete booking with guest details and promo codes
- **Promo Codes**: Apply discount codes (percentage or fixed amount)
- **Booking Management**: View and manage all your bookings
- **Responsive Design**: Mobile-friendly interface with TailwindCSS
- **Professional UI**: Clean and modern design with smooth interactions

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Next.js 14** (App Router)
- **TailwindCSS** for styling
- **Axios** for API calls
- **React Context** for state management

### Backend
- **Node.js** with Express.js
- **MongoDB** for database
- **JWT** for authentication
- **Bcryptjs** for password hashing
- **CORS** for cross-origin requests

## Project Structure

\`\`\`
bookit-mern/
├── app/                          # Next.js app directory
│   ├── page.tsx                 # Landing page
│   ├── login/page.tsx           # Login page
│   ├── register/page.tsx        # Registration page
│   ├── experiences/
│   │   ├── page.tsx             # Experiences listing
│   │   └── [id]/page.tsx        # Experience details
│   ├── checkout/[id]/page.tsx   # Checkout page
│   ├── booking-result/[id]/page.tsx  # Booking confirmation
│   ├── my-bookings/page.tsx     # User bookings
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/
│   ├── navbar.tsx               # Navigation bar
│   └── auth/
│       ├── login-form.tsx       # Login form
│       └── register-form.tsx    # Registration form
├── lib/
│   ├── api.ts                   # API client
│   └── auth-context.tsx         # Auth context provider
├── public/                       # Static assets
└── server/                       # Backend
    ├── server.js                # Express server
    ├── models/
    │   ├── User.js              # User model
    │   ├── Experience.js        # Experience model
    │   ├── Booking.js           # Booking model
    │   └── PromoCode.js         # Promo code model
    ├── routes/
    │   ├── auth.js              # Auth routes
    │   ├── experiences.js       # Experience routes
    │   ├── bookings.js          # Booking routes
    │   └── promo.js             # Promo code routes
    ├── middleware/
    │   └── auth.js              # JWT verification
    └── scripts/
        └── seedData.js          # Database seeding
\`\`\`

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- MongoDB (local or cloud)
- Git

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd bookit-mern
   \`\`\`

2. **Install frontend dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Install backend dependencies**
   \`\`\`bash
   cd server
   npm install
   cd ..
   \`\`\`

4. **Set up environment variables**

   Create `.env.local` in the root directory:
   \`\`\`
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   \`\`\`

   Create `.env` in the `server` directory:
   \`\`\`
   MONGODB_URI=mongodb://localhost:27017/bookit
   JWT_SECRET=your-secret-key-here
   PORT=5000
   \`\`\`

5. **Seed the database**
   \`\`\`bash
   cd server
   node scripts/seedData.js
   cd ..
   \`\`\`

### Running the Application

1. **Start the backend server**
   \`\`\`bash
   cd server
   npm start
   # or for development with auto-reload
   npm run dev
   \`\`\`

2. **In a new terminal, start the frontend**
   \`\`\`bash
   npm run dev
   \`\`\`

3. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)

### Experiences
- `GET /api/experiences` - Get all experiences
- `GET /api/experiences/:id` - Get experience details

### Bookings
- `POST /api/bookings` - Create a new booking (requires token)
- `GET /api/bookings` - Get user's bookings (requires token)

### Promo Codes
- `POST /api/promo/validate` - Validate promo code

## Sample Promo Codes

The database is seeded with these promo codes:
- `SAVE10` - 10% discount
- `FLAT100` - $100 fixed discount
- `WELCOME20` - 20% discount

## Features Walkthrough

### 1. Landing Page
- View featured experiences
- Learn about BookIt benefits
- Quick access to login/register

### 2. Authentication
- Secure registration with password hashing
- JWT-based login
- Protected routes

### 3. Experience Browsing
- View all available experiences
- See ratings, reviews, and amenities
- Filter by location and price

### 4. Booking Flow
- Select date and time slots
- View real-time availability
- See booking summary

### 5. Checkout
- Enter guest details
- Apply promo codes
- View final pricing
- Confirm booking

### 6. Booking Confirmation
- View booking details
- Booking ID for reference
- Option to book more experiences

## Database Schema

### User
\`\`\`javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
\`\`\`

### Experience
\`\`\`javascript
{
  title: String,
  description: String,
  image: String,
  location: String,
  price: Number,
  rating: Number,
  reviews: Number,
  amenities: [String],
  slots: [{
    date: Date,
    time: String,
    available: Number,
    booked: Number
  }],
  createdAt: Date
}
\`\`\`

### Booking
\`\`\`javascript
{
  userId: ObjectId (ref: User),
  experienceId: ObjectId (ref: Experience),
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  date: Date,
  time: String,
  guests: Number,
  totalPrice: Number,
  promoCode: String,
  discount: Number,
  status: String (confirmed/cancelled),
  createdAt: Date
}
\`\`\`

### PromoCode
\`\`\`javascript
{
  code: String (unique, uppercase),
  discountType: String (percentage/fixed),
  discountValue: Number,
  maxUses: Number,
  currentUses: Number,
  expiryDate: Date,
  active: Boolean,
  createdAt: Date
}
\`\`\`

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected API routes with middleware
- CORS configuration
- Input validation on both frontend and backend

## Performance Optimizations

- Lazy loading of images
- Optimized API calls with Axios
- Client-side caching with React Context
- Responsive images with Next.js Image component
- CSS-in-JS with TailwindCSS

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy

### Backend (Heroku/Railway/Render)
1. Create account on hosting platform
2. Connect MongoDB Atlas
3. Set environment variables
4. Deploy

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally or check connection string
- Verify network access if using MongoDB Atlas

### API Not Responding
- Check if backend server is running on port 5000
- Verify NEXT_PUBLIC_API_URL in frontend

### Authentication Issues
- Clear browser localStorage
- Check JWT_SECRET matches between frontend and backend
- Verify token expiration

## Future Enhancements

- Payment integration (Stripe)
- Email notifications
- Review and rating system
- Wishlist functionality
- Advanced filtering and search
- Admin dashboard
- Booking cancellation
- Refund management

## License

MIT License - feel free to use this project for learning and development.

## Support

For issues and questions, please create an issue in the repository.
