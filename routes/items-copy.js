// const express = require('express');
// const router = express.Router();

// // Temporary in-memory "database"
// let items = [
//   { id: 1, title: 'Research ideas', done: 'true' },
//   { id: 2, title: 'Commit to repo', done: 'false' }
// ];

// // 1. CREATE (POST) - Add a new item
// router.post('/', (req, res) => {
//   if(req.params.title==null){
//       res.status(404).json({message:"bad request, title was empty"});
//   }  
//   else{
//     const newItem = {
//       id: items.length + 1,
//       title: req.body.title,
//       done: "false"
//     };
//     items.push(newItem);
//     res.status(201).json(newItem);
//   }
// });

// // 2. READ (GET) - Get all items
// router.get('/', (req, res) => {
//   res.json(items);
// });

// // 3. READ (GET) - Get a single item by ID
// router.get('/:id', (req, res) => {
//   const itemId = parseInt(req.params.id);
//   const item = items.find(i => i.id === itemId);
  
//   if (item) {
//     res.json(item);
//   } else {
//     res.status(404).json({ message: 'Item '+itemId+' not found' });
//   }
// });

// // 4. UPDATE (PUT) - Update an existing item
// router.put('/:id', (req, res) => {
//   const itemId = parseInt(req.params.id);
//   const item = items.find(i => i.id === itemId);

//   if (item) {
//     item.title = req.body.title || item.title;
//     item.done = req.body.done || item.done;
//     res.status(204).json({message:"Item updated to "+item.done+" successfully",item:item});
//   } else {
//     res.status(404).json({ message: 'Item '+itemId+' not found' });
//   }
// });

// // 5. DELETE - Remove an item
// router.delete('/:id', (req, res) => {
//   const itemId = parseInt(req.params.id);
//   const item = items.find(i => i.id === itemId);

//   if(item){
//     items = items.filter(i => i.id !== itemId);
//     res.status(205).json({ message: 'Item deleted successfully' });
//   }
//   else{
//     res.status(404).json({message:"Couldn't find that task"});
//   }
// });

// module.exports = router;