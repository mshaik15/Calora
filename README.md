# Calora (formerly Healthbyte)

## Overview
Calora is a full-stack calorie-tracking application designed to provide efficient and secure user data management. It utilizes **in-memory caching** to reduce redundant API calls, **JWT authentication** for secure user sessions, and a **React frontend** that interacts seamlessly with a Django REST API backend.
<br/>
(A practice web app to develop skills in Django and ReactJS, The information given is not accurate at all!!)

## Video Demonstration
For a walkthrough of how Calora works, check out the video below:
https://www.loom.com/share/9ca17f946bdb4f94bcd48e725601bb23?sid=820c3408-499f-4d5d-9ad1-45c96a2d8f25
## Features
- User authentication with JWT tokens
- In-memory caching for optimized API usage
- Food and calorie tracking with external API integration
- Seamless frontend-backend communication via REST API

## Authentication (JWT)
Calora employs **JSON Web Tokens (JWT)** to handle authentication securely. When a user logs in:
1. The backend generates a JWT token and sends it to the frontend.
2. The frontend stores the token in memory (or local storage if needed).
3. Every request to the backend includes this token in the headers for authentication.
4. When the user logs out, the token is discarded, ensuring session security.

## Local Caching in React
To optimize performance and minimize unnecessary API calls:
1. The frontend temporarily stores API responses in memory.
2. This allows quick access to user data without repeated server requests.
3. When a user logs out, the cached data is packaged and sent to the backend for permanent storage.
4. This approach reduces data transfer, improving responsiveness and efficiency.

## Backend-Frontend API Interactions
- The **React frontend** sends API requests (e.g., login, food search, calorie tracking) to the **Django REST API backend**.
- The backend processes these requests, interacts with the database or external APIs, and responds with structured JSON data.
- The frontend consumes this data and updates the UI accordingly.
- Secure endpoints require the JWT token in the headers to authenticate requests.

## How to Clone and Run Locally
To set up and run this project on your own computer:

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

Now, open `http://localhost:3000` in your browser to use Calora.


