#!/usr/bin/env node
import { runServer } from './server.js';

runServer().catch(error => {
  const errorMessage = 'Fatal error running server';
  console.error(errorMessage, error);
  process.exit(1);
});
