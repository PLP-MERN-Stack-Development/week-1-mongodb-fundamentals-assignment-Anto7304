db.books.insertMany([
    {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Fiction',
    published_year: 1960,
    price: 12.99,
    in_stock: true,
    pages: 336,
    publisher: 'J. B. Lippincott & Co.'
  },
  {
    title: '1984',
    author: 'George Orwell',
    genre: 'Dystopian',
    published_year: 1949,
    price: 10.99,
    in_stock: true,
    pages: 328,
    publisher: 'Secker & Warburg'
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Fiction',
    published_year: 1925,
    price: 9.99,
    in_stock: true,
    pages: 180,
    publisher: 'Charles Scribner\'s Sons'
  },
  {
    title: 'Brave New World',
    author: 'Aldous Huxley',
    genre: 'Dystopian',
    published_year: 1932,
    price: 11.50,
    in_stock: false,
    pages: 311,
    publisher: 'Chatto & Windus'
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    published_year: 1937,
    price: 14.99,
    in_stock: true,
    pages: 310,
    publisher: 'George Allen & Unwin'
  },
  {
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    genre: 'Fiction',
    published_year: 1951,
    price: 8.99,
    in_stock: true,
    pages: 224,
    publisher: 'Little, Brown and Company'
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Romance',
    published_year: 1813,
    price: 7.99,
    in_stock: true,
    pages: 432,
    publisher: 'T. Egerton, Whitehall'
  },
  {
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    published_year: 1954,
    price: 19.99,
    in_stock: true,
    pages: 1178,
    publisher: 'Allen & Unwin'
  },
  {
    title: 'Animal Farm',
    author: 'George Orwell',
    genre: 'Political Satire',
    published_year: 1945,
    price: 8.50,
    in_stock: false,
    pages: 112,
    publisher: 'Secker & Warburg'
  },
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    genre: 'Fiction',
    published_year: 1988,
    price: 10.99,
    in_stock: true,
    pages: 197,
    publisher: 'HarperOne'
  },
  {
    title: 'Moby Dick',
    author: 'Herman Melville',
    genre: 'Adventure',
    published_year: 1851,
    price: 12.50,
    in_stock: false,
    pages: 635,
    publisher: 'Harper & Brothers'
  },
  {
    title: 'Wuthering Heights',
    author: 'Emily Brontë',
    genre: 'Gothic Fiction',
    published_year: 1847,
    price: 9.99,
    in_stock: true,
    pages: 342,
    publisher: 'Thomas Cautley Newby'
  },
  {
    title: 'Brave  World',
    author: 'Aldous Huxley',
    genre: 'Dystopian',
    published_year: 2011,
    price: 11.50,
    in_stock: true,
    pages: 311,
    publisher: 'Chatto & Windus'
  }
])



// Task 2: Basic CRUD Operations
// finding all books in a specific genre
db.books.find({genre: 'Fiction'})

// Finding books published after a certain year
db.books.find({published_year: {$gt: 1930}})

// Finding books by a specific author
db.books.find({author: 'Herman Melville'})

// Updating the price of a specific book
db.books.updateOne(
    {title: 'Moby Dick'},
    {$set: {price: 29.99}}
)

// Deleting a book by its title
db.books.deleteOne({title: 'Wuthering Heights'})


// Task 3: Advanced Queries
//  a query to find books that are both in stock and published after 2010

db.books.find(
    {
        in_stock: true,
        published_year: {$gt: 2010}
    }
)

// Using projection to return only the title, author, and price fields in your queries

db.books.find(
    {
        in_stock: true,
        published_year: {$gt: 2010}
    },{title: 1, author: 1, price: 1, _id: 0}
)

// Implement sorting to display books by price (both ascending and descending)
// in ascending order
db.books.aggregate([
  {$sort: {"price": 1}},
  {$project: {"title": 1, "author": 1, "price": 1}}
])

// in descending order
db.books.aggregate([
  {$sort: {"price": -1}},
  {$project: {"title": 1, "author": 1, "price": 1}}
])


// Using the `limit` and `skip` methods to implement pagination (5 books per page)
// For page 2 with 5 items per page
db.books.aggregate([
  {$sort: {"price": 1}},
  {$skip: (2 - 1) * 5}, 
  {$project: {"title": 1, "author": 1, "price": 1}},
  {$limit: 5}            
])
// Task 4: Aggregation Pipeline
//- Create an aggregation pipeline to calculate the average price of books by genre
db.books.aggregate([
  {$group: {_id: "$genre", average_price: {$avg: "$price"}}}
])

//Create an aggregation pipeline to find the author with the most books in the collection
db.books.aggregate([
  // Stage 1: Group books by author and count them
  {
    $group: {
      _id: "$author",
      bookCount: { $sum: 1 }
    }
  },
  
  // Stage 2: Sort authors by book count in descending order
  {
    $sort: { bookCount: -1 }
  },
  
  // Stage 3: Limit to the top result(s)
  {
    $limit: 1
  },
  
  // Optional Stage 4: Project to format the output
  {
    $project: {
      _id: 0,
      author: "$_id",
      bookCount: 1
    }
  }
])

//- Implement a pipeline that groups books by publication decade and counts them
db.books.aggregate([
  {
    $group: {
      _id: "$published_year",
      bookCount: { $sum: 1 }
    }
  }
])


// Task 5: Indexing
// Create an index on the `title` field for faster searches
db.books.createIndex({ title: 1 }, { unique: true });

// Create a compound index on `author` and `published_year
db.books.createIndex({ author: 1, published_year: 1 });

// Use the `explain()` method to demonstrate the performance improvement with your indexes

db.books.find({
  author: "J.K. Rowling",
  published_year: { $gte: 2000 }
}).explain("executionStats");