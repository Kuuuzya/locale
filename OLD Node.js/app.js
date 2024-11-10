const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cors = require('cors');
const Csrf = require('csrf'); // Обратите внимание на заглавную 'C' в 'Csrf'
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser'); // Необходимо для работы с cookie

const app = express();

// Безопасность HTTP-заголовков
app.use(helmet());

// Лимит запросов
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 100, // Максимум 100 запросов
    message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use(limiter);

// Использование body-parser для обработки JSON
app.use(bodyParser.json());
app.use(express.static('public'));

// Добавление CORS для разрешения запросов с фронтенда
app.use(cors({
    origin: 'https://locale.itzine.ru', // URL вашего веб-приложения
    credentials: true, // Для передачи cookies и сессий
}));

// Парсинг cookie
app.use(cookieParser());

// Создание экземпляра для CSRF-токенов
const tokens = new Csrf();

// Настройка подключения к базе данных Postgres
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});



// Middleware для генерации и проверки CSRF-токенов
app.use((req, res, next) => {
    // Проверяем, есть ли секрет в cookie
    let secret = req.cookies['_csrf_secret'];
    if (!secret) {
        // Генерируем новый секрет и сохраняем в cookie
        secret = tokens.secretSync();
        res.cookie('_csrf_secret', secret, { httpOnly: true, secure: true });
    }
    req.csrfSecret = secret;
    next();
});

// Маршрут для получения CSRF-токена
app.get('/api/csrf-token', (req, res) => {
    const token = tokens.create(req.csrfSecret);
    res.json({ csrfToken: token });
});

// Middleware для проверки CSRF-токена
const csrfProtection = (req, res, next) => {
    const token = req.headers['x-csrf-token'] || req.body._csrf;
    if (!token) {
        return res.status(403).json({ success: false, message: 'CSRF token missing' });
    }
    const isValid = tokens.verify(req.csrfSecret, token);
    if (!isValid) {
        return res.status(403).json({ success: false, message: 'Invalid CSRF token' });
    }
    next();
};

// Маршрут для регистрации
app.post('/api/register', csrfProtection, async (req, res) => {
    const { username, email, password } = req.body;

    console.log('Registration request received:', req.body); // Logging
    try {
        // Normalize username and email
        const normalizedUsername = username.trim().toLowerCase();
        const normalizedEmail = email.trim().toLowerCase();

        // Check for existing user
        const existingUser = await pool.query(
            'SELECT * FROM users WHERE LOWER(email) = $1 OR LOWER(username) = $2',
            [normalizedEmail, normalizedUsername]
        );
        console.log('User existence check completed. Found:', existingUser.rows.length);

        if (existingUser.rows.length > 0) {
            console.log('User with this email or username already exists.');
            return res.status(400).json({ success: false, message: 'A user with this email or username already exists.' });
        }

        // Hash password
        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed successfully.');

        // Insert new user
        console.log('Inserting user into the database...');
        const result = await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING username',
            [normalizedUsername, normalizedEmail, hashedPassword]
        );
        console.log('User registered successfully:', result.rows[0].username);

        res.json({ success: true, username: result.rows[0].username });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ success: false, message: 'Registration error.', error: error.message });
    }
});

// Маршрут для входа
app.post('/api/login', csrfProtection, async (req, res) => {
    const { email, password } = req.body;

    console.log('Login request received:', req.body); // Logging
    try {
        // Normalize email
        const normalizedEmail = email.trim().toLowerCase();

        // Check if user exists
        const result = await pool.query('SELECT * FROM users WHERE LOWER(email) = $1', [normalizedEmail]);
        console.log('User existence check completed. Found:', result.rows.length);

        if (result.rows.length > 0) {
            const user = result.rows[0];

            // Compare password
            console.log('Comparing passwords...');
            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (isMatch) {
                console.log('Login successful for user:', user.username);
                res.json({ success: true, username: user.username });
            } else {
                console.log('Incorrect password for user:', normalizedEmail);
                res.status(401).json({ success: false, message: 'Incorrect password.' });
            }
        } else {
            console.log('User not found with email:', normalizedEmail);
            res.status(404).json({ success: false, message: 'User not found.' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'Login error.', error: error.message });
    }
});

// Default port
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
