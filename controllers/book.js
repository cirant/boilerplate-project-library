const Book = require('../model/book');

exports.create = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      throw new Error('missing title')
    }
    const book = await Book.create({
      title: title
    });
    return res.status(200).json(book);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

exports.index = async (req, res) => {
  try {
    const books = await Book.find();

    return res.status(200).json(books.map(b => {
      let result = { ...b._doc }
      result['commentcount'] = result.comments.length;
      return result;
    }));
  } catch (error) {
    res.status(400).send(error.message);
  }
}

exports.find = async (req, res) => {
  try {
    var bookid = req.params.id;
    const book = await Book.findById(bookid);
    return book ? res.status(200).json(book) : res.status(200).send('no book exists');
  } catch (error) {
    res.status(400).send(error.message);
  }
}

exports.createComment = async (req, res) => {
  try {
    var bookid = req.params.id;
    var comment = req.body.comment;
    const book = await Book.findById(bookid);
    book.comments.push(comment);
    await book.save();
    res.status(200).json(book)
  } catch (error) {
    res.status(400).send(error.message);
  }
}

exports.deleteBook = async (req, res) => {
  try {
    var bookid = req.params.id;
    const { n } = await Book.deleteOne({ _id: bookid });
    if (n === 1) {
      res.status(200).send('delete successful')
    } else {
      res.status(200).send('delete invalid')
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
}

exports.delete = async (req, res) => {
  try {
    await Book.deleteMany({});
    res.status(200).send('complete delete successful')
  } catch (error) {
    res.status(400).send(error.message);
  }
}
