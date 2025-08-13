# 📚 Flashcards Application

A full-stack Flashcards app built with **React + TypeScript** on the frontend and **Express.js + MongoDB** on the backend. Designed to help users create, manage, and study flashcards efficiently.

---

## 🚀 Features

- User authentication (JWT-based)
- Create, edit, delete flashcards
- Organize flashcards into categories
- Import/export flashcards via CSV
- Responsive UI built with React + TypeScript
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

---

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/your-username/flashcards.git
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


