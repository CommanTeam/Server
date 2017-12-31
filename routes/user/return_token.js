/*
 Default module
*/
const express = require('express');
const router = express.Router();
const crypto = require('crypto-promise');
const async = require('async');
const mysql = require('mysql');
const bodyParser = require('body-parser');

/*
 Router.use
*/
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

/*
 Custom module
*/
const hash = require('../module/hash.js');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');
const secretKey = require('../../config/secretKey').key;

/*
 Variable declaration
*/

/*
 Function Sector
*/

/*
 Method : Get
*/
router.get('/', async(req, res, next) => {

    const chkToken = jwt.verify(req.headers.authorization);
    
    console.log('result : '+ chkToken);
    //토큰 검증이 성공할 경우
    if(chkToken != -1) {
        res.status(200).send({
            message : "Access Success",
            token :{
                user_id : chkToken.user_id,
                user_nickname : chkToken.user_nickname
            }
        });
    }
    else {
        res.status(401).send({
            message : "Access Denied"
        });
    }
});

/*
 Method : Post
*/


module.exports = router;