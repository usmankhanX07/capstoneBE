// const express = require('express');
// const router = express.Router();
// const supabase = require('../subabase.js');
// const pool = require('../daba');

// //get all
// router.get('/', async (req,res) => {
//   try{  
//       var result = await pool.query('SELECT * from tasks');
//       res.json(result.rows);
//   }
//   catch(err){
//       // console.log(err);
//       res.status(504).json({message:"There was an error in retrieving data from the DB"});
//   }
// });

// //get with criteria
// router.get('/:id', async (req,res) => {
//   try{
//     const {id} = req.params;
//     var result = await pool.query('SELECT * from tasks where id = $1',[id]);
//     if(result.rows.length==0){
//       res.status(403).json({message:"Couldn't find a task associated with that id"})
//     }else{
//       res.json(result.rows);
//     }
//   }
//   catch(err){
//     res.status(504).json({message:"Server error"});
//   }
// });


// //create a task
// router.post('/', async(req,res) => {
//   const {title} = req.body; 
//   if(!title){
//     return res.status(400).json({message:"No title was input"});
//   }
  
//   try{
//     var result = await pool.query('INSERT INTO tasks (title) VALUES ($1) returning *',[title]);
//     res.status(201).json({message:"Success!"});
//   }
//   catch(err){
//     res.status(402).json({message:"Couldn't insert the data into the DB", err:err.message});
//   }
// });

// //update a task
// router.put('/:id', async (req,res) => {
//   try{
//     const {id} = req.params;
//     const {title, completed} = req.body;
    
//     var result = await pool.query('UPDATE tasks SET title = $1, completed = $2 where id = $3',[title, completed, id]);
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
    
//     var result = await pool.query('DELETE FROM tasks WHERE id = $1',[id]);   
//     res.json({message:"Row(s) deleted successfully"});
//   }
//   catch(err){
//     console.log(err);
//     res.status(504).json({message:"Server error"});
//   }
// });

// module.exports = router;