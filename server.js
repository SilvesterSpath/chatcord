const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config({ path: './config/.env' });

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
