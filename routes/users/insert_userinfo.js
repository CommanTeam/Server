/*
 Default module
 */
 const express = require('express');
 const router = express.Router();
 const crypto = require('crypto-promise');
 const async = require('async');
 const bodyParser = require('body-parser');

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
//http://ip/users/insert_usr_info/

router.post('/', async(req, res, next) => {
    var nickname = req.body.nickName;
    var thumbnail_path = req.body.thumbnailPath;
    var email = req.body.email;
    var checkToken = req.headers.authorization;

    var token;

    var hashedValue = await crypto.hash('sha512')(email);

    let checkEmailQuery=    
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


        if(checkToken != undefined){
            // console.log("토큰이 있습니다");
            if(jwt.verify(checkToken) != -1){
                // console.log("성공적으로 로그인 되었습니다");
                res.status(200).send({
                    message : "success",
                    token : token
                });
            } else {
                // console.log("기간이 만료되었습니다. 재발급 합니다");
                token = jwt.sign(hashedValue);
                res.status(200).send({
                    message : "your token ended and reissue new token",
                    token : token
                })
            } 
        } else{
            // console.log("토큰이 없습니다");
            let checkEmail = await db.queryParamCnt_Arr(checkEmailQuery,[email]);

            if(checkEmail.length != 0){ // 다른 기기이고 회원일때 
                // console.log("다른기기에서 접속했습니다");
                res.status(200).send({
                    message : "new device login",
                    token : jwt.sign({ email : hashedValue})
                });
            } else{ // 다른 기기이고 회원이 아닐때
                // console.log("비회원입니다.")

                await db.queryParamCnt_Arr(insertQuery, [nickname, thumbnail_path ,email]);
                let insertResult = await db.queryParamCnt_Arr(insertQuery,[nickname, thumbnail_path ,email]); 

                token = jwt.sign(hashedValue);
                // console.log(token);
                
                res.status(200).send({
                    message : "sign up success",
                    token : token
                })
            }

        }

    // 등록된 회원 x 
    // if(checkEmail.length == 0){                                              
    //     let insertQuery =                                                    
    //     `
    //     INSERT INTO user (nickname, thumbnail_path, id) 
    //     VALUES (?, ?, ?);
    //     `;
    //     //user정보 Insert쿼리실행
    //     let insertResult = await db.queryParamCnt_Arr(insertQuery,[nickname, thumbnail_path ,email]);   


    //     msg

    //     token

    //     res.status(200).send({
    //         "message" : " Success Register ",
    //         "token " : token
    //     });
    // } else {
    //     // 회원
    //     const chkToken = jwt.verify(req.headers.authorization);
    //     // 회원인데 Token문제
    //     if(chkToken == -1) {
    //         token = jwt.sign(hashedValue);
    //         res.status(200).send({
    //             message : "ReIssue Token",
    //             token : token
    //         });
    //     }
    //     else{
    //         res.status(200).send({
    //             message : "Login Success",
    //             token : token
    //         });
    //     }
    // }

});
    // console.log(token);
    




    // if(토큰있냐){
    //     if(토큰 일치하냐){ // 정상사용자가 원래기기에서 토큰이 만료되지 않은 상태에서 접근 
    //         로그인되는거고

    //     } else{ // 정상사용자가 원래기기에서 토큰이 만료됨
    //         토큰 재발급
    //     }
    // } else {
    //     if(회원이냐){ // 다른기기일
    //         토큰 발급
    //     }else{ //
    //         회원가입해서 토큰발급해줘야됨
    //     }
    // }

    // console.log("here is token " + jwt.sign(hashedValue));

    


    module.exports = router;