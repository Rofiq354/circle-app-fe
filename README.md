<div align="center">

# 🔵 Circle App — Frontend

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Redux](https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org)

**Frontend of Circle App — a Twitter-inspired social media platform built with React, TypeScript, and Redux.**

[🔗 Backend Repository](https://github.com/Rofiq354/circle-app-be)

</div>

---

## 📸 Preview

|            🖥️ Desktop             |            📱 Mobile            |
| :-------------------------------: | :-----------------------------: |
| ![Desktop](./preview-desktop.png) | ![Mobile](./preview-mobile.png) |

---

## ✨ About

Circle App is a full-stack Twitter-inspired social media application. This repository contains the **frontend** side of the project, built with React and TypeScript. It communicates with the backend via REST API and WebSocket for real-time interactions.

---

## 🛠️ Tech Stack

| Technology                                                                                                    | Purpose                           |
| ------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| ![React](https://img.shields.io/badge/React_19-20232A?style=flat&logo=react&logoColor=61DAFB)                 | UI library                        |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)      | Type-safe JavaScript              |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)                        | Build tool & dev server           |
| ![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=flat&logo=redux&logoColor=white)     | Global state management           |
| ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)  | Utility-first CSS framework       |
| ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat&logo=reactrouter&logoColor=white) | Client-side routing               |
| ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white)                     | HTTP client                       |
| **Radix UI**                                                                                                  | Headless accessible UI primitives |
| **Framer Motion**                                                                                             | Animation library                 |
| **React Hot Toast**                                                                                           | Toast notifications               |
| **Lucide React**                                                                                              | Icon library                      |
| **Socket.io Client**                                                                                          | Real-time WebSocket communication |

---

## 📋 Features

**🔐 Authentication**

- User registration and login with form handling
- JWT token stored in cookies for session persistence
- Auth middleware enforcement on protected pages

**🧵 Thread (Post)**

- Display list of threads fetched from the backend API
- Conditional like button rendering (liked / not liked state)
- Create new thread with text-only or text + image
- Real-time thread update via WebSocket after posting

**💬 Thread Detail & Reply**

- View full thread detail including replies
- Reply to a thread with text and/or image
- Retrieve `thread_id` from URL using `useParams`

**❤️ Like / Unlike**

- Like and unlike threads with optimistic UI update
- Like state managed in Redux for instant feedback
- Synced with the database (create/delete like record)

**👤 Profile**

- View own and other users' profiles
- Profile data stored and retrieved from Redux

**👥 Follow / Unfollow**

- Follow and unfollow users
- View followers and following list (own or others')
- Query params used to toggle between followers/following

**🔍 Search**

- Search users by name or username

---

## 🧠 Concepts Learned

- **Clean Architecture** in React — separating concerns across layers
- **Component & Props** — reusable UI building blocks
- **State Management** — local state, `useEffect`, and global state with Redux
- **Conditional Rendering** — dynamic UI based on data state
- **Form Handling** — controlled inputs for login, register, and post creation
- **useParams** — reading URL parameters for dynamic routing
- **WebSocket Client** — listening to real-time events from the server
- **Git Workflow** — branching, merging, pull requests, and hotfixes

---

## 🚀 Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/Rofiq354/circle-app-fe.git
cd circle-app-fe

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Fill in your backend API URL in .env

# 4. Start development server
npm run dev
```

Make sure the [backend server](https://github.com/Rofiq354/circle-app-be) is running before starting the frontend.

---

## 📁 Project Structure

```
circle-app-fe/
├── public/
└── src/
    ├── api/            # Axios instance & API configuration
    ├── assets/         # Static assets (images, icons, etc.)
    ├── components/     # Reusable UI components
    ├── context/        # React context providers
    ├── hooks/          # Custom React hooks
    ├── layouts/        # Page layout components
    ├── lib/            # Third-party library configurations
    ├── pages/          # Page-level components
    ├── routes/         # Route definitions & protected routes
    ├── services/       # API call functions
    ├── store/          # Redux store & slices
    ├── types/          # TypeScript type definitions
    ├── App.css
    ├── App.tsx
    ├── index.css
    └── main.tsx
```

---

<div align="center">

_Part of the Circle App full-stack project — built day by day, feature by feature. 🚀_

\*by **Ainur Rofiq\***

</div>
