const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const fileRouter = require('./routes/file');
const showRouter = require('./routes/show');
const downloadRouter = require('./routes/download');
const deleteFiles = require('./utils/script');
require('dotenv').config();

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose
  .connect(process.env.DATABASE_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connect successfull!'))
  .catch(() => console.log('DB connect failed!'));

app.use('/api/files', fileRouter);
app.use('/files', showRouter);
app.use('/files/download', downloadRouter);
app.get('/', (req, res) => {
  res.render('index');
});

deleteFiles();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`App running on port ${PORT}...`));
