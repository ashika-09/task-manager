# 📋 Task Manager App

**Task Manager App** is a full-stack web application designed to help users manage their tasks effectively. It allows users to create, update, delete, and filter tasks, as well as mark them as completed or pending. With a clean and modern UI built using React and Tailwind CSS, and a secure backend using Express and MongoDB, this app provides a reliable and responsive experience for staying organized.

---

## 🌟 Key Features

- ✅ **User Authentication** (Login, Register, Logout)
- 🔐 **JWT-based Auth** with HTTP-only cookies
- 📝 **Create, Edit, Delete Tasks**
- 📌 **Mark tasks as Completed or Pending**
- 🗂 **Filter tasks** by status (All, Completed, Pending)
- 📅 **Set Due Dates** for tasks
- 🔁 **Pagination** support for large task lists
- 🕒 **Timestamps**: View created, updated, and due dates
- 💅 **Responsive UI** using Tailwind CSS

---

## 🛠 Tech Stack

### 🚀 Frontend

- React.js
- Tailwind CSS
- Axios
- React Router DOM

### 🔧 Backend

- Node.js
- Express.js
- MongoDB & Mongoose
- JWT (jsonwebtoken)
- bcryptjs (password hashing)
- cookie-parser
- cors

---

<!-- ## Live Demo

Check out the live demo: [Taskmaster Live Demo]() -->

## Local Installation Guide

Follow these steps to set up the project locally:

### Clone the Repository

1. Clone the repository:
   ```bash
   git clone https://github.com/adarsh0128/HSR_Assignment.git
   cd MERN_TASK_MANAGER
   ```

### Front-end

1. Navigate to the client directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Back-end

1. Navigate to the server directory:
   ```bash
   cd backend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Environment Variables

Create a `.env` file in the server directory with the following variables:

```
MONGO_USER=your_mongodb_user
PORT=your_port
```
# task-manager
