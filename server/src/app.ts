import 'dotenv/config';
import config from 'config';
import express, { NextFunction, Request, Response } from 'express';
// import express from 'express';
import cors from 'cors';
// import { exit } from 'process';
import { Router as CvRouter } from './routes/cv.routes';
import { AppDataSource } from './utils/data-source';
import { validateEnv } from './utils/validate-env';
import { logger, successHandler, errorHandler } from './utils/logger';


AppDataSource.initialize()
  .then(() => {
    logger.log('INFO', 'Database initialized');
    /** Validate environment variables */
    validateEnv();
    /** Start express */
    const app = express();
    /** MIDDLEWARE */
    /** 1. Body parser */
    app.use(express.json({ limit: '100kb' }));
    app.use(express.urlencoded({ extended: true }));
    /** 2. Logger */
    app.use(successHandler);
    app.use(errorHandler);
    /** 3. Cookie parser */
    // app.use(cookieParser());
    /** 4. CORS */
    app.use(
      cors({
        origin: config.get<string>('origin'),
        credentials: true
      })
    );
    /** ROUTES */
    app.use('/api/v1/cv/', CvRouter);
    /** 5. file uploads for images */
    app.use('/uploads', express.static('uploads'));
    /** 6. Main GET request */
    app.get('/api/v1/', (req, res) => {
      res.json({
        message: `Welcome to the CV-Builder backend!`
      });
    });
    /** START THE SERVER */
    const port = config.get<number>('port');
    app.listen(port);
    logger.log('INFO',`Server started on port ${port}`);
  });

