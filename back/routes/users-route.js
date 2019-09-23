const express = require('express');
const router = express.Router();
const { requireAuth } = require('../utils')

router.use(requireAuth)
router.get('/me', async (req, res) => {
  try {
    const assos = await req.user.getAssos({ 
      attributes: ['id', 'name'],
    }).map((asso) => { return { id: asso.id, name: asso.name } })

    const user = {
      id: req.user.id,
      displayName: req.user.displayName,
      email: req.user.email,
      isAdmin: req.user.isAdmin,
      isMu0x: req.user.isMu0x
    }

    res.json({ 
      ...user,
      assos 
    })
  }
  catch (error) {
    console.error(error)
  }
});

module.exports = router;