const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: 'Unauthenticated'
    })
  }
  next()
}

const requireAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(401).json({
      message: 'Unauthenticated'
    })
  }
  next()
}

module.exports = { requireAuth, requireAdmin }