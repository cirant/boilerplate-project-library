/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const bookController = require('../controllers/book');

module.exports = function (app) {

  app.route('/api/books')
    .get(bookController.index)

    .post(bookController.create)

    .delete(bookController.delete);


  app.route('/api/books/:id')
    .get(bookController.find)

    .post(bookController.createComment)

    .delete(bookController.deleteBook);
};
