# API Testing Guide & Theory

This guide explains the **theory** behind API testing and provides practical instructions for testing the NewsProject API using **Postman**.

---

## 1. The Theory: "How It Happens"

When you test an API (Application Programming Interface), you are testing the **communication** between two software components. In this project, you are acting as the **Client** (simulating a React frontend or a mobile app) talking to the **Server** (Node.js/Express).

### The Request-Response Cycle
Every API test follows this cycle:

1.  **Client (Postman) Sends a Request**:
    *   **Method**: The action (GET, POST, PUT, DELETE).
    *   **URL**: The address (e.g., `http://localhost:5000/api/login`).
    *   **Headers**: Metadata (e.g., "I am sending JSON data" -> `Content-Type: application/json`).
    *   **Body**: The data payload (e.g., `{ "email": "admin@gmail.com", "password": "123" }`).

2.  **Server Processes the Request**:
    *   **Routing**: The server looks at the URL (`/api/login`) and Method (`POST`) to decide which function to run (in `controllers/authController.js`).
    *   **Middleware**: Before reaching the controller, the request might pass through security checks (e.g., "Is this user logged in?").
    *   **Controller Logic**: The code verifies credentials, queries the database, or performs calculations.
    *   **Database**: The server talks to MongoDB to get or save data.

3.  **Server Sends a Response**:
    *   **Status Code**: A 3-digit number indicating success or failure (e.g., `200 OK`, `401 Unauthorized`, `404 Not Found`).
    *   **Body**: The result data (e.g., `{ "token": "ey..." }` or `{ "message": "Invalid Password" }`).

### Authentication Flow (The "Token" Theory)
This project uses **JWT (JSON Web Tokens)** for security. This is stateless authentication.

1.  **Login**: You send email/password. If correct, the server creates a "badge" (Token) containing your User ID and Role.
2.  **The Token**: This string (`ey...`) is signed by the server's secret key. You cannot fake it.
3.  **Subsequent Requests**: For every protected route (like "Add News"), you must show this badge.
    *   **In Postman**: You add a header `Authorization: Bearer <your_token>`.
    *   **On Server**: The `middleware.auth` function checks if the token is valid. If yes, it lets you pass. If no, it blocks you (`401 Unauthorized`).

---

## 2. Postman Setup Guide

### Step 1: Create an Environment
Instead of pasting `http://localhost:5000` and your token everywhere, use variables.

1.  Open Postman -> Click **Environments** (sidebar) -> **+** (Create New).
2.  Name it `NewsProject Local`.
3.  Add these variables:
    *   `base_url`: `http://localhost:5000`
    *   `admin_token`: (Leave blank for now)
    *   `writer_token`: (Leave blank for now)
4.  **Select this environment** from the dropdown in the top right corner.

### Step 2: Create a Collection
1.  Click **Collections** -> **+** -> Name it `NewsProject API`.
2.  Right-click the collection -> **Add Folder** -> Create folders for:
    *   `Auth`
    *   `News`
    *   `Writer`

---

## 3. Testing Scenarios (How to Test)

### Scenario A: Authentication (Login)
**Goal**: Get a token to use for other requests.

1.  **Create Request**: `POST {{base_url}}/api/login` inside `Auth` folder.
2.  **Body**: Select `raw` -> `JSON`.
    ```json
    {
      "email": "admin@gmail.com",
      "password": "123"
    }
    ```
3.  **Tests (The "Magic" Part)**:
    Go to the **Scripts** -> **Post-response** tab in Postman. Add this code to automatically save the token:
    ```javascript
    // Check if login was successful
    pm.test("Status code is 200", function () {
        pm.response.to.have.status(200);
    });

    // Save the token to the environment variable
    var jsonData = pm.response.json();
    if (jsonData.token) {
        pm.environment.set("admin_token", jsonData.token);
        console.log("Admin token saved!");
    }
    ```
4.  **Run**: Click Send. You should see `200 OK`, and your `admin_token` variable is now updated automatically!

### Scenario B: Protected Route (Add News)
**Goal**: Test if the server accepts our token and data.

1.  **Create Request**: `POST {{base_url}}/api/news/add` inside `News` folder.
2.  **Auth**: Go to the **Authorization** tab -> Select **Bearer Token** -> Type `{{admin_token}}`.
3.  **Body**: Since this route handles file uploads (images), you **cannot** use JSON.
    *   Select **form-data**.
    *   Add fields:
        *   `title`: `Test News Title`
        *   `description`: `This is a test description`
        *   `image`: (Change type from Text to **File**, then upload a dummy image)
4.  **Run**: Click Send.
    *   **Success**: `201 Created` (if configured correctly).
    *   **Failure**: `401 Unauthorized` (if token is missing/wrong) or `500` (if Cloudinary fails).

### Scenario C: Role Validation (Writer Access)
**Goal**: Verify a writer cannot delete admins (if such a route existed) or access admin-only stats.

1.  Login as a **Writer** (use a different request to save `writer_token`).
2.  Try to access an Admin-only route using the `{{writer_token}}`.
3.  **Expectation**: The server should return `403 Forbidden` or `404 Not Found` (depending on implementation).

---

## 4. Understanding HTTP Status Codes
*   **200 OK**: Success (e.g., Got list of news).
*   **201 Created**: Success + New thing made (e.g., Added news).
*   **400 Bad Request**: You sent bad data (e.g., missing email).
*   **401 Unauthorized**: Who are you? (Missing/Invalid Token).
*   **403 Forbidden**: You are logged in, but you can't do this (e.g., Writer trying to delete Admin).
*   **404 Not Found**: Endpoint doesn't exist.
*   **500 Internal Server Error**: The server crashed (bug in code).

---

## 5. Summary
To explain "how it happens":
1.  **Postman** wraps your data in an HTTP envelope.
2.  It travels to the **Node.js Server**.
3.  **Express** routes it to the right function.
4.  **Middleware** checks your ID card (Token).
5.  **Controller** does the work (talks to DB).
6.  **Response** comes back to Postman.
