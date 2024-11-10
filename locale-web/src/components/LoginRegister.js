import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import DOMPurify from 'dompurify';
import './LoginRegister.css';
import validator from 'validator';
import { useNavigate } from 'react-router-dom';  // Импортируем useNavigate

const LoginRegister = () => {
    const navigate = useNavigate();  // Инициализируем navigate для редиректа
    const [isRegister, setIsRegister] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const [csrfToken, setCsrfToken] = useState(''); // Новый стейт для CSRF-токена

    useEffect(() => {
        // Получение CSRF-токена при загрузке компонента
        const fetchCsrfToken = async () => {
            try {
                const response = await axios.get('https://locale.itzine.ru/api/csrf-token', {
                    withCredentials: true, // Чтобы cookie с CSRF-секретом были получены
                });
                setCsrfToken(response.data.csrfToken);
            } catch (error) {
                console.error('Ошибка при получении CSRF-токена:', error);
            }
        };

        fetchCsrfToken();

        const savedUsername = Cookies.get('username');
        const savedEmail = Cookies.get('email');
        if (savedUsername && savedEmail) {
            setUserInfo({
                username: DOMPurify.sanitize(savedUsername),
                email: DOMPurify.sanitize(savedEmail),
            });
            setIsLoggedIn(true);
        }
    }, []);

    const validateInputs = () => {
        const normalizedUsername = username.trim().toLowerCase();
        const normalizedEmail = email.trim().toLowerCase();

        if (isRegister) {
            if (!validator.isLength(normalizedUsername, { min: 3, max: 20 })) {
                return 'Username must be between 3 and 20 characters.';
            }
            if (!validator.isAlphanumeric(normalizedUsername)) {
                return 'Username must only contain letters and numbers.';
            }
        }

        if (!validator.isEmail(normalizedEmail)) {
            return 'Invalid e-mail format.';
        }

        if (!validator.isLength(password, { min: 8 })) {
            return 'Password must be at least 8 characters long.';
        }

        if (!validator.matches(password, /[A-Z]/)) {
            return 'Password must contain at least one uppercase letter.';
        }

        if (!validator.matches(password, /[a-z]/)) {
            return 'Password must contain at least one lowercase letter.';
        }

        if (!validator.matches(password, /[0-9]/)) {
            return 'Password must contain at least one digit.';
        }

        if (!validator.matches(password, /[\W_]/)) {
            return 'Password must contain at least one special character.';
        }

        return null;
    };

    const handleSubmit = async () => {
        const normalizedUsername = username.trim().toLowerCase();
        const normalizedEmail = email.trim().toLowerCase();

        const validationError = validateInputs();
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        try {
            setErrorMessage('');

            // Проверяем, есть ли CSRF-токен
            if (!csrfToken) {
                setErrorMessage('CSRF token is missing. Please refresh the page.');
                return;
            }

            const config = {
                headers: {
                    'X-CSRF-Token': csrfToken, // Отправляем CSRF-токен в заголовках
                },
                withCredentials: true, // Чтобы cookie передавались с запросом
            };

            if (isRegister) {
                const response = await axios.post(
                    'https://locale.itzine.ru/api/register',
                    {
                        username: DOMPurify.sanitize(normalizedUsername),
                        email: DOMPurify.sanitize(normalizedEmail),
                        password,
                    },
                    config
                );
                console.log('Registration successful:', response.data);
                alert('Registration successful! Please log in.');
                setIsRegister(false);
                // После регистрации обновляем CSRF-токен
                const newCsrfTokenResponse = await axios.get('https://locale.itzine.ru/api/csrf-token', {
                    withCredentials: true,
                });
                setCsrfToken(newCsrfTokenResponse.data.csrfToken);
            } else {
                const response = await axios.post(
                    'https://locale.itzine.ru/api/login',
                    {
                        email: DOMPurify.sanitize(normalizedEmail),
                        password,
                    },
                    config
                );
                console.log('Login successful:', response.data);
                setIsLoggedIn(true);
                setUserInfo({
                    username: DOMPurify.sanitize(response.data.username),
                    email: DOMPurify.sanitize(normalizedEmail),
                });

                Cookies.set('username', response.data.username, { expires: 7 });
                Cookies.set('email', normalizedEmail, { expires: 7 });

                // Редиректим пользователя на страницу настроек
                navigate('/settings');  // Редирект после успешного входа
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('Something went wrong. Please try again.');
            }
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserInfo({});
        Cookies.remove('username');
        Cookies.remove('email');
        // Обновляем CSRF-токен после выхода
        const fetchCsrfToken = async () => {
            try {
                const response = await axios.get('https://locale.itzine.ru/api/csrf-token', {
                    withCredentials: true,
                });
                setCsrfToken(response.data.csrfToken);
            } catch (error) {
                console.error('Ошибка при получении CSRF-токена:', error);
            }
        };
        fetchCsrfToken();
    };

    return (
        <div className="login-register-page">
            <div className="left-panel">
                <h1 className="brand-title">Locale</h1>
                <h2 className="brand-slogan">Find your way</h2>
                <p className="description">
                    We help you not only find, but also cherish your coffee, memories, tastes, and every moment that makes your journey special. Explore the world with a cup in your hand, and let us help you remember every sip.
                </p>
            </div>
            <div className="right-panel">
                {isLoggedIn ? (
                    <div className="user-info">
                        <h3>Welcome, {userInfo.username}!</h3>
                        <p>E-mail: {userInfo.email}</p>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                ) : (
                    <div className="form-container">
                        <div className="tabs">
                            <div
                                className={`tab ${!isRegister ? 'active-tab' : ''}`}
                                onClick={() => setIsRegister(true)}
                            >
                                Register
                            </div>
                            <div
                                className={`tab ${!isRegister ? 'active-tab' : ''}`}
                                onClick={() => setIsRegister(false)}
                            >
                                Login
                            </div>
                        </div>
                        {errorMessage && <div className="error-message">{errorMessage}</div>}
                        <form className="form-fields" onSubmit={(e) => e.preventDefault()}>
                            {isRegister && (
                                <div className="form-field">
                                    <label>Username</label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                            )}
                            <div className="form-field">
                                <label>E-mail</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-field">
                                <label>Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button className="submit-button" onClick={handleSubmit}>
                                {isRegister ? 'Register' : 'Login'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginRegister;
