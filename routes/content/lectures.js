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
	let result = [];
	let selectLectureByLectureID =
	`
	select count(*)
	from lecture_quiz as lq
	where lq.lecture_id = ?
	`;

	var data = await db.queryParamCnt_Arr(selectLectureByLectureID, lectureID);

	data = data[0].cnt * 0.8;

	if(data!=undefined){
		result = data;
	}

	res.status(200).send({data : result});

});





/*
 Method : Post
 */

 module.exports = router;