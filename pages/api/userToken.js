const jwt = require("jsonwebtoken");
const uuid4 = require("uuid4");

export default function handler(req, res) {
  return new Promise((resolve) => {
    const app_access_key = process.env.MS_APP_ACCESS_KEY;
    const app_secret = process.env.MS_APP_SECRET;
    // Create the payload with data provided by front-end like roomId and userId
    const payload = {
      access_key: app_access_key,
      room_id: req.body.roomId,
      user_id: req.body.userId,
      role: req.body.role,
      type: "app",
      version: 2,
      iat: Math.floor(Date.now() / 1000) - 2,
      nbf: Math.floor(Date.now() / 1000) - 2,
    };
    // The following is the algorithm generating the user token
    jwt.sign(
      payload,
      app_secret,
      {
        algorithm: "HS256",
        expiresIn: "24h",
        jwtid: uuid4(),
      },
      function (err, token) {
        if (err) {
          res.status(500).send("Error occured while generating JWT token");
        } else {
          // We send the token to front end
          res.status(200).json({ token }).end();
        }

        return resolve();
      }
    );
  });
}
