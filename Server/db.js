/** 
  Author: Piera Blum
  Date: 26.06.2024
  Description: Connection to the Database
*/

const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.mongo_URL).then(
    () => {
        console.log('connected to database');
    }
)
    .catch((err) => {
        console.log(`Could not connect to db ` + err);
    })