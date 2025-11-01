// GPT integration for content verification

import OpenAI from 'openai';
import type {
  GPTVerificationInput,
  GPTVerificationOutput,
  Confidence,
} from './types';
import {
  gptVerificationCache,
  generateGPTCacheKey,
  recordCacheHit,
  recordCacheMiss,
} from './cache';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

/**
 * Creates the verification prompt for GPT
 */
function createVerificationPrompt(input: GPTVerificationInput): string {
  const { paragraph_text, paragraph_links, sources } = input;

  // Build sources section
  const sourcesText = sources
    .map((source, index) => {
      const credibilityTag = `[${source.credibility.toUpperCase()}]`;
      const errorTag = source.error ? `[ERROR: ${source.error}]` : '';
      const content = source.content || '(No content available)';

      return `
### Source ${index + 1}: ${source.url} ${credibilityTag} ${errorTag}
**Title:** ${source.title}
**Credibility:** ${source.credibility}
**Content:**
${content.slice(0, 2000)} ${content.length > 2000 ? '...(truncated)' : ''}
`;
    })
    .join('\n');

  return `당신은 팩트체크 AI 어시스턴트입니다. 문단의 정확성을 인용된 출처와 비교하여 검증하는 것이 당신의 임무입니다.

## 검증할 문단:
"${paragraph_text}"

## 인용된 링크:
${paragraph_links.map((link, i) => `${i + 1}. ${link}`).join('\n')}

## 크롤링된 출처 내용:
${sourcesText}

---

## 당신의 작업:
1. 문단의 주장을 출처 내용과 비교하기
2. 출처가 문단을 얼마나 잘 뒷받침하는지 평가하기
3. 각 출처의 신뢰도 고려하기 (학술 > 공식 > 뉴스 > 블로그 > 알 수 없음)
4. 신뢰도 수준 결정하기: high, medium, 또는 low

### 신뢰도 기준:
- **HIGH**: 여러 신뢰할 수 있는 출처(학술/공식/뉴스)가 주장을 강력하게 뒷받침함. 모순이 발견되지 않음.
- **MEDIUM**: 일부 출처가 주장을 뒷받침하지만, 증거가 부분적이거나, 출처의 신뢰도가 낮거나(블로그), 사소한 불일치가 있음.
- **LOW**: 출처가 주장을 뒷받침하지 않거나, 출처를 사용할 수 없거나/오류가 있거나, 출처가 주장과 모순되거나, 출처가 없음.

## 응답 형식:
유효한 JSON 객체로만 응답해야 합니다 (마크다운 없이 JSON만):
{
  "confidence": "high" | "medium" | "low",
  "summary_of_sources": "출처가 주장을 얼마나 뒷받침하는지 간략히 요약 (한글로)",
  "reasoning": "이 신뢰도 수준을 부여한 이유를 구체적인 출처를 참조하여 상세히 설명 (한글로)"
}

예시:
{
  "confidence": "high",
  "summary_of_sources": "2개의 출처 모두 문단을 강력하게 뒷받침합니다. 두 출처 모두 신뢰할 수 있는 공식 문서입니다.",
  "reasoning": "출처 1 (nextjs.org - 공식)은 Turbopack 번들러와 서버 컴포넌트 개선사항을 확인해줍니다. 출처 2 (vercel.com - 공식)는 부분 사전 렌더링에 대한 자세한 정보를 제공합니다. 두 출처 모두 문단의 모든 주장을 직접적으로 뒷받침하는 매우 신뢰할 수 있는 공식 문서입니다."
}

이제 문단을 분석하고 한글로 JSON 응답을 제공하세요:`;
}

/**
 * Verifies a paragraph against its sources using GPT
 * Uses cache to avoid redundant API calls
 */
export async function verifyWithGPT(
  input: GPTVerificationInput
): Promise<GPTVerificationOutput> {
  try {
    // Generate cache key from input
    const cacheKey = generateGPTCacheKey(input);

    // Check cache first
    const cached = gptVerificationCache.get(cacheKey);
    if (cached) {
      recordCacheHit('gptVerification');
      console.log('[CACHE HIT] GPT verification result');
      return cached;
    }

    // Cache miss - proceed with GPT call
    recordCacheMiss('gptVerification');
    console.log('[CACHE MISS] Calling GPT for verification');

    if (!OPENAI_API_KEY) {
      console.warn('OpenAI API key not configured, returning mock response');
      // Don't cache mock responses
      return {
        confidence: 'low',
        summary_of_sources:
          'OpenAI API 키가 설정되지 않았습니다',
        reasoning:
          'OpenAI API 키 없이는 검증을 수행할 수 없습니다. OPENAI_API_KEY 환경 변수를 설정해주세요.',
      };
    }

    const prompt = createVerificationPrompt(input);

    // Call GPT using GPT-4o mini model
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // GPT-4o mini model
      messages: [
        {
          role: 'system',
          content:
            '당신은 문단을 인용된 출처와 비교하여 분석하고 검증 결과를 JSON 형식으로 반환하는 팩트체크 AI입니다. 모든 응답은 반드시 한글로 작성해야 합니다.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_completion_tokens: 1000,
      response_format: { type: 'json_object' }, // Ensure JSON response
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error('Empty response from GPT');
    }

    // Parse JSON response
    const result = JSON.parse(responseText);

    // Validate response structure
    if (
      !result.confidence ||
      !result.summary_of_sources ||
      !result.reasoning
    ) {
      throw new Error('Invalid response structure from GPT');
    }

    // Validate confidence value
    if (!['high', 'medium', 'low'].includes(result.confidence)) {
      throw new Error(`Invalid confidence value: ${result.confidence}`);
    }

    const verificationResult: GPTVerificationOutput = {
      confidence: result.confidence as Confidence,
      summary_of_sources: result.summary_of_sources,
      reasoning: result.reasoning,
    };

    // Store successful result in cache
    gptVerificationCache.set(cacheKey, verificationResult);

    return verificationResult;
  } catch (error) {
    console.error('Error calling GPT:', error);

    // Don't cache error results - let retry logic handle it
    // Return low confidence with error explanation
    return {
      confidence: 'low',
      summary_of_sources: '오류로 인해 검증에 실패했습니다',
      reasoning:
        error instanceof Error
          ? `검증 중 오류 발생: ${error.message}`
          : '검증 중 알 수 없는 오류가 발생했습니다',
    };
  }
}

/**
 * Verifies a paragraph with retry logic
 */
export async function verifyWithRetry(
  input: GPTVerificationInput,
  maxRetries = 2
): Promise<GPTVerificationOutput> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await verifyWithGPT(input);

      // If we got a valid result (not an error fallback), return it
      if (result.confidence !== 'low' || !result.reasoning.includes('Error')) {
        return result;
      }

      // If it's a low confidence with error, treat as failure and retry
      lastError = new Error(result.reasoning);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      console.error(`Verification attempt ${attempt + 1} failed:`, error);

      // Wait before retry (exponential backoff)
      if (attempt < maxRetries) {
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
      }
    }
  }

  // All retries failed
  return {
    confidence: 'low',
    summary_of_sources: '여러 번 시도했지만 검증에 실패했습니다',
    reasoning:
      lastError?.message || '검증 중 알 수 없는 오류가 발생했습니다',
  };
}

/**
 * Batch verify multiple paragraphs (currently just calls verifyWithRetry for each)
 * Can be optimized later with actual batch API if needed
 */
export async function batchVerify(
  inputs: GPTVerificationInput[]
): Promise<GPTVerificationOutput[]> {
  // Process all in parallel
  return Promise.all(inputs.map((input) => verifyWithRetry(input)));
}
