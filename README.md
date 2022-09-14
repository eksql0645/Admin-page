# 목차
[Admin Page](#-Admin-Page)

[요구사항 분석](#-요구사항-분석)

[모델링](#-모델링)

[API 문서](#-API-문서)

[컨벤션](#-컨벤션)

[디렉토리 구조](#-디렉토리-구조)

[패키지](#-패키지)

[기술 스택](#-기술-스택)

[문제 해결 과정](#-문제-해결-과정)
# 🚩 Admin Page

쇼핑몰 주문 내역을 관리하는 관리자 페이지 서비스입니다.

## ✔ 간단 기능 설명

- 주문 생성, 조회, 전체조회, 수정, 삭제가 가능합니다.
    - 주문 생성 시 쿠폰 적용 및 원-달러 환율을 적용해 배송비 환산이 가능합니다.
    - 주문전체조회 시 주문자명 검색 및 주문상태와 기간별 필터 및 페이지네이션 기능을 제공합니다.
    - 주문 취소는 soft delete로 구현하였습니다.
- 쿠폰 생성, 조회, 전체조회, 수정, 삭제가 가능합니다.
    - 쿠폰 생성 시 3가지 타입을 제공하여 쿠폰을 생성합니다.
    - 쿠폰전체조회 시 쿠폰 상태에 따른 필터 및 페이지네이션을 제공합니다.
    - 사용한 쿠폰 타입별 사용횟수와 총 할인액을 조회할 수 있습니다.
    - 쿠폰 삭제도 soft delete로 구현하였습니다.

# ✅ 요구사항 분석

## ✔ 주문 API 구현

### 주문 생성

1. 주문 생성 시 요청으로 들어온 국가코드로 국가명을 알아낸 후 배송비를 알아내야한다고 해석하였습니다.
2. 그렇지만 제공된 데이터 중 country_code, delivery_cost 파일은 다량의 데이터가 있었기 때문에 DB에 저장하면 성능저하가 일어날 수 있다고 생각되었습니다.
3. 따라서, **xlsx.js**를 사용하여 엑셀 파일을 json으로 변환 후 데이터를 추출하였습니다.
4. 배송비를 원-달러로 환산하기 위해 openAPI인 **exchangeratesapi**를 사용하였습니다.
5. **request-promise** 패키지를 사용하여 API에 환율 정보를 요청하였습니다.
6. 국가코드가 KR이 아닌 경우에만 환산을 하였고, 부동소수점을 방지하기 위해 toFixed를 사용하여 소수점 자릿수를 둘째자리까지 제한하였습니다.
7. 쿠폰번호가 있는 경우, 정상쿠폰인지 확인하는 **canUseCoupon**메서드를 거치고 쿠폰의 타입별로 할인율을 적용합니다.
8. 할인가가 적용된 price가 음수가 나오지 않도록 **Math.abs**를 사용하여 절댓값 처리를 합니다.
9. 주문 생성 시 함께 생성되는 주문번호는 **moment**와 **Math.random**을 사용하여 랜덤하게 만들었고 소수점이 나오지 않도록 **Math.floor**로 소수점 아래를 버리도록 구현했습니다.
10. 쿠폰을 적용한 후 쿠폰의 상태, 쿠폰의 할인가, 적용된 order id를 수정합니다.

### 주문 전체 조회

1. 주문전체조회 시 요구사항은 주문자명 검색, 기간별, 상태별 필터였고 페이지네이션도 추가하였습니다.
2. 각 조건에 따른 where절을 호출하기 위해 메서드를 따로 만들고 서비스단에서 호출하였고,
3. where절 안에서 **sequelize의 Op.and**를 사용하여 조건에 따른 쿼리를 묶었습니다.
4. page만 필수요소로 두었고, 나머지는 option으로 두어 좀 더 다양하게 주문리스트를 조회할 수 있습니다.

### 주문 수정

1. 주문 수정 시 주문의 상태가 배송중 혹은 배송완료가 된다면, 송장번호를 추가하도록 구현하였습니다.
2. 송장번호는 주문번호와 동일하게 **moment**와 **Math.random**을 사용하여 랜덤하게 만들었고 소수점이 나오지 않도록 **Math.floor**로 소수점 아래를 버리도록 구현했습니다.

### 주문 취소

1. soft delete로 구현하기 때문에 주문의 상태를 결제취소로 변경하고 송장번호 null로 만들고 제공 데이터와 동일하게 주문자 도시 데이터도 삭제합니다.

## ✔ 쿠폰 API 구현

### 쿠폰 생성

1. 쿠폰 생성 시 기간은 월단위로 설정했으나, 기간을 설정하지 않는다면 end_date가 당일로 지정되어 하루쿠폰이 되도록 구현하였습니다.
2. 쿠폰의 타입은 배송비, 정액, 정률 세가지로 **ENUM** 데이터 타입을 사용해 설정하였습니다.
3. 쿠폰 생성 시 함께 생성되는 쿠폰번호는 **crypto**를 사용하여 생성하였고 상태는 발급완료가 되도록 구현하였습니다.

### 쿠폰 전체 조회 및 통계

1. 쿠폰 전체 조회 시 쿠폰 상태에 따라서 필터링하도록 구현하였고 페이지네이션 기능을 추가하였습니다.
2. 요구사항에 따라 사용된 쿠폰을 타입별로 묶어 사용횟수와 총 할인가를 조회하도록 구현하였습니다.

### 쿠폰 삭제

1. 쿠폰의 상태는 발급완료, 사용완료, 사용불가, 기간만료 4가지만 사용할 수 있도록 구현하였습니다.
2. 쿠폰이 삭제되는 경우 상태를 사용불가 처리로 만들고 end_date가 start_date와 같아지도록 구현했습니다.

## ✔ validator / error middleware / errorCodes
1) API 중 요청 데이터를 가진 경우 validator를 통해 유효성 검사를 진행하였습니다.
2) 모든 API는 에러를 던지면 error middleware가 받아서 처리를 합니다.
3) errorCodes로 각각의 에러에 맞게 에러 메세지를 커스텀했습니다.

# 🛠 모델링
- 하나의 주문에는 여러개의 쿠폰이 사용될 수 있고 쿠폰은 하나의 주문에만 적용되기 때문에 order_lists : coupons = 1:N 관계를 가지도록 설계했습니다.

| order_lists | 필드명 | 데이터 타입 |
| --- | --- | --- |
| id (PK) | id | INT |
| 주문번호 | order_num | VARCHAR(20) |
| 주문일자 | date | VARCHAR(50) |
| 주문상태 | order_state | VARCHAR(20) |
| 수량 | quantity | INT |
| 가격 | price | FLOAT |
| 주문자 도시 | buyr_city | VARCHAR(40) |
| 주문자 국가 | buyr_country | VARCHAR(45) |
| 주문자 우편번호 | buyr_zipx | VARCHAR(20) |
| 국가코드 | vccode | VARCHAR(20) |
| 송장번호 | delivery_num | VARCHAR(20) |
| 주문자명 | user_name | VARCHAR(45) |

| coupons | 필드명 | 데이터 타입 |
| --- | --- | --- |
| id (PK) | id | INT |
| 쿠폰번호 | coupon_num | VARCHAR(45) |
| 쿠폰유형 | type | ENUM('배송비', '정액', '정률') |
| 쿠폰상태 | state | VARCHAR(45) |
| 할인가 | discount | VARCHAR(45) |
| 시작일자 | start_date | FLOAT |
| 마감일자 | end_date | VARCHAR(45) |
| order id(FK) | order | INT |
| 쿠폰 설명 | description | VARCHAR(45) |

## ✏ ERD
![image](https://user-images.githubusercontent.com/80232260/190191347-06974952-a6d1-49f1-beac-20f320afaf80.png)

# 📑 API 문서
npm start 후 http://localhost:8080/api-docs

혹은

[swagge PDF 문서](https://github.com/eksql0645/Admin-page/files/9567589/screencapture-localhost-8080-api-docs-2022-09-14-23_52_10.pdf)

# 💡 컨벤션

### ✔ camelCase / PascalCase

- **파일, 생성자, 변수, 메서드명**은 **camelCase**를 사용합니다.
- **클래스명**은 **PascalCase**를 사용합니다.

### ✔ Lint 규칙

| 들여쓰기 2칸 | 탭 사용 x |
| --- | --- |
| double quote 사용. | commonJS 사용 |
| 마지막 콤마 사용 | 한줄 최대 글자수: 80 |
| var는 사용하지 않습니다. | 세미 콜론 사용을 허용합니다. |

### ✔ branch명

- 대문자 금지 / 언더바 금지
- ‘-’ 사용
- 초기 설정은 master 브랜치에 설정
    - 초기설정에는 패키지 설치 / DB 설정 / 폴더구조까지 포함합니다.
- 브랜치 나누기 전에 이슈 생성하기
- 구현할 기능별/ 문서 / 테스트 별로 브랜치 나누기

| 기능 | 브랜치명 |
| --- | --- |
| 주문 생성  | feature/admin-add-order |
| 주문 전체 조회 | feature/admin-get-order-list |
| 주문 조회 | feature/admin-get-order |
| 주문 수정 | feature/admin-set-order |
| 주문 삭제 | feature/admin-delete-order |
| 쿠폰 생성 | feature/admin-add-coupon |
| 쿠폰 전체 조회 | feature/admin-get-coupon-list |
| 쿠폰 조회 | feature/admin-get-coupon |
| 쿠폰 수정 | feature/admin-set-coupon |
| 쿠폰 삭제 | feature/admin-delete-coupon |
| 주문 생성 추가기능 | feature/admin-add-order-extra |
| 리팩토링 | feature/refactoring |

### ✔ Issue 템플릿

Issue 제목
(브랜치명) | (이슈 간략 설명) / feature/board | create post API

Issue 내용
```text
### Issue 타입(하나 이상의 Issue 타입을 선택해주세요)
-[] 기능 추가
-[] 기능 삭제
-[] 버그 수정
-[] 의존성, 환경 변수, 빌드 관련 코드 업데이트
-[] 테스트 추가
-[] 리팩토링

### 상세 내용
ex) Github 소셜 로그인 기능이 필요합니다.

### 참고 사항
```

### ✔ Git commit

![image](https://user-images.githubusercontent.com/80232260/188366205-84d8a796-3c51-4eb0-bb29-3a61c96bb047.png)

[깃 커밋 컨벤션 참고 사이트](https://overcome-the-limits.tistory.com/entry/협업-협업을-위한-기본적인-git-커밋컨벤션-설정하기)

# 🗂 폴더 구조

1) 기본적인 폴더구조는 routes - services - models로 계층화하였습니다.
2) db - models: 시퀄라이즈 모델링과 db 설정파일로 구성되었습니다.
3) middlewares: service 단 이전에 처리되는 데이터들과 error middleware로 구성되었습니다.
4) utils: errorCodes와 기능별로 모듈화한 함수들로 구성되었습니다.

```
├─config
├─db
│  └─models
├─middlewares
│  └─validator
├─models
├─node_modules
├─routes
├─service
└─utils
    └─xlsx
```

# ⚙ 패키지

```json
{
  "name": "admin-page",
  "version": "1.0.0",
  "description": "쇼핑몰 주문 내역을 관리하는 관리자 페이지 서비스입니다.",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon server.js"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/eksql0645/Admin-page.git"
  },
  "author": "JKS",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/eksql0645/Admin-page/issues"
  },
  "homepage": "https://github.com/eksql0645/Admin-page#readme",
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.1",
    "express-validator": "^6.14.2",
    "moment": "^2.29.4",
    "morgan": "^1.10.0",
    "mysql2": "^2.3.3",
    "nanoid": "^4.0.0",
    "request-promise": "^4.2.6",
    "sequelize": "^6.21.4",
    "sequelize-auto": "^0.8.8",
    "xlsx": "^0.18.5"
  },
  "devDependencies": {
    "@babel/eslint-parser": "^7.18.9",
    "dotenv": "^16.0.2",
    "eslint": "^8.23.0",
    "eslint-config-prettier": "^8.5.0",
    "eslint-plugin-prettier": "^4.2.1",
    "nodemon": "^2.0.19",
    "prettier": "^2.7.1",
    "sequelize-cli": "^6.4.1",
    "should": "^13.2.3",
    "supertest": "^6.2.4",
    "swagger-jsdoc": "^6.2.5",
    "swagger-ui-express": "^4.5.0"
  }
}

```

# ⚡ 기술 스택
<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white"> <img src="https://img.shields.io/badge/express-FCC624?style=for-the-badge&logo=express&logoColor=white"> <img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white">
<img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white"> <img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white"> <img src="https://img.shields.io/badge/Sequelize-007396?style=for-the-badge&logo=Sequelize&logoColor=white">
<img src="https://img.shields.io/badge/Swagger-61DAFB?style=for-the-badge&logo=Swagger&logoColor=white">

# ✋ 문제 해결 과정
1️⃣ 이전 프로젝트에서 상태코드에 대해 명확한 판단이 섰다고 생각했는데 이번에 또 다시 조회, 수정, 삭제 등 다양한 상황에서 데이터가 없는 경우 어떤 상태코드를 보내는 것이 적절한지에 대해 생각하며 많은 시간을 보냈습니다. 
먼저, 특정 주문을 조회할 때, 클라이언트의 요청이 정상적으로 왔지만 데이터가 없는 경우라면 주문번호가 잘못되었기 때문에 이때에는 400에러를 보내는 것이 맞다고 판단하였으나, 전체주문조회의 경우는 일반적으로 클라이언트가 요청데이터를 보내지 않기 때문에 이 경우 데이터가 없다면 200을 보내는 것이 맞다고 생각했습니다. 이번 프로젝트에서는 전체주문조회를 할 때 쿼리 스트링을 사용하여 검색 및 필터에 필요한 데이터를 보내도록 하였는데 이 데이터들의 유효성 검사는 service단으로 오기 전에 express-validator를 통해 진행하도록 구현했습니다. 따라서, 데이터가 잘못 올 경우는 사전에 어느정도 차단된다고 생각하여 전체주문조회에서 데이터가 없는 경우 200을 보내도록 하였습니다. 

그리고 주문 수정과 삭제를 하기 전에 주문이 존재하는지 사전에 확인 하는데 이 때 주문이 존재하지 않는다면 주문조회와 마찬가지로 클라이언트가 주문번호를 잘못 보냈다고 생각하여 400을 보내도록 했습니다. 또한, 같은 수정 데이터를 보낸다면 두번째 요청에서는 수정이 되지 않기 때문에 0을 반환하는데 이 경우에도 수정을 요청하면서 같은 데이터를 보낸 것은 잘못된 요청이라고 판단하여 400을 보내도록 했습니다. 하지만 수정과 삭제 시에 반환되는 객체 자체가 없다면(이 경우가 있을지는 모르겠지만..) 서버에러라고 생각했고, 500을 보내는 건 보안을 취약하게 하기 때문에 400에러와 커스텀 메세지만 보내도록 구현했습니다. 

2️⃣ 저는 보통 수정 요청 처리 후 수정 데이터를 다시 조회하여 응답객체로 보내는데, 이번 프로젝트를 하면서 ‘수정 후 조회를 하는 사이에 삭제 요청이 들어와서 수정된 데이터를 조회하지 못하는 경우도 있는지’에 대해 궁금해졌습니다. 만약 그렇다면 수정 후 조회를 할 때도 에러를 잡아줘야된다고 생각했기 때문입니다. 팀원들과 이 부분에 대해 토론했고, node는 싱글스레드이기 때문에 하나의 요청이 끝난 후 다음 요청을 처리하여 중간에 요청이 들어오지 않을 것이라고 결론을 내렸습니다.

3️⃣ 프로젝트를 하며 일반적인 단조로운 쿼리 몇가지만 썼기 때문에 sequelize 연산자 혹은 함수를 모듈화시키는 방식을 사용할 일이 거의 없었는데 이번 프로젝트를 통해서 평소보다 조금은 복잡한 쿼리를 작성해보면서 시퀄라이즈 연산자에 대해 공부할 수 있었습니다. 연산자에 대해 어렴풋이 알고 있었는데, 많은 시도를 해보면서 이번 프로젝트에서 사용한 Op.and와 Op.or의 차이를 확실히 알게 되었습니다. 
무엇보다 모델단에서 조건의 유무에 따라서 데이터를 조회하도록 하려 했으나 연산자를 사용하더라도 모든 데이터 중 하나만 있는 경우는 에러가 발생해서 계속 고민을 하다 팀원에게 도움을 요청했고 팀원분 덕에 서비스단에서 where절을 조건에 따라 분리할 수 있다는 것을 깨달았습니다. 쿼리는 모델에서만 사용해야 한다는 생각의 틀에 빠져 쿼리를 미리 만들어서 조건에 따라 분리할 생각을 하지 못했는데 팀원분 덕에 좀 더 넓게 생각할 수 있게 되었고, 코드를 좀 더 넓게 보게되면서 모듈화도 구현하였습니다. 이외에도 쿠폰의 사용유무를 보거나 환율 적용, 쿠폰적용 등 기능별로 함수를 모듈화시켰는데, router, service, model을 제외하면 middleware 정도만 이렇게 구현을 했던터라 모듈화에 익숙해지는 좋은 경험이 되었습니다.

🔆 이번 프로젝트에서 내,외장 라이브러리를 다양하게 사용해보고 상태코드, 자바스크립트 및 node.js의 동작방식에 대해 찾아보면서 사용 언어에 대한 기초를 더 튼튼히 해야 발전할 수 있다는 생각이 들었고 부족한 부분을 알게 되어 공부하는데 도움을 받을 수 있었습니다.
