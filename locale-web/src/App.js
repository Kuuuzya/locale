import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginRegister from './components/LoginRegister';
import Settings from './components/Settings'; // Импортируем компонент настроек
import './App.css';
import Cookies from 'js-cookie';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Проверяем, есть ли сохраненные данные о пользователе в cookies
    const savedUsername = Cookies.get('username');
    const savedEmail = Cookies.get('email');
    if (savedUsername && savedEmail) {
      setIsLoggedIn(true);  // Если есть - считаем пользователя залогиненным
    }
  }, []);

  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Страница логина/регистрации */}
          <Route path="/login-register" element={<LoginRegister />} />

          {/* Страница настроек, доступна только для залогиненных */}
          <Route
            path="/settings"
            element={isLoggedIn ? <Settings /> : <Navigate to="/login-register" />}
          />

          {/* Главная страница - если залогинен, показываем приветствие, если нет - редиректим на логин */}
          <Route
            path="/"
            element={isLoggedIn ? <h1>Welcome back, {Cookies.get('username')}!</h1> : <Navigate to="/login-register" />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
