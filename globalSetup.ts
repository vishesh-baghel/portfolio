import { globalSetup } from '@mastra/evals';

export default function setup() {
  console.log('Setting up Mastra evals global configuration...');
  globalSetup();
  console.log('Global setup complete');
}
