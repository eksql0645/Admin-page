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
8. 할인가가 적용된 price가 음수가 나오지 않도록 **Math.abs()**를 사용하여 절댓값 처리를 합니다.
9. 주문 생성 시 함께 생성되는 주문번호는 **moment()**와 **Math.random()**을 사용하여 랜덤하게 만들었고 소수점이 나오지 않도록 **Math.floor()**로 소수점 아래를 버리도록 구현했습니다.
10. 쿠폰을 적용한 후 쿠폰의 상태, 쿠폰의 할인가, 적용된 order id를 수정합니다.

### 주문 전체 조회

1. 주문전체조회 시 요구사항은 주문자명 검색, 기간별, 상태별 필터였고 페이지네이션도 추가하였습니다.
2. 각 조건에 따른 where절을 호출하기 위해 메서드를 따로 만들고 서비스단에서 호출하였고,
3. where절 안에서 **sequelize의 Op.and**를 사용하여 조건에 따른 쿼리를 묶었습니다.
4. page만 필수요소로 두었고, 나머지는 option으로 두어 좀 더 다양하게 주문리스트를 조회할 수 있습니다.

### 주문 수정

1. 주문 수정 시 주문의 상태가 배송중 혹은 배송완료가 된다면, 송장번호를 추가하도록 구현하였습니다.
2. 송장번호는 주문번호와 동일하게 **moment()**와 **Math.random()**을 사용하여 랜덤하게 만들었고 소수점이 나오지 않도록 **Math.floor()**로 소수점 아래를 버리도록 구현했습니다.

### 주문 취소

1. soft delete로 구현하기 때문에 주문의 상태를 결제취소로 변경하고 송장번호 null로 만들고 제공 데이터와 동일하게 주문자 도시 데이터도 삭제합니다.

## ✔ 쿠폰 API 구현

### 쿠폰 생성

1. 쿠폰 생성 시 기간은 월단위로 설정했으나, 기간을 설정하지 않는다면 end_date가 당일로 지정되어 하루쿠폰이 되도록 구현하였습니다.
2. 쿠폰의 타입은 배송비, 정액, 정률 세가지로 **ENUM*8 데이터 타입을 사용해 설정하였습니다.
3. 쿠폰 생성 시 함께 생성되는 쿠폰번호는 **crypto**를 사용하여 생성하였고 상태는 발급완료가 되도록 구현하였습니다.

### 쿠폰 전체 조회 및 통계

1. 쿠폰 전체 조회 시 쿠폰 상태에 따라서 필터링하도록 구현하였고 페이지네이션 기능을 추가하였습니다.
2. 요구사항에 따라 사용된 쿠폰을 타입별로 묶어 사용횟수와 총 할인가를 조회하도록 구현하였습니다.

### 쿠폰 삭제

1. 쿠폰의 상태는 발급완료, 사용완료, 사용불가, 기간만료 4가지만 사용할 수 있도록 구현하였습니다.
2. 쿠폰이 삭제되는 경우 상태를 사용불가 처리로 만들고 end_date가 start_date와 같아지도록 구현했습니다.

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
