const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

// Mock user database (will replace with real database later)
const users = [];

// Validation rules
const validateRegistration = [
    body('username').isLength({ min: 3 }).trim().escape(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('age').isInt({ min: 5, max: 120 })
];

// Register route
router.post('/register', validateRegistration, async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password, age } = req.body;

        // Check if user already exists
        const existingUser = users.find(u => u.email === email || u.username === username);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Determine age group
        let ageGroup = 'adult';
        if (age < 13) ageGroup = 'child';
        else if (age < 20) ageGroup = 'teen';
        else if (age < 36) ageGroup = 'young-adult';
        else if (age < 65) ageGroup = 'adult';
        else ageGroup = 'senior';

        // Create new user
        const newUser = {
            id: users.length + 1,
            username,
            email,
            password: hashedPassword,
            age,
            ageGroup,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);

        // Create JWT token
        const token = jwt.sign(
            { id: newUser.id, username: newUser.username, ageGroup: newUser.ageGroup },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                age: newUser.age,
                ageGroup: newUser.ageGroup
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = users.find(u => u.username === username);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username, ageGroup: user.ageGroup },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                age: user.age,
                ageGroup: user.ageGroup
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Verify token route
router.get('/verify', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ valid: false });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        
        // Find user
        const user = users.find(u => u.id === decoded.id);
        if (!user) {
            return res.status(401).json({ valid: false });
        }

        res.json({
            valid: true,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                age: user.age,
                ageGroup: user.ageGroup
            }
        });
    } catch (error) {
        res.status(401).json({ valid: false });
    }
});

module.exports = router;
