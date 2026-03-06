const fs = require('fs');
const path = require('path');
const logFile = path.join(__dirname, 'server.log');

// Log to both console and file
const originalLog = console.log;
const originalError = console.error;

console.log = (...args) => {
    originalLog(...args);
    fs.appendFileSync(logFile, `[LOG] ${new Date().toISOString()} ${args.join(' ')}\n`);
};
console.error = (...args) => {
    originalError(...args);
    fs.appendFileSync(logFile, `[ERROR] ${new Date().toISOString()} ${args.join(' ')}\n`);
};

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
// const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');
// const rateLimit = require('express-rate-limit');
// const swaggerUi = require('swagger-ui-express');
// const swaggerSpecs = require('./config/swagger');
const logger = require('./utils/logger');
require('dotenv').config();
const { ipBlocker, activityLogger } = require('./middleware/security');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ["http://localhost:5173", "http://localhost:5174"],
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(express.json());
// app.use(cookieParser());
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}));
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false // Disable CSP for easier deployment of assets
}));
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));

app.get('/api/health', (req, res) => {
    res.json({
        status: 'UP',
        timestamp: new Date(),
        environment: process.env.NODE_ENV
    });
});

// API Documentation (Disabled - library missing)
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Make io accessible to routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Security Middleware (Must be before routes)
app.use(ipBlocker);
app.use(activityLogger);

// Socket.io Connection
io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on('join_room', (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id);
    });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/investigations', require('./routes/investigation'));
app.use('/api/evidence', require('./routes/evidence'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/privacy', require('./routes/privacy'));

app.get('/', (req, res) => {
    res.send('Hyper Crime Shield API is running...');
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// Create logs directory if it doesn't exist
if (!fs.existsSync('./logs')) {
    fs.mkdirSync('./logs');
}
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

// Global Error Handler
app.use((err, req, res, next) => {
    logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    res.status(status).json({
        success: false,
        error: {
            message,
            status
        }
    });
});

const PORT = process.env.PORT || 5001;
if (process.env.NODE_ENV !== 'test') {
    server.listen(PORT, '0.0.0.0', () => {
        logger.info(`Server running on port ${PORT}`);
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;

const { sequelize, connectDB } = require('./config/db');
const { User } = require('./models');

// Initialize Database
connectDB();

/*
// Sync Database and Auto-Seed
sequelize.sync({ alter: true }).then(async () => {
    // ... logic moved to force-seed.js
}).catch(err => {
    console.log('SQLite Sync Error:', err);
});
*/
