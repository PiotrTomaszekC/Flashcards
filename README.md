# 📚 Flashcards Application

A full-stack Flashcards app built with **React + TypeScript** on the frontend and **Express.js + MongoDB** on the backend. Designed to help users create, manage, and study flashcards efficiently.

---

## 🚀 Features

- User authentication (JWT-based)
- Create, edit, delete flashcards & decks
- Import/export decks via CSV
- Responsive UI built with React + TypeScript + Tailwind CSS
- RESTful API with Express.js
- MongoDB for data persistence
- Backend and frontend testing with Vitest and Supertest
---

## 📦 Tech Stack

- **Frontend**: React, TypeScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **File Uploads**: Multer
- **CSV Handling**: csv-parser, json2csv
- **Testing**: Vitest, Supertest, mongodb-memory-server
- **Dev Tools**: Nodemon, Concurrently, Cross-env
- **Global State Management**: Context API
- **Form Handling & Validation**: React Hook Form & Zod
- **Server State Management**: React Query
- **Internationalization**: react-i18next

---

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/PiotrTomaszekC/Flashcards.git
cd flashcards

# Install dependencies
npm install
npm install --prefix frontend
```

## 🔧 Running the App
```bash
# Development Mode
npm run dev

#Production Build
npm run build
```

## 🧪 Running Tests
```bash
# Backend Unit Tests && Coverage Report
npm run test:backend
npm run test:coverage

# Frontend Unit Tests && Coverage Report
cd frontend
npm run test
npm run test:coverage
```

## ⚙️ Environment Variables
Create a .env file in the backend/ directory with the following:
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```



