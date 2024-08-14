const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: "./config/.env" });
const path = require("path");
const mongoose = require("mongoose");

// Import user routes
const userRoutes = require("./routes/userRoutes");

// Import the function to initialize the default admin
const initializeAdmin = require('./utils/initializeAdmin'); 

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
        return initializeAdmin(); // Execute the function to create the default admin
    })
    .catch(err => console.error("MongoDB connection error:", err));

// Use user routes under the '/api/users' path
app.use('/api/users', userRoutes);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server and listen on the specified port
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
