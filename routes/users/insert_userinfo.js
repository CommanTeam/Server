/*
 Default module
 */
 const express = require('express');
 const router = express.Router();
 const async = require('async');
 const bodyParser = require('body-parser');
 const http = require('http');
/*
 Router.use
 */
 router.use(bodyParser.json());
 router.use(bodyParser.urlencoded({ extended: false }));

/*
 Custom module
 */
 const jwt = require('../../module/jwt.js');
 const db = require('../../module/pool.js');
 const sql = require('../../module/sql.js');

 const request = require('request-promise');

/*
 Variable declaration
 */

/*
 Function Sector
 */

/*
 Method : Get
 */


/*
 Method : Post
 */
//written by 탁형민
//usr info 받아서 DB에 INSERT
//http://ip/users/insert_user_info

// var options = {
//   host: 'https://kapi.kakao.com',
//   path: '/v1/user/access_token_info',
//   method: 'GET'
// };

// http.request(options, function(res) {
//   console.log('STATUS: ' + res.statusCode);
//   console.log('HEADERS: ' + JSON.stringify(res.headers));

//   res.setEncoding('utf8');
//   res.on('data', function (chunk) {
//     console.log('BODY: ' + chunk);
// });
// }).end();



router.post('/', async(req, res, next) => {
    console.log("===insert_userinfo.js ::: router('/')===");

    // var token = "VTDI10s8Md7V_-knqwpvykaWaE94_9Auo7ss1QopdkgAAAFg29_n1A";
    let accessToken = req.body.accessToken;

    let option = {
        method : 'GET',
        uri: 'https://kapi.kakao.com/v1/user/me ',
        json : true,
        headers : {
            'Authorization': "Bearer " +  accessToken
        }
    }

    let cacaoResult = await request(option);
    let result = {};
    result.nickname = cacaoResult.properties.nickname;
    result.thumbnail_image = cacaoResult.properties.thumbnail_image;

    var nickname = cacaoResult.properties.nickname;
    var thumbnail_path = cacaoResult.properties.thumbnail_image;
    var email = cacaoResult.kaccount_email;
    var token;

    console.log('img path : ' + thumbnail_path);
    var chkToken;
    if(req.headers.authorization != undefined){
        chkToken = jwt.verify(req.headers.authorization);
    }

    // console.log()
    console.log(chkToken);
    console.log(jwt.verify(chkToken));

    let checkEmailQuery =     
    `
    select * from user
    where id = ?
    `;

    let insertQuery =                                                    
    `
    INSERT INTO user (nickname, thumbnail_path, id) 
    VALUES (?, ?, ?);
    `;
        //user정보 Insert쿼리실행
        if(chkToken != undefined){
            console.log("토큰이 있습니다");
            if(chkToken.email == email){
                console.log("성공적으로 로그인 되었습니다");
                res.status(200).send({
                    result : {
                    message : "success",
                    token : req.headers.authorization,
                    user : result
                    }
                });
            } else {
                console.log("기간이 만료되었습니다. 재발급 합니다");
                token = jwt.sign(email);
                res.status(200).send({
                    "result" : {
                    message : "your token ended and reissue new token",
                    token : token ,
                    user : result
                    }
                })
            } 
        } else{            // console.log("토큰이 없습니다");
        let checkEmail = await db.queryParamCnt_Arr(checkEmailQuery,[email]);

            if(checkEmail.length != 0){ // 다른 기기이고 회원일때 
                console.log("다른기기에서 접속했습니다");
                res.status(200).send({
                    "result" : {
                        message : "new device login",
                        token : jwt.sign(email),
                        user : result
                    }
                });
            } else{ // 다른 기기이고 회원이 아닐때
                console.log("비회원입니다.")

                await db.queryParamCnt_Arr(insertQuery, [nickname, thumbnail_path ,email]);
                let insertResult = await db.queryParamCnt_Arr(insertQuery,[nickname, thumbnail_path ,email]); 

                token = jwt.sign(email);
                console.log(token);
                
                res.status(200).send({
                    "result" : {
                        message : "sign up success",
                        token : token,
                        user : result
                    }
                })
            }
        }
    });






module.exports = router;
