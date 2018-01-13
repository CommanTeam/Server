

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
	console.log("===chapters.js ::: router('/')===");

	const chkToken = jwt.verify(req.headers.authorization);
    if(chkToken == -1) {
        res.status(401).send({
            message : "Access Denied"
        });
    }
    let result = {}; 
	let chapterID = req.query.chapterID;
	let selectChapterByChapterID =
	`
	SELECT * FROM chapter
	WHERE id = ?;
	`;

	var data = await db.queryParamCnt_Arr(selectChapterByChapterID, chapterID);

	if( data.length > 0){
		result.id = data[0].id
		result.course_id = data[0].course_id
		result.info = data[0].info
		result.title = data[0].title
		result.priority = data[0].priority
	}

	if(data != undefined){
		result = result;
	}

	res.status(200).send({data : result});

});

////used







module.exports = router;

