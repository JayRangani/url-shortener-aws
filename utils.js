const { nanoid } = require("nanoid");

function generateShortId() {
  return nanoid(7); // 7 chars (good balance)
}

module.exports = { generateShortId };