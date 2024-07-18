const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const labourRoutes = require('./routes/labourRoutes');
const cors = require('cors');
const helmet = require('helmet');
dotenv.config();

const app = express();

app.use(helmet());

// Set Referrer-Policy
app.use(helmet.referrerPolicy({ policy: 'strict-origin-when-cross-origin' }));

const options={
    origin: ['http://localhost:3000',process.env.FRONTEND_URL,"https://smart-grower-frontend.vercel.app"],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};
app.use(cors(options));
app.use(express.json());
// DB connect 

require('./config/database').connect();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/labours', labourRoutes);
  
app.use('/',(req,res)=>{
    res.send('Server is running successfully');
})

const PORT = process.env.PORT || 4000;

app.listen(PORT , ()=>{
    console.log(`app is listening on PORT ${PORT}`);
})


