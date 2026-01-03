# API Route Map and Flow Guide

This document maps all backend endpoints to their controllers and middleware, and links them to the React dashboard and Next.js public frontend components that call them. Use this for onboarding, debugging, and feature work.

## Overview

- Backend entry: `server.js`
  - Loads env, JSON parsing, CORS, DB connect (`utils/db.js`), mounts routers, listens on `process.env.port`.
  - Routers: `routes/authRoutes.js`, `routes/newsRoutes.js`.
- Middleware: `middlewares/middlewares.js`
  - `auth`: validates `Authorization: Bearer <token>`, sets `req.userInfo` via `jwt.verify(process.env.secret)`.
  - `role`: allows `admin` and `writer`; others receive `401`.
- Models: `models/authmodel.js`, `models/newsmodel.js`, `models/galleryModel.js`.
- Cloudinary uploads: Formidable parsing in controllers, with Cloudinary `uploader.upload`.

## Environment Keys

- Expected keys in `.env`: `mode`, `port`, `DB_LOCAL_URL`, `secret`, `exp_time`, `cloud_name`, `api_key`, `api_secret`, plus `ADMIN_*` for seeding.
- Notes:
  - The server reads lowercase keys (`process.env.mode`, `process.env.port`). Ensure `.env` uses `mode` and `port` (not uppercase) or adjust `server.js` accordingly.
  - Client dashboard dev base URL is `http://localhost:5000` (see `client/src/config/config.jsx`). Align backend port.

## Auth Routes (routes/authRoutes.js)

- `POST /api/login`
  - Controller: `authController.login`
  - Middleware: none
  - Dashboard: `client/src/dashboard/pages/Login.jsx`

- `POST /api/writer/add`
  - Controller: `authController.add_writer`
  - Middleware: `auth`, `role`
  - Dashboard: `client/src/dashboard/pages/AddWriter.jsx`

- `GET /api/news/writers`
  - Controller: `authController.get_writers`
  - Middleware: `auth`, `role`
  - Dashboard: `client/src/dashboard/pages/Writers.jsx`

- `GET /api/news/writer/:id`
  - Controller: `authController.getWriterById`
  - Middleware: `auth`, `role`
  - Dashboard: `client/src/dashboard/pages/EditWriter.jsx`

- `PUT /api/update/writer/:id`
  - Controller: `authController.update_writer`
  - Middleware: `auth`, `role`
  - Dashboard: `client/src/dashboard/pages/EditWriter.jsx`

- `DELETE /api/delete/writer/:id`
  - Controller: `authController.delete_writer`
  - Middleware: `auth`, `role`
  - Dashboard: `client/src/dashboard/pages/Writers.jsx`

- `PUT /api/update-profile/:id`
  - Controller: `authController.update_profile`
  - Middleware: `auth`, `role`
  - Dashboard: `client/src/dashboard/pages/Profile.jsx`

- `GET /api/profile/:id`
  - Controller: `authController.get_profile`
  - Middleware: `auth`, `role`
  - Dashboard: `client/src/dashboard/pages/Profile.jsx`

- `POST /api/change-password`
  - Controller: `authController.changePassword`
  - Middleware: `auth`
  - Dashboard: password change form (Profile/Settings)

## Dashboard News Routes (routes/newsRoutes.js)

- `POST /api/news/add`
  - Controller: `newsControllers.add_news`
  - Middleware: `auth`
  - Dashboard: `client/src/dashboard/pages/CreateNews.jsx`

- `GET /api/images`
  - Controller: `newsControllers.get_images`
  - Middleware: `auth`
  - Dashboard: `client/src/dashboard/components/Gallery.jsx`

- `POST /api/images/add`
  - Controller: `newsControllers.add_images`
  - Middleware: `auth`
  - Dashboard: `client/src/dashboard/components/Gallery.jsx`

- `GET /api/news`
  - Controller: `newsControllers.get_dashboard_news` (admin: all; writer: own)
  - Middleware: `auth`
  - Dashboard: `client/src/dashboard/components/NewsContent.jsx`, `client/src/dashboard/pages/Adminindex.jsx`

- `GET /api/news/:newsId`
  - Controller: `newsControllers.get_edit_dashboard_news`
  - Middleware: `auth`
  - Dashboard: `client/src/dashboard/pages/NewsDetail.jsx`

- `GET /api/edit/news/:news_id`
  - Controller: `newsControllers.get_edit_dashboard_news`
  - Middleware: `auth`
  - Dashboard: `client/src/dashboard/pages/EditNews.jsx`

