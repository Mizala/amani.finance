// src/services/gpt4Service.ts
import { Queue, Worker } from 'bullmq';
// import { ExpressAdapter } from '@bull-board/express' ;
// import {BullAdapter} from '@bull-board/api/bullAdapter';
import ExpenseService from '../domain/expense/services/ExpenseService';
import IORedis from 'ioredis';
const connection = new IORedis({
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
  host: process.env.REDIS_HOST || 'localhost',
});

// Create an analysis queue
export const analysisQueue = new Queue('analysis', {connection});

// Process jobs in the queue
export const analysisWorker = new Worker('analysis', async job => {
  console.log(`Processing job ${job.id} with data:`, job.data);
  try {
    const { filePath, email } = job.data;
    // Perform the expensive tasks here
    await ExpenseService.analyzeBankStatement(filePath, email);
    
  } catch (err) {
    console.error(err);
  }
});

analysisWorker.on('completed', (job) => {
  console.log(`Job completed with ID ${job.id}`);
});

analysisWorker.on('failed', (job: any, err) => {
  console.log(`Job failed with ID ${job.id} with error ${err.message}`);
});

export default analysisQueue;