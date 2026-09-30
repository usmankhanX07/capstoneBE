const express = require('express');
const router = express.Router();
const cors = require('cors');
const pool = require('../daba.js');

const corsOptions = {
  origin: process.env.DASHBOARD_URL || 'http://127.0.0.1:5500'
};

router.use(cors(corsOptions));

router.get('/', async (req,res) => {
  try{  
      var result = await pool.query('SELECT * from widgets');
      return res.json(result.rows);
  }
  catch(err){
      res.status(504).json({message:"There was an error in retrieving data from the DB"});
  }
});

module.exports = router;