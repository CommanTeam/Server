# Comman Server API
[API Document](https://comman.postman.co/collections/1458906-c866ca9a-ab48-60de-394c-efc05b285bef)


---

# Develop Environment

1. AWS - EC2

<img align="center" width="200" src="https://github.com/CommanTeam/Server/blob/master/public/images/EC2.png" />

<img align="center" src="https://github.com/CommanTeam/Server/blob/master/public/images/EC2_Environment.png" />



2. AWS - RDS

<img align="center" width="200" src="https://github.com/CommanTeam/Server/blob/master/public/images/RDS.png" />

<img align="center" src="https://github.com/CommanTeam/Server/blob/master/public/images/RDS_Environment.png" />

3. Async & Await & Promise

<img align="center" src="https://github.com/CommanTeam/Server/blob/master/public/images/Async_Await.jpg" />

--- 


# Security Mehtod
1. [JWT](http://self-issued.info/docs/draft-ietf-oauth-json-web-token.html)

[![JWT](http://jwt.io/assets/logo.svg)](https://jwt.io/)

[![Build Status](https://travis-ci.org/yourkarma/JWT.svg?branch=master)](https://travis-ci.org/yourkarma/JWT) 
[![Reference Status](https://www.versioneye.com/objective-c/jwt/reference_badge.svg?style=flat)](https://www.versioneye.com/objective-c/jwt/references)

Middleware that validates JsonWebTokens and sets req.user.

This module lets you authenticate HTTP requests using JWT tokens in your Node.js applications.

JWTs are typically used to protect API endpoints, and are often issued using OpenID Connect.

---
2. [Nginx](https://nginx.org/en/)

<img align="center" src="https://github.com/CommanTeam/Server/blob/master/public/images/nginx.png" />

An official read-only mirror of http://hg.nginx.org/nginx/ which is updated hourly. 

Pull requests on GitHub cannot be accepted and will be automatically closed. 

The proper way to submit changes to nginx is via the nginx development mailing list, see http://nginx.org/en/docs/contributing_changes.html http://nginx.org/

---

3. Helmet
<img align="right" width="200" src="http://static.nfl.com/static/content/public/static/img/logos/react-helmet.jpg" />

[![npm version](https://badge.fury.io/js/helmet.svg)](http://badge.fury.io/js/helmet)
[![npm dependency status](https://david-dm.org/helmetjs/helmet.svg)](https://david-dm.org/helmetjs/helmet)
[![Build Status](https://travis-ci.org/helmetjs/helmet.svg?branch=master)](https://travis-ci.org/helmetjs/helmet)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fhelmetjs%2Fhelmet.svg?type=shield)](https://app.fossa.io/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fhelmetjs%2Fhelmet?ref=badge_shield)

Helmet is Middlewares to help secure your apps

Helmet helps you secure your Express apps by setting various HTTP headers. *It's not a silver bullet*, but it can help!

---

4. express-session

* 미들웨어는 세션 데이터를 서버에 저장하며, 쿠키 자체에는 세션 데이터가 아니라 세션 ID만 저장

* 기본적으로 express-session은 인메모리 스토리지를 이용


---


5. cookie-parser

* 쿠키 기반의 스토리지를 구현하며, 하나의 세션 키가 아니라 세션 전체를 쿠키에 직렬화

* 세션 데이터의 크기가 상대적으로 작음


---


6. SSL
<img align="center" width="200" src="https://github.com/CommanTeam/Server/blob/master/public/images/SSL.png" />

* 전송 계층 보안 (영어: Transport Layer Security, TLS, 과거 명칭: 보안 소켓 레이어/Secure Sockets Layer, SSL)는 암호 규약이다. 

* '트랜스포트 레이어 보안'이라는 이름은 '보안 소켓 레이어'가 표준화 되면서 바뀐 이름이다. 

* TLS의 3단계 기본 절차:
  1. 지원 가능한 알고리즘 서로 교환
  2. 키 교환, 인증
  3. 대칭키 암호로 암호화하고 메시지 인증
---

# Technology Stack

[![Build Status](https://travis-ci.org/e-/Hangul.js.svg?branch=master)](https://travis-ci.org/e-/Hangul.js) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

# Hangul.js

> Hangul.js는 한글로 이루어진 문장의 자음과 모음을 분리하는 자바스크립트 라이브러리입니다. 이 라이브러리를 이용하여 한글검색, 초성검색 등을 할 수 있습니다. 

## 설치 및 사용방법

### node.js 

```bash
npm install hangul-js
```
```js
var Hangul = require('hangul-js');
```


## 명세

### Hangul.disassemble (alias `Hangul.d`)
`Hangul.disassemble(str:string, grouped:boolean = false)`은 문자열 `str`에 있는 한글을 자음/모음으로 분리하여 문자들의 배열로 돌려줍니다. 이 때 한글이 아닌 문자는 그대로 반환됩니다. `Hangul.d`처럼 짧은 이름으로 사용할 수도 있습니다.

```js
Hangul.disassemble('가나다'); // ['ㄱ','ㅏ','ㄴ','ㅏ','ㄷ','ㅏ']

Hangul.disassemble('ab가c'); // ['a','b','ㄱ','ㅏ','c']

Hangul.disassemble('ab@!23X.'); // ['a','b','@','!','2','3','X','.']
```

같은 홑낱자로 이루어진 겹낱자는 분리되지 않습니다.

```js
Hangul.disassemble('ㄲ'); // ['ㄲ']
```

다른 홑낱자로 이루어진 겹낱자는 분리됩니다.

```js
Hangul.disassemble('ㄳ'); // ['ㄱ','ㅅ']

Hangul.disassemble('ㅚ'); // ['ㅗ','ㅣ']
```

추가적으로 `grouped` 옵션을 `true`로 설정하여 문자열의 각 글자별로 따로 분리할 수 있습니다.

```js
Hangul.d('매드캣MK2', true); 
// [['ㅁ', 'ㅐ'], ['ㄷ', 'ㅡ'], ['ㅋ', 'ㅐ', 'ㅅ'], ['M'], ['K'], ['2']]
```

두벌식 키보드로 주어진 문자열을 입력할 때 누르는 키들의 배열이라고 생각하면 쉽습니다.

### Hangul.assemble (alias `Hangul.a`)

`Hangul.assemble(arr:string[])`는 한글 자음/모음들의 배열 `arr`을 인자로 받아 이를 조합한 문자열을 돌려줍니다. 이 때 한글이 아닌 문자는 그대로 반환됩니다. `Hangul.a`처럼 짧은 이름으로 사용할 수도 있습니다.

```js
Hangul.assemble(['ㄱ','ㅏ','ㄴ','ㅏ','ㄷ','ㅏ']); // '가나다'

Hangul.assemble(['a','b','ㄱ','ㅏ','c']); // 'ab가c'

Hangul.assemble(['a','b','@','!','2','3','X','.']); // 'ab@123X.'
```

이 경우에도 두벌식 키보드에서 주어진 키들을 누를 때 만들어지는 문자열을 돌려준다고 생각하면 쉽습니다.

```js
Hangul.assemble(['ㅗ','ㅐ']); // 'ㅙ'

Hangul.assemble(['ㄹ','ㅂ','ㅅ']); // 'ㄼㅅ'
```

`Hangul.disassemble` 함수와 역함수 관계가 아닙니다. 

```js
Hangul.a(Hangul.d('옽ㅏ')); // '오타' ('옽ㅏ' 가 아님)
```

### Hangul.search

`Hangul.search(a:string, b:string)`는 문자열 `a`가 문자열 `b`를 포함하는지 검사합니다. 이때 포함관계는 '두벌식 키보드 기준으로 a문자열을 입력할 때 누르는 키들의 배열이 b문자열을 입력할 때 누르는 키들의 배열을 포함한다'로 정의합니다. 반환값이 0보다 크거나 같다면 포함합니다.

```js
Hangul.search('달걀','닭'); // 0

Hangul.search('달걀','알'); // -1
```

`indexOf`함수와 다릅니다.

```js
var a = '도우미'
  , b = '도움';
  
a.indexOf(b); // -1

Hangul.search(a, b); // 0
```

실제 사용할 때에는 하나의 단어를 여러개의 문자열과 비교하므로 `Hangul.Searcher`를 사용하는게 편합니다.

```js
var searcher = new Hangul.Searcher('닭');

searcher.search('달걀'); // 0
searcher.search('달구지'); // 0
searcher.search('달무리'); // -1
```


## 테스트 및 기여

코드를 수정하셨다면 꼭 `grunt` 명령어를 통해 테스트를 수행해 주세요. 현재 마스터 브랜치에 있는 코드의 테스트 결과는 [여기](http://e-.github.io/Hangul.js/test/)서 보실 수 있습니다.



