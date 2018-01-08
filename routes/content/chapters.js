

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

	let chapterID = req.query.chapterID;

	let selectChapterByChapterID =
	`
	SELECT * FROM chapter
	WHERE id = ?;
	`;

	var data = await db.queryParamCnt_Arr(selectChapterByChapterID, chapterID);

	res.status(200).send({data});

});

////used







module.exports = router;

