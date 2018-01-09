/*
 Default module
 */
 const express = require('express');
 const router = express.Router();
 const async = require('async');
 const bodyParser = require('body-parser');
 const hangul = require('hangul-js');

/*
 Router.use
 */
 router.use(bodyParser.json());
 router.use(bodyParser.urlencoded({ extended: false }));

/*
 Custom module
 */
 const jwt = require('../../module/jwt.js');
 const db = require('../../module/pool.js');
 const sql = require('../../module/sql.js');



//written by 성찬
//강좌 검색
//http://ip/search/courses
//reqBody : search
router.post('/', async(req, res, next) => {
    console.log("===course.js ::: router('/')===");
    const chkToken = jwt.verify(req.headers.authorization);
    if(chkToken == -1) {
        res.status(401).send({
            message : "Access Denied"
        });
    }
    let searchWord = req.body.search;
    let searcher = new hangul.Searcher(searchWord);
    let result = [];
    
    let selectAllCourse =
    `
    SELECT c.id, c.title, c.info, c.image_path, ur.hit
    FROM course c LEFT JOIN (SELECT course_id, count(*) as hit FROM comman.user_register group by course_id) ur
    ON c.id = ur.course_id
    ORDER BY hit DESC
    `;


    var data = await db.queryParamCnt_None(selectAllCourse);


    // console.log(data);


    if(data != undefined){
        for(var i=0;i<data.length;i++){
            let course = {};
            if(searcher.search(data[i].title) >= 0){
                course.id = data[i].id;
                course.title = data[i].title;
                course.info = data[i].info;
                course.image_path = data[i].image_path;
                course.hit = data[i].hit;

                result.push(course);
            }
        }
    }

    res.status(200).send({
        "result" : result
    }
    );
});
////used



//written by 성찬
//강좌 검색
//http://ip/search/courses
//reqBody : search
router.get('/categories/:categoryID', async(req, res, next) => {
    console.log("===course.js ::: router('/categories/{categoryID}')===");
    const chkToken = jwt.verify(req.headers.authorization);
    if(chkToken == -1) {
        res.status(401).send({
            message : "Access Denied"
        });
    }
    let categoryID = req.params.categoryID;
    let result = [];
    
    let selectCourseByCategoryID =
    `
    SELECT c.id, c.title, c.info, c.image_path, ur.hit, c.category_id
    FROM (SELECT * FROM course WHERE category_id = ?) c 
    LEFT JOIN
    (SELECT course_id, count(*) AS hit 
    FROM user_register GROUP BY course_id) ur
    ON c.id = ur.course_id
    ORDER BY hit
    DESC
    `;



    var data = await db.queryParamCnt_Arr(selectCourseByCategoryID, categoryID);
    

    for(var i=0;i<data.length;i++){
        let course = {};
        course.id = data[i].id;
        course.title = data[i].title;
        course.info = data[i].info;
        course.image_path = data[i].image_path;
        course.hit = data[i].hit;

        result.push(course);
        
    }

    res.status(200).send({
        "result" : result
    }
    );
});







module.exports = router;