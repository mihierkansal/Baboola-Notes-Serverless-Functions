const jwt = require("jsonwebtoken");
require("dotenv").config();
module.exports = {
  verifyAuth: (auth) => {
    if (!auth) {
      return {
        statusCode: 213,
        headers: {
          "Content-Type": "text/plain", // For plain text responses
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
        },
        body: "No auth header",
      };
    }
    if (auth.indexOf("Bearer ") === -1) {
      return {
        statusCode: 401,
        body: "Unauthorized",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
        },
      };
    }

    const token = auth.split("Bearer ")[1];

    try {
      const CERT = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApTBjtxRzChhx9BJybsqp
PXsStvsL706buiraFfysLIr3VdduvkkRNuScj69Ix8m5wxgeoKIRx6U1N6lFJ0iQ
Fiz55YeIZvaR3iAYOV5x/gCY1K/u7EAcje3uH5yTEPEGlvp9x4nwpDmJKMDcwteY
2c1vvLMaLIuBho206lWcQOINohlknJE1gczGvgwUegcfDlHof57lLnQgjQ2LhbDr
qbsLIEshMKAm6o8YDklnyLLsJyMYx2tes+Rv3WYLfO2qtYK7IPe+LXCsdqHI3xsX
7bqTEQ1w40IpnnspvbT++ArzeIRgczGLQKiwuzh9OOHcIVoHnDFUnMcOJmcwKLu1
tQIDAQAB
-----END PUBLIC KEY-----
`;
      const u = jwt.verify(token, CERT);

      return {
        statusCode: 200,
        body: u.email,
      };
    } catch {
      return { statusCode: 401, body: "Invalid token" };
    }
  },
};
