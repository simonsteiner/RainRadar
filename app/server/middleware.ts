import express from 'express';
import path from 'path';
import { MIME_TYPES } from './config';

export const staticFiles = express.static(path.join(__dirname, "..", "public"), {
  setHeaders: (res, filepath) => {
    console.debug(`Serving static file: ${filepath}`);
    const ext = path.extname(filepath);
    const mimeType = MIME_TYPES[ext];
    if (mimeType) {
      res.setHeader("Content-Type", mimeType);
    }
  },
});

export const requestLogger = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log(`Incoming ${req.method} request to: ${req.originalUrl}`);
  next();
};

export const corsHeaders = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
};