import Redis from "ioredis"; 
import express from "express";
import { Router } from "express";

export const redisRouter = Router();

const redis = new Redis();


const checkCache = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const cachedData = await redis.get('KEY');
  
    if (cachedData) {
      res.send(JSON.parse(cachedData));
    } else {
      next(); // Continue to the route handler if data is not in the cache
    }
  };
  
// Use the checkCache middleware before the route handler
redisRouter.get('/cache', checkCache, async (req, res) => {
const dataToCache = { message: 'VALUE' };
await redis.set('KEY', JSON.stringify(dataToCache), 'EX', 3600); // Cache for 1 hour
res.send(dataToCache);
});