const jwt = require('jsonwebtoken');
const STAFFDATA = require('../model/staffDataSchema');

const authenticateStaff = async (req, res, next) => {
  try {
    // console.log(req.headers.authorization)
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      const token = req.headers.authorization.split("\"")[1];

      if (token) {
        jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
          if (err) {
            console.log("err msg", err.message);
            return res.status(401).json({ error: 'Unauthorized' });
          } else {
            // console.log(decodedToken);
            req.ID = decodedToken.id;

            // check blocked
            let isBlocked = await STAFFDATA.findOne({ _id: req.ID }, { isBlocked: 1 });


            if (isBlocked===true) {
              return res.status(401).json({ error: "Blocked By Admin" });
            } else {
              next();
            }
          }
        });
      } else {
        return res.status(401).json({ error: "Authentication Required" });
      }
    } else {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  authenticateStaff
};
