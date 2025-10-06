import { beforeAll } from 'vitest';
import { attachListeners } from '@mastra/evals';
import { mastra } from './src/mastra';

beforeAll(async () => {
  console.log('Attaching Mastra eval listeners...');
  
  // Attach listeners to capture eval results
  // This will store results in Mastra storage if configured
  await attachListeners(mastra);
  
  console.log('Test setup complete');
});
