// src/app.js
import express from 'express';

const app = express();
app.use(express.json());

app.post('/add', (req, res) => {
    const { a, b } = req.body;
    if (a == null || b == null) {
        return res.status(400).send('Invalid input');
    }
    const sum = a + b;
    res.json({ result: sum });
});

export default app;