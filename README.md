# RentFlow

임대인을 위한 간편한 월세·세입자 관리 시스템 (1개 건물, 1~4층, 단일 관리자).

## 기술 스택

- Next.js 16 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- Supabase (Auth, Postgres, Storage, RLS)
- 배포: Vercel (Frontend) / Supabase (Backend)

## 시작하기

### 1. Supabase 프로젝트 생성

1. [supabase.com](https://supabase.com)에서 새 프로젝트를 생성합니다.
2. 프로젝트의 **Settings → API**에서 `Project URL`과 `anon public key`를 복사합니다.

### 2. 데이터베이스 마이그레이션 실행

Supabase 대시보드의 **SQL Editor**에서 [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql)의 내용을 그대로 실행합니다. 테이블, RLS 정책, `contracts` Storage 버킷이 함께 생성됩니다.

### 3. 관리자 계정 생성

회원가입 기능은 없습니다. Supabase 대시보드의 **Authentication → Users → Add user**에서 관리자 이메일/비밀번호를 직접 생성합니다.

### 4. 환경 변수 설정

```bash
cp .env.example .env.local
```

`.env.local`에 1번에서 복사한 값을 입력합니다.

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### 5. 실행

```bash
npm install
npm run dev
```

`http://localhost:3000/login`에서 3번에서 만든 관리자 계정으로 로그인합니다.

## 폴더 구조

```
app/(app)/          인증된 관리자 화면 (대시보드, 호실/세입자/월세/계약/설정)
app/login/          로그인 화면
lib/domain.ts       호실/계약/월세 파생 상태 계산 로직
lib/queries/        Server Component에서 사용하는 조회 함수
lib/actions/        Server Actions (생성/수정/삭제)
supabase/migrations 데이터베이스 스키마
```

## 배포

- Frontend: Vercel에 이 저장소를 연결하고, 위 환경 변수 2개를 Vercel 프로젝트 설정에 등록합니다.
- Backend: Supabase 프로젝트를 그대로 사용합니다.
