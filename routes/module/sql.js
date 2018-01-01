const async = require('async');
const moment = require('moment');

const pool = require('../../config/dbPool.js');
const db = require('./pool.js');


module.exports = {

  findCourseByLectureID : async (...args) =>{
    const data = args[0]; // lecture ID
    let selectQuery =`
    select a.course_id 
    from all_course_info as a, user_history as u 
    where u.lecture_id = ?;
    `
    let result = await db.queryParamCnt_Arr(selectQuery,data);
    return result;
  },

  getLectureCntOfUserInCourse : async (...args) => {
    let selectQuery = `
    select count(*) 
    from all_course_info 
    where user_id=1 and course_id=1;
    `
    let result = await db.queryParamCnt_Arr(selectQuery,data);
    return result;
  },


  // 나중에 비슷한 View 생성or수정시 쿼리문 수정
  createAllCourseInfoViewQuery : async (...args) =>{
    let createQuery = `
    CREATE VIEW  comman.all_course_info AS 
    SELECT A.user_id, B.course_id, B.chapter_id, A.lecture_id 
    FROM user_history A LEFT JOIN 
    (SELECT A.id as course_id, B.chapter_id, B.lecture_id FROM course A 
      inner join (SELECT A.id as chapter_id, B.id as lecture_id 
        FROM chapter A inner join lecture B ON A.id = B.chapter_id) B) B 
        ON A.lecture_id = B.lecture_id
    `
  },

    makeNewChatRoomTable : async (...args) => {
    const name = args[0];
    var ctrl_name = name + '_' + moment().format('YYMMDDHHmmss');
    console.log(ctrl_name);
    let createAllTableQuery =
    `
    CREATE TABLE IF NOT EXISTS chat.` + ctrl_name + ` (
      chat_idx INT(11) NOT NULL AUTO_INCREMENT,
      content TEXT NULL DEFAULT NULL,
      write_time VARCHAR(45) NULL DEFAULT NULL,
      count INT(11) NULL DEFAULT NULL,
      u_idx INT(11) NULL DEFAULT NULL,
      user_photo TEXT NULL DEFAULT NULL,
      PRIMARY KEY (chat_idx))
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8;
    `;

    let checkAllTable = await db.queryParamCnt_0(createAllTableQuery);
    console.log("checkAllTable", checkAllTable);
    let insertGroupQuery = 'INSERT INTO chat.group (real_name, ctrl_name) VALUES (?,?)';
    let insertGroup = await db.queryParamCnt_Arr(insertGroupQuery, [name, ctrl_name]);
    console.log("insertGroup", insertGroup);

    //let insertJoinedQuery = 'INSERT INTO admin.joined (u_idx, g_idx) VALUES (?,?)';
    //let insertJoined = await db.queryParamCnt_Arr(insertJoinedQuery, [])
  },
  
  joinNewPerson : async (...args) => {
    const name = args[0];
    const user_name = args[1];
    let searchAllInfoQuery = 'SELECT * FROM A.user WHERE name = ?';
    let searchAllInfo = await db.queryParamCnt_Arr(searchAllInfoQuery, [user_name]);

    let insertUserInfoQuery = 'INSERT INTO C.`' + name + '` (idx, name, bio, photo) VALUES (?,?,?,?)';
    let object = [searchAllInfo.idx, searchAllInfo.name, searchAllInfo.bio, searchAllInfo.photo];
    let insertUserInfo = await db.queryParamCnt_Arr(insertUserInfoQuery, object);
  },
  findUserIndex : async (...args) => {
    let user_name = args[0];
    let searchUserIdxQuery = 'SELECT idx FROM A.user WHERE name = ?';
    let result = await db.queryParamCnt_Arr(searchUserIdxQuery, [user_name]);
    return result.user_idx;
  },
  findRestResLights : async (...args) => {
    let user_idx = args[0];
    let findUserJoinedQuery = 'SELECT * FROM A.joined WHERE user_idx = ?';
    let tables = await db.queryParamCnt_Arr(findUserJoinedQuery, [user_idx]);
    if(result.length === 0) {
      res.status(400).send({
        message : "wrong input"
      });
    } else {
      for(let i = 0 ; i < result.length ; i++) {
        let findSpecificQuery = 'SELECT * FROM ';
      }
    }
  }
};
