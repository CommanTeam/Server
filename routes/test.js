const express = require('express');
const router = express.Router();
const async = require('async');
const mysql = require('mysql');

const sql = require('../module/sql.js');

router.get('/:name', async(req, res, next) => {
  let name = req.params.name;
  let test = await sql.makeNewChatRoomTable(name);
  res.status(200).send({
    message : "successfully create table"
  });
});
module.exports = router;
