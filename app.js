const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const presentationRoutes = require('./routes/presentationRoutes');
const slideRoutes = require('./routes/slideRoutes');
const uploadRouter = require('./routes/uploadRoutes');
const path = require('path');

const app = express();

app.use(cors()); // <-- эта строка ДОЛЖНА быть

app.use(express.json());

// Подключаем роуты
app.use('/api/presentations', presentationRoutes);
app.use('/api/slides', slideRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // отдача файлов
app.use('/api/upload', uploadRouter);
app.use('/uploads', express.static('uploads'));

connectDB();

module.exports = app;


