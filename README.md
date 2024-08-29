## 🎧 음악 취향 공유 서비스 웹, 카버뮤직

![alt text](https://file.notion.so/f/f/74a28231-9a14-42f3-bd53-a8b84388f018/0527c646-aa9b-4823-a13a-633230a93445/test2500.gif?table=block&id=4575cb79-d765-4782-9506-46f7a9f96953&spaceId=74a28231-9a14-42f3-bd53-a8b84388f018&expirationTimestamp=1724925600000&signature=dy4Is15qv4tAGgsTVnw8ZfcQruXyVmrZOMlNE19tOdY&downloadName=test2500.gif)

- 배포 URL: https://music.divdivdiv.com

## 프로젝트 소개

- 카버뮤직은 음반에 관한 글을 작성하고 별점을 통해 평가하는 등, 자신의 음악 취향을 아카이빙 할 수 있는 사이트입니다.
- 회원가입 및 로그인 기능을 제공합니다.
- 관리자 아이디로 로그인하면 글을 자유롭게 쓰거나 수정하고 삭제할 수 있습니다.
- 글 작성 시 음반의 특성에 맞는 태그를 입력해 각각의 태그가 포함된 글을 모아볼 수 있습니다.
- 마음에 드는 게시글에 좋아요를 누르거나 댓글을 작성할 수 있습니다.
- 검색을 통해 특정 키워드가 포함된 글을 찾을 수 있습니다.
- 음악 장르별로 구분된 게시판에서 원하는 장르의 글을 구경해볼 수 있습니다.
- 달력 게시판을 통해 날짜별로 업로드된 글을 한눈에 살펴보고 해당 페이지로 이동할 수 있습니다.

## 개발 환경

- Front-end: HTML, CSS, TypeScript, React, Next.js, Jotai
- Back-end: MongoDB, AWS S3
- 서비스 배포: Vercel
- 커밋 컨벤션
- 코드 컨벤션
- 스프라이트

## 채택한 개발 기술

### React

- 기능별 컴포넌트화를 통해 추후 유지보수와 재사용성을 고려했습니다.
- 레이아웃 컴포넌트를 설계해 사이트의 전체 구조를 일관성 있게 유지하고 디자인 시스템 관리의 효율성을 높였습니다.

### Next.js

- SSR을 통해 서버 컴포넌트에서 데이터 조회 API를 호출해 페이지 로딩 속도를 향상시켰습니다.
- Metadata API로 페이지별 메타데이터를 동적으로 설정해 SEO를 최적화했습니다.

### Jotai

- 컴포넌트에서 props로 데이터를 전달하는 방식의 경우 props drilling 현상이 발생합니다. 이를 방지하기 위해 필요한 컴포넌트에서만 원하는 데이터를 가져다 쓸 수 있는 상태 관리 라이브러리를 도입하게 되었습니다.
- 메인 페이지의 앨범 데이터 및 로그인 데이터를 atom에 저장해 필요한 컴포넌트에서 사용했습니다.
- Redux 대신 Jotai를 채택한 이유
  - React의 useState와 동작 방식이 비슷해 학습비용 측면에서 훨씬 유리했습니다.
  - 특정 atom이 변경될 때, 해당 atom을 참조하는 컴포넌트만 리렌더링되기 때문에 불필요한 리렌더링을 최소화할 수 있습니다.
  - Redux에 비해 훨씬 적은 양의 코드로 작동시킬 수 있습니다.

### MongoDB

- 사이트의 모든 데이터를 MongoDB와 연동해 관련 CRUD 작업을 직접 구축했습니다.
- 클라이언트와 서버 간 데이터 전송에 필요한 비동기 처리 과정을 구현했습니다.

### AWS S3

- 이미지 업로드 시 AWS S3에 저장하고, 파일 URL을 MongoDB와 연동해 사용자 요청 시 이미지를 빠르게 제공했습니다.

### eslint, prettier

- 정해진 규칙에 따라 자동으로 코드 스타일을 정리해 코드의 일관성을 유지했습니다.
- eslint로 코드 품질 관리를, prettier로 코드 포맷팅을 했습니다.

## 프로젝트 실행 방법

사용한 `npm` 버전은 9.2.0이며, `Node.js` 버전은 v19.4.0입니다.

```bash
npm install
npm run dev
```

## 프로젝트 구조

```bash
.
├── README.md
├── .gitignore
├── .prettierrc
├── package-lock.json
├── package.json
├── app
│   ├── (routes)
│   │   ├── [genre]
│   │   ├── admin
│   │   ├── artist
│   │   ├── calendar
│   │   ├── login
│   │   ├── post
│   │   ├── search
│   │   └── signup
│   └── api
│       ├── artist
│       ├── auth
│       ├── aws
│       ├── calendar
│       ├── genre
│       ├── post
│       ├── randomPost
│       ├── search
│       ├── spotify
│       └── tag
├── components
│   ├── @common
│   │   ├── album
│   │   ├── assets
│   │   ├── footer
│   │   └── header
│   ├── artist
│   ├── auth
│   ├── calendar
│   ├── landingPage
│   ├── post
│   │   └── comment
│   ├── search
│   └── upload
│       ├── TagsEditor
│       ├── ToastEditor
│       └── VideoLinksEditor
├── hooks
├── modules
│   ├── api
│   ├── config
│   └── constants
├── models
└── public
    ├── fonts
    ├── images
    └── svgs

```

## 개발 기간

- 개발 기간: 2023-10 ~ 2024-02
- 리팩토링 기간: 2024-07 ~ 2024-08

## 관련 문서

- [카버뮤직 트러블 슈팅 모음](https://medium.com/@icycyi92/%EC%B9%B4%EB%B2%84%EB%AE%A4%EC%A7%81-%ED%8A%B8%EB%9F%AC%EB%B8%94-%EC%8A%88%ED%8C%85-%EB%AA%A8%EC%9D%8C-4b296a4ae616)
- [최유일 포트폴리오](https://rust-ocicat-1b0.notion.site/f61c9cea780144819507bf0616d3bd70?pvs=4)

## 페이지별 기능

### [메인 페이지]

- 200개 이상의 전체 게시글 데이터를 앨범아트 형태로 일정량씩 노출합니다.
- SSR을 통해 초기 데이터 조회 API를 호출해 `MongoDB`로부터 Data Fetching 작업을 진행합니다.
- 현재 데이터 중 마지막 항목이 뷰포트 내에 진입하면 CSR을 통해 데이터 조회 API를 호출하는 무한 스크롤 로직을 구현했습니다.
- 새로운 데이터를 불러올 때까지 Loading Spinner를 표시한 뒤, [`AOS`](https://www.npmjs.com/package/aos)의 `fade-in-up` 애니메이션을 활용해 화면을 부드럽게 전환시킵니다.
- 데이터 조회 API를 통해 한번 불러온 데이터는 `Jotai` atom에 저장해두었다가 재사용합니다.

| 메인 페이지                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ![mainPage](https://file.notion.so/f/f/74a28231-9a14-42f3-bd53-a8b84388f018/0527c646-aa9b-4823-a13a-633230a93445/test2500.gif?table=block&id=4575cb79-d765-4782-9506-46f7a9f96953&spaceId=74a28231-9a14-42f3-bd53-a8b84388f018&expirationTimestamp=1725004800000&signature=BmWIsNkeHqa6sPmh9kLKJOkrwi4nOOuRlvchTfNhDP4&downloadName=test2500.gif) |

<br>

## 개선 목표

## 프로젝트 후기

## 개발자

<div >

|                                                                   **최유일**                                                                    |
| :---------------------------------------------------------------------------------------------------------------------------------------------: |
| [<img src="https://carver-bucket.s3.ap-northeast-2.amazonaws.com/user/carver" height=150 width=150> <br/> @minumsa](https://github.com/minumsa) |

</div>
