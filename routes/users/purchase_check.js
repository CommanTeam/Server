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






/*
 Method : Get
 */
//written by 성찬
//구매한 강좌인지 체크  return 0: 구매안한 강좌, return 1: 구매함
//localhost:3000/users/purchase/{courseID}
router.get('/:courseID', async(req, res, next) => {
    console.log("===purchase_check.js ::: router('/{courseID}')===");
    const chkToken = jwt.verify(req.headers.authorization);
    if(chkToken == -1) {
        res.status(401).send({
            message : "Access Denied"
        });
    }

    let userID = chkToken.email;

    let courseID = req.params.courseID;
    let result = 0;

    let checkPurchaseByUserIDAndCourseID =
    `
    SELECT purchase_flag 
    FROM user_register 
    WHERE user_id = ? 
    AND course_id = ?
    `;

    var data = await db.queryParamCnt_Arr(checkPurchaseByUserIDAndCourseID, [userID, courseID]);
    console.log("purchase check data ==> " + data[0]);

    if(data != undefined && data.length !=0){
        result = data[0].purchase_flag;
    }
    res.status(200).send({result});
});



/*
 Method : Put
 */
//written by 성찬
//구매 행위 API
//localhost:3000/users/purchase/{courseID}
router.put('/:courseID', async(req, res, next) => {
    console.log("===purchase_check.js ::: router('/{courseID}')===");
    const chkToken = jwt.verify(req.headers.authorization);
    if(chkToken == -1) {
        res.status(401).send({
            message : "Access Denied"
        });
    }

    let userID = chkToken.email;
    let courseID = req.params.courseID;
    let result = 0;

    let updatePurchaseByUserIDAndCourseID =
    `
    UPDATE user_register 
    SET purchase_flag = 1 
    WHERE user_id = ?
    AND course_id = ?
    `;

    var data = await db.queryParamCnt_Arr(updatePurchaseByUserIDAndCourseID, [userID, courseID]);
    res.status(200).send({
        message : "구매 성공"
    });
});


 module.exports = router;