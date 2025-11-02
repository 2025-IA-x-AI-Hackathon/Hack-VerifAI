# TruAI - AI 기반 팩트체크 및 출처 검증 시스템

> 연구 자료의 신뢰성을 검증하는 지능형 팩트체킹 시스템입니다. 연구 문서를 분석하여 문단별로 구조화하고, 인용된 출처를 기반으로 AI를 활용해 신뢰도를 실시간으로 검증합니다.

[![Next.js](https://img.shields.io/badge/Next.js-14.2.33-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## 라이브 데모

🚀 **[https://truai.vercel.app/](https://truai.vercel.app/)**

실제 배포된 애플리케이션에서 바로 TruAI를 체험해보세요!

## 프로젝트 소개

**TruAI** (Trust AI)는 연구 콘텐츠의 신뢰성을 인용된 출처와 교차 검증하여 확인하는 정교한 팩트체킹 플랫폼입니다. 연구 기사(특히 ChatGPT Deep Research 결과물)를 파싱하여 출처 링크가 포함된 구조화된 문단으로 추출하고, 해당 출처들을 대상으로 실시간 AI 기반 검증을 수행합니다.

### 주요 기능

- **자동 콘텐츠 파싱**: 연구 URL에서 문단을 추출하고 제목 계층 구조를 유지
- **출처 검증**: 문단당 최대 5개의 출처 링크를 크롤링하고 GPT를 사용하여 주장 검증
- **실시간 업데이트**: 검증이 완료되면 신뢰도 등급(높음/중간/낮음)이 실시간으로 표시
- **인터랙티브 UI**: 색상으로 구분된 문단 카드와 상세한 근거 및 출처 요약 제공
- **스마트 캐싱**: LRU 캐시로 중복 API 호출을 줄여 성능 향상
- **병렬 처리**: 비동기 검증 작업으로 여러 문단을 동시에 처리

---

## 목차

- [데모](#데모)
- [아키텍처](#아키텍처)
- [기술 스택](#기술-스택)
- [시작하기](#시작하기)
- [API 문서](#api-문서)
- [프로젝트 구조](#프로젝트-구조)
- [개발 가이드](#개발-가이드)
- [설정](#설정)
- [기여하기](#기여하기)
- [라이선스](#라이선스)

---

## 데모

### 라이브 데모

👉 **[https://truai.vercel.app/](https://truai.vercel.app/)** 에서 바로 사용해보세요!

### 작동 방식

1. **입력**: 연구 기사 URL 입력 (예: ChatGPT Deep Research)
2. **파싱**: 시스템이 문단을 추출하고 인용된 출처에 매핑
3. **검증**: AI가 각 문단을 출처와 대조하여 실시간으로 분석
4. **결과**: 상세한 근거와 함께 색상으로 구분된 신뢰도 등급 확인

```
URL 입력 → 콘텐츠 파싱 → 출처 크롤링 → AI 검증 → 실시간 결과
```

### 신뢰도 수준

- **높음 (초록색)**: 신뢰할 수 있는 출처들이 주장을 강력하게 뒷받침
- **중간 (노란색)**: 부분적 지원 또는 출처들의 혼합된 증거
- **낮음 (빨간색)**: 약한 지원, 상충되는 증거 또는 신뢰할 수 없는 출처

---

## 아키텍처

### 3계층 시스템

```
┌─────────────────────────────────────────────────────────────┐
│                    프론트엔드 (UI 레이어)                      │
│  • 신뢰도 업데이트와 함께 실시간 문단 표시                         │
│  • 검증 결과를 위한 3초 폴링                                    │
│  • 출처 상세 정보를 보여주는 인터랙티브 사이드바                    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              백엔드 로직 1: 수집 및 파싱                        │
│  • ScrapingBee 웹 스크래핑 (JavaScript 렌더링)                 │
│  • HTML → 출처 링크가 포함된 구조화된 문단                        │
│  • UI에 즉시 응답 + 백그라운드 작업 트리거                        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              백엔드 로직 2: 검증 워커                           │
│  • 병렬 출처 스크래핑 (문단당 최대 5개 URL)                       │
│  • 신뢰도 평가를 포함한 GPT 기반 팩트체킹                         │
│  • UI 폴링을 위한 결과 저장                                     │
└─────────────────────────────────────────────────────────────┘
```

상세한 아키텍처는 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)를 참조하세요.

---

## 기술 스택

| 카테고리 | 기술 |
|----------|------|
| **프레임워크** | Next.js 14 (App Router) |
| **언어** | TypeScript (Strict Mode) |
| **UI 컴포넌트** | shadcn/ui + Radix UI |
| **스타일링** | Tailwind CSS |
| **애니메이션** | Framer Motion |
| **웹 스크래핑** | ScrapingBee API |
| **AI 검증** | OpenAI GPT API |
| **파싱** | Cheerio |
| **캐싱** | LRU Cache |
| **검증** | Zod |

---

## 시작하기

### 사전 요구사항

- **Node.js** 18.x 이상
- **npm** 9.x 이상
- **ScrapingBee API 키** ([여기서 발급](https://www.scrapingbee.com/))
- **OpenAI API 키** ([여기서 발급](https://platform.openai.com/api-keys))

### 설치

1. **저장소 클론**

```bash
git clone https://github.com/yourusername/truai.git
cd truai
```

2. **의존성 설치**

```bash
npm install
```

3. **환경 변수 설정**

루트 디렉토리에 `.env.local` 파일을 생성하세요:

```bash
# ScrapingBee API 키 (웹 스크래핑용)
SCRAPINGBEE_API_KEY=your_scrapingbee_api_key_here

# OpenAI API 키 (GPT 검증용)
OPENAI_API_KEY=your_openai_api_key_here
```

4. **개발 서버 실행**

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 여세요.

### 빠른 테스트

1. ChatGPT Deep Research URL 또는 연구 기사를 붙여넣기
2. "분석" 버튼 클릭
3. 실시간 신뢰도 등급과 함께 문단이 표시되는 것을 확인
4. 문단을 클릭하여 상세한 검증 근거 확인

---

## API 문서

### POST `/api/ingest`

연구 기사 URL을 수집하고 파싱된 문단을 반환합니다.

**요청:**
```json
{
  "url": "https://example.com/research-article"
}
```

**응답:**
```json
{
  "doc_id": "doc_20251102_abc123",
  "source_url": "https://example.com/research-article",
  "paragraphs": [
    {
      "id": 1,
      "order": 1,
      "text": "문단 내용...",
      "links": ["https://source1.com", "https://source2.com"],
      "isHeading": false
    }
  ]
}
```

### GET `/api/verification/[docId]`

문서의 검증 결과를 조회합니다.

**파라미터:**
- `docId` (string): ingest 응답에서 받은 문서 식별자

**응답:**
```json
{
  "success": true,
  "doc_id": "doc_20251102_abc123",
  "results": [
    {
      "doc_id": "doc_20251102_abc123",
      "paragraph_id": 1,
      "confidence": "high",
      "summary_of_sources": "문단이 3/3 출처와 일치합니다",
      "reasoning": "모든 신뢰할 수 있는 출처가 주장을 뒷받침합니다...",
      "link_digests": [
        {
          "url": "https://example.com",
          "title": "출처 제목",
          "summary": "출처 내용 요약..."
        }
      ]
    }
  ],
  "progress": {
    "total_paragraphs": 10,
    "verified_paragraphs": 8,
    "pending_paragraphs": 2,
    "failed_paragraphs": 0
  }
}
```

### GET `/api/cache-stats`

캐싱 통계를 반환합니다.

**응답:**
```json
{
  "cache_stats": {
    "total_requests": 150,
    "cache_hits": 45,
    "cache_misses": 105,
    "hit_rate": "30%"
  }
}
```

---

## 프로젝트 구조

```
src/
├── app/
│   ├── api/
│   │   ├── ingest/route.ts              # 콘텐츠 파싱 엔드포인트
│   │   ├── verification/[docId]/route.ts # 검증 결과 엔드포인트
│   │   ├── cache-stats/route.ts          # 캐시 통계
│   │   └── test-verification/route.ts    # 테스트 엔드포인트
│   ├── page.tsx                          # 홈 페이지
│   ├── layout.tsx                        # 루트 레이아웃
│   └── globals.css                       # 전역 스타일
├── components/
│   ├── ContentAnalyzer.tsx              # 메인 콘텐츠 표시 컴포넌트
│   └── ui/                              # shadcn/ui 컴포넌트
├── lib/
│   ├── types.ts                         # Zod 스키마 및 타입 정의
│   ├── parser.ts                        # HTML → 문단 파서
│   ├── scraper.ts                       # ScrapingBee 통합
│   ├── scraping.ts                      # URL 스크래핑 오케스트레이션
│   ├── openai.ts                        # GPT 검증 로직
│   ├── verification.ts                  # 검증 작업 오케스트레이션
│   ├── storage.ts                       # 인메모리 결과 저장소
│   ├── cache.ts                         # GPT 요청용 LRU 캐시
│   └── utils.ts                         # 유틸리티 함수
└── types/
    ├── ingest.ts                        # 문단 및 수집 타입
    └── content.ts                       # 콘텐츠 분석 타입
```

---

## 개발 가이드

### 명령어

```bash
# 개발 서버 시작
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 시작
npm start

# 린터 실행
npm run lint
```

### TypeScript 설정

- **경로 별칭**: 상대 경로 대신 `@/*` 사용
  ```typescript
  import { Button } from "@/components/ui/button"
  import { parseHtml } from "@/lib/parser"
  ```

- **Strict Mode**: 최대 타입 안전성을 위해 활성화
- **ESNext**: 하위 호환성이 있는 최신 JavaScript 기능

### 스타일링 규칙

- 조건부 className 병합을 위해 `cn()` 유틸리티 사용:
  ```typescript
  import { cn } from "@/lib/utils"

  <div className={cn(
    "base-classes",
    condition && "conditional-classes"
  )} />
  ```

- 테마를 위한 CSS 변수 (`globals.css`에 정의)
- 클래스 기반 테마를 통한 다크 모드 지원

### UI 컴포넌트 추가

shadcn/ui 컴포넌트 설치:

```bash
npx shadcn@latest add [컴포넌트명]
```

예시:
```bash
npx shadcn@latest add card
npx shadcn@latest add tooltip
```

---

## 설정

### 환경 변수

| 변수 | 설명 | 필수 |
|------|------|------|
| `SCRAPINGBEE_API_KEY` | 웹 스크래핑 서비스 API 키 | 예 |
| `OPENAI_API_KEY` | GPT 검증용 OpenAI API 키 | 예 |

### 캐싱

LRU 캐시는 `src/lib/cache.ts`에 설정되어 있습니다:
- **최대 크기**: 500개 항목
- **TTL**: 만료 없음 (LRU 제거만)
- **키**: 문단 텍스트 + 출처 콘텐츠의 해시

### 검증 설정

`src/lib/verification.ts`에서 설정 가능:
- **문단당 최대 출처 수**: 5개
- **폴링 간격**: 3초 (프론트엔드)
- **출처 스크래핑**: 병렬 실행
- **콘텐츠 자르기**: 출처당 최대 2000자

---

## 주요 기능 설명

### 콘텐츠 파싱

- **ChatGPT Deep Research 지원**: OpenAI 연구 페이지 특별 처리
- **제목 보존**: h1-h6 계층 구조 유지
- **참조 추출**: 각주를 문단에 자동으로 매핑
- **콘텐츠 분리**: 본문과 인용 목록 구분

### 검증 프로세스

1. **출처 분류**: 신뢰도에 따라 출처 순위 지정 (학술 > 공식 > 뉴스 > 블로그)
2. **병렬 스크래핑**: 최대 5개 출처를 동시에 가져오기
3. **GPT 분석**: 문단 주장과 출처 콘텐츠 비교
4. **신뢰도 등급**: 지원 수준에 따라 높음/중간/낮음 할당
5. **결과 캐싱**: 동일한 콘텐츠에 대한 중복 API 호출 방지

### 실시간 업데이트

- **폴링 메커니즘**: 프론트엔드가 3초마다 새 결과를 폴링
- **점진적 표시**: 검증이 완료되면 문단이 업데이트됨
- **진행 추적**: 검증됨/대기 중/실패 횟수 표시
- **작업 상태**: 각 문단의 검증 상태 추적

---

## 성능 최적화

- **비동기 작업**: 논블로킹 백그라운드 검증
- **LRU 캐싱**: GPT API 비용을 30-50% 절감
- **병렬 처리**: 여러 출처를 동시에 스크래핑
- **콘텐츠 자르기**: GPT 효율성을 위해 출처 콘텐츠를 2000자로 제한
- **지연 로딩**: 최소한의 초기 데이터 전송

---

## 기여하기

기여를 환영합니다! 다음 가이드라인을 따라주세요:

1. 저장소 포크
2. 기능 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 푸시 (`git push origin feature/amazing-feature`)
5. Pull Request 열기

### 개발 가이드라인

- TypeScript strict mode 규칙 준수
- 코드 품질을 위해 ESLint 사용
- 설명적인 커밋 메시지 작성
- 새 기능에 대한 문서 업데이트
- PR 제출 전 철저한 테스트

---

## 로드맵

- [ ] 실시간 업데이트를 위한 WebSocket/SSE 지원 (폴링 대체)
- [ ] 다국어 지원 (현재 한국어/영어)
- [ ] UI를 통한 사용자 정의 GPT 프롬프트
- [ ] PDF/Markdown으로 보고서 내보내기
- [ ] 출처 신뢰도 점수 시스템
- [ ] 사용자 인증 및 문서 저장
- [ ] 원클릭 검증을 위한 Chrome 확장 프로그램

---

## 라이선스

이 프로젝트는 MIT 라이선스로 제공됩니다. 자세한 내용은 [LICENSE](LICENSE)를 참조하세요.

---

## 감사의 말

- [Next.js](https://nextjs.org/) - React 프레임워크
- [shadcn/ui](https://ui.shadcn.com/) - UI 컴포넌트 라이브러리
- [ScrapingBee](https://www.scrapingbee.com/) - 웹 스크래핑 API
- [OpenAI](https://openai.com/) - GPT 검증 엔진
- [Vercel](https://vercel.com/) - 배포 플랫폼

---

## 지원

질문, 이슈 또는 기능 요청:
- [GitHub Issues](https://github.com/yourusername/truai/issues)에 이슈를 등록하세요
