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
//강의 id로 강좌정보 가져오기  
//http://ip/content/lectures?lectureID={lectureID}
router.get('/', async(req, res, next) => {

  let lectureID = req.query.lectureID;

  let selectLectureByLectureID =
  `
   SELECT * FROM lecture
   WHERE id = ?;
  `;

  var data = await db.queryParamCnt_Arr(selectLectureByLectureID, lectureID);

  res.status(200).send({data});

});





/*
 Method : Post
 */

 module.exports = router;