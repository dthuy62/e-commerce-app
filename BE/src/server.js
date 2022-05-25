const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');

dotenv.config();
const app = express();

mongoose.connect(process.env.MONGODB_URL, () => {
  console.log("CONNECTED TO mongodb")
})

app.use(cors());
app.use(cookieParser());
app.use(express.json());

// routes
app.use('/api', authRoute);
app.use('/api', userRoute);

const PORT = 8000;
app.listen(PORT, () => {
  console.log("Server is running at", PORT);
});
