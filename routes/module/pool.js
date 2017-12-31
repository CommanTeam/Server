/*
 Default module
*/
const async = require('async');

/*
 Custom module
*/
const pool = require('../config/dbPool.js');

/*
 Modularize DB Connection
*/
module.exports = {
  queryParamCnt_None : async (...args) => {
    const query = args[0];
    let result;
    try {
      var connection = await pool.getConnection();
      result = await connection.query(query) || null;
    }
    catch(err) {
      next(err);
    }
    finally {
      pool.releaseConnection(connection);
      return result;
    }
  },
  queryParamCnt_Arr : async (...args) => {
    const query = args[0];
    const data = args[1];
    let result;
    try {
      var connection = await pool.getConnection();
      result = await connection.query(query, data) || null;
    }
    catch(err) {
      next(err);
    }
    finally {
      pool.releaseConnection(connection);
      return result;
    }
  }
};
