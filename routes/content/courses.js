

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
//written By 성찬
//강좌 id로 강좌정보 가져오기  
//http://ip/content/courses?courseID={courseID}
router.get('/', async(req, res, next) => {
	console.log("===courses.js ::: router('/')===");
	const chkToken = jwt.verify(req.headers.authorization);
	if(chkToken == -1) {
		res.status(401).send({
			message : "Access Denied"
		});
	}
	let courseID = req.query.courseID;

	let result = {};
	let selectCourseByCourseID =
	`
	SELECT c.id, c.supplier_id, c.opened_chapter, c.image_path, s.name, s.thumbnail_path as supplier_thumbnail, c.title, c.info, c.price, c.category_id FROM course c, supplier s
	WHERE c.supplier_id = s.id AND c.id = ?;
	`;

	var data = await db.queryParamCnt_Arr(selectCourseByCourseID, courseID);

	if( data.length > 0){
		result.id = data[0].id;
		result.supplier_id = data[0].supplier_id;
		result.opened_chapter = data[0].opened_chapter;
		result.image_path = data[0].image_path;
		result.name = data[0].name;
		result.supplier_thumbnail = data[0].supplier_thumbnail;
		result.title = data[0].title;
		result.info = data[0].info;
		result.price = data[0].price;
		result.category_id = data[0].category_id;
	}
	

	res.status(200).send({
		"result" : result
	});

});





//written By 성찬
//강좌id로 챕터목록 반환 
//http://ip/content/courses/{courseID}/chapters
router.get('/:courseID/chapters', async(req, res, next) => {
	console.log("===courses.js ::: router('/{courseID}/chapters')===");
	const chkToken = jwt.verify(req.headers.authorization);
	if(chkToken == -1) {
		res.status(401).send({
			message : "Access Denied"
		});
	}
	
	let courseID = req.params.courseID;
	let result = [];


	let query = `
	SELECT ch.chapter_id, ch.chapter_info, ch.chapter_title, ch.chapter_priority, ch.lecture_count, c.opened_chapter 
	FROM	course c, 
	(SELECT c.id as chapter_id, c.course_id, c.info as chapter_info, c.title as chapter_title, c.priority as chapter_priority, count(*) as lecture_count 
	FROM lecture l 
	LEFT JOIN chapter c 
	ON l.chapter_id = c.id GROUP BY chapter_id)  ch 
	WHERE c.id = ch.course_id AND course_id = 2
    ORDER BY ch.chapter_priority;`

	var data = await db.queryParamCnt_Arr(query, courseID);

	if(data != undefined && data.length !=0){
		for(var i=0;i<data.length;i++){
			let chapter = {};
			chapter.chapterID = data[i].chapter_id;

			chapter.info = data[i].chapter_info;
			chapter.title = data[i].chapter_title;
			chapter.priority = data[i].chapter_priority;
			chapter.open = (i < data[0].opened_chapter || data[0].opened_chapter==-1);
			chapter.lectureCnt = data[i].lecture_count;
			result.push(chapter);
		}
}
	

	res.status(200).send({
		result: result
	});

});


module.exports = router;

