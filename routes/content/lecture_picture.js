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
//강의ID로 강의imgPath를 강의 우선순위에 따라 정렬, 다음 단원ID 반환
//http://ip/content/lecturepicture/lectureimgUrl?courseID={courseID}&lectureID={lectureID}
router.get('/lectureimgUrl', async(req, res, next) => {
	console.log("===lecture_picture.js ::: router('/lectureimgUrl')===");
	const chkToken = jwt.verify(req.headers.authorization);
    if(chkToken == -1) {
        res.status(401).send({
            message : "Access Denied"
        });
    }
	let courseID = req.query.courseID;
	let lectureID = req.query.lectureID;
	var lectureImageArr = [];
	var object_lectureImage = {};
	var nextlecID = [];
	var result = {};
	let getImageUrlbyLectureID =
	`SELECT image_path
	FROM comman_db.lecture as l,
	comman_db.lecutre_image as li  
	WHERE l.id = li.lecture_id 
	AND l.id = ?
	order by  li.priority;
	`;
	let data = await db.queryParamCnt_Arr(getImageUrlbyLectureID, lectureID);


	for(var i=0; i<data.length;i++){ 
		lectureImageArr.push(data[i].image_path);
	}

	var selectAllLectureIDInCourse=`
	SELECT l.id as lecture_id 
	FROM course c, chapter ch, lecture l 
	WHERE c.id=ch.course_id 
	AND ch.id=l.chapter_id 
	AND course_id = ? 
	ORDER BY ch.priority, l.priority;
	`;


	let orderedLectureID = await db.queryParamCnt_Arr(selectAllLectureIDInCourse, courseID);



	for(var i=0;i<orderedLectureID.length;i++){
		nextlecID.push(orderedLectureID[i].lecture_id.toString());
	}

	var currentIndex = nextlecID.indexOf(lectureID.toString());
	var nextLectureID = nextlecID[currentIndex+1];
	if(nextLectureID != undefined){
		nextLectureID = nextlecID[currentIndex+1];
	} else{
		nextLectureID = -1;
	}


	result.lectureImageUrlArr = lectureImageArr;
	result.nextLectureID = nextLectureID;

	console.log(result);
	res.status(200).send({
		"result" : result
	});







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
});


// written by 성찬
// lectureID로 image강의 정보 가져오기
// http://ip/content/lecturepicture/{lectureID}
router.get('/:lectureID', async(req, res, next) => {
	console.log("===lecture_picture.js ::: router('/{lectureID}')===");
	const chkToken = jwt.verify(req.headers.authorization);
    if(chkToken == -1) {
        res.status(401).send({
            message : "Access Denied"
        });
    }
	let lectureID = req.params.lectureID;
	let result = [];
	let selectLectureByUserID = `SELECT  lp.lecture_id, l.title, lp.priority, lp.image_path 
	FROM lecture_picture lp, lecture l
	WHERE lp.lecture_id = l.id AND lecture_id = ?
	ORDER BY priority`;

	let data = await db.queryParamCnt_Arr(selectLectureByUserID, lectureID);
	// console.log(data);

	if(data != undefined){
		result = data;
	}

	res.status(200).send({
		result : result
	});
});




/*
 Method : Post
 */

 module.exports = router;