const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const dbSchema = new Schema({
  title: String,
  description: String
});

module.exports = mongoose.model('db', dbSchema);
