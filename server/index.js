import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import yup from "yup";
import { nanoid } from "nanoid";

const app = express();

app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.static('./public'));

app.get('/url/:id', (req, res) => {
    // TODO: get a short url by id
});

app.get('/:id', (req, res) => {
    // TODO: Redirect to URL
});

const schema = yup.object().shape({
    slug: yup.string().trim().matches(/[\w\-]/i),
    url: yup.string().trim().url().required(),
    
});

app.post('/url', async (req, res, next) => {
    let { slug, url } = req.body;
    try {
        await schema.validate({
            slug,
            url
        });
        if (!slug) {
            slug = nanoid(5);
        }
        slug = slug.toLowerCase();
        res.json({
            slug,
            url
        });
    } catch (error) {
        next(error);
    }
});

app.use((error, req, res, next) => {
    if (error.status) {
        res.status = error.status;
    } else {
        res.status(500);
    }
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack
    });
});

const port = process.env.port || 7766;

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});