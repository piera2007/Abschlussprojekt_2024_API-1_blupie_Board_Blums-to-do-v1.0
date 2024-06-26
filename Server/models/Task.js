/** 
  Author: Piera Blum
  Date: 26.06.2024
  Description: Defines a Mongoose schema for tasks with references to users.
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  task: {
    type: String,
    required: true,
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Task", taskSchema);
