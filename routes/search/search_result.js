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
 Method : Post
*/


//written by 형민
//강좌 카테고리 클릭 시 강좌 목록 view
//http://ip/search/searchresulte/{categoryID}
router.get('/:categoryID', async(req, res, next) => {
    let category_ID = req.params.categoryID

    let selectQuery =
    `  
        select c.id as courseID, c.title as courseTitle, c.image_path as courseImg, c.info as courseInfo, c.hit as courseHit
        from comman_db.course as c, comman_db.course_category as s
        where c.category_id = s.id
        and s.id = ?
        order by c.hit desc
        ;
    `;

    let result = await db.queryParamCnt_Arr(selectQuery,category_ID);
    
    res.status(200).send({
        "result" : result
    });
});




module.exports = router;