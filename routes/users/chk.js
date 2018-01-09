/*
 Declare module
 */
const express = require('express');
const router = express.Router();
const async = require('async');
const bodyParser = require('body-parser');



const jwt = require('../../module/jwt.js');
const db = require('../../module/pool.js');
const sql = require('../../module/sql.js');


const request = require('request-promise');

/*
Method : Get
*/
router.get('/', async(req, res, next) => {
    var token = "VTDI10s8Md7V_-knqwpvykaWaE94_9Auo7ss1QopdkgAAAFg29_n1A";

    let option = {
        method : 'GET',
        uri: 'https://kapi.kakao.com/v1/user/me ',
        json : true,
        headers : {
            'Authorization': "Bearer " +  token
        }
    }


    let cacaoResult = await request(option);
    let result = {};
    result.kaccount_email = cacaoResult.kaccount_email;
    result.nickname = cacaoResult.properties.nickname;
    result.thumbnail_image = cacaoResult.properties.thumbnail_image;

    console.log(result);
    

    /*
        .then(function (repos) {
            console.log('User has %d repos', repos.length);
        })
        .catch(function (err) {
            // API call failed...
        });
    */

    res.status(200).send({
          "msg" : " msg good gid"
      });
});

module.exports = router;