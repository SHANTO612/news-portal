## Overview

This project is a **complete online news system**.  
You can think of it as three parts that work together:

- A **control panel** (dashboard) for admins and writers.
- A **public news website** where visitors read the news.
- A **server** in the middle that stores data safely and talks to both.

 you can still understand this project by thinking in terms of:

- **Who uses it** (Admin, Writer, Reader).
- **What each person can do**.
- **How the news flows** from idea → written article → published on the website.

Below you’ll find:
- Plain‑language explanations first.
- More technical details after that, for developers.

---

## User Types and What They Can Do

### 1. Admin

The **Admin** is like the editor‑in‑chief of a news company.

Admin can:
- **Log in** with email and password.
- **Create writer accounts** (name, email, password, category).
- **See a dashboard** with total news, pending news, active news, deactivated news, and number of writers.
- **See all news** written by everyone.
- **Approve or reject news** by changing its status:
  - `pending` – waiting for review.
  - `active` – approved and visible on the public site.
  - `deactive` – hidden from the public but kept in the system.
- **Edit or delete any news article.**
- **Manage writers**:
  - Edit writer details (name, email, category, role).
  - Delete writers.
- **Manage their own profile** (name, email, profile picture).
- **Change their password.**

### 2. Writer

The **Writer** is like a journalist who writes and manages their own articles.

Writer can:
- **Log in** with email and password.
- **See a personal dashboard** with statistics:
  - Total number of news they wrote.
  - Pending news, active news, and deactivated news.
- **Create news**:
  - Add a title, choose category, write news content with a rich text editor (bold, links, etc.).
  - Upload an image from their computer.
  - Or pick an image from their **personal image gallery**.
- **Edit their own news.**
- **Delete their own news.**
- **See a list of their recent news** in a table.
- **Manage their profile** (name, email, profile picture).
- **Change their password.**

### 3. Public Reader

The **Reader** is a normal visitor on the public website.

Reader can:
- **See the homepage** with:
  - Top headlines.
  - Latest news.
  - Popular news.
  - News grouped by topic (Technology, Sports, Health, Education, etc.).
- **Open a news article** to:
  - See image, title, category, date, and writer name.
  - Read the full formatted content.
  - View **related news** in the sidebar.
- **Browse by category** (e.g., only Sports news).
- **Use search** to find news by keywords.
- **See “recent news” widgets** in sidebars and footer.

---

## How the System Works (In Simple Steps)

1. **Admin creates writers**
   - Admin logs into the dashboard.
   - Goes to “Add Writer” page.
   - Fills in writer details and saves.

2. **Writer logs in and writes news**
   - Writer logs in with the email and password given by Admin.
   - Opens “Create News”.
   - Writes title and content, chooses category.
   - Uploads an image or picks one from gallery.
   - Submits the news. It becomes **pending**.

3. **Admin reviews and approves**
   - Admin opens the news list.
   - Checks pending news.
   - Changes status to **active** when it should be shown to the public.

4. **Public can read the news**
   - The public Next.js site calls the backend to get:
     - Latest news.
     - Popular news (based on view count).
     - News by category.
     - News details by slug (SEO‑friendly URL).
   - Only **active** news show on the public website.

5. **System tracks popularity**
   - When a reader opens a news detail page, the backend increases a view counter.
   - Popular news section uses this counter to show most‑read articles.

---

## Non‑Technical Explanation of the Parts

### Dashboard (Admin + Writer)

- This is a **private area**, not visible to the public.
- Accessible at something like `http://localhost:5173` in development or your deployed dashboard URL.
- After logging in, the menu changes depending on your role:
  - Admin sees options to manage writers and all news.
  - Writer sees options to manage only their own news.
- Most things are shown in **tables and cards**:
  - Tables for lists (writers, news).
  - Cards for quick statistics (how many news, etc.).

### Public Site (News Website)

- This is the **public face** of your news brand.
- Accessible at `http://localhost:3000` in development or a production URL.
- Designed for **readers**, not for editors.
- Shows:
  - A large header and navigation with categories.
  - Dynamic sections like Latest News, Popular News.
  - Detail pages for each article with related content.

