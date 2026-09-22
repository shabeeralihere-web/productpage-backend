# ProductPage Backend

Backend API for a MERN stack product management application built with Node.js, Express.js, and MongoDB.

The application provides authentication, product management, role-based access control, and cart functionality.

---

## 🚀 Features

- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Role-based authorization
- Admin product management
- Product CRUD operations
- Cart management
- MongoDB database integration
- Express.js REST API
- Request validation
- Centralized error handling
- Environment variable configuration

---

## 🛠️ Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Token)
- bcryptjs
- express-validator
- dotenv
- cors
- nodemon

---

## 📁 Project Structure

```text
backend/
│
├── config/
│   └── connectDB.js
│
├── controllers/
│   ├── authController.js
│   ├── cartController.js
│   └── productController.js
│
├── helpers/
│   └── httpError.js
│
├── middleware/
│   ├── authCheck.js
│   ├── adminCheck.js
│   └── validation.js
│
├── models/
│   ├── User.js
│   ├── Product.js
│   └── Cart.js
│
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   └── cartRoutes.js
│
├── validators/
│   └── authValidators.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── server.js