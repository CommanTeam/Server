/*
 Default module
 */
 const express = require('express');
 const router = express.Router();
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
//http://ip/users/insert_user_info

router.post('/', async(req, res, next) => {
    console.log("===insert_userinfo.js ::: router('/')===");
    const chkToken = jwt.verify(req.headers.authorization);
    if(chkToken == -1) {
        res.status(401).send({
            message : "Access Denied"
        });
    }
    var nickname = req.body.nickName;
    var thumbnail_path = req.body.thumbnailPath;
    var email = req.body.email;
    var token;

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
            // console.log("토큰이 있습니다");
            if(jwt.verify(chkToken) != -1){
                // console.log("성공적으로 로그인 되었습니다");
                res.status(200).send({
                    message : "success",
                    token : token
                });
            } else {
                // console.log("기간이 만료되었습니다. 재발급 합니다");
                token = jwt.sign(email);
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
                    token : jwt.sign(email)

                });
            } else{ // 다른 기기이고 회원이 아닐때
                // console.log("비회원입니다.")

                await db.queryParamCnt_Arr(insertQuery, [nickname, thumbnail_path ,email]);
                let insertResult = await db.queryParamCnt_Arr(insertQuery,[nickname, thumbnail_path ,email]); 

                token = jwt.sign(email);
                // console.log(token);
                
                res.status(200).send({
                    message : "sign up success",
                    token : token
                })
            }
        }
});
    


    


    module.exports = router;