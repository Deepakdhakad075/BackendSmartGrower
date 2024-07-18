const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const labourRoutes = require('./routes/labourRoutes');
const cors = require('cors');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
// DB connect 

require('./config/database').connect();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/labours', labourRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT , ()=>{
    console.log(`app is listening on PORT ${PORT}`);
})


