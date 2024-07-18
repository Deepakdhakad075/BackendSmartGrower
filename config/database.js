const mongoose = require('mongoose');
require('dotenv').config;

exports.connect = () =>{
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        }).then(() => {
            console.log('DB connect successfully');
            }).catch((err) => {
                console.log('Error connecting to MongoDB', err);
                console.log(err);
                process.exit(1);
                });
 };

