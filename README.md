# ProductHub Backend

Backend API for ProductHub, a MERN-based e-commerce application built with Node.js, Express.js, MongoDB, and JWT authentication.

The backend provides authentication, role-based authorization, product management, image uploads, cart management, user profiles, and order creation.

## Features

- User registration and login
- JWT-based authentication
- Role-based access for User, Seller, and Admin
- Password hashing with bcrypt
- Product CRUD operations
- Product image upload with Multer
- Product search
- Product pagination
- Seller-specific product management
- Shopping cart management
- Cart pagination
- Order creation
- Order validation
- User profile management
- Profile image upload
- Centralized error handling
- MongoDB database integration

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer
- Express Validator
- CORS
- dotenv
- Nodemon

## Project Structure

```text
backend/
├── config/
│   └── connectDB.js
├── controllers/
│   ├── authController.js
│   ├── cartController.js
│   ├── orderController.js
│   └── productController.js
├── helpers/
│   └── httpError.js
├── middleware/
│   ├── authCheck.js
│   ├── adminCheck.js
│   ├── fileUpload.js
│   └── validation.js
├── models/
│   ├── Cart.js
│   ├── Order.js
│   ├── Product.js
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   ├── cartRoutes.js
│   ├── orderRoutes.js
│   └── productRoutes.js
├── uploads/
├── validators/
│   ├── authValidators.js
│   └── orderValidator.js
├── views/
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js

