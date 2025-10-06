# Eval Score Interpretation & Improvement Guide

## Quick Reference

### Score Ranges

| Score | Rating | Action |
|-------|--------|--------|
| 0.90 - 1.00 | Excellent | Maintain quality |
| 0.75 - 0.89 | Good | Minor tweaks |
| 0.60 - 0.74 | Needs Work | Review instructions |
| < 0.60 | Poor | Major revision needed |

*Note: For Bias/Toxicity/Hallucination, lower is better (invert the scale)*

## Metric-by-Metric Guide

### 1. Answer Relevancy (Target: >= 0.75)

**What it measures**: How well the response addresses the user's query

**Low scores mean**:
- Responses are off-topic
- Missing key information user asked for
- Too generic or vague

**How to improve**:
```typescript
// ❌ Bad: Too vague
"Vishesh has experience with various technologies"

// ✅ Good: Specific and relevant
"Vishesh works with TypeScript, React, Next.js, AWS, and Java. 
He specializes in cloud-native microservices and AI integrations."
```

**Instruction improvements**:
- Add more specific examples of work
- Include context about when/where skills were used
- Emphasize matching response to query intent

---

### 2. Tone Consistency (Target: >= 0.85)

**What it measures**: Whether responses maintain consistent formality and style

**Low scores mean**:
- Switching between formal and casual
- Inconsistent terminology
- Varying levels of detail

**How to improve**:
```typescript
// ❌ Bad: Inconsistent tone
Response 1: "Vishesh is a software engineer who codes stuff"
Response 2: "Mr. Baghel possesses extensive expertise in distributed systems architecture"

// ✅ Good: Consistent professional-casual tone
Response 1: "Vishesh is a Software Engineer II specializing in cloud-native systems"
Response 2: "Vishesh has expertise in distributed systems and microservices architecture"
```

**Instruction improvements**:
- Define clear tone guidelines
- Use consistent terminology
- Maintain same level of formality

---

### 3. Bias Detection (Target: <= 0.15)

**What it measures**: Presence of gender, political, racial, or geographical bias

**High scores mean**:
- Stereotypical language
- Discriminatory assumptions
- Unbalanced perspectives

**How to improve**:
```typescript
// ❌ Bad: Biased language
"As a male engineer, Vishesh excels at technical problem-solving"

// ✅ Good: Neutral language
"Vishesh excels at technical problem-solving and system architecture"
```

**Instruction improvements**:
- Remove gendered language
- Avoid stereotypes
- Focus on skills and achievements
- Use inclusive terminology

---

### 4. Toxicity Detection (Target: <= 0.05)

**What it measures**: Harmful, offensive, or inappropriate content

**High scores mean**:
- Aggressive language
- Insults or put-downs
- Inappropriate content

**How to improve**:
```typescript
// ❌ Bad: Aggressive
"Vishesh is way better than other developers who don't know what they're doing"

// ✅ Good: Professional
"Vishesh brings strong expertise in modern development practices"
```

**Instruction improvements**:
- Emphasize professional tone
- Avoid comparisons that put others down
- Focus on positive attributes

---

### 5. Hallucination Detection (Target: <= 0.10)

**What it measures**: Factual accuracy vs. provided context

**High scores mean**:
- Making up experience
- Inventing projects
- Incorrect facts

**How to improve**:
```typescript
// ❌ Bad: Hallucinated
"Vishesh has 10 years of experience and worked at Google"

// ✅ Good: Factual
"Vishesh is a Software Engineer II at Baton Systems since Feb 2023"
```

**Instruction improvements**:
- Add explicit "ONLY mention" rules
- List all valid facts clearly
- Include "forbidden claims" list
- Add "I don't have that information" fallback

**Critical guardrails**:
```typescript
NEVER claim:
- Experience at companies not listed
- Degrees or certifications not earned
- Projects not actually built
- Skills not actually possessed
```

---

### 6. Prompt Alignment (Target: >= 0.80)

**What it measures**: Following specific instructions (length, format, style)

**Low scores mean**:
- Ignoring length constraints
- Wrong format
- Not following guidelines

**How to improve**:
```typescript
// Instruction: "Keep responses to 2-4 sentences"

// ❌ Bad: Too long
"Vishesh Baghel is a Software Engineer II at Baton Systems where he has been 
working since February 2023. In this role, he maintains and optimizes 18 
cloud-native microservices using various AWS services including RDS, Aurora, 
Lambda, S3, and SQS. He has successfully reduced system downtime by 30% through 
performance profiling and caching enhancements. Additionally, he spearheaded a 
complete architectural redesign..."

// ✅ Good: Concise
"Vishesh is a Software Engineer II at Baton Systems, specializing in cloud-native 
microservices with AWS. He's reduced system downtime by 30% and improved response 
times by 50% through architectural improvements."
```

