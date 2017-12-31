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

 

/*
    같은 기능이다.
    router.post('/', async function (req, res, next) {
        ==> functin 대신 '=>'
 */
router.post('/', async(req, res, next) => {
    var id = req.body.u_id;
    var pwd = req.body.u_pwd;
    const hashedValue = 
    await crypto.hash('sha512')(pwd);
    // let hashedValue = hash.encoding(pwd);
    let selectQuery = 
    `
        select nickname from users
        where id = ? and hashed = ?
    `;
    // Returns the User's Nickname
    let result = await db.queryParamCnt_Arr(selectQuery,[id,hashedValue.toString('base64')]);
    if( result.length == 0){
        res.status(404).send({
            stat: " Login Fail "
        });
    }
    else{
        const token = jwt.sign(id,result[0].nickname);
        res.status(200).send({
            msg : " Login Success",
            token : token
        });
    }    
});

module.exports = router;