- `PUT /api/news/update/:news_id`
  - Controller: `newsControllers.update_news`
  - Middleware: `auth`
  - Dashboard: `client/src/dashboard/pages/EditNews.jsx`

- `DELETE /api/news/delete/:news_id`
  - Controller: `newsControllers.delete_news`
  - Middleware: `auth`
  - Dashboard: `client/src/dashboard/components/NewsContent.jsx`, `client/src/dashboard/pages/NewsDetail.jsx`

- `PUT /api/news/status-update/:news_id`
  - Controller: `newsControllers.update_news_status`
  - Middleware: `auth`
  - Dashboard: `client/src/dashboard/components/NewsContent.jsx` (admin status toggle)

- `GET /api/writer/news`
  - Controller: `newsControllers.get_writer_news`
  - Middleware: `auth`
  - Dashboard: writer views

- `GET /api/writer/news-statistics`
  - Controller: `newsControllers.getWriterNewsStatistics`
  - Middleware: `auth`
  - Dashboard: writer KPIs

- `GET /api/news-statistics`
  - Controller: `newsControllers.news_statistics`
  - Middleware: none
  - Dashboard: `client/src/dashboard/pages/Adminindex.jsx`

## Public Frontend APIs (routes/newsRoutes.js)

- `GET /api/all/news` → `newsControllers.get_all_news`
- `GET /api/category/all` → `newsControllers.get_categories`
- `GET /api/news/details/:slug` → `newsControllers.get_details_news`
- `GET /api/category/news/:category` → `newsControllers.get_category_news`
- `GET /api/popular/news` → `newsControllers.get_popular_news`
- `GET /api/latest/news` → `newsControllers.get_latest_news`
- `GET /api/recent/news` → `newsControllers.get_recent_news`
- `GET /api/images/news` → `newsControllers.get_images_news`
- `GET /api/search/news` → `newsControllers.news_search`

### Next.js Components

- `frontend/components/news/PopularNews.jsx` → `/api/popular/news` (ISR)
- `frontend/components/news/LatestNews.jsx` → `/api/latest/news`
- `frontend/components/news/DetailsNews.jsx` → details rendering from `/api/news/details/:slug`
- `frontend/components/news/*` → category, recent, gallery, search features map to corresponding endpoints above.
- Base API URL: `frontend/config/config.js` (`base_api_url`).

## Client Dashboard Structure

- Router: `client/src/App.jsx`
  - Guards: `middleware/ProtectDashboard.tsx`, `middleware/ProtectRole.jsx`
  - Pages: `Login`, `DashboardLanding`, `Adminindex`, `Writerindex`, `News`, `NewsDetail`, `CreateNews`, `EditNews`, `Writers`, `AddWriter`, `EditWriter`, `Profile`, `Unable`.
- Context: `context/StoreProvider.jsx`, `context/storeReducer.js` (decodes token, manages `userInfo` and `token`).
- Token utilities: `utils/index.js` (expiry checks).
- Config: `config/config.jsx` (`base_url`).

## Typical Request Flow

- Login
  - Client `Login.jsx` → `POST /api/login` with email/password.
  - `authController.login` validates auth, issues JWT (`secret`, `exp_time`).
  - Client stores token in `localStorage` as `newsToken`, updates context; guards allow dashboard.

- List News (Dashboard)
  - Client `NewsContent.jsx` → `GET /api/news` with `Authorization: Bearer <token>`.
  - `newsControllers.get_dashboard_news` returns admin all news or writer’s own news.
  - Client supports search, filter, pagination.

- News Detail
  - Client `NewsDetail.jsx` → `GET /api/news/:newsId` with token.
  - Actions: edit (`PUT /api/news/update/:news_id`), delete (`DELETE /api/news/delete/:news_id`).

## Debugging Tips

- Verify `.env` alignment with server expectations (`mode`, `port`, `secret`, `exp_time`).
- Ensure `client/src/config/config.jsx` points to the running backend port.
- Add logging in `middlewares/middlewares.js` to inspect `authorization` header and decoded `req.userInfo`.
- Public frontend fetches do not send JWT; protected dashboard endpoints do.

## Reading Order

- Backend: `server.js` → `middlewares/middlewares.js` → `routes/*` → `controllers/*` → `models/*`.
- Dashboard client: `client/src/App.jsx` → `middleware/*` → `context/*` → `config/config.jsx` → `dashboard/pages/*` and `dashboard/components/*`.
- Public frontend: `frontend/app/*` → `frontend/components/*` → `frontend/config/config.js`.