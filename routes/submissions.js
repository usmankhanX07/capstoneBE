const express = require('express');
const router = express.Router();
const supabase = require('../subabase.js');
const pool = require('../daba.js');
var cors = require("cors");
const { z } = require('zod');
const rateLimit = require('express-rate-limit');

router.use(cors());


// routes/submissions.js
router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// // Inside routes/submissions.js
// const origin = req.get('origin') || req.get('referer');

// const widgetResult = await pool.query('SELECT domain FROM widgets WHERE id = $1', [widgetId]);
// if (widgetResult.rows.length === 0) {
//   return res.status(404).json({ error: 'Invalid Widget ID' });
// }

// // Ensure submission comes from the authorized domain
// const registeredDomain = widgetResult.rows[0].domain; // e.g., "http://127.0.0.1:5500"
// if (origin && !origin.includes(registeredDomain)) {
//   return res.status(403).json({ error: 'Unauthorized domain for this widget' });
// }

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
      let location = "nully";
      try {
      const geoRes = await fetch(`https://ipapi.co/${req.ip}/json/`);
      if (geoRes.ok) {
          const geoData = await geoRes.json();
          location = `${geoData.city}, ${geoData.country_name}`;
        }
      } catch (e) {
        console.log('Geo enrichment failed, continuing anyway...');
      }

      await pool.query(
        'INSERT INTO submissions (widget_id, sender_name, sender_email, message, geo_location) values ($1,$2,$3,$4,$5)',
        [validated.widgetId, validated.name, validated.email, validated.message, location]   //check if zod attributes match with this
      );
      res.status(202).json({uuid:validated.widgetId, name:validated.name, location:location, mail:validated.email, message:validated.message})
    }catch(err){
      res.status(402).json({message:"Couldn't insert the data into the DB", err:err.message});
    }
});

// const { scrapeBooksFromSite } = require('../scraper/src/index');    ///scraper/src/index.js


// router.post('/scraper', async(req,res) =>{
//   try{
//     const scrapedBooks = await scrapeBooksFromSite();
//     console.log("Successfully scraped");
//     for(var book of scrapedBooks){
//         await pool.query(
//           'INSERT INTO Books (title,price,rating) values ($1,$2,$3)',
//           [book.title, book.price, book.rating]
//         );
//     }
//     res.status(200).json({message:"Scraping successful",count:scrapedBooks.length});
// } catch (err) {
//       res.status(500).json({message: "Scraping was  unsuccessful"});
//   }
// });

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


// //create a task
// router.post('/', async(req,res) => {
//   const {title, price, rating} = req.body; 

//   if(!title || !price || !rating){
//     return res.status(400).json({message:"No title was input"});
//   }
//   else{
//     try{
//       var result = await pool.query('INSERT INTO books (title, price, rating) VALUES ($1, $2, $3) returning *',[title, price, rating]);
//       res.status(201).json({message:"Success!"});
//     }
//     catch(err){
//       res.status(402).json({message:"Couldn't insert the data into the DB", err:err.message});
//     }
//   }
// });

// //update a task
// router.put('/:id', async (req,res) => {
//   try{
//     const {id} = req.params;
//     const {title, price, rating} = req.body;
    
//     var result = await pool.query('UPDATE books SET title = $1, price = $2, rating = $3 where id = $4',[title, price, rating, id]);
//     res.status(202).json({message:'Successfully updated the row(s)'});
//   }
//   catch(err){
//     console.log(err);
//     res.status(504).json({message:"Server error"});
//   }
// });

// router.delete('/:id', async (req,res) => {
//   try{
//     const {id} = req.params;
    
//     var result = await pool.query('DELETE FROM books WHERE id = $1',[id]);   
//     res.json({message:"Row(s) deleted successfully"});
//   }
//   catch(err){
//     console.log(err);
//     res.status(504).json({message:"Server error"});
//   }
// });

module.exports = router;