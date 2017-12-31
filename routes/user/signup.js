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
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');
const sql = require('../module/sql.js');

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
    let result = await sql.getLectureCntInCourese(1);
    res.status(200).send(
        result
    );
});


/*
 Method : Post
*/
router.post('/', async(req, res, next) => {
    var id = req.body.u_id;
    var pwd = req.body.u_pwd;
    var nickname = req.body.u_nickname;
    const hashedValue = await crypto.hash('sha512')(pwd);
    let selectQuery =
    `
        select * from users
        where id = ?
    `;
    let checkID = await db.queryParamCnt_Arr(selectQuery,[id]);
    if(checkID.length == 0){
        let insertQuery =
        `
            insert into users (id,pwd,hashed,nickname)
            values (?,?,?,?)
        `;

        let insertResult = await db.queryParamCnt_Arr(insertQuery,[id,pwd,hashedValue.toString('base64'),nickname]);
        res.status(200).send({
            message : " Success Register "
        });
    } else {
        res.status(401).send({
            message : " ID Already Exist "
        });
    }
});

module.exports = router;