

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
//챕터id로 챕터정보 가져오기  
//http://ip/content/chapters?chapterID={chapterID}
router.get('/', async(req, res, next) => {

	const chkToken = jwt.verify(req.headers.authorization);
    if(chkToken == -1) {
        res.status(401).send({
            message : "Access Denied"
        });
    }

	let chapterID = req.query.chapterID;

	let selectChapterByChapterID =
	`
	SELECT * FROM chapter
	WHERE id = ?;
	`;

	var data = await db.queryParamCnt_Arr(selectChapterByChapterID, chapterID);

	res.status(200).send({data});

});


//written By 성찬
//챕터id로 챕터정보 가져오기  
//http://ip/content/chapters/nextChapter?courseID={courseID}
router.get('/nextChapter', async(req, res, next) => {

	const chkToken = jwt.verify(req.headers.authorization);
    if(chkToken == -1) {
        res.status(401).send({
            message : "Access Denied"
        });
    }

	let courseID = req.query.courseID;

	let selectNextChatperIDByCourseID =
	`
	SELECT id as chapter_id FROM comman_db.chapter WHERE course_id = 1 ORDER BY priority;
	`;

	var orderedChapterID = await db.queryParamCnt_Arr(selectNextChatperIDByCourseID, courseID);

	for(var i=0;i<data.length;i++){
		data.push(orderedChapterID[i].chapter_id.toString());
	}


    //현재 lecture의 index값 구하기 
    var currentIndex = data.indexOf(lectureID.toString());
    var nextLectureID = data[currentIndex+1];
    if(nextLectureID != undefined){
    	result = data[currentIndex+1];
    } else{
    	result = -1;
    }



    res.status(200).send({data});

});





module.exports = router;

