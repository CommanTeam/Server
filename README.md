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



# express-session

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]


# cookie-parser


```
이 두 모듈의 주요 차이점은 쿠키 세션 데이터를 저장하는 방식입니다. express-session 미들웨어는 세션 데이터를 서버에 저장하며, 쿠키 자체에는 세션 데이터가 아니라 세션 ID만 저장됩니다. 기본적으로 express-session은 인메모리 스토리지를 이용하며, 프로덕션 환경용으로 설계되지 않았습니다. 프로덕션 환경에서는 확장 가능한 session-store를 설정해야 합니다. 호환 가능한 세션 스토어의 목록을 참조하십시오.

이와 반대로 cookie-session 미들웨어는 쿠키 기반의 스토리지를 구현하며, 하나의 세션 키가 아니라 세션 전체를 쿠키에 직렬화합니다. cookie-session은 세션 데이터의 크기가 상대적으로 작으며 (오브젝트가 아닌) 원시 값으로 쉽게 인코딩 가능할 때에만 사용하십시오
```


---


4. SSL
<img align="center" width="200" src="https://github.com/CommanTeam/Server/blob/master/public/images/SSL.png" />

* 전송 계층 보안 (영어: Transport Layer Security, TLS, 과거 명칭: 보안 소켓 레이어/Secure Sockets Layer, SSL)는 암호 규약이다. 

* '트랜스포트 레이어 보안'이라는 이름은 '보안 소켓 레이어'가 표준화 되면서 바뀐 이름이다. 

* TLS의 3단계 기본 절차:
  1. 지원 가능한 알고리즘 서로 교환
  2. 키 교환, 인증
  3. 대칭키 암호로 암호화하고 메시지 인증
---

# Technology Stack


