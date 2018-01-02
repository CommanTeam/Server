

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
//강좌id로 챕터목록 반환
//http://ip/content/courses/{courseID}/chapters
router.get('/:courseID/chapters', async(req, res, next) => {
	let courseID = req.params.courseID;

	let selectChapterByCourseId =
    `
        select id as chapter_id, course_id, info, title, priority from comman_db.chapter where course_id = ? order by priority asc
    `;

    var data = await db.queryParamCnt_Arr(selectChapterByCourseId, courseID);

    res.status(200).send({
        data
    });

});

module.exports = router;

