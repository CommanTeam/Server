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
router.post('/', async(req, res, next) => {
    var nickname = req.body.nickName;
    var thumbnail_path = req.body.thumbnailPath;
    var email = req.body.email;


    res.send(200).status({
        "msg": " test"
    });

    //pwd해싱 필요없음
    //const hashedValue = await crypto.hash('sha512')(pwd);  

    let checkEmailQuery=    
    `
        select * from user
        where email = ?
    `;
    let checkEmail = await db.queryParamCnt_Arr(checkEmailQuery,[email]);


    if(checkEmail.length == 0){                                                 //등록된 email 존재 X

        let insertQuery =                                                       //user테이블에 전달받은 정보 전달
        `
            INSERT INTO user (nickname, thumbnail_path, email) 
            VALUES (?, ?, ?);
        `;

        let insertResult = await db.queryParamCnt_Arr(insertQuery,[nickname, thumbnail_path ,email]);   //usr정보 Insert쿼리실행

        //등록된 user table 전달
        let selectQuery =
        `
            SELECT * 
            FROM user
            WHERE email = ?
        `
        let result = await db.queryParamCnt_Arr(selectQuery,[email]);

        res.status(200).send({
            "message" : " Success Register ",
            "result " : result
        });
    } else {
        let selectQuery =
        `
            SELECT * 
            FROM user
            WHERE email = ?
        `
        let result = await db.queryParamCnt_Arr(selectQuery,[email]);

        res.status(401).send({
            "message" : " ID Already Exist ",
            "result " : result

        });
    }
});

module.exports = router;