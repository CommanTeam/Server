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
//해당 강좌의 flag 리턴  result : 0 => 미수강, result : 1 => 수강중 result : 2 => 수강완료 
//http://ip/users/lectureHistory/{lectureID}
router.get('/:lectureID', async(req, res, next) => {
    console.log("===history_check.js ::: router('/{lectureID}')===");

    const chkToken = jwt.verify(req.headers.authorization);
    if(chkToken == -1) {
        res.status(401).send({
            message : "Access Denied"
        });
    }
    let userID = chkToken.email;

    // let userID = req.query.userID;
    let lectureID = req.params.lectureID;
    
    // console.log(userID);
    // console.log(userInfo.email);

    let checkHistoryByUserIDAndLectureID =
    `
    SELECT watched_flag 
    FROM user_history 
    WHERE user_id = ? 
    AND lecture_id = ? 
    
    `;

    var data = await db.queryParamCnt_Arr(checkHistoryByUserIDAndLectureID, [userID, lectureID]);
    // console.log(data[0]);

    if(result!=undefined){
        result = data[0].watched_flag;
    }

    res.status(200).send({
        result
    });
});





/*
 Method : Post
 */
//written by 성찬
//강의 history create
//localhost:3000/users/lectureHistory
router.post('/', async(req, res, next) => {
    console.log("===history_check.js ::: router('/')===");

    const chkToken = jwt.verify(req.headers.authorization);
    if(chkToken == -1) {
        res.status(401).send({
            message : "Access Denied"
        });
    }
    let userID = chkToken.email;
    let lectureID = req.body.lectureID;


    
    let insertQuery =
    `
    INSERT INTO user_history (user_id, lecture_id, watched_flag) VALUES (?, ?, 1);
    `;


    await db.queryParamCnt_Arr(insertQuery, [userID, lectureID]);


    res.status(200).send({
        message : "강의 history 생성"
    });


});


/*
 Method : Put
 */
//written by 성찬
//수강 완료 update
//localhost:3000/users/lectureHistory/{lectureID}
router.put('/:lectureID', async(req, res, next) => {
    console.log("===history_check.js ::: router('/{lectureID}')===");
    const chkToken = jwt.verify(req.headers.authorization);
    if(chkToken == -1) {
        res.status(401).send({
            message : "Access Denied"
        });
    }
    let userID = chkToken.email;
    let lectureID = req.params.lectureID;
    let result = 0;

    let updateLectureHistoryByUserIDAndLectureID =
    `
    UPDATE user_history 
    SET watched_flag = 2 
    WHERE user_id = ? 
    AND lecture_id = ?

    `;


    console.log(await db.queryParamCnt_Arr(updateLectureHistoryByUserIDAndLectureID, [userID, lectureID]));


    res.status(200).send({
        message : userID + "번 회원의" + lectureID + "번 강의 수강 완료"
    });
});



module.exports = router;