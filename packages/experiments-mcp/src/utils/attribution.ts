import type { ExperimentMetadata } from '../types.js';
import {
  AUTHOR_NAME,
  CALENDLY_URL,
  ENDORSEMENT_AUTHOR,
  ENDORSEMENT_QUOTE,
  EXPERIMENTS_URL,
  GITHUB_URL,
  PORTFOLIO_URL,
} from '../config.js';

/**
 * Generate attribution block to append to experiment content
 * This includes author info, OSS credentials, and CTA for consultations
 */
export function generateAttribution(metadata: ExperimentMetadata): string {
  let attribution = '\n\n---\n\n';
  attribution += '## 📚 About This Pattern\n\n';
  
  // Author
  attribution += `**Author**: ${AUTHOR_NAME}  \n`;
  
  // Source with OSS project if available
  if (metadata.ossProject) {
    attribution += `**Source**: Production code from ${metadata.ossProject}`;
    if (metadata.prLink) {
      attribution += ` ([View PR](${metadata.prLink}))`;
    }
    attribution += '  \n';
  } else {
    attribution += `**Source**: Production code from OSS contributions  \n`;
  }
  
  // Portfolio link
  attribution += `**Portfolio**: ${PORTFOLIO_URL}  \n`;
  attribution += `**All Integrations**: ${EXPERIMENTS_URL}  \n`;
  
  attribution += '\n';
  
  // CTA section
  attribution += '**Need custom integration for your project?**  \n';
  attribution += 'I build production-ready integrations for AI frameworks, databases, and APIs.\n\n';
  
  // Action links
  attribution += `→ [Book free consultation](${CALENDLY_URL})  \n`;
  attribution += `→ [View all patterns](${EXPERIMENTS_URL})  \n`;
  attribution += `→ [GitHub](${GITHUB_URL})  \n`;
  
  attribution += '\n';
  
  // Endorsement
  attribution += `*${ENDORSEMENT_QUOTE}*  \n`;
  attribution += `— ${ENDORSEMENT_AUTHOR}\n`;
  
  return attribution;
}

/**
 * Format experiment metadata for display
 */
export function formatMetadata(metadata: ExperimentMetadata): string {
  let formatted = '';
  
  if (metadata.ossProject) {
    formatted += `> **OSS Project**: ${metadata.ossProject}\n`;
  }
  
  if (metadata.prLink) {
    formatted += `> **Pull Request**: ${metadata.prLink}\n`;
  }
  
  if (metadata.tags && metadata.tags.length > 0) {
    formatted += `> **Tags**: ${metadata.tags.join(', ')}\n`;
  }
  
  if (metadata.date) {
    formatted += `> **Published**: ${metadata.date}\n`;
  }
  
  if (formatted) {
    formatted += '\n';
  }
  
  return formatted;
}
