import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/api/test', (_req, res) => {
    res.send('Hello from API');
});

export default app;
