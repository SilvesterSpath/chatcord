const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: './config/.env' });

const app = express();
app.use(bodyParser.json());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
