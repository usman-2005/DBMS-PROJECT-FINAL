const express = require('express');

const cors = require('cors');

const pool = require('./db')

require('dotenv').config();


const app = express();

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    try {
        res.json('WELCOME TO CINEMA MANAGEMENT SYSTEM');
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});



app.get('/staff', async (req, res) => {
    try {
        const result = await pool.query('select * from staff');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});
app.post('/staffs', async (req, res) => {
    const { cinema_id, full_name, role, phone, email, hire_date } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO staff (cinema_id, full_name, role, phone, email, hire_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [cinema_id, full_name, role, phone, email, hire_date]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/user', async (req, res) => {
    try {
        const result = await pool.query('select * from users');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});

app.post('/users', async (req, res) => {
    const { full_name, email, phone } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO users (full_name, email, phone) VALUES ($1, $2, $3) RETURNING *',
            [full_name, email, phone]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/show', async (req, res) => {
    try {
        const result = await pool.query('select * from shows');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});

app.post('/shows', async (req, res) => {
    const { movie_id, screen_id, show_date, start_time, end_time, price } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO shows (movie_id, screen_id, show_date, start_time, end_time, price) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [movie_id, screen_id, show_date, start_time, end_time, price]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/seat', async (req, res) => {
    try {
        const result = await pool.query('select * from seats');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});
app.post('/seats', async (req, res) => {
    const { screen_id, seat_number, seat_type, is_available } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO seats (screen_id, seat_number, seat_type, is_available) VALUES ($1, $2, $3, $4) RETURNING *',
            [screen_id, seat_number, seat_type, is_available]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/screen', async (req, res) => {
    try {
        const result = await pool.query('select * from screens');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});
app.post('/screens', async (req, res) => {
    const { cinema_id, screen_number, total_seats, type } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO screens (cinema_id, screen_number, total_seats, type) VALUES ($1, $2, $3, $4) RETURNING *',
            [cinema_id, screen_number, total_seats, type]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/payment', async (req, res) => {
    try {
        const result = await pool.query('select * from payments');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});

app.post('/payments', async (req, res) => {
    const { booking_id, amount, payment_method, status } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO payments (booking_id, amount, payment_method, status) VALUES ($1, $2, $3, $4) RETURNING *',
            [booking_id, amount, payment_method, status]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/movie', async (req, res) => {
    try {
        const result = await pool.query('select * from movies');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});
app.post('/movies', async (req, res) => {
    const { title, genre, duration, language, release_date, certificate } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO movies (title, genre, duration, language, release_date, certificate) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [title, genre, duration, language, release_date, certificate]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/feedback', async (req, res) => {
    try {
        const result = await pool.query('select * from feedback');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});
app.post('/feedbacks', async (req, res) => {
    const { user_id, movie_id, rating, comment } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO feedback (user_id, movie_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
            [user_id, movie_id, rating, comment]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/cinema', async (req, res) => {
    try {
        const result = await pool.query('select * from cinemas');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});
app.post('/cinemas', async (req, res) => {
    const { name, location, total_screens } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO cinemas (name, location, total_screens) VALUES ($1, $2, $3) RETURNING *',
            [name, location, total_screens]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/booking', async (req, res) => {
    try {
        const result = await pool.query('select * from bookings');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});

app.post('/bookings', async (req, res) => {
    const { user_id, show_id, total_amount, status } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO bookings (user_id, show_id, total_amount, status) VALUES ($1, $2, $3, $4) RETURNING *',
            [user_id, show_id, total_amount, status]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});





app.get('/method', async (req, res) => {
    console.log("Hitting /method route...");
    try {
        const result = await pool.query(`
            SELECT payment_method, COUNT(*) as count
            FROM payments
            GROUP BY payment_method
        `);
        res.json(result.rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: err.message });
    }
});










const PORT = process.env.PORT || 4040;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
