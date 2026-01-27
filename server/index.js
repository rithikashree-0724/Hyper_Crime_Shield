const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));

// Make io accessible to routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

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

app.get('/', (req, res) => {
    res.send('Hyper Crime Shield API is running...');
});

// Create logs directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('./logs')) {
    fs.mkdirSync('./logs');
}

const { ipBlocker, activityLogger } = require('./middleware/security');
app.use(ipBlocker);
app.use(activityLogger);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/crime-shield')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('MongoDB connection error. Check if local MongoDB is running.');
        process.env.USE_MOCK_DATA = 'true';
        console.log('Note: USE_MOCK_DATA is now active. Server will function in demo mode.');
    });
