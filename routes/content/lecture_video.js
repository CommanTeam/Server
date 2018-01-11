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
	console.log("===lecture_video.js ::: router('/{lectureID}')===");
	const chkToken = jwt.verify(req.headers.authorization);
    if(chkToken == -1) {
        res.status(401).send({
            message : "Access Denied"
        });
    }
	let lectureID = req.params.lectureID;
	let result = {};
	let selectVideoLecutreByLectureID =

	`SELECT lv.lecture_id, l.title, l.info, l.profile_image as file_path, lv.video_id, l.priority 
	FROM lecture_video lv, lecture l 
	WHERE lv.lecture_id = l.id AND lecture_id = ?`;


	console.log('good gid');
	let data = await db.queryParamCnt_Arr(selectVideoLecutreByLectureID, lectureID);

	if( data.length > 0) {
	result.lecture_id = data[0].lecture_id;
	result.title = data[0].title;
	result.info = data[0].info;
	result.file_path = data[0].file_path;
	result.video_id = data[0].video_id;
	result.priority = data[0].priority;
	}

    res.status(200).send({
       "result" : result
    });
});




/*
 Method : Post
 */

 module.exports = router;