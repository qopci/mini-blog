// Require express framework
const express = require('express');
const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: '0000',
    database: 'blog'
});

async function connect() {
    try {
        let conn = await pool.getConnection();
        console.log('Connected to the database');
        return conn;
    } catch (err) {
        console.log('Error connecting to the database: ' + err);
    } 
}

const PORT = 3000; // Define port

// Instantiate express
const app = express();

app.use(express.urlencoded({ extended: false }));

// CSS 
app.use(express.static('public'));

app.set('view engine', 'ejs');

// Define a default route
app.get('/', (req, res) => {
    res.render('home', { data: {}, errors: [] });
});

// Submit GET route
app.get('/submit', (req, res) => {
    res.send('You need to post your information in the form!'); 
});

// Submit route
app.post('/submit', async (req, res) => {
    const data = req.body;

    let isValid = true;
    let errors = [];

    // Title validation
    if (data.title.trim() === '' || data.title.length > 5) {
        isValid = false;
        errors.push('Title is required, and has to be more than 5 characters long');
    }
    // Content validation
    if (data.content.trim() === '') {
        isValid = false;
        errors.push('Content is required');
    }
    // Author validation
    if (data.author.trim() === '') {
        data.author = "NULL";  
    }

    // Validation
    if (!isValid) {
        res.render('home', { data: data, errors: errors});
        return;
    }

    const conn = await connect();
    conn.query(`
        INSERT INTO posts (author, title, content)
        VALUES ('${data.author}', '${data.title}', '${data.content}');
    `); 
    res.render('confirmation', { data: data });
});

// Entries route
app.get('/entries', async (req, res) => {
    const conn = await connect();
    const rows = await conn.query('SELECT * FROM posts ORDER BY created_at DESC;');

    res.render('entries', { data: rows });  
});

// Start the app
app.listen(PORT, () =>{
    console.log(`Server running on port http://localhost:${PORT}`);
});