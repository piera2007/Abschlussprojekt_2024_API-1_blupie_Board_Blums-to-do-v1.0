/** 
  Author: Piera Blum
  Date: 26.06.2024
  Description: Defines a Mongoose schema for events.
*/

const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    date: { type: Date, required: true },
});

module.exports = mongoose.model('Event', eventSchema);
