<h1 align="center">🏡 WanderLust - Airbnb Clone</h1>

A full-stack web application inspired by **Airbnb**, built using **Node.js, Express, MongoDB, Mongoose, and EJS**. Users can browse listings, view details, and add new property listings.

---

## 🚀 Features
✅ Add new listings  
✅ View all listings  
✅ View a single listing page  
✅ MongoDB database integration  
✅ Server-side rendering using EJS   
✅ User Authentication (Login / Signup)  
✅ Image Upload (Cloudinary / Multer)  
✅ Edit & Delete Listings  
✅ Responsive UI  
✅ Map Integration

---

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose 

### Frontend
- HTML
- CSS
- EJS Template Engine

---

## 🔧 Installation & Setup

### 1️⃣ Clone the repository
```
git clone https://github.com/Anushka7237/Airbnb-Clone.git
cd major_project
```

### 2️⃣ Install dependencies
```
npm install
```

### 3️⃣ Start MongoDB
```
mongod
```

### 4️⃣ Run the project
```
node app.js
```

Server will start at:
```
http://localhost:8080
```

---

## 🌐 Routes Overview

| Route | Method | Description |
|--------|--------|-------------|
| /listings | GET | Show all listings |
| /listings/new | GET | Add listing form |
| /listings | POST | Create new listing |
| /listings/:id | GET | Show single listing |

---

## 📝 Example Listing Schema
```js
const listingSchema = new Schema({
  title: String,
  description: String,
  image: {
    filename: String,
    url: String
  },
  price: Number,
  location: String,
  country: String
});
```

---

## ✅ Features Completed
🔹 User Authentication (Login / Signup)  
🔹 Image Upload (Cloudinary / Multer)  
🔹 Edit & Delete Listings  
🔹 Responsive UI  
🔹 Map Integration  

---

## 🌐 Connect here
<p align="left">
  <a href="https://linkedin.com/in/anushka-gupta18" target="blank">
    <img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/linked-in-alt.svg" alt="anushka-gupta18" height="30" width="40" />
  </a>
</p>

Feel free to contribute or suggest improvements! 🎉
