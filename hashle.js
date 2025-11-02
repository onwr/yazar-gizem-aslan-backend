const bcrypt = require("bcrypt");

async function generateHash() {
  const password = "admin12345";
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed password:", hashedPassword);
  return hashedPassword;
}

generateHash();
