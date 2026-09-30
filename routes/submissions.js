const express = require('express');
const router = express.Router();
const supabase = require('../subabase.js');
const pool = require('../daba.js');
var cors = require("cors");
const { z } = require('zod');
const rateLimit = require('express-rate-limit');

router.use(cors({ origin: '*' }))

router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const submissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute window
  max: 10, // Max 10 requests per IP per 15 minutes
  message: { error: 'Too many submissions from this IP, please try again later.' }
});

const submissionSchema = z.object({
    widgetId: z.uuid(),
    name: z.string().min(1).max(50),
    message: z.string().max(1000),
    email: z.string().max(20)
});

router.post('/', submissionLimiter, async(req,res) => {
  try {
      const validated = submissionSchema.parse(req.body);
      console.log('validated by zod successfully')

      let location = "Unknown";

      try {
        const widgetResult = await pool.query('SELECT domain FROM widgets WHERE id = $1', [validated.widgetId]);
        if (widgetResult.rows.length === 0) {
          return res.status(404).json({ error: 'Invalid Widget ID' });
        }
        const registeredDomain = widgetResult.rows[0].domain; // e.g., "http://127.0.0.1:5500"

        const origin = req.get('origin') || req.get('referer');
        if (!origin) {
          return res.status(403).json({error:'Unauthorized domain for this widget'});
        }

        const requestOrigin = new URL(origin).origin;
        const allowedOrigin = new URL(registeredDomain).origin;

        if (requestOrigin !== allowedOrigin) {
          return res.status(403).json({ error: 'Unauthorized domain for this widget' });
        }
      }catch(e) {
        console.log(e)
      }


      try {
        const geoRes = await fetch(`https://ipapi.co/${req.ip}/json/`);
        if (geoRes.ok) {
            const geoData = await geoRes.json();
            location = `${geoData.city}, ${geoData.country_name}`;
          }
      } catch (e) {
        console.log(e);
      }

      await pool.query(
        'INSERT INTO submissions (widget_id, sender_name, sender_email, message, geo_location) values ($1,$2,$3,$4,$5)',
        [validated.widgetId, validated.name, validated.email, validated.message, location] 
      );
      console.log({uuid:validated.widgetId, name:validated.name, location:location, mail:validated.email, message:validated.message})
    }catch(err){
      res.status(402).json({message:"Couldn't insert the data into the DB", err:err.message});
    }
});

//get all
router.get('/', async (req,res) => {
  try{  
      var result = await pool.query('SELECT * from submissions');
      return res.json(result.rows);
  }
  catch(err){
      res.status(504).json({message:"There was an error in retrieving data from the DB"});
  }
});

//get with criteria
router.get('/:id', async (req,res) => {
  try{
    const {id} = req.params;
    var result = await pool.query('SELECT * from submissions where id = $1',[id]);
    if(result.rows.length==0){
      res.status(403).json({message:"Couldn't find a task associated with that id"})
    }else{
      res.json(result.rows);
    }
  }
  catch(err){
    res.status(504).json({message:"Server error"});
  }
});

router.delete('/:id', async (req,res) => {
  try{
    const {id} = req.params;
    
    var result = await pool.query('DELETE FROM submissions WHERE id = $1',[id]);   
    res.json({message:"Row(s) deleted successfully"});
  }
  catch(err){
    console.log(err);
    res.status(504).json({message:"Server error"});
  }
});

module.exports = router;