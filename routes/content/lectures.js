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
//written By 성찬 -> 기용 수정
//강의 id로 강의정보 가져오기  
//http://ip/content/lectures?lectureID={lectureID}
router.get('/', async(req, res, next) => {
	console.log("===lectures.js ::: router('/')===");
	const chkToken = jwt.verify(req.headers.authorization);
	if(chkToken == -1) {
		res.status(401).send({
			message : "Access Denied"
		});
	}
	let lectureID = req.query.lectureID;
	let result = {};
	let selectLectureByLectureID =
	`
	select l.id, l.chapter_id, l.title, l.type as lecture_type, l.profile_image as file_path, l.priority, l.info, count(*) as pass_value
	from lecture as l, lecture_quiz as lq
	where l.id = lq.lecture_id
	and lq.lecture_id = ?
	`;

	var data = await db.queryParamCnt_Arr(selectLectureByLectureID, lectureID);

	if ( data[0].type == 2){
		let selectQuery = `
		select lv.video_id, lv.play_time
		from lecture as l, lecture_video as lv
		where l.id = lv.lecture_id
		and l.id = ?
		`
		var _data = await db.queryParamCnt_Arr(selectQuery,lectureID);
		data[0].video_id = _data[0].video_id;
		data[0].playTime = _data[0].play_time;

	}else{
		data[0].video_id = "";
		data[0].playTime = -1;
	}
	
	if(data!=undefined){
		result = data;
	}

	res.status(200).send({
		"data" : data[0]
	});

});





/*
 Method : Post
 */

 module.exports = router;