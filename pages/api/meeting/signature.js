import KJUR from "jsrsasign";

export default function signature(req, res) {
  // Since we are only supporting POST request
  if (req.method !== "POST") {
    res.status(405).send({ message: `${req.method} Method Not Allowed` });
    return;
  }

  const iat = Math.round(new Date().getTime() / 1000) - 30;
  const exp = iat + 60 * 60 * 2;

  const oHeader = { alg: "HS256", typ: "JWT" };

  const oPayload = {
    sdkKey: "5nzVbulx38TJcEFZGJWrG7G2mTMSSnS5HHFR",
    mn: req.body.meetingNumber,
    role: req.body.role,
    iat: iat,
    exp: exp,
    appKey: "5nzVbulx38TJcEFZGJWrG7G2mTMSSnS5HHFR",
    tokenExp: iat + 60 * 60 * 2,
  };

  const sHeader = JSON.stringify(oHeader);
  const sPayload = JSON.stringify(oPayload);
  const signature = KJUR.jws.JWS.sign(
    "HS256",
    sHeader,
    sPayload,
    "5nzVbulx38TJcEFZGJWrG7G2mTMSSnS5HHFR"
  );

  res.json({
    signature: signature,
  });
}
