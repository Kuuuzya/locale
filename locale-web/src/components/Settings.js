import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Settings = () => {
  const [userInfo, setUserInfo] = useState({ username: '', email: '', name: '' });
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(true);

  // Получаем данные пользователя
  useEffect(() => {
    const accessToken = localStorage.getItem('access_token'); // Получаем токен из LocalStorage
    if (accessToken) {
      axios.get('/api/user', { headers: { Authorization: `Bearer ${accessToken}` } })
        .then(response => {
          setUserInfo(response.data);
          setNewName(response.data.name || '');
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    } else {
      console.error('No access token found');
    }
  }, []);

  // Обновляем имя
  const handleSave = () => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      axios.put('/api/user', { name: newName }, { headers: { Authorization: `Bearer ${accessToken}` } })
        .then(response => {
          alert(response.data.message);
          setUserInfo({ ...userInfo, name: newName });
        })
        .catch(error => {
          console.error('Error updating name:', error);
        });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="settings-page">
      <h1>Настройки</h1>
      <div>
        <strong>Email:</strong> {userInfo.email}
      </div>
      <div>
        <strong>Логин:</strong> {userInfo.username}
      </div>
      <div>
        <strong>Имя:</strong>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button onClick={handleSave}>Сохранить</button>
      </div>
    </div>
  );
};

export default Settings;
