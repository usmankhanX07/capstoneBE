const express = require('express');
const router = express.Router();
const cors = require('cors');

// Only allow requests coming from your dashboard frontend (e.g. Live Server or React app)
const corsOptions = {
  origin: 'http://127.0.0.1:5500' 
};

router.use(cors(corsOptions));

router.get('/my-widgets', async (req, res) => {
  // Return tenant's widgets
});

module.exports = router;