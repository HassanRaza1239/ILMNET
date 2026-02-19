const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Import routes
const authRoutes = require('./server/routes/auth');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'client')));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'ilmnet_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

// API Routes
app.use('/api/auth', authRoutes);

// Basic route for testing
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'ILM.NET Server is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Serve frontend - this must be the LAST route
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log('\n=================================');
    console.log('🚀 ILM.NET Server is running!');
    console.log('=================================');
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`📚 Platform: Islamic Learning Network`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔑 Auth routes: /api/auth/*`);
    console.log('=================================\n');
});
