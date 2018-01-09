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


var Curl = require( 'node-libcurl' ).Curl;


/*
Method : Get
*/
router.get('/', function(req,res,next){
    console.log('good gid ');


    var curl = new Curl();
    curl.setOpt( 'URL', 'www.google.com' );
    curl.setOpt( 'FOLLOWLOCATION', true );
    
    
    curl.on( 'end', function( statusCode, body, headers ) {
    
        console.info( statusCode );
        console.info( '---' );
        console.info( body.length );
        console.info( '---' );
        console.info( this.getInfo( 'TOTAL_TIME' ) );
    
        this.close();
    });
    
    curl.on( 'error', curl.close.bind( curl ) );
    curl.perform();


    res.status(200).send({
          "msg" : " msg good gid"
      });
});

module.exports = router;