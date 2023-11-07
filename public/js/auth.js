// Функция для отправки POST-запроса на сервер
function post(url, data) {
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }
  
  // Обработчик события отправки формы регистрации
  document.getElementById('register-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
  
    post('/register', { username, password })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'User registered') {
          alert('Registration successful. User ID: ' + data.userId);
          // Очистка полей формы или другие действия после регистрации
        } else {
          alert('Registration failed: ' + data.error);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Registration failed with an error. Please try again.');
      });
  });
  
  // Обработчик события отправки формы авторизации
  document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
  
    post('/login', { username, password })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Login failed');
        }
      })
      .then(data => {
        if (data.message === 'User logged in') {
          alert('Login successful. User ID: ' + data.userId);
          // Здесь может быть перенаправление на страницу пользователя или другая логика входа
        } else {
          alert('Login failed: ' + data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Login failed with an error. Please try again.');
      });
  });
  