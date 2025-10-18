import fs from 'fs/promises';
import path from 'path';
import { fromRepoRoot, fromPackageRoot } from '../utils/path-helpers';

const EXPERIMENTS_SOURCE = fromRepoRoot('content/experiments');
const EXPERIMENTS_DEST = fromPackageRoot('.experiments');

async function copyDir(src: string, dest: string) {
  await fs.mkdir(dest, { recursive: true });

  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
      await fs.copyFile(srcPath, destPath);
      console.log(`✓ Copied ${entry.name}`);
    }
  }
}

export async function copyExperiments() {
  try {
    console.log('📦 Copying experiment files...');
    console.log(`   From: ${EXPERIMENTS_SOURCE}`);
    console.log(`   To: ${EXPERIMENTS_DEST}`);
    
    try {
      await fs.rm(EXPERIMENTS_DEST, { recursive: true });
    } catch {
    }

    await copyDir(EXPERIMENTS_SOURCE, EXPERIMENTS_DEST);
    console.log('Experiment files copied successfully');
  } catch (error) {
    console.error('Failed to copy experiment files:', error);
    process.exit(1);
  }
}

if (process.env.PREPARE === 'true') {
  try {
    await copyExperiments();
  } catch (error) {
    console.error('Error preparing experiments:', error);
    process.exit(1);
  }
}
