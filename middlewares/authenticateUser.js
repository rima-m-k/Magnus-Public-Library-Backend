const jwt = require('jsonwebtoken')

const requireAuth = (req, res, next) => { 
  try {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {

      // console.log(req.headers.authorization)
      const token = req.headers.authorization.split("\"")[1];
      // console.log(token,"totken")
      if (token) {
        jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
          if (err) {
           
            console.log("err msg",err.message)
            return res.status(401).json({ error: 'Unauthorized' })
          } else {
            req.ID = decodedToken.id
            next();
            //check blocked
          }
        })
      } else {
        return res.status(401).json({ error: "Authentication Required" }) 
      }
    } else {
      return res.status(401).json({ error: 'Unauthorized' })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Internal Server Error" })
  }
}

module.exports = {
  requireAuth
}
