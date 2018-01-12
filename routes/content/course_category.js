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
 router.get('/', async(req, res, next) => {
    console.log("===course_category.js ::: router('/')===");
    const chkToken = jwt.verify(req.headers.authorization);
    if(chkToken == -1) {
        res.status(401).send({
            message : "Access Denied"
        });
    }
    
    
    let selectAllCategories =
    `
    select id, category_name from course_category
    `;


    var result = await db.queryParamCnt_None(selectAllCategories);

    if(result != undefined) {
        res.status(200).send({
            "result" : result
        });
    }else{
        res.status(500).send({
            "msg" : "Error /content/categories"
        });
    }

});

//카테고리별 course title들 
router.get('/course', async(req, res, next) => {
    console.log("===course_category.js ::: router('/course')===");
    const chkToken = jwt.verify(req.headers.authorization);
    if(chkToken == -1) {
        res.status(401).send({
            message : "Access Denied"
        });
    }
    

    var result = [];
    var object = {};


    let selectAllCategoryAndCourse =
    `SELECT cate.id as category_id, cate.category_name, course.title, cate.category_img
    FROM course course 
    JOIN course_category cate 
    ON course.category_id = cate.id 
    ORDER BY category_id`;

    var data = await db.queryParamCnt_None(selectAllCategoryAndCourse);

    for(var i=0; i<data.length;i++){

        if(object.categoryID != data[i].category_id){
            
            var object = {};
            object.categoryID = data[i].category_id;
            object.categoryName = data[i].category_name;
            object.categoryImg = data[i].category_img;
            object.title = [];
            
        }

        object.title.push(data[i].title)

        if(!compare(result[result.length - 1], object)){
            result.push(object);
        }

    }

    if(result != undefined) {
        res.status(200).send({
            "result" : result
        });
    }else{
        res.status(500).send({
            "msg" : "Error /content/categories/course"
        });
    }

});



module.exports = router;