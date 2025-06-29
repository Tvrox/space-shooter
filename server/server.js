require('dotenv').config(); // Подключаем .env
const nodemailer = require('nodemailer'); // Для отправки email
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const path = require('path');


const app = express();


// 🔓 Разрешаем CORS и JSON-запросы
app.use(cors());
app.use(express.json());

// 🔑 Подключаем ключ Firebase
const adminConfig = {
  type: 'service_account',
  project_id: process.env.FB_PROJECT_ID,
  private_key_id: process.env.FB_PRIVATE_KEY_ID,
  private_key: process.env.FB_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FB_CLIENT_EMAIL,
  client_id: process.env.FB_CLIENT_ID,
  auth_uri: process.env.FB_AUTH_URI,
  token_uri: process.env.FB_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FB_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FB_CLIENT_CERT_URL,
  universe_domain: process.env.FB_UNIVERSE_DOMAIN
};

admin.initializeApp({
  credential: admin.credential.cert(adminConfig),
  databaseURL: 'https://space-shooter-1e24a-default-rtdb.europe-west1.firebasedatabase.app/'
});

const db = admin.database();
const scoresRef = db.ref('scores');


// 📤 Сохранение результата
app.post('/api/score', (req, res) => {
  const { name, score } = req.body;

  if (!name || typeof score !== 'number') {
    return res.status(400).json({ error: 'Invalid data' });
  }

  const newRef = scoresRef.push();
  newRef.set({
    name,
    score,
    createdAt: Date.now()
  }, (error) => {
    if (error) {
      console.error('Ошибка при записи в Firebase:', error);
      res.status(500).json({ error: 'Firebase write error' });
    } else {
      console.log('✅ Рекорд сохранён:', { name, score });
      res.status(201).json({ message: 'Score saved' });
    }
  });
});


// 📥 Получение топ-10 по очкам
app.get('/api/scores', (req, res) => {
  scoresRef.once('value', snapshot => {
    const records = [];
    snapshot.forEach(child => {
      const val = child.val();
      if (val && val.name && typeof val.score === 'number') {
        records.push(val);
      }
    });

    records.sort((a, b) => b.score - a.score);
    res.json(records.slice(0, 10));
  }, error => {
    console.error('❌ Firebase error:', error);
    res.status(500).json({ error: 'Ошибка чтения из Firebase' });
  });
});


// ✉️ Обработка формы помощи (поставлен выше статики!)
app.post('/api/help', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_TO,
    subject: `Помощь от ${name}`,
    text: `Имя: ${name}\nEmail: ${email}\nСообщение: ${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Ошибка при отправке письма:', error);
      res.status(500).json({ error: 'Ошибка при отправке письма' });
    } else {
      console.log('📨 Письмо успешно отправлено:', info.response);
      res.status(200).json({ message: 'Сообщение отправлено' });
    }
  });
});


// 📂 Отдаём статику (в самом конце)
app.use(express.static(path.join(__dirname, '../public')));


// 🟢 Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
});