/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
var mongoose = require('mongoose');
const Book = require('../model/book');

chai.use(chaiHttp);

suite('Functional Tests', function () {

  let bookId;

  this.beforeAll(done => {
    mongoose.connect(process.env.MONGO_DB_TEST || process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    }).then(async () => {
      const book = await Book.create({ title: 'cirant book', comments: ['hola mundo'] });
      bookId = book._id;
      done();
    })
      .catch(err => console.log('err', err))
  });

  this.afterAll((done) => {
    mongoose.connection.db.collections().then(async collections => {
      for (let collection of collections) {
        await collection.drop();
      }
    }).then(() => {
      mongoose.disconnect();
      done()
    })
  });

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function (done) {
    chai.request(server)
      .get('/api/books')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        console.log('res.body ', res.body)
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function () {


    suite('POST /api/books with title => create book object/expect book object', function () {

      test('Test POST /api/books with title', function (done) {
        chai.request(server)
          .post('/api/books')
          .send({ title: 'a nuee book' })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, 'title', 'Books in array should contain title');
            assert.property(res.body, 'comments', 'Books in array should contain comments');
            assert.property(res.body, '_id', 'Books in array should contain _id');
            done();
          });
      });

      test('Test POST /api/books with no title given', function (done) {
        chai.request(server)
          .post('/api/books')
          .send({})
          .end(function (err, res) {
            assert.equal(res.status, 400);
            assert.equal(res.text, 'missing title', 'should contain a missing title message');
            done();
          });
      });

    });


    suite('GET /api/books => array of books', function () {

      test('Test GET /api/books', function (done) {
        chai.request(server)
          .get('/api/books')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          });
      });

    });


    suite('GET /api/books/[id] => book object with [id]', function () {

      test('Test GET /api/books/[id] with id not in db', function (done) {
        chai.request(server)
          .get('/api/books/5e00dd97a0ac431b719636e4')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db', function (done) {
        chai.request(server)
          .get(`/api/books/${bookId}`)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body.comments, 'comments should be a comments');
            assert.equal(res.body.title, 'cirant book', 'Book should contain title cirant book');
            assert.property(res.body, '_id', 'Book should contain _id');
            done();
          });
      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function () {

      test('Test POST /api/books/[id] with comment', function (done) {
        chai.request(server)
          .post(`/api/books/${bookId}`)
          .send({ comment: 'a comment' })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body.comments, 'comments should be a comments');
            assert.includeMembers(res.body.comments, ['hola mundo', 'a comment'], 'comments should be a comments');
            assert.equal(res.body.comments.length, 2);
            assert.equal(res.body.title, 'cirant book', 'Book should contain title cirant book');
            assert.property(res.body, '_id', 'Book should contain _id');
            done();
          });
      });

    });

  });

});
