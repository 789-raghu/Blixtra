const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const jwt = require('jsonwebtoken');

// Import routers
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const signupRouter = require('./routes/signup');

const app = express();

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Session configuration
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'session-secret-key',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        },
    })
);

// JWT Authentication middleware
const authenticateToken = (req, res, next) => {
    if (req.path === '/login' || req.path === '/signup' || req.path === '/') {
        return next();
    }

    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.redirect('/login');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        req.session.lastAccess = Date.now(); // Refresh session
        next();
    } catch (error) {
        res.clearCookie('token');
        return res.redirect('/login');
    }
};

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session activity checker middleware
app.use((req, res, next) => {
    if (req.session && req.session.lastAccess) {
        const currentTime = Date.now();
        const sessionAge = currentTime - req.session.lastAccess;
        if (sessionAge > 24 * 60 * 60 * 1000) {
            req.session.destroy();
            res.clearCookie('token');
            return res.redirect('/login');
        }
    }
    next();
});

// Root route: Landing page or Home page
app.get('/', (req, res) => {
    if (req.session && req.user) {
        // If session exists and user is authenticated, render the home page
        res.render('home', { user: req.user });
    } else {
        // If session does not exist, render the landing page
        res.render('landingpage', { title: 'Express' });
    }
});

// Routes
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/home', indexRouter); // Adjusted to use '/home' for index-related routes

// CSRF Protection middleware
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken?.() || '';
    next();
});

// 404 handler: Render error.ejs for non-existent routes
app.use(function (req, res, next) {
    res.status(404).render('error', {
        message: 'Page Not Found',
        error: { status: 404, stack: '' },
    });
});

// Error handler for other errors
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    if (req.app.get('env') === 'production') {
        console.error(err);
    }

    res.status(err.status || 500).render('error', {
        message: err.message || 'Internal Server Error',
        error: err,
    });
});

// Graceful shutdown handler
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    app.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

// Set port to 5000
const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
