const mongoose = require('mongoose');
const { Schema } = mongoose;

const { Types: { ObjectId } } = Schema;

const BookSchema = new Schema({
  title: String,
  comments: [
    {
      type: String,
    }]
});


module.exports = mongoose.model('Book', BookSchema);