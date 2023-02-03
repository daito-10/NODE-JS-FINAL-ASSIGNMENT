const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const app = express();
const port = 8800;
const jwtSecretkey = 'asjh*^%as026^4&Adjga^hd&asja5&';


//LOCAL DATABASE
const books = [ {book_isbn: 'b1', book_name: 'book-1', author: 'author-1', reviews: [{userId: '1675446422650', message: 'Review for book-1'}]}, 
                {book_isbn: 'b2', book_name: 'book-2', author: 'author-1', reviews: [{userId: '1675446422650', message: 'Review for book-1'}]}, 
                {book_isbn: 'b3', book_name: 'book-3', author: 'author-2', reviews: [{userId: '1675446422650', message: 'Review for book-1'}]},
                {book_isbn: 'b4', book_name: 'book-4', author: 'author-2', reviews: [{userId: '1675446422650', message: 'Review for book-1'}]},
                {book_isbn: 'b5', book_name: 'book-5', author: 'author-2', reviews: [{userId: '1675446422650', message: 'Review for book-1'}]} ]

const users = [ { userId:1487403422650, username:'user-01', email:'user-01@gmail.com', password:'user1password'}, 
                { userId:1926403422874, username:'user-02', email:'user-02@gmail.com', password:'user2password'}, 
                { userId:1675446422650, username:'user-03', email:'user-03@gmail.com', password:'user3password'}, 
                { userId:1894039841350, username:'user-04', email:'user-04@gmail.com', password:'user4password'}, 
                { userId:4589555456850, username:'user-05', email:'user-05@gmail.com', password:'user5password'} ]


app.use(express.json());



app.listen(port, () => {
    console.log(`Port listening on port: ${port}`)
})


// General Users:
//Task 1: Get the book list available in the shop.
app.get('/api/books', (req, res) => {
    res.status(200).json({ success: true, books })
});





//Task 2: Get the books based on ISBN.
app.get('/api/books/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books.filter(book => book.book_isbn === isbn);
    if(!book) return res.status(400).json({ success: true, message: 'No book found'});
    res.status(200).json({ success: true, book });
});





// Task 3: Get all books by Author.
app.get('/api/books/author/:author', (req, res) => {
    const author = req.params.author;
    const book = books.filter(book => book.author === author );
    res.status(200).json({ success: true, book });
});





// Task 4: Get all books based on Title
app.get('/api/books/title/:title', (req, res) => {
    const title = req.params.title;
    const book = books.filter(book => book.title === title );
    res.status(200).json({ success: true, book });
});




// Task 5: Get book Review.
app.get('/api/books/title/:title', (req, res) => {
    const title = req.params.title;
    const book = books.filter(book => book.title === title );
    res.status(200).json({ success: true, book, reviews: book[0].reviews });
});



// Task 6: Register New user 
app.post('/api/user/register', (req, res) => {
    try {
        const { username, email, password } = req.body
        const id = Date.now(); //The database will provide an id or we can use an external package for one.
        const newUser = {id, username, email, password};
        users.push(newUser);
        const token = jwt.sign(newUser, jwtSecretkey)
        res.status(201).header('x-auth-token', token).json({ success: true, message: 'New user created '});

    } catch (error) {

        res.status(500).json({ success: false, error });
    }

});

// Task 7: Login as a Registered user 
app.post('/api/user/login', (req, res) => {
    try {
        const { email, password } = req.body
        const user = users.find(user => user.email ===email && user.password === password);

        if(!user) return res.status(401).json({ message: 'No user found / Invalid Credentials'});

        const token = jwt.sign(user, jwtSecretkey)

        res.status(200).header('x-auth-token', token).json({ success: true, message: `Hello ${user.username}`})
        
    } catch (error) {    
        res.status(500).json({ success: false, error });
    }

});

// Registered Users:
// Task 8: Add/Modify a book review. 
app.post('/api/user/:bookname/review', (req, res) => {

    try {
        const token = req.header('x-auth-token');
        if (!token) return res.status(401).json({ success: false, messsage: 'Authorization denied. Login in to access this resource. No token'});
        
        const user = jwt.verify(token, jwtSecretkey);
        if (!user) return res.status(401).json({ success: false, messsage: 'Login to access this resource/ Tanpered token'});

        const book = books.find(book => book.book_name === req.params.bookname);

        const review = book.reviews.find(review => review.userId === user.userId);
        review.message = req.body.review

        res.status(201).json({ success: true, message: 'Review added/ updated' })

    } catch (error) {
        res.status(500).json({ success: false, error });
    }
})

// Task 9: Delete book review added by that particular user
app.delete('/api/user/:bookname/review', (req, res) => {

    try {
        const token = req.header('x-auth-token');
        if (!token) return res.status(401).json({ success: false, messsage: 'Authorization denied. Login in to access this resource. No token'});
        
        const user = jwt.verify(token, jwtSecretkey);
        if (!user) return res.status(401).json({ success: false, messsage: 'Login to access this resource/ Tampered token'});

        const book = books.find(book => book.book_name === req.params.bookname);

        const review = book.reviews.filter(review => review.userId !== user.userId);

        res.status(201).json({ success: true, message: 'Review deleted' })

    } catch (error) {
        res.status(500).json({ success: false, error });
    }
})



// Node.JS program with 4 methods:
// Use Async/Await or Promises with Axios in Node.js for all the four methods.

// Task 10: Get all books – Using async callback function

const getAllBooks = (callback) => {
    axios.get('http://example-API.com/books')
      .then((response) => {
        callback(null, response.data);
      })
      .catch((error) => {
        callback(error);
      });
  };
  
  getAllBooks((error, books) => {
    if (error) {
      console.error(error);
    } else {
      console.log(books);
    }
  });

// Task 11: Search by ISBN – Using Promises
const searchByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
      const book = books.find((book) => book.book_isbn === isbn);
      if (book) {
        resolve(book);
      } else {
        reject(new Error(`Book with ISBN ${isbn} not found`));
      }
    });
  };
  
  searchByISBN('234567')
    .then((book) => {
      console.log(book);
    })
    .catch((err) => {
      console.error(err);
    });


// Task 12: Search by Author
const searchByAuthor = async (author) => {
  try {
    const response = await axios.get('http://example-API.com/books');
    const bookList = books //or .. response.data in an actual api response
    return bookList.filter((book) => book.author === author);
  } catch (error) {
    console.error(error);
  }
};

const authorBooks =  searchByAuthor('author-1');


// Task 13: Search by Title - 2 Points
const searchByTitle = async (title) => {
    try {
      const response = await axios.get('http://api.example.com/books');
      const bookList = books //or .. response.data in an actual api response
      return bookList.filter((book) => book.book_name === title);
    } catch (error) {
      console.error(error);
    }
  };
  
  const bookTitle =  searchByTitle('book-3');

// Task 14: Submission of Project GitHub Link - 2 Points


