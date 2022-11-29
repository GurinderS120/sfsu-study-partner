// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const jwt = require("jsonwebtoken");
const uuid4 = require("uuid4");

export default function handler(req, res) {
  return new Promise((resolve) => {
    const app_access_key = process.env.MS_APP_ACCESS_KEY;
    const app_secret = process.env.MS_APP_SECRET;

    jwt.sign(
      {
        access_key: app_access_key,
        type: "management",
        version: 2,
        iat: Math.floor(Date.now() / 1000),
        nbf: Math.floor(Date.now() / 1000),
      },
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
          res.status(200).json({ token }).end();
        }

        return resolve();
      }
    );
  });
}
