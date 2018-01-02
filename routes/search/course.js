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


/*
 Variable declaration
*/

/*
 Function Sector
*/

/*
 Method : Get
*/


router.post('/', async(req, res, next) => {

    let searchWord = req.body.search;
    let searcher = new hangul.Searcher(searchWord);
    let result = [];
    
    let selectAllCourse =
    `
        SELECT id, title, info, image_path FROM comman_db.course;
    `;


    var data = await db.queryParamCnt_None(selectAllCourse);
    

    for(var i=0;i<data.length;i++){
        let course = {};
        if(searcher.search(data[i].title) >= 0){
            course.id = data[i].id;
            course.title = data[i].title;
            course.info = data[i].info;
            course.image_path = data[i].image_path;

            result.push(course);
        }
    }

    res.status(200).send(
        result
    );
    

});




module.exports = router;