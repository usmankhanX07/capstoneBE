const express = require('express');
const router = express.Router();
const supabase = require('../subabase.js');
const pool = require('../daba');
const { scrapeBooksFromSite } = require('../scraper/src/index');    ///scraper/src/index.js

router.post('/scraper', async(req,res) =>{
  try{
    const scrapedBooks = await scrapeBooksFromSite();
    console.log("Successfully scraped");
    for(var book of scrapedBooks){
        await pool.query(
          'INSERT INTO Books (title,price,rating) values ($1,$2,$3)',
          [book.title, book.price, book.rating]
        );
    }
    res.status(200).json({message:"Scraping successful",count:scrapedBooks.length});
} catch (err) {
      res.status(500).json({message: "Scraping was  unsuccessful"});
  }
});

//get all
router.get('/', async (req,res) => {
  try{  
      var result = await pool.query('SELECT * from books');
      res.json(result.rows);
  }
  catch(err){
      // console.log(err);
      res.status(504).json({message:"There was an error in retrieving data from the DB"});
  }
});

//get with criteria
router.get('/:id', async (req,res) => {
  try{
    const {id} = req.params;
    var result = await pool.query('SELECT * from books where id = $1',[id]);
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


//create a task
router.post('/', async(req,res) => {
  const {title, price, rating} = req.body; 

  if(!title || !price || !rating){
    return res.status(400).json({message:"No title was input"});
  }
  else{
    try{
      var result = await pool.query('INSERT INTO books (title, price, rating) VALUES ($1, $2, $3) returning *',[title, price, rating]);
      res.status(201).json({message:"Success!"});
    }
    catch(err){
      res.status(402).json({message:"Couldn't insert the data into the DB", err:err.message});
    }
  }
});

//update a task
router.put('/:id', async (req,res) => {
  try{
    const {id} = req.params;
    const {title, price, rating} = req.body;
    
    var result = await pool.query('UPDATE books SET title = $1, price = $2, rating = $3 where id = $4',[title, price, rating, id]);
    res.status(202).json({message:'Successfully updated the row(s)'});
  }
  catch(err){
    console.log(err);
    res.status(504).json({message:"Server error"});
  }
});

router.delete('/:id', async (req,res) => {
  try{
    const {id} = req.params;
    
    var result = await pool.query('DELETE FROM books WHERE id = $1',[id]);   
    res.json({message:"Row(s) deleted successfully"});
  }
  catch(err){
    console.log(err);
    res.status(504).json({message:"Server error"});
  }
});

module.exports = router;