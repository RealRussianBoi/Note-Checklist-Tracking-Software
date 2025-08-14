# Note & Checklist Tracking Software

This project is a modern, professional-grade refactor of my original note-taking software, rebuilt from the ground up as a full stack React + Node.js application.  
It supports saving and editing notes and checklists with persistent storage in an SQLite database, featuring a clean, responsive UI and advanced search capabilities.

---

## 📹 Project Overview Video
In this video, I talk about the old, unupgraded artifact and the improvements I planned to make:  
[Watch on YouTube](https://www.youtube.com/watch?v=7DsJgUtddfE)

---

## 📖 About This Project

The original artifact was my first attempt at building a React/Node.js application. Its purpose was to save notes and checklists into an SQLite database to help me learn full stack engineering.

For this enhanced version, I rebuilt the entire application into a complete, functional, and professional-grade full stack app.

### Key Improvements
- **Software Design & Engineering** – Implemented a **component-based architecture** in React for scalability and maintainability. Added a responsive UI with:
  - Homepage
  - Note management page (create/edit)
  - Checklist dialog (add/edit checklist items)
- **Database Integration** – Integrated a **SQLite** database with full CRUD operations for notes and checklists, ensuring real-time, persistent data storage.
- **Algorithms & Data Structures** – Developed an **advanced search and ranking feature** using:
  - Custom relevance scoring algorithm
  - MaxHeap for organizing results so the most relevant appear first

This transformation showcases my ability to deliver high-quality, industry-standard full stack applications while applying database design and algorithmic problem-solving skills.

---

## 💻 Local Development Setup

Follow these steps to run the project locally:

### 1️⃣ Clone the repository's main branch and open project file in VS Code

### 2️⃣ Start Client and Server
- Open two terminals. In the first, run:

```bash
cd client
npm i
npm run dev
```
- In the second:

```bash
cd server
npm i
npm run dev
```

### 3️⃣ Access app
- In the client terminal, when the application starts up, you will see a message saying:
  VITE v4.5.14  ready in 1902 ms

  ➜  Local:   http://localhost:5173/

  - Open that link.
 
  ### 4️⃣ You're all set!
