import * as http from 'http';
import { Sequelize, Model, DataTypes } from 'sequelize';
import * as url from 'url';
import * as querystring from 'querystring';

// Настройка подключения к базе данных и модели пользователя
const sequelize = new Sequelize('sqlite:./database.sqlite');

class User extends Model {}
User.init({
  username: DataTypes.STRING,
  password: DataTypes.STRING // В реальном приложении пароль должен быть хеширован
}, { sequelize, modelName: 'user' });

sequelize.sync();



const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url as string);
  const parsedQuery = querystring.parse(parsedUrl.query as string);

  if (parsedUrl.pathname === '/register' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      const { username, password } = JSON.parse(body);
      try {
        const newUser = await User.create({ username, password });
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User registered', userId: newUser.id }));
      } catch (error) {
        res.writeHead(500);
        res.end(JSON.stringify({ message: 'Error registering user', error }));
      }
    });
  } else if (parsedUrl.pathname === '/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      const { username, password } = JSON.parse(body);
      try {
        const user = await User.findOne({ where: { username, password } });
        if (user) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'User logged in', userId: user.id }));
        } else {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Invalid credentials' }));
        }
      } catch (error) {
        res.writeHead(500);
        res.end(JSON.stringify({ message: 'Error logging in', error }));
      }
    });
  } else {
    // Обработка других запросов...
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
