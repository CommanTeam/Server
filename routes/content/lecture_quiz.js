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


//(객체 비교 function)
var compare = function( a, b ){
  var type = typeof a, i, j;
  if( type == "object" ){
    if( a === null ) return a === b;
    else if( Array.isArray(a) ){
      if( !Array.isArray(b) || a.length != b.length ) return false;
      for( i = 0, j = a.length ; i < j ; i++ ){
        if(!compare(a[i], b[i]))return false;
      }
      return true;
    }else{ //일반 오브젝트인 경우

      //우선 b의 키 갯수를 세둔다.
      j = 0;
      for( i in b ){
        if( b.hasOwnProperty(i) ) j++;
      }
      //a의 각 키와 비교하면서 카운트를 제거해간다.
      for( i in a ){
        if( a.hasOwnProperty(i) ){
          if( !compare( a[i], b[i] ) ) return false;
          j--;
        }
      }

      //남은 카운트가 0이라면 같은 객체고 남아있다면 다른 객체임
      return !j;
    }
  }
  return a === b;
};


/*
 Method : Get
 */
//written by 성찬 
//lectureID값으로 lecture(quiz) 정보들 가져옴 (퀴즈테이블과 join) 
//http://ip/content/lecturequiz/{lectureID}
router.get('/:lectureID', async(req, res, next) => {
  console.log("===lecture_quiz.js ::: router('/{lectureID}')===");
  const chkToken = jwt.verify(req.headers.authorization);
  if(chkToken == -1) {
    res.status(401).send({
      message : "Access Denied"
    });
  }
  let lectureID = req.params.lectureID;
  var quizArr = [];
  var questionArr = [];
  var object_quiz = {};
  var object_question = {};
  let selectQuizAndQuestionByLectureID =
  `
  SELECT L.id as lecture_id, L.priority as lecture_priority, LQ.id as quiz_id, LQ.title as quiz_title, LQ.explanation as explanation, LQ.image_path as quiz_image, LQ.priority as quiz_priority, Q.id as question_id, Q.content as question_content, Q.answer_flag
  FROM lecture L, lecture_quiz LQ, quiz_question Q
  WHERE L.id = LQ.lecture_id AND LQ.id = Q.quiz_id AND lecture_id = ?
  ORDER BY lecture_priority, quiz_priority
  `

  // `
  //   SELECT lq.lecture_id, lq.id as quiz_id, lq.title as quiz_title, lq.explanation, lq.image_path as quiz_image, lq.priority as quiz_priority, Q.id as question_id, Q.content, Q.answer_flag 
  //   FROM lecture_quiz lq, quiz_question Q, lecture L 
  //   WHERE lq.id=Q.quiz_id 
  //   AND lq.lecture_id = L.id
  //   AND lecture_id = ?
  //   ORDER BY lecture_id, quiz_priority
  // `;

  var data = await db.queryParamCnt_Arr(selectQuizAndQuestionByLectureID, lectureID);

  var result = [];
  var object = {};

  if(data != undefined){
    for(var i=0; i<data.length;i++){

      if(object.quizID != data[i].quiz_id){
        var object = {};
        object.quizID = data[i].quiz_id;
        object.quizTitle = data[i].quiz_title;
        object.quizPriority = data[i].quiz_priority;

        
        if(object.quizImage != undefined){
          object.quizImage = data[i].quiz_image;
        } else{
          object.quizImage = "";
        } 
        
        object.explanation = data[i].explanation;
        object.questionArr = [];
      }

      var object_question = {};
      object_question.questionID = data[i].question_id;
      object_question.questionContent = data[i].question_content;
      object_question.answerFlag = data[i].answer_flag;
      object.questionArr.push(object_question)


      if(!compare(result[result.length - 1], object)){
        result.push(object);
      }

    }
  }

  res.status(200).send({
    result : result
  });

});






/*
 Method : Post
 */

 module.exports = router;