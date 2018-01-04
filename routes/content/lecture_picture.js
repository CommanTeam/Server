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
//written by 형민
//강의ID로 강의img, 다음 단원ID 반환
//http://ip/content//lecturepicture/{lectureID}
// router.get('/:lectureID', async(req, res, next) => {

//     let lectureID = req.params.lectureID;
//     let result = {};

//     let getImageUrlbyLectureID =
//     `SELECT image_path
//     FROM comman_db.lecture as l,
//     comman_db.quiz_title as q  
//     WHERE l.id = q.lecture_id 
//     AND l.id = ?;
//     `;

//     let getChapterIDbyLectureID = 
//     `SELECT ch.id AS ch_id
//     FROM chapter AS ch, lecture AS l
//     WHERE ch.id = l.chapter_id
//     AND l.id = ?
//     `

//     let imageUrlbylectureID = await db.queryParamCnt_Arr(getImageUrlbyLectureID, lectureID);
//     let chapterIDbylectureID = await db.queryParamCnt_Arr(getChapterIDbyLectureID, lectureID);

//     let nextChpaterID = chapterID + 1; //챕터 아이디를 렉쳐아이디당 챕터ID를 다시 구해주는 쿼리를 만들어야하는가 ==> //아님 포스트로 만들어서 ChapterID도 ㅏㄷ아야하는가 
    

//     // if(!data.length==0){
//     //     result = 1;
//     // }


// result.imageUrlbylectureID = imageUrlbylectureID;
// result

//     res.status(200).send({
//         result ={                       //객체 문법 이거 가능? 
//             imageUrlbylectureID;        
//         },
//         {
//             nextChpaterID;
//         }
//     });
// });






/*
 Method : Post
 */

 module.exports = router;