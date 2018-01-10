

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
    let user_nickname = chkToken.nickname;
    let lectureID = req.params.lectureID;
    let result = [];

    let selectAllQnA =
    `
    SELECT * FROM comman.lecture_qna 
    WHERE l_question_lecture_id = ?;
    `;

    var data = await db.queryParamCnt_Arr(selectAllQnA, lectureID);

    if(data != undefined){
    for(var i=0; i<data.length;i++){

      var object = {};
      object.lq_id = data[i].lq_id;
      object.l_question_user_id = data[i].l_question_user_id;
      object.l_question_lecture_id = data[i].l_question_lecture_id;
      object.question_text = data[i].question_text;
      object.l_question_date = data[i].l_question_date;
      object.l_question_flag = data[i].l_question_flag;
      object.l_answer_id = data[i].l_answer_id;
      object.l_answer_question_id = data[i].l_answer_question_id;
      object.l_answer_text = data[i].l_answer_text;
      object.l_answer_date = data[i].l_answer_date;
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
//http://ip/content/lecturequestion/{lectureID}
router.post('/insertanswer', async(req, res, next) => {
    console.log("===lecture_question.js ::: router('/')===");

    const chkToken = jwt.verify(req.headers.authorization);
    if(chkToken == -1) {
        res.status(401).send({
            message : "Access Denied"
        });
    }

    let user_nickname = chkToken.nickname;
    let user_id = req.body.user_id
    let lectureID = req.body.lectureID;
    let question_text = req.body.question_text;
    let question_date  = moment().format('YYYY-MM-DD');

    let insertQusetion =
    `
    INSERT INTO lecture_question (user_id, lecture_id, question_text, question_date, flag)
    VALUES (?, ?, ?, ?, 0);
    `;

    var data = await db.queryParamCnt_Arr(insertQusetion, [user_id,lectureID,question_text, question_date]);

    res.status(200).send({
        "result" : data
    }
    );
});


// 1. flag가 NN로 해야하는가

module.exports = router;