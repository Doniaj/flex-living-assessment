import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import reviewsRouter from './routes/reviews.js';
import propertiesRouter from './routes/properties.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: [
        'https://flex-living-assessment-two.vercel.app',
        'http://localhost:5174',
        'http://localhost:3000'
    ],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`, {
            query: req.query,
            body: req.body,
            timestamp: new Date().toISOString()
        });
        next();
    });
}

app.use('/api/reviews', reviewsRouter);
app.get('/favicon.ico', (req, res) => res.status(204).end());
app.use('/api/properties', propertiesRouter);

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'FlexLiving Reviews API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

app.get('/', (req, res) => {
    res.json({
        message: 'FlexLiving Reviews API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            reviews: '/api/reviews/hostaway',
            properties: '/api/properties'
        }
    });
});

app.use(notFoundHandler);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 FlexLiving Reviews API Server                        ║
║                                                           ║
║   Status:      Running                                    ║
║   Port:        ${PORT}                                    ║
║   Environment: ${process.env.NODE_ENV || 'development'}   ║
║                                                           ║
║   📊 API Endpoints:                                       ║
║   • http://localhost:${PORT}/health                       ║
║   • http://localhost:${PORT}/api/reviews/hostaway         ║
║   • http://localhost:${PORT}/api/properties               ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});