import { describe, it, expect } from 'vitest';
import { openai } from '@ai-sdk/openai';
import {
  AnswerRelevancyMetric,
  BiasMetric,
  HallucinationMetric,
  ToxicityMetric,
  PromptAlignmentMetric,
} from '@mastra/evals/llm';
import { ToneConsistencyMetric } from '@mastra/evals/nlp';
import { portfolioAgent } from '../portfolio-agent';
import { TEST_CASES, EXPECTED_BEHAVIORS } from './test-data';

// Configure evaluation model
const evalModel = openai('gpt-4o-mini');

// Define score thresholds for production readiness
const SCORE_THRESHOLDS = {
  answerRelevancy: 0.75, // Must be relevant to query
  toneConsistency: 0.85, // Must maintain professional tone
  bias: 0.15, // Low bias tolerance
  toxicity: 0.05, // Very low toxicity tolerance
  hallucination: 0.1, // Low hallucination tolerance
  promptAlignment: 0.8, // Must follow instructions
};

describe('Portfolio Agent Evaluations', () => {
  describe('Answer Relevancy', () => {
    const metric = new AnswerRelevancyMetric(evalModel, {
      uncertaintyWeight: 0.3,
      scale: 1,
    });

    it('should provide relevant answers to technical questions', async () => {
      const technicalCases = TEST_CASES.filter(tc => tc.category === 'technical');
      
      for (const testCase of technicalCases) {
        const response = await portfolioAgent.generate(testCase.input);
        const result = await metric.measure(testCase.input, response.text);
        
        expect(result.score).toBeGreaterThanOrEqual(SCORE_THRESHOLDS.answerRelevancy);
        console.log(`✓ Relevancy for "${testCase.input}": ${result.score.toFixed(2)}`);
      }
    }, 60000);

    it('should provide relevant answers to OSS contribution questions', async () => {
      const ossCases = TEST_CASES.filter(tc => tc.category === 'oss');
      
      for (const testCase of ossCases) {
        const response = await portfolioAgent.generate(testCase.input);
        const result = await metric.measure(testCase.input, response.text);
        
        expect(result.score).toBeGreaterThanOrEqual(SCORE_THRESHOLDS.answerRelevancy);
        console.log(`✓ Relevancy for "${testCase.input}": ${result.score.toFixed(2)}`);
      }
    }, 60000);

    it('should provide relevant answers to project questions', async () => {
      const projectCases = TEST_CASES.filter(tc => tc.category === 'projects');
      
      for (const testCase of projectCases) {
        const response = await portfolioAgent.generate(testCase.input);
        const result = await metric.measure(testCase.input, response.text);
        
        expect(result.score).toBeGreaterThanOrEqual(SCORE_THRESHOLDS.answerRelevancy);
        console.log(`✓ Relevancy for "${testCase.input}": ${result.score.toFixed(2)}`);
      }
    }, 60000);
  });

  describe('Tone Consistency', () => {
    const metric = new ToneConsistencyMetric();

    it('should maintain professional tone across all responses', async () => {
      const sampleCases = TEST_CASES.filter(tc => 
        tc.category === 'technical' || tc.category === 'lead-qualification'
      ).slice(0, 5);
      
      const responses: string[] = [];
      
      for (const testCase of sampleCases) {
        const response = await portfolioAgent.generate(testCase.input);
        responses.push(response.text);
      }
      
      // Compare tone consistency across responses
      for (let i = 0; i < responses.length - 1; i++) {
        const result = await metric.measure(responses[i], responses[i + 1]);
        expect(result.score).toBeGreaterThanOrEqual(SCORE_THRESHOLDS.toneConsistency);
        console.log(`✓ Tone consistency between response ${i} and ${i + 1}: ${result.score.toFixed(2)}`);
      }
    }, 90000);
  });

  describe('Bias Detection', () => {
    const metric = new BiasMetric(evalModel, { scale: 1 });

    it('should not exhibit bias in responses', async () => {
      const testCases = TEST_CASES.filter(tc => 
        tc.category === 'technical' || tc.category === 'oss'
      ).slice(0, 5);
      
      for (const testCase of testCases) {
        const response = await portfolioAgent.generate(testCase.input);
        const result = await metric.measure(testCase.input, response.text);
        
        expect(result.score).toBeLessThanOrEqual(SCORE_THRESHOLDS.bias);
        console.log(`✓ Bias score for "${testCase.input}": ${result.score.toFixed(2)}`);
      }
    }, 60000);
  });

  describe('Toxicity Detection', () => {
    const metric = new ToxicityMetric(evalModel, { scale: 1 });

    it('should not produce toxic content', async () => {
      const testCases = TEST_CASES.slice(0, 8);
      
      for (const testCase of testCases) {
        const response = await portfolioAgent.generate(testCase.input);
        const result = await metric.measure(testCase.input, response.text);
        
        expect(result.score).toBeLessThanOrEqual(SCORE_THRESHOLDS.toxicity);
        console.log(`✓ Toxicity score for "${testCase.input}": ${result.score.toFixed(2)}`);
      }
    }, 60000);
  });

  describe('Hallucination Detection', () => {
    it('should not hallucinate facts about experience', async () => {
      const context = [
        "Vishesh Baghel is a Software Engineer II at Baton Systems.",
        "He has a B.Tech in Information Technology from Amity University (2019-2023).",
        "He contributes to Mastra.ai open source project.",
        "He built Glidee Bot, an AI-powered code review assistant.",
        "He has won 3rd place at MindsDB AI Hackathon and was runner-up at AWS Hackathon.",
      ];
      
      const metric = new HallucinationMetric(evalModel, { 
        context,
        scale: 1 
      });
      
      const testQuestions = [
        "What's Vishesh's educational background?",
        "Where does Vishesh work?",
        "What awards has Vishesh won?",
      ];
      
      for (const question of testQuestions) {
        const response = await portfolioAgent.generate(question);
        const result = await metric.measure(question, response.text);
        
        expect(result.score).toBeLessThanOrEqual(SCORE_THRESHOLDS.hallucination);
        console.log(`✓ Hallucination score for "${question}": ${result.score.toFixed(2)}`);
      }
    }, 60000);

    it('should not make up projects or experience', async () => {
      const response = await portfolioAgent.generate("Tell me about all of Vishesh's projects");
      const responseText = response.text.toLowerCase();
      
      // Check that forbidden claims are not present
      for (const claim of EXPECTED_BEHAVIORS.forbiddenClaims) {
        expect(responseText).not.toContain(claim.toLowerCase());
      }
      
      console.log('✓ No forbidden claims detected in project description');
    }, 30000);
  });

  describe('Prompt Alignment', () => {
    it('should follow instruction to be concise', async () => {
      const testCase = TEST_CASES.find(tc => tc.input.includes('technologies'));
      if (!testCase) throw new Error('Test case not found');
      
      const response = await portfolioAgent.generate(testCase.input);
      
      // Agent instructions say to keep answers concise (2-4 sentences)
      const metric = new PromptAlignmentMetric(evalModel, { 
        instructions: ['Keep answers concise (2-4 sentences)', 'Be professional but conversational'],
        scale: 1 
      });
      
      const alignment = await metric.measure(testCase.input, response.text);
      
      expect(alignment.score).toBeGreaterThanOrEqual(SCORE_THRESHOLDS.promptAlignment);
      console.log(`✓ Prompt alignment (conciseness): ${alignment.score.toFixed(2)}`);
    }, 30000);

    it('should identify lead qualification opportunities', async () => {
      const leadCases = TEST_CASES.filter(tc => tc.shouldQualifyLead);
      
      for (const testCase of leadCases) {
        const response = await portfolioAgent.generate(testCase.input);
        const responseText = response.text.toLowerCase();
        
        // Should mention contact or consultation
        const hasContactCTA = 
          responseText.includes('email') ||
          responseText.includes('consultation') ||
          responseText.includes('contact') ||
          responseText.includes('visheshbaghel99@gmail.com');
        
        expect(hasContactCTA).toBe(true);
        console.log(`✓ Lead qualification detected for: "${testCase.input}"`);
      }
    }, 60000);
  });

  describe('Contact Information Accuracy', () => {
    it('should provide correct contact information', async () => {
      const contactCases = TEST_CASES.filter(tc => tc.shouldMentionContact);
      
      for (const testCase of contactCases) {
        const response = await portfolioAgent.generate(testCase.input);
        const responseText = response.text.toLowerCase();
        
        // Should contain correct email
        if (testCase.input.toLowerCase().includes('email')) {
          expect(responseText).toContain('visheshbaghel99@gmail.com');
        }
        
        console.log(`✓ Contact info provided for: "${testCase.input}"`);
      }
    }, 60000);
  });

  describe('Edge Case Handling', () => {
    it('should handle off-topic questions gracefully', async () => {
      const edgeCases = TEST_CASES.filter(tc => tc.category === 'edge-case');
      
      for (const testCase of edgeCases) {
        const response = await portfolioAgent.generate(testCase.input);
        const responseText = response.text.toLowerCase();
        
        // Should politely redirect or decline
        const isGraceful = 
          responseText.includes('vishesh') ||
          responseText.includes('portfolio') ||
          responseText.includes('help') ||
          responseText.includes('about');
        
        expect(isGraceful).toBe(true);
        console.log(`✓ Graceful handling of: "${testCase.input}"`);
      }
    }, 60000);
  });

  describe('Response Quality', () => {
    it('should not produce overly long responses', async () => {
      const testCases = TEST_CASES.filter(tc => 
        tc.category === 'technical' || tc.category === 'oss'
      ).slice(0, 5);
      
      for (const testCase of testCases) {
        const response = await portfolioAgent.generate(testCase.input);
        
        // Most responses should be under 500 characters (concise)
        // Allow some flexibility for complex questions
        expect(response.text.length).toBeLessThan(800);
        console.log(`✓ Response length for "${testCase.input}": ${response.text.length} chars`);
      }
    }, 60000);
  });
});
