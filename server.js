const express = require('express');
const Database = require('better-sqlite3');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = 4167;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize SQLite database
const db = new Database('./library.db');

// Helper function to create MD5 hash
function createMD5Hash(password) {
    return crypto.createHash('md5').update(password).digest('hex');
}

// Create tables and insert dummy data
function initializeDatabase() {
    // Create users table
    db.exec(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT DEFAULT 'user'
    )`);

    // Create books table
    db.exec(`CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        author TEXT,
        isbn TEXT,
        year INTEGER,
        description TEXT
    )`);

    // Insert dummy users (admin has ID 1) - passwords are now MD5 hashed
    const users = [
        { username: 'admin', password: createMD5Hash('admin123'), role: 'admin' },
        { username: 'john_doe', password: createMD5Hash('password123'), role: 'user' },
        { username: 'jane_smith', password: createMD5Hash('mypassword'), role: 'user' },
        { username: 'bob_wilson', password: createMD5Hash('123456'), role: 'user' },
        { username: 'alice_brown', password: createMD5Hash('secret'), role: 'user' },
        { username: 'charlie_davis', password: createMD5Hash('qwerty'), role: 'user' },
        { username: 'diana_miller', password: createMD5Hash('letmein'), role: 'user' },
        { username: 'frank_jones', password: createMD5Hash('password'), role: 'user' },
        { username: 'grace_taylor', password: createMD5Hash('welcome'), role: 'user' },
        { username: 'henry_clark', password: createMD5Hash('admin'), role: 'user' }
    ];

    const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get();
    if (userCount.count === 0) {
        const insertUser = db.prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)");
        users.forEach(user => {
            insertUser.run(user.username, user.password, user.role);
        });
    }

    // Insert dummy books
    const books = [
        { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-0-7432-7356-5', year: 1925, description: 'A classic American novel about the Jazz Age' },
        { title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0-06-112008-4', year: 1960, description: 'A gripping tale of racial injustice and childhood innocence' },
        { title: '1984', author: 'George Orwell', isbn: '978-0-452-28423-4', year: 1949, description: 'A dystopian social science fiction novel' },
        { title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '978-0-14-143951-8', year: 1813, description: 'A romantic novel of manners' },
        { title: 'The Catcher in the Rye', author: 'J.D. Salinger', isbn: '978-0-316-76948-0', year: 1951, description: 'A controversial novel about teenage rebellion' },
        { title: 'Lord of the Flies', author: 'William Golding', isbn: '978-0-571-05686-2', year: 1954, description: 'A novel about British boys stranded on an island' },
        { title: 'The Hobbit', author: 'J.R.R. Tolkien', isbn: '978-0-547-92822-7', year: 1937, description: 'A fantasy adventure novel' },
        { title: 'Fahrenheit 451', author: 'Ray Bradbury', isbn: '978-1-4516-7331-9', year: 1953, description: 'A dystopian novel about book burning' },
        { title: 'Jane Eyre', author: 'Charlotte Brontë', isbn: '978-0-14-144114-6', year: 1847, description: 'A novel about an orphaned girl' },
        { title: 'The Adventures of Huckleberry Finn', author: 'Mark Twain', isbn: '978-0-486-28061-5', year: 1884, description: 'Adventures along the Mississippi River' },
        { title: 'Brave New World', author: 'Aldous Huxley', isbn: '978-0-06-085052-4', year: 1932, description: 'A dystopian novel about a technologically advanced society' },
        { title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', isbn: '978-0-544-00341-5', year: 1954, description: 'Epic fantasy trilogy' },
        { title: 'Animal Farm', author: 'George Orwell', isbn: '978-0-452-28424-1', year: 1945, description: 'An allegorical novella about farm animals' },
        { title: 'Of Mice and Men', author: 'John Steinbeck', isbn: '978-0-14-017739-8', year: 1937, description: 'A novella about displaced migrant ranch workers' },
        { title: 'The Scarlet Letter', author: 'Nathaniel Hawthorne', isbn: '978-0-14-243724-2', year: 1850, description: 'A novel about adultery in Puritan New England' },
        { title: 'Wuthering Heights', author: 'Emily Brontë', isbn: '978-0-14-143955-6', year: 1847, description: 'A novel about passionate love and revenge' },
        { title: 'The Picture of Dorian Gray', author: 'Oscar Wilde', isbn: '978-0-14-143957-0', year: 1890, description: 'A novel about a man who remains young while his portrait ages' },
        { title: 'Moby Dick', author: 'Herman Melville', isbn: '978-0-14-243724-3', year: 1851, description: 'The story of Captain Ahab and the white whale' },
        { title: 'War and Peace', author: 'Leo Tolstoy', isbn: '978-0-14-044793-4', year: 1869, description: 'Russian epic about the Napoleonic era' },
        { title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', isbn: '978-0-14-044913-6', year: 1866, description: 'A psychological novel about guilt and redemption' }
    ];

    const bookCount = db.prepare("SELECT COUNT(*) as count FROM books").get();
    if (bookCount.count === 0) {
        const insertBook = db.prepare("INSERT INTO books (title, author, isbn, year, description) VALUES (?, ?, ?, ?, ?)");
        books.forEach(book => {
            insertBook.run(book.title, book.author, book.isbn, book.year, book.description);
        });
    }
}

// Initialize database on startup
initializeDatabase();

// Routes
app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/books', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'books.html'));
});

// Login endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    // Hash the input password with MD5
    const hashedPassword = createMD5Hash(password);
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${hashedPassword}'`;
    console.log('Executing query:', query); // For debugging
    
    try {
        const row = db.prepare(query).get();
        
        if (row) {
            res.json({ 
                success: true, 
                user: { 
                    id: row.id, 
                    username: row.username, 
                    role: row.role 
                } 
            });
        } else {
            res.json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error: ' + err.message });
    }
});

// Search endpoint
app.get('/api/search', (req, res) => {
    const { q } = req.query;
    
    if (!q) {
        // Return all books if no search query
        try {
            const rows = db.prepare("SELECT * FROM books ORDER BY title").all();
            res.json(rows);
        } catch (err) {
            res.status(500).json({ error: 'Database error' });
        }
        return;
    }
    
    const query = `SELECT id, title, author, isbn, year, description FROM books WHERE title LIKE '%${q}%' OR author LIKE '%${q}%'`;
    console.log('Executing search query:', query); 
    
    try {
        const rows = db.prepare(query).all();
        res.json(rows);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error: ' + err.message });
    }
});

// Add book endpoint (admin only)
app.post('/api/books', (req, res) => {
    const { title, author, isbn, year, description, userId } = req.body;
    
    // Simple check - in real app would use proper session management
    if (userId !== 1) {
        res.status(403).json({ error: 'Admin access required' });
        return;
    }
    
    try {
        const result = db.prepare("INSERT INTO books (title, author, isbn, year, description) VALUES (?, ?, ?, ?, ?)")
            .run(title, author, isbn, year, description);
        res.json({ success: true, id: result.lastInsertRowid });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Delete book endpoint (admin only)
app.delete('/api/books/:id', (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    
    // Simple check - in real app would use proper session management
    if (userId !== 1) {
        res.status(403).json({ error: 'Admin access required' });
        return;
    }
    
    try {
        const result = db.prepare("DELETE FROM books WHERE id = ?").run(id);
        res.json({ success: true, deleted: result.changes });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.listen(PORT, () => {
    console.log(`Insecure library server running on http://localhost:${PORT}`);
});