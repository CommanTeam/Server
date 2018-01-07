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


// written by 성찬
// lectureID로 video강의 정보 가져오기
// http://ip/content/lecturevideo/{lectureID}
router.get('/:lectureID', async(req, res, next) => {

	const chkToken = jwt.verify(req.headers.authorization);
    if(chkToken == -1) {
        res.status(401).send({
            message : "Access Denied"
        });
    }
	let lectureID = req.params.lectureID;

	let selectVideoLecutreByLectureID =
	`
	SELECT id as lecture_id, title, info, file_path, lecture_type, video_id, priority AS lecture_priority 
	FROM lecture
	WHERE id = ?;

	`;

	let result = await db.queryParamCnt_Arr(selectVideoLecutreByLectureID, lectureID);


    res.status(200).send({
       result : result
    });
});




/*
 Method : Post
 */

 module.exports = router;