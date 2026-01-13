# BookWorm Frontend 📚✨

Welcome to the **BookWorm Frontend**, a modern, responsive, and feature-rich web application built for a community of avid readers. This application provides a premium user experience for tracking reading progress, discovering new books, and engaging with other readers.

**🌐 Live Demo:** [https://book-worm-front-end.vercel.app/](https://book-worm-front-end.vercel.app/)

---

## 🚀 Key Features

### 📖 For Readers
- **Personal Library**: Organize your books into *Want to Read*, *Currently Reading*, and *Read* shelves.
- **Progress Tracking**: Log pages as you read and watch your status update dynamically.
- **Reading Streak**: Stay motivated with a visual streak tracker that counts consecutive reading days.
- **Interactive Dashboard**: Gain insights with visual charts (Monthly Progress, Favorite Genres) powered by Recharts.
- **Personalized Recommendations**: A custom engine suggests books based on your favorite genres and history.
- **Social Ecosystem**: Follow other users, see their reading updates in a live feed, and discover suggested readers.
- **Advanced Search & Filter**: Find books by title, author, genre, or rating with a sleek filtering system.
- **PDF Reader**: Read uploaded book content directly in the browser.

### 🛡️ Admin Features
- **Moderation Dashboard**: Approve or reject pending user reviews.
- **Platform Analytics**: Global stats on users, books, and platform engagement.
- **Content Management**: Tools to manage the book collection and platform metadata.

---

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [DaisyUI](https://daisyui.com/)
- **State Management**: React Context API (AuthContext)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Alerts**: [SweetAlert2](https://sweetalert2.github.io/)
- **API Communication**: [Axios](https://axios-http.com/) with Request/Response interceptors.

---

## 🔧 How It Works

1. **Authentication**: Uses a hybrid approach. The backend sends a JWT in an `httpOnly` cookie for security and in the response body as a fallback. The frontend stores the token in `localStorage` and uses an **Axios Interceptor** to attach it to every request header.
2. **Navigation**: Protected routes ensure only authenticated users can access the dashboard and library.
3. **Data Fetching**: All data fetching is optimized using `Promise.all` where possible to minimize loading times.
4. **Theming**: Supports standard light/dark modes based on the user's system preference.

---

## 🐞 Error Handling & Optimization (Fixes Implemented)

We prioritised a "Wow" experience through continuous refinement:

- **Authentication Fallback**: Solved cross-domain cookie issues (common on Vercel) by implementing a JWT interceptor that attaches tokens from LocalStorage if cookies are blocked.
- **Mobile Responsiveness**: 
    - Fixed spacing and padding issues in Login/Register forms for a minimal, professional look on small devices.
    - Optimized the **Stats Grid**: Transitions from a 4-column layout on desktop to a 2-column grid on mobile for better readability.
    - Adjusted dropdown menus and buttons in the Book Details page to prevent screen overflow.
- **Interaction Fixes**:
    - **Click Interception**: Fixed a bug where decorative background elements blocked input clicks by applying `pointer-events-none`.
    - **Form Reliability**: Moved registration links outside `<form>` tags to prevent accidental form submissions on mobile.
- **Visual Polish**: 
    - Replaced generic spinners with custom **Skeleton Screen Loaders** to improve perceived performance.
    - Added decorative blur elements and glassmorphism effects for a premium feel.

---

## ⚙️ Installation & Setup

1. **Clone the repo**:
   ```bash
   git clone <repository-url>
   cd bookworm-frontend
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Create a `.env` file:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-api.vercel.app/api
   ```
4. **Run development server**:
   ```bash
   npm run dev
   ```

---
*Created with ❤️ by the BookWorm Team.*
