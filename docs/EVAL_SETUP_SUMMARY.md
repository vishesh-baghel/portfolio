# Portfolio Agent Eval Setup - Summary

## ✅ What Was Created

### 1. Test Infrastructure
- **`vitest.config.ts`**: Vitest configuration with 90s timeout for LLM calls
- **`globalSetup.ts`**: Mastra evals global setup
- **`testSetup.ts`**: Test listeners for capturing eval results
- **`.github/workflows/agent-evals.yml`**: CI/CD workflow for automated testing

### 2. Test Files
- **`src/mastra/agents/__tests__/test-data.ts`**: 
  - 25+ test cases across 6 categories
  - Expected behaviors and forbidden claims
  - Contact information validation data

- **`src/mastra/agents/__tests__/portfolio-agent.eval.test.ts`**:
  - 9 test suites with 15+ individual tests
  - Comprehensive metric coverage
  - Production-ready score thresholds

- **`src/mastra/agents/__tests__/README.md`**:
  - Complete documentation
  - Usage instructions
  - Troubleshooting guide

### 3. Agent Enhancements
- **Added Guardrails** to `portfolio-agent.ts`:
  - Factual accuracy rules
  - Scope boundaries
  - Contact & commitment guidelines
  - Professional standards
  - Security measures

### 4. Package Updates
- Added `@mastra/evals@0.13.10`
- Added `vitest@3.2.4`
- Added `@vitest/ui@3.2.4`
- Added test scripts to `package.json`

## 📊 Eval Metrics Implemented

| Metric | Purpose | Threshold |
|--------|---------|-----------|
| **Answer Relevancy** | Ensures responses address queries | >= 0.75 |
| **Tone Consistency** | Maintains professional tone | >= 0.85 |
| **Bias Detection** | Identifies potential biases | <= 0.15 |
| **Toxicity Detection** | Prevents harmful content | <= 0.05 |
| **Hallucination Detection** | Verifies factual accuracy | <= 0.10 |
| **Prompt Alignment** | Follows instructions | >= 0.80 |
| **Contact Info Accuracy** | Validates correct contact details | 100% |
| **Edge Case Handling** | Graceful off-topic handling | Pass/Fail |
| **Response Quality** | Ensures concise responses | < 800 chars |

## 🎯 Test Coverage

### Categories Tested (25+ test cases)
1. **Technical Skills** (5 cases)
   - Technologies, databases, AWS, microservices, AI/ML

2. **Open Source Contributions** (2 cases)
   - Mastra.ai work, LanceDB/MilvusDB integrations

3. **Projects** (2 cases)
   - Glidee Bot and other projects

4. **Lead Qualification** (4 cases)
   - Integration help, developer search, migration needs

5. **Contact Information** (3 cases)
   - Email, website, portfolio links

6. **Edge Cases** (4 cases)
   - Weather, jokes, off-topic questions

## 🛡️ Guardrails Added

### 1. Factual Accuracy
- Only mention listed projects/experience
- Never invent achievements
- Honest about unknown information
- No claims about unlisted companies

### 2. Scope Boundaries
- Stay focused on professional background
- Redirect off-topic questions
- Don't engage with inappropriate requests

### 3. Contact & Commitments
- Only provide listed contact info
- Never make commitments (pricing, timelines)
- Suggest direct email for specifics

### 4. Professional Standards
- Maintain respectful tone
- Avoid bias and controversy
- Keep responses concise (2-4 sentences)

### 5. Security
- Never ask for personal information
- Don't discuss internal systems
- Treat all interactions as public

## 🚀 How to Run

### Local Testing
```bash
# Run all eval tests
pnpm test:eval

# Watch mode for development
pnpm test:watch

# Visual UI for debugging
pnpm test:ui
```

### CI/CD
Tests run automatically on:
- Pull requests to `main`/`develop`
- Pushes to `main`
- Manual workflow dispatch

## 📋 Next Steps

### Before First Run
1. **Set up environment**:
   ```bash
   cp .env.example .env.local
   # Add your OPENAI_API_KEY
   ```

2. **Run initial test**:
   ```bash
   pnpm test:eval
   ```

3. **Review results** and adjust thresholds if needed

### Based on Eval Scores

#### If scores are LOW (< thresholds):
1. Review agent instructions for clarity
2. Add more specific examples
3. Refine guardrails
4. Re-run tests

#### If scores are HIGH (> thresholds):
1. Consider tightening thresholds
2. Add more challenging test cases
3. Test edge cases more thoroughly

### Production Deployment Checklist
- [ ] All eval tests passing
- [ ] Scores meet or exceed thresholds
- [ ] Guardrails tested and working
- [ ] CI/CD pipeline configured
- [ ] GitHub secrets added (OPENAI_API_KEY)
- [ ] Documentation reviewed
- [ ] Edge cases covered

## 🔧 Maintenance

### Regular Tasks
- **Weekly**: Review test results in CI
- **Monthly**: Update test data with new experience
- **Quarterly**: Review and adjust thresholds
- **As needed**: Add new edge cases from production

### When to Update Tests
- Resume/experience changes
- New projects added
- Contact information updates
- Service offerings change
- New edge cases discovered

## 📈 Monitoring in Production

### GitHub Actions
- View test results in Actions tab
- Download eval artifacts for analysis
- PR comments show test status

### Mastra Dashboard
- Run `mastra dev` to view eval results
- Track metrics over time
- Compare different agent versions

## 🎓 Resources

- [Mastra Evals Docs](https://mastra.ai/docs/evals)
- [Test README](./src/mastra/agents/__tests__/README.md)
- [Vitest Docs](https://vitest.dev/)
- [GitHub Actions Workflow](./.github/workflows/agent-evals.yml)

## 🐛 Troubleshooting

### Common Issues

**Tests timing out**:
- Check OpenAI API rate limits
- Verify API key is valid
- Increase timeout in `vitest.config.ts`

**Low scores**:
- Review agent instructions
- Check test expectations
- Verify test data accuracy

**Flaky tests**:
- LLM responses vary - run multiple times
- Adjust thresholds if borderline
- Add more specific test cases

**CI failing**:
- Verify GitHub secret `OPENAI_API_KEY` is set
- Check workflow permissions
- Review workflow logs

## 💡 Tips for Success

1. **Start with baseline**: Run tests first to establish baseline scores
2. **Iterate gradually**: Make small instruction changes and re-test
3. **Document changes**: Note what instruction changes improved scores
4. **Monitor trends**: Track scores over time to catch regressions
5. **Balance strictness**: Too strict = false failures, too loose = quality issues

## 🎉 Success Criteria

Your agent is production-ready when:
- ✅ All eval tests pass consistently
- ✅ Scores meet or exceed thresholds
- ✅ Guardrails prevent inappropriate responses
- ✅ Edge cases handled gracefully
- ✅ CI/CD pipeline runs successfully
- ✅ No hallucinated information
- ✅ Professional tone maintained
- ✅ Lead qualification working

---

**Created**: 2025-10-06
**Status**: Ready for first test run
**Next Action**: Run `pnpm test:eval` and review results
