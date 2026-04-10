# 🛒 Akuma Fits

---

## 🔷 Introduction

Akuma Fits is a **full-stack anime streetwear e-commerce platform** built to handle real-world users, orders, and payments.

This is not just a demo project — the platform is **live in production**, has processed **real customer orders**, and has been tested through **paid Facebook ad campaigns**.

The backend is designed with a strong focus on **scalability, validation, and real-world business logic**, including order tracking, admin control, payment verification, and review systems.

---

## 🛠️ Technologies Used

- Node.js
- Express.js
- MongoDB
- EJS (Server-Side Rendering)
- Razorpay (Payment Gateway)
- JavaScript (ES6+)
- HTML5 & CSS3

---

## ⭐ Features (What Users Can Do)

### 🧑‍💻 User Features
- Browse products with filtering (category, featured)
- View product details
- Place orders (Cash / Online Payment)
- Track orders using Order ID + Email
- Update order details (before processing)
- Submit verified reviews (only if product was actually ordered)

### 🛠️ Admin Features
- Create, update, delete products
- Toggle product visibility, stock, and featured status
- View and manage all orders
- Update order status (Placed → Shipped → Delivered)
- Moderate and approve reviews
- Bulk seed products

---

## ⚙️ The Process (How I Built It)

### 🧩 Backend Architecture

The backend follows a **modular controller-based architecture**:

- `product.controller` → Handles product fetching with filters and visibility logic  
- `order.controller` → Manages order lifecycle, tracking, and updates  
- `payment.controller` → Handles Razorpay integration and payment verification  
- `admin.controller` → Full admin control over products  
- `review.controller` → Verified review system with fraud prevention  

---

### 💳 Payment System (Key Highlight)

- Razorpay order is created before payment
- Payment is verified using **HMAC SHA256 signature**
- Only verified payments result in order creation

```js
const expectedSignature = crypto
  .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
  .update(body)
  .digest("hex");
```

This ensures:
✔ No fake orders  
✔ No tampered payments  
✔ Secure transaction handling  

---

### 📦 Order System

- Orders are created with unique `orderId`
- Users can:
  - Track orders via email + ID
  - Update details only before processing
- Admin can:
  - Filter orders by status
  - Update status dynamically

---

### ⭐ Review System (Advanced Logic)

- Users can only review if:
  ✔ They actually placed the order  
  ✔ The product exists in their order  
- Prevents:
  ❌ Fake reviews  
  ❌ Duplicate reviews  

---

### 🛍️ Product Management

- Products support:
  - Visibility toggle
  - Stock toggle
  - Featured toggle
  - Sorting priority
- Admin has full CRUD control

---

## 📚 What I Learned

- Designing real-world backend systems
- Secure payment verification (signature-based validation)
- Preventing fraud in reviews and orders
- Structuring scalable Express applications
- Handling real users and production data
- Thinking like a product builder, not just a developer

---

## 🔮 How It Can Be Improved

- Add JWT-based admin authentication
- Add user accounts and dashboards
- Implement inventory tracking system
- Add caching (Redis) for performance
- Move to REST API + React frontend (scalable architecture)
- Add analytics (conversion tracking, user behavior)
- Implement rate limiting & security middleware

---

## 💻 How to Run the Project

### Prerequisites

- Node.js
- npm
- MongoDB
- Razorpay API Keys (for payments)

### Installation Steps

```bash
# Clone the repository
git clone https://github.com/sarthak-sharma31/akuma.git

# Navigate into the project folder
cd akuma

# Install dependencies
npm install

# Create .env file and add:
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret

# Start the server
npm start
```

The application will run at:

```
http://localhost:3000
```

---

## 🌐 Live Website

https://akumafits.store/

---

## 🎥 Project Demo Video

Add your demo video here:

[Watch Demo Video](#)

---

## 📌 Author

Sarthak Sharma  
GitHub: https://github.com/sarthak-sharma31

---