### Backend (Server and Database)

- This part is not directly seen by users.
- It:
  - Stores user accounts, news, images (via URLs), and statistics.
  - Checks passwords and logins.
  - Decides who is allowed to access which features (admin vs writer).
  - Serves the right data to both the dashboard and the public site.

---

## Tech Stack

NewsProject is a full‑stack news publishing platform built with:
- **Backend API:** Node.js, Express, MongoDB (Mongoose), Cloudinary
- **Admin/Writer Dashboard:** React + Vite
- **Public News Website:** Next.js App Router

It supports a complete workflow for managing writers and articles, including authentication, role‑based dashboards, rich‑text news creation, image management, and a dynamic public news portal with search, categories, and engagement tracking.

---

## Tech Stack

- **Backend**
  - Node.js + Express ([server.js](file:///e:/NewsProject/server.js))
  - MongoDB with Mongoose models:
    - [authmodel.js](file:///e:/NewsProject/models/authmodel.js)
    - [newsmodel.js](file:///e:/NewsProject/models/newsmodel.js)
    - [galleryModel.js](file:///e:/NewsProject/models/galleryModel.js)
  - Cloudinary for image storage
  - JWT authentication and bcrypt password hashing

23→- **Admin/Writer Dashboard**
24→  - React + Vite ([client](file:///e:/NewsProject/client))
25→  - React Router for dashboard routing
26→  - Context API for auth state
27→  - Tailwind‑style utility classes for UI

- **Public Frontend**
  - Next.js (App Router) ([frontend](file:///e:/NewsProject/frontend))
  - Server components + incremental static regeneration
  - Category pages, news details, search, latest/popular/recent sections

---

## High‑Level Architecture

- **Backend API** (single Express app)
  - Entry point: [server.js](file:///e:/NewsProject/server.js)
  - Routers:
    - [authRoutes.js](file:///e:/NewsProject/routes/authRoutes.js)
    - [newsRoutes.js](file:///e:/NewsProject/routes/newsRoutes.js)
  - Middleware:
    - [middlewares.js](file:///e:/NewsProject/middlewares/middlewares.js) (JWT auth, role checks)
  - Database connection:
    - [db.js](file:///e:/NewsProject/utils/db.js)

- **Dashboard (React + Vite)**
  - Entry: [main.jsx](file:///e:/NewsProject/client/src/main.jsx)
  - Router and pages: [App.jsx](file:///e:/NewsProject/client/src/App.jsx)
  - Layout: [MainLayout.jsx](file:///e:/NewsProject/client/src/dashboard/layout/MainLayout.jsx), [Header.jsx](file:///e:/NewsProject/client/src/dashboard/layout/Header.jsx), [Sidebar.jsx](file:///e:/NewsProject/client/src/dashboard/layout/Sidebar.jsx)
  - Auth context: [StoreProvider.jsx](file:///e:/NewsProject/client/src/context/StoreProvider.jsx), [storeReducer.js](file:///e:/NewsProject/client/src/context/storeReducer.js)
  - API base URL config: [config.jsx](file:///e:/NewsProject/client/src/config/config.jsx)

- **Public Frontend (Next.js)**
  - Root layout and globals: [layout.js](file:///e:/NewsProject/frontend/app/layout.js), [globals.css](file:///e:/NewsProject/frontend/app/globals.css)
  - Home page: [page.js](file:///e:/NewsProject/frontend/app/page.js)
  - News routes:
    - Details by slug: [news/[slug]/page.jsx](file:///e:/NewsProject/frontend/app/news/%5bslug%5d/page.jsx)
    - Category page: [news/category/[category]/page.jsx](file:///e:/NewsProject/frontend/app/news/category/%5bcategory%5d/page.jsx)
    - Search page: [search/news/page.jsx](file:///e:/NewsProject/frontend/app/search/news/page.jsx)
  - API base URL config: [config.js](file:///e:/NewsProject/frontend/config/config.js)

For a detailed mapping between endpoints and UI, see [route-map.md](file:///e:/NewsProject/docs/route-map.md).

---

## Backend Features

### Authentication and Users

Implemented in [authController.js](file:///e:/NewsProject/controllers/authController.js) and [authRoutes.js](file:///e:/NewsProject/routes/authRoutes.js).

- **Login**
  - `POST /api/login`
  - Validates email and password.
  - Uses bcrypt to compare password hashes.
  - Issues JWT with payload `{ id, name, category, role }`.
  - Token expiry controlled by `exp_time`.

- **JWT‑Protected Routes**
  - Middleware `auth` verifies `Authorization: Bearer <token>`, decodes JWT using `secret`, and attaches `req.userInfo`.
  - Middleware `role` enforces role‑based access (admin, writer).

- **Writer Management (Admin only)**
  - `POST /api/writer/add` – create writer with name, email, password, category.
  - `GET /api/news/writers` – list all writers.
  - `GET /api/news/writer/:id` – get a single writer by ID.
  - `PUT /api/update/writer/:id` – update writer name, email, category, role.
  - `DELETE /api/delete/writer/:id` – remove a writer.

- **Profile Management**
  - `PUT /api/update-profile/:id`
    - Formidable parses form data including profile image.
    - Optional profile image uploaded to Cloudinary (folder `news_images`).
    - Updates name, email, and optionally profile image URL.
  - `GET /api/profile/:id` – fetch logged‑in user profile.

- **Password Management**
  - `POST /api/change-password`
    - Requires valid JWT (`auth` middleware).
    - Verifies old password via bcrypt.
    - Hashes and saves new password.

### News Management (Dashboard API)

Implemented in [newsControllers.js](file:///e:/NewsProject/controllers/newsControllers.js) and [newsRoutes.js](file:///e:/NewsProject/routes/newsRoutes.js).

- **Create News**
  - `POST /api/news/add`
  - Protected by `auth`.
  - Formidable handles image upload; uploads to Cloudinary (`news_images` folder).
  - Stores:
    - `writerId`, `writerName` from JWT
    - `title`, `slug`, `category`, `description`, `date`, `image`, `status` (default `pending`)

- **Image Gallery (Dashboard)**
  - `GET /api/images` – list gallery images for logged‑in writer.
  - `POST /api/images/add` – upload multiple images to Cloudinary; saves URLs in gallery collection.

- **Dashboard News Listing**
  - `GET /api/news`
    - For admin: returns all news.
    - For writer: returns only their own news.

- **News Detail for Dashboard**
  - `GET /api/news/:newsId` – fetch news by ID for viewing.
  - `GET /api/edit/news/:news_id` – fetch news by ID for editing.

- **Update / Delete News**
  - `PUT /api/news/update/:news_id` – update title, description, category, image, etc.
  - `DELETE /api/news/delete/:news_id` – delete a news article.

- **Status Management (Admin only)**
  - `PUT /api/news/status-update/:news_id`
    - Admin can change `status` (`pending`, `active`, `deactive`).

- **Writer‑Specific Dashboard Data**
  - `GET /api/writer/news` – list only news created by the logged‑in writer.
  - `GET /api/writer/news-statistics` – statistics for a specific writer (total, pending, active, deactive).

- **Global News Statistics**
  - `GET /api/news-statistics`
  - Counts:
    - `totalNews`
    - `pendingNews`
    - `activeNews`
    - `deactiveNews`
    - `totalWriters`

### Public News API (for Next.js frontend)

Also in [newsControllers.js](file:///e:/NewsProject/controllers/newsControllers.js), exposed via [newsRoutes.js](file:///e:/NewsProject/routes/newsRoutes.js).

- `GET /api/all/news`
  - Returns news grouped by category for the homepage (e.g., Technology, Sports, Health, Education, etc.).

- `GET /api/category/all`
  - Returns all categories available.

- `GET /api/news/details/:slug`
  - Returns a single news item by slug plus related news.
  - Increments view count (`count`) for engagement tracking.

- `GET /api/category/news/:category`
  - List all active news in a specific category.

- `GET /api/popular/news`
  - Returns news sorted by view count (`count`) for “Popular News”.

- `GET /api/latest/news`
  - Returns most recent active news for the “Latest News” carousel.

- `GET /api/recent/news`
  - Returns recent active news items for sidebars / lists.

- `GET /api/images/news`
  - Returns gallery images for use on the public frontend.

- `GET /api/search/news`
  - Full‑text‑style search over news by title/description.

---

## Admin/Writer Dashboard Features (React + Vite)

Dashboard code lives under [client/src](file:///e:/NewsProject/client/src).

### Routing and Guards

- Main router: [App.jsx](file:///e:/NewsProject/client/src/App.jsx)
  - `/login` – login page.
  - `/dashboard` – protected dashboard layout.
  - `/dashboard/admin` – admin home (stats + summary).
  - `/dashboard/writer` – writer home (writer‑specific stats + recent news).
  - `/dashboard/news` – list all news (admin) or writer’s news.
  - `/dashboard/news/create` – news creation form.
  - `/dashboard/news/edit/:news_id` – edit news page.
  - `/dashboard/news/details/:newsId` – dashboard news detail view.
  - `/dashboard/writers` – writer list (admin).
  - `/dashboard/writer/add` – add writer (admin).
  - `/dashboard/writer/edit/:id` – edit writer (admin).
  - `/dashboard/profile` – profile & password change.
  - `*` – fallback “Unable” / 404 page.

- Guards:
  - [ProtectDashboard.tsx](file:///e:/NewsProject/client/src/middleware/ProtectDashboard.tsx) – checks authentication token, redirects unauthenticated users to login.
  - [ProtectRole.jsx](file:///e:/NewsProject/client/src/middleware/ProtectRole.jsx) – ensures correct role (admin or writer) for nested routes.

### Layout and Navigation

- [MainLayout.jsx](file:///e:/NewsProject/client/src/dashboard/layout/MainLayout.jsx)
  - Wraps all dashboard pages with header, sidebar, and content area.

- [Header.jsx](file:///e:/NewsProject/client/src/dashboard/layout/Header.jsx)
  - Shows logged‑in user info, avatar/profile link, and overall header styling.

- [Sidebar.jsx](file:///e:/NewsProject/client/src/dashboard/layout/Sidebar.jsx)
  - Role‑aware navigation:
    - Admin links: Dashboard, Add Writer, Writers, News, Profile, Logout.
    - Writer links: Dashboard, Add News, News, Profile, Logout.
  - Highlights active route.
  - Logout clears `newsToken` from localStorage and resets store.

### Auth State and Token Handling

- Context:
  - [StoreProvider.jsx](file:///e:/NewsProject/client/src/context/StoreProvider.jsx)
  - [storeContext.js](file:///e:/NewsProject/client/src/context/storeContext.js)
  - [storeReducer.js](file:///e:/NewsProject/client/src/context/storeReducer.js)
    - Handles `login_success` (stores token, decodes JWT into `userInfo`) and `logout`.

- Token utility:
  - [utils/index.js](file:///e:/NewsProject/client/src/utils/index.js)
    - Decodes JWT, checks expiry, and returns `userInfo`.

### Admin Dashboard (Adminindex.jsx)

Implemented in [Adminindex.jsx](file:///e:/NewsProject/client/src/dashboard/pages/Adminindex.jsx).

- Displays global KPIs using `GET /api/news-statistics`:
  - Total News, Pending News, Active News, Deactive News, Total Writers.
- Shows recent news table with title, image, category, date, status, and actions.
- Allows admin to:
  - Change status (pending/active/deactive).
  - Edit and delete news items.

### Writer Dashboard (writerIndex.jsx)

Implemented in [writerIndex.jsx](file:///e:/NewsProject/client/src/dashboard/pages/writerIndex.jsx).

- Shows writer‑specific KPIs from `GET /api/writer/news-statistics`:
  - Writer Total News, Pending News, Active News, Deactive News.
- Recent news table (writer’s own news only).
- Link to view all news (`/dashboard/news`).

### News Listing and Management

- News list page: [News.jsx](file:///e:/NewsProject/client/src/dashboard/pages/News.jsx)
  - For writers, shows “Create News” button linking to `/dashboard/news/create`.

- News table and controls: [NewsContent.jsx](file:///e:/NewsProject/client/src/dashboard/components/NewsContent.jsx)
  - Fetches `GET /api/news`.
  - Supports:
    - Search by title.
    - Filter by category.
    - Pagination with configurable “news per page” (5, 10, 15, 20).
  - Columns:
    - No, Title, Image, Category, Date, Status, Actions.
  - Actions:
    - Admin:
      - Toggle status (`active`, `pending`, `deactive`) via `PUT /api/news/status-update/:news_id`.
      - Edit any news.
      - Delete any news via `DELETE /api/news/delete/:news_id`.
    - Writer:
      - Edit own news (when role is writer).
      - Delete own news.

- News detail page: [NewsDetail.jsx](file:///e:/NewsProject/client/src/dashboard/pages/NewsDetail.jsx)
  - Shows single news for dashboard context with full description and actions.

### News Creation and Editing

- Create news page: [CreateNews.jsx](file:///e:/NewsProject/client/src/dashboard/pages/CreateNews.jsx)
  - Uses a rich‑text editor (Jodit) for description.
  - Fields:
    - Title, Category (based on writer’s category), Description (HTML), Image.
  - Image selection options:
    - Upload new image via file input (supports multiple files).
    - Choose from Gallery:
      - `GET /api/images` to fetch previously uploaded images.
      - `POST /api/images/add` for uploading multiple gallery images.
      - Uses [Gallery.jsx](file:///e:/NewsProject/client/src/dashboard/components/Gallery.jsx) as a modal.
  - On submit:
    - Sends multipart form data to `POST /api/news/add`.
    - Shows loading state while submitting.

- Edit news page: [EditNews.jsx](file:///e:/NewsProject/client/src/dashboard/pages/EditNews.jsx)
  - Loads existing news via `GET /api/edit/news/:news_id`.
  - Allows changing title, description, category, and image (including from gallery).
  - Submits changes with `PUT /api/news/update/:news_id`.

### Writer Management (Admin)

- Writers list: [Writers.jsx](file:///e:/NewsProject/client/src/dashboard/pages/Writers.jsx)
  - Uses `GET /api/news/writers` to show all writers.
  - Supports delete writer via `DELETE /api/delete/writer/:id`.

- Add writer: [AddWriter.jsx](file:///e:/NewsProject/client/src/dashboard/pages/AddWriter.jsx)
  - Form fields: name, email, password, category.
  - Calls `POST /api/writer/add`.

- Edit writer: [EditWriter.jsx](file:///e:/NewsProject/client/src/dashboard/pages/EditWriter.jsx)
  - Loads writer via `GET /api/news/writer/:id`.
  - Updates via `PUT /api/update/writer/:id`.

### Profile and Settings

- Profile page: [Profile.jsx](file:///e:/NewsProject/client/src/dashboard/pages/Profile.jsx)
  - Fetches profile via `GET /api/profile/:id`.
  - Updates profile with optional avatar via `PUT /api/update-profile/:id`.
  - Contains change password form that calls `POST /api/change-password`.

### Error Handling and Fallback

- `Unable.jsx` – generic “unable/404” style page used for unknown routes.
- Network / API errors are surfaced via toast/alerts in each page (where implemented).

---

## Public Frontend Features (Next.js)

Frontend code lives under [frontend](file:///e:/NewsProject/frontend).

### Layout and Shared Components

- [layout.js](file:///e:/NewsProject/frontend/app/layout.js)
  - Global HTML shell with header and footer.
  - Wraps all pages.

- Shared components:
  - [Header.jsx](file:///e:/NewsProject/frontend/components/Header.jsx) – top bar with logo and navigation.
  - [Header_Category.jsx](file:///e:/NewsProject/frontend/components/Header_Category.jsx) – category navigation bar.
  - [Footer.jsx](file:///e:/NewsProject/frontend/components/Footer.jsx)
  - [BreadCrumb.jsx](file:///e:/NewsProject/frontend/components/BreadCrumb.jsx)
  - [Category.jsx](file:///e:/NewsProject/frontend/components/Category.jsx)
  - [Title.jsx](file:///e:/NewsProject/frontend/components/Title.jsx)

### Home Page

Implemented in [app/page.js](file:///e:/NewsProject/frontend/app/page.js).

- Fetches grouped news from `GET /api/all/news` (ISR with `revalidate`).
- Sections:
  - **Headlines**: [Headlines.jsx](file:///e:/NewsProject/frontend/components/Headlines.jsx)
    - Likely top stories slider using selected categories.
  - **Latest News**: [LatestNews.jsx](file:///e:/NewsProject/frontend/components/news/LatestNews.jsx)
    - Fetches `GET /api/latest/news`.
    - Uses `react-multi-carousel` for a horizontally scrollable carousel of latest articles.
  - **Category Highlights**:
    - Technology block using [SimpleNewsCard.jsx](file:///e:/NewsProject/frontend/components/news/item/SimpleNewsCard.jsx).
    - Sports and Health sections using [DetailsNewsRow.jsx](file:///e:/NewsProject/frontend/components/news/DetailsNewsRow.jsx) and [DetailsNews.jsx](file:///e:/NewsProject/frontend/components/news/DetailsNews.jsx).
    - Education and other categories using [DetailsNewsCol.jsx](file:///e:/NewsProject/frontend/components/news/DetailsNewsCol.jsx).
  - **Popular News**: [PopularNews.jsx](file:///e:/NewsProject/frontend/components/news/PopularNews.jsx)
    - Fetches from `GET /api/popular/news`.
  - **Gallery / Other sections**:
    - [Gallery.jsx](file:///e:/NewsProject/frontend/components/news/Gallery.jsx) shows image‑based news cards.
    - [RecentNewsFooter.jsx](file:///e:/NewsProject/frontend/components/news/RecentNewsFooter.jsx) shows additional recent items in the footer area.

### News Details Page

Implemented in [news/[slug]/page.jsx](file:///e:/NewsProject/frontend/app/news/%5bslug%5d/page.jsx).

- Fetches article and related news via `GET /api/news/details/:slug`.
- Features:
  - Breadcrumb navigation with category and title.
  - Main image and full article content (HTML) rendered via `react-html-parser`.
  - Displays date and writer name.
  - Sidebar:
    - Search form ([Search.jsx](file:///e:/NewsProject/frontend/components/news/Search.jsx)).
    - Recent news widget ([RecentNews.jsx](file:///e:/NewsProject/frontend/components/news/RecentNews.jsx)) using `GET /api/recent/news`.
    - Related news list ([RelatedNews.jsx](file:///e:/NewsProject/frontend/components/news/RelatedNews.jsx)).

### Category Page

Implemented in [news/category/[category]/page.jsx](file:///e:/NewsProject/frontend/app/news/category/%5bcategory%5d/page.jsx).

- Fetches category news from `GET /api/category/news/:category`.
- Shows:
  - Breadcrumb and category title.
  - Grid/list of news using [SimpleDetailsNewCard.jsx](file:///e:/NewsProject/frontend/components/news/item/SimpleDetailsNewCard.jsx).
  - Sidebar with search, popular/recent widgets similar to detail page.

### Search Page

Implemented in [search/news/page.jsx](file:///e:/NewsProject/frontend/app/search/news/page.jsx).

- Provides search experience backed by `GET /api/search/news`.
- Components:
  - [SearchNews.jsx](file:///e:/NewsProject/frontend/components/news/SearchNews.jsx) – lists search results.
  - [Search.jsx](file:///e:/NewsProject/frontend/components/news/Search.jsx) – search form component reused in sidebars.

### Other Public Features

- **Recent News Widgets**
  - [RecentNews.jsx](file:///e:/NewsProject/frontend/components/news/RecentNews.jsx)
  - [RecentNewsFooter.jsx](file:///e:/NewsProject/frontend/components/news/RecentNewsFooter.jsx)
  - Both consume `GET /api/recent/news`.

- **News Cards**
  - [NewsCard.jsx](file:///e:/NewsProject/frontend/components/news/item/NewsCard.jsx)
  - [SimpleNewsCard.jsx](file:///e:/NewsProject/frontend/components/news/item/SimpleNewsCard.jsx)
  - [SimpleDetailsNewCard.jsx](file:///e:/NewsProject/frontend/components/news/item/SimpleDetailsNewCard.jsx)
  - Used across home, category, and sidebar sections.

---

## Database Models

### User / Auth Model

Defined in [authmodel.js](file:///e:/NewsProject/models/authmodel.js).

- Fields (key ones):
  - `name`, `email`, `password`, `role` (`admin` or `writer`), `category`, `image`.
  - Timestamps.
  - Password stored as bcrypt hash.

### News Model

Defined in [newsmodel.js](file:///e:/NewsProject/models/newsmodel.js).

- Fields:
  - `writerId` (ObjectId ref to `authors` collection).
  - `writerName`.
  - `title`, `slug`, `image`, `category`, `description`, `date`.
  - `status` (`pending` by default; can be `active` or `deactive`).
  - `count` (view count, used for popularity).
  - `createdAt`, `updatedAt` via timestamps.

### Gallery Model

Defined in [galleryModel.js](file:///e:/NewsProject/models/galleryModel.js).

- Fields:
  - `writerId` – owner of the images.
  - `url` – Cloudinary image URL.
  - Timestamps.

---

## Environment Configuration

Root `.env` (not committed) should define at least:

- `MODE` – `dev` or `production` (used by client/frontend config).
- `PORT` – backend port (e.g., `5000`).
- `DB_LOCAL_URL` – MongoDB connection string for local development.
- `db_production_url` – MongoDB connection string for production.
- `secret` – JWT signing secret.
- `exp_time` – JWT expiration (e.g., `1d`).
- `cloud_name`, `api_key`, `api_secret` – Cloudinary credentials.
- `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_CATEGORY` – used by seeding scripts.

Client dashboard env (for Vite, in `client`):

- `VITE_API_URL` – backend base URL in production (e.g., deployed API URL).

Next.js frontend env (in `frontend`):

- `NEXT_PUBLIC_API_URL` – backend base URL for public site.

---

## Running Locally

### Prerequisites

- Node.js and npm
- MongoDB instance (local or cloud)
- Cloudinary account for image hosting

### Install Dependencies

From the project root:

```bash
npm install
cd client && npm install
cd ../frontend && npm install
cd ..
```

### Start Development Servers

From the project root:

```bash
npm run dev
```

This runs:
- Express API on `http://localhost:5000`
- React dashboard on `http://localhost:5173`
- Next.js public site on `http://localhost:3000`

Ensure that:
- `client/src/config/config.jsx` base URL points to `http://localhost:5000`.
- `frontend/config/config.js` base API URL points to `http://localhost:5000`.

---

## Seeding Admin User

There are helper scripts under [scripts](file:///e:/NewsProject/scripts):

- `seedAdmin.js` – create initial admin user using `ADMIN_*` env variables.
- `syncAdmin.js` – sync admin data if needed.

Run from the project root:

```bash
npm run seed:admin
```

---

## Deployment Notes

The project is designed so that:

- Backend API can be deployed as a standalone Node/Express service.
- React dashboard can be built with Vite and served as static assets.
- Next.js frontend can be deployed on platforms that support Next.js (e.g., Railway, Vercel) using `NEXT_PUBLIC_API_URL` to point to the backend.

Core things to configure in production:

- Correct MongoDB URL (`db_production_url`).
- Proper `secret` and `exp_time`.
- Cloudinary credentials.
- `VITE_API_URL` and `NEXT_PUBLIC_API_URL` pointing to your live backend URL.

---

## Summary of Key Features

- Role‑based authentication (admin, writer) with JWT.
- Admin capabilities:
  - Manage writers (CRUD).
  - Global news management (CRUD + status changes).
  - View global statistics (news and writers).
- Writer capabilities:
  - Create, edit, delete own news.
  - Upload and reuse images via gallery.
  - View writer‑specific statistics and recent news.
- Rich‑text editor for news description with HTML rendering on the frontend.
- Image handling:
  - Cloudinary‑backed uploads for news images and profile pictures.
  - Gallery reuse both in dashboard and public views.
- Public news site:
  - SEO‑friendly slugs for news details.
  - Category browsing and filtering.
  - Latest, popular, and recent news sections.
  - Search across news content.
  - Related news suggestions on article detail pages.

