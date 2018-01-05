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
//lectureID값으로 lecture 정보들 가져옴 (퀴즈테이블과 join) 
//http://ip/content/lecturequiz/{lectureID}
router.get('/:lectureID', async(req, res, next) => {

    let lectureID = req.params.lectureID;
    var quizArr = [];
    var questionArr = [];
    var object_quiz = {};
    var object_question = {};
    let selectQuizAndQuestionByLectureID =
    `
    SELECT T.lecture_id, T.id as quiz_id, T.title as quiz_title, T.explanation, T.image_path as quiz_image, T.priority as quiz_priority, Q.id as question_id, Q.question_content, Q.answer_flag 
    FROM quiz_title T, quiz_question Q, lecture L 
    WHERE T.id=Q.quiz_id 
    AND T.lecture_id = L.id
    AND lecture_id = ?
    ORDER BY lecture_id, quiz_priority
    `;


    var data = await db.queryParamCnt_Arr(selectQuizAndQuestionByLectureID, lectureID);



    var result = [];
    var object = {};

    for(var i=0; i<data.length;i++){

        if(object.quizID != data[i].quiz_id){
            var object = {};
            object.quizID = data[i].quiz_id;
            object.quizTitle = data[i].quiz_title;
            object.quizPriority = data[i].quiz_priority;
            object.quizImage = data[i].quiz_image;
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

    console.log(result);
    res.status(200).send({result : result});











    // for(var i=0; i<data.length;i++){




    //     for(테이블전체){







    //     if(quiz_id가 겹칠경우){ //==> 다른 보기를 가진 row 데이터 
    //         question객체 초기화//question = {};
    //         question관련 데이터 삽입
    //         "quiz.question"배열에 question객체 push
    //         question배열 초기화

    //     } else { //==> 다른 quiz인 데이터

    //     }
    // }








//     for(var i=0; i<data.length;i++){

//         if(object.categoryID != data[i].category_id){

//             var object = {};
//             object.categoryID = data[i].category_id;
//             object.categoryName = data[i].category_name;
//             object.title = [];
//         }

//         object.title.push(data[i].title)

//         if(!compare(result[result.length - 1], object)){
//             result.push(object);
//         }

//     }


//     if(!compare(result[result.length - 1], object)){
//         result.push(object);
//     }

// }



});






/*
 Method : Post
 */

 module.exports = router;