**Instruction improvements**:
- Be explicit about constraints
- Provide examples of good responses
- Add format templates

---

## Common Patterns & Fixes

### Pattern: Low Relevancy + High Hallucination
**Problem**: Agent making up information to answer questions
**Fix**: 
```typescript
// Add to instructions:
"If you don't have information to answer a question, say:
'I don't have that specific information. For details, please contact 
Vishesh at visheshbaghel99@gmail.com'"
```

### Pattern: Low Tone Consistency
**Problem**: Switching between styles
**Fix**:
```typescript
// Add to instructions:
"Maintain a professional yet approachable tone. Think: LinkedIn post, 
not resume. Conversational, not casual. Informative, not salesy."
```

### Pattern: High Bias Scores
**Problem**: Unintentional stereotyping
**Fix**:
```typescript
// Add to instructions:
"Focus solely on skills, experience, and achievements. Avoid any 
references to personal characteristics, demographics, or assumptions."
```

### Pattern: Low Prompt Alignment
**Problem**: Not following length/format rules
**Fix**:
```typescript
// Add to instructions:
"Response format:
- 2-4 sentences for most queries
- Use bullet points for lists
- Include contact CTA for lead qualification
- Link to experiments when relevant"
```

---

## Iterative Improvement Process

### Step 1: Establish Baseline
```bash
pnpm test:eval
```
Note all scores and identify lowest performers.

### Step 2: Prioritize Fixes
Focus on:
1. Scores below threshold (blocking issues)
2. Hallucination (accuracy is critical)
3. Relevancy (user experience)
4. Everything else

### Step 3: Make Targeted Changes
Change ONE thing at a time:
- Add specific examples
- Clarify instructions
- Add guardrails
- Adjust tone guidelines

### Step 4: Re-test
```bash
pnpm test:eval
```
Compare scores to baseline.

### Step 5: Document
Keep notes on what worked:
```
Change: Added "ONLY mention listed projects" rule
Result: Hallucination score: 0.15 → 0.05
```

### Step 6: Repeat
Continue until all scores meet thresholds.

---

## Example Improvement Session

### Initial Scores
```
Answer Relevancy: 0.68 [FAIL] (target: 0.75)
Tone Consistency: 0.82 [WARN] (target: 0.85)
Hallucination: 0.22 [FAIL] (target: 0.10)
```

### Changes Made

**1. Improve Relevancy**
```diff
- "You are Vishesh's AI assistant"
+ "You are Vishesh's AI portfolio assistant. When answering questions,
+  directly address what was asked using specific examples from his experience."
```

**2. Reduce Hallucination**
```diff
+ "CRITICAL: ONLY mention projects, experience, and skills explicitly 
+  listed in these instructions. NEVER invent or exaggerate achievements."
+ 
+ "Forbidden claims: PhD, Stanford, Google, Meta, 10 years experience"
```

**3. Improve Tone**
```diff
+ "Tone: Professional yet approachable. Think LinkedIn, not resume."
```

### After Changes
```
Answer Relevancy: 0.82 [PASS]
Tone Consistency: 0.88 [PASS]
Hallucination: 0.06 [PASS]
```

---

## Red Flags

### Immediate Action Required

**Hallucination > 0.20**
- Agent is making up significant information
- STOP and review all factual claims
- Add explicit "ONLY mention" rules

**Toxicity > 0.10**
- Inappropriate content detected
- Review tone guidelines
- Add professional standards section

**Bias > 0.30**
- Significant bias present
- Remove stereotypical language
- Focus on skills only

**Relevancy < 0.50**
- Agent not understanding queries
- Add more examples
- Clarify instruction structure

---

## Success Checklist

Before deploying to production:

- [ ] All scores meet thresholds for 3 consecutive runs
- [ ] No hallucinated information in any test
- [ ] Tone consistent across all response types
- [ ] Edge cases handled gracefully
- [ ] Lead qualification working correctly
- [ ] Contact information always accurate
- [ ] Guardrails preventing inappropriate responses
- [ ] Response length appropriate
- [ ] Professional tone maintained
- [ ] No bias detected

---

## Quick Fixes Cheat Sheet

| Problem | Quick Fix |
|---------|-----------|
| Low Relevancy | Add "directly address the question" instruction |
| High Hallucination | Add "ONLY mention listed items" rule |
| Low Tone | Define specific tone: "professional yet approachable" |
| High Bias | Remove demographic references, focus on skills |
| Low Alignment | Add explicit format/length constraints |
| High Toxicity | Add "maintain respectful tone" guideline |

---

**Remember**: Eval scores are guides, not absolutes. The goal is consistent, high-quality responses that serve users well and represent you accurately.
