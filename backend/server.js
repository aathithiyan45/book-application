const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Book = require('./models/Book'); // ✅ Import the model

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/bookdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB ✅'))
.catch(err => console.error('MongoDB connection error ❌:', err));

// ✅ Routes

// Test route
app.get('/', (req, res) => {
  res.send('Backend server is running. Use /api/books to access data.');
});

// Get all books
app.get('/api/books', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const totalBooks = await Book.countDocuments();
    const books = await Book.find().skip(skip).limit(limit);
    
    const totalPages = Math.ceil(totalBooks / limit);
    
    res.json({
      books,
      pagination: {
        currentPage: page,
        totalPages,
        totalBooks,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// Add a book
app.post('/api/books', async (req, res) => {
  const { title, author, genre, publishedYear, description, coverUrl, readingStatus, tags } = req.body;
  try {
    const newBook = new Book({ 
      title, 
      author, 
      genre, 
      publishedYear,
      description,
      coverUrl,
      readingStatus,
      tags
    });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a book by ID
app.put('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, genre, publishedYear, description, coverUrl, readingStatus, tags } = req.body;
    
    const updatedBook = await Book.findByIdAndUpdate(
      id, 
      { title, author, genre, publishedYear, description, coverUrl, readingStatus, tags },
      { new: true, runValidators: true }
    );
    
    if (!updatedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update book' });
  }
});
// Delete a book by ID
app.delete('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);
    
    if (!deletedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.status(204).send(); // Success, no content
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete book' });
  }
});

// Get a book by ID
app.get('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});