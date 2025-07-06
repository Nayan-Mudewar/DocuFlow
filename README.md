# 📄 DocuFlow – Collaborative Document Platform

DocuFlow is a Confluence-like full-stack web app where users can create, edit, share, and manage documents with rich formatting and collaborative access control.

> 🚀 Built as part of the Frigga Cloud Labs ASE Assignment

---

## ✨ Features

- 🔐 **User Authentication**
  - Register/Login with JWT-based security
  - Forgot password (TODO if needed)

- 📝 **Document Management**
  - Rich-text editor (React Quill)
  - Create, edit, delete documents
  - Auto-save and version-ready structure

- 👥 **Collaboration**
  - `@mention` users inside documents to auto-share
  - Manual share with view/edit permissions
  - Public vs Private access

- 🔍 **Dashboard**
  - View accessible docs
  - Real-time search

- 🌐 **UI**
  - Built using React + TailwindCSS
  - Clean, minimal, mobile-friendly

---

## 🛠 Tech Stack

| Layer       | Technology                     |
|-------------|---------------------------------|
| Frontend    | React, TailwindCSS, React Router, Axios |
| Backend     | Node.js, Express, JWT          |
| Database    | MongoDB + Mongoose             |
| Editor      | React Quill                    |
| Auth        | JWT (localStorage)             |

---

## 📦 Installation

### 🖥 Backend Setup

```bash
cd backend
npm install
npm run dev
Create a .env file with:

ini
Copy
Edit
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
💻 Frontend Setup
bash
Copy
Edit
cd client
npm install
npm run dev
App runs on: http://localhost:5173

🧪 Demo Users
Email	Password	Role
testuser@mail.com	123456	Author
collaborator@mail.com	123456	Viewer

📁 Folder Structure
bash
Copy
Edit
/client   → React + Tailwind frontend
/backend  → Express backend
🧠 Learning Highlights
Clean modular codebase

RESTful architecture with secure auth

AI-assisted design + code using ChatGPT

End-to-end CRUD with MongoDB

Real-time UX using local state

📌 Assignment Brief
This project was built for the Frigga Cloud Labs ASE assignment, simulating core features of Atlassian Confluence with personal enhancements.

📸 Screenshots

Login/Register:![alt text](<Screenshot 2025-07-04 185410.png>)

Dashboard

Editor + Sharing modal

✅ Todo (Optional)
Add version history

Public document viewer



🤝 Author
Nayan Mudewar
📫 GitHub: @Nayan-Mudewar