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

    //pwd해싱 필요없음
    const hashedValue = await crypto.hash('sha512')(email);  
    const token;

    let checkEmailQuery=    
    `
        select * from user
        where id = ?
    `;
    let checkEmail = await db.queryParamCnt_Arr(checkEmailQuery,[email]);

    // 등록된 회원 x 
    if(checkEmail.length == 0){                                              
        let insertQuery =                                                    
        `
            INSERT INTO user (nickname, thumbnail_path, id) 
            VALUES (?, ?, ?);
        `;
        //user정보 Insert쿼리실행
        let insertResult = await db.queryParamCnt_Arr(insertQuery,[nickname, thumbnail_path ,email]);   


        res.status(200).send({
            "message" : " Success Register ",
            "token " : token
        });
    } else {
        // 회원
        // 회원인데 Token문제
        if(chkToken == -1) {
            token = jwt.sign(hashedValue);
            res.status(200).send({
                message : "ReIssue Token",
                token : token
            });
        }
        else{
            res.status(200).send({
                message : "Login Success",
                token : 
            });
        }
    }
});

module.exports = router;