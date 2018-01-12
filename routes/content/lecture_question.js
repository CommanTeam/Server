


/*
 Declare module
 */
 const express = require('express');
 const router = express.Router();
 const async = require('async');
 const moment = require('moment');

 const bodyParser = require('body-parser');

/*
 Custom module
 */
 const jwt = require('../../module/jwt.js');
 const db = require('../../module/pool.js');
 const sql = require('../../module/sql.js');



//written by 형민
//lectureID로 질문, 답변 가져오기
//http://ip/content/lecturequestion/{lectureID}
router.get('/:lectureID', async(req, res, next) => {

    console.log("===lecture_question.js ::: router('/')===");

    const chkToken = jwt.verify(req.headers.authorization);
    if(chkToken == -1) {
        res.status(401).send({
            message : "Access Denied"
        });
    }
    let user_ID = chkToken.email;
    let lectureID = req.params.lectureID;
    let result = [];

    let selectAllQnA =
    `
    SELECT lqa.*, ac.*,u.*
    FROM user u, lecture_question_answer lqa, 
    (SELECT lecture_id, supplier_id, name as supplier_name FROM all_course ac, supplier s WHERE ac.supplier_id = s.id) ac
    where u.id = lqa.user_id
    and lqa.lecture_id = ac.lecture_id
    and lqa.lecture_id = ?
    order by lecture_question_id desc
    `;

    var data = await db.queryParamCnt_Arr(selectAllQnA, lectureID);

    if(data != undefined){
    for(var i=0; i<data.length;i++){

      var object = {};
      object.lq_id = data[i].lecture_question_id;
      object.l_question_user_nickname = data[i].nickname;
      object.l_question_lecture_id = data[i].lecture_id;
      object.question_text = data[i].question_text;
      object.l_question_date = data[i].question_date;
      object.l_question_flag = data[i].flag;
      object.l_answer_id = data[i].lecture_answer_id;
      object.l_answer_question_id = data[i].lecture_question_id;
      object.l_answer_text = data[i].answer_text;
      object.l_answer_date = data[i].answer_date;
      object.supplier_name = data[i].supplier_name;
    result.push(object);
    }
  }

    res.status(200).send({
        "result" : result
    }
    );
});



//written by 형민
//lectureID로 질문 DB에 INSERT
//http://ip/content/lecturequestion/insertquestion/{lectureID}
router.post('/insertquestion', async(req, res, next) => {
    console.log("===lecture_question.js ::: router('/')===");

    const chkToken = jwt.verify(req.headers.authorization);
    if(chkToken == -1) {
        res.status(401).send({
            message : "Access Denied"
        });
    }
    let result = {};
    let user_id = chkToken.email;     
    let lectureID = req.body.lectureID;
    let question_text = req.body.question_text;


    let qestion_year = moment().format('YYYY');
    let qestion_month = moment().format('MM');
    let qestion_day = moment().format('DD');

    let question_date = qestion_year + "." + qestion_month + "." + qestion_day ;
    
    let insertQusetion =
    `
    INSERT INTO lecture_question (user_id, lecture_id, question_text, question_date, flag)
    VALUES (?, ?, ?, ?, 0);
    `;

    var data = await db.queryParamCnt_Arr(insertQusetion, [user_id,lectureID,question_text, question_date]);

    let SelectQusetion =
    `
    SELECT * 
    FROM comman.lecture_question 
    WHERE lecture_id = ?
    AND question_text = ?
    order by id desc

    `;

    var InsertData = await db.queryParamCnt_Arr(SelectQusetion, [lectureID,question_text]);

    result.questionID = InsertData[0].id;
    result.user_id = InsertData[0].user_id; 
    result.lecture_id = InsertData[0].lecture_id; 
    result.question_text = InsertData[0].question_text; 
    result.question_date = InsertData[0].question_date; 
    result.flag = InsertData[0].flag; 


    res.status(200).send({
        result : result
    }
    );
});


// 1. flag가 NN로 해야하는가

module.exports = router;
