const crypto = require("node:crypto");
require("dotenv").config();
const { logger } = require("../logger");
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const IV_KEY = process.env.IV_KEY;
const ENCRYPTION_KEY_IN_BYTES = Buffer.from(ENCRYPTION_KEY, "hex");
const IV_KEY_IN_BYTES = Buffer.from(IV_KEY, "hex");
const ALGORITHM = "aes-256-cbc";
function encrypt(text) {
  try {
    const cipher = crypto.createCipheriv(
      ALGORITHM,
      ENCRYPTION_KEY_IN_BYTES,
      IV_KEY_IN_BYTES,
    );
    let encryptedData = cipher.update(text, "utf8", "hex");
    encryptedData += cipher.final("hex");
    logger.info("encrypted is successfull.");
    return encryptedData;
  } catch (error) {
    logger.error(error.message, {
      fullDetails: error.stack,
    });
    throw new Error(error);
  }
}

function decrypt(encryptedData) {
  try {
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      ENCRYPTION_KEY_IN_BYTES,
      IV_KEY_IN_BYTES,
    );
    let decryptedData = decipher.update(encryptedData, "hex", "utf8");
    decryptedData += decipher.final("utf8");
    logger.info("decrypt is successfull.");
    return decryptedData;
  } catch (error) {
    logger.error(error.message, {
      fullDetails: error.stack,
    });
  }
}

module.exports = { encrypt, decrypt };
