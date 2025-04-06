const bcrypt = require('bcrypt');

async function hashPassword() {
  const password = 'fuzail1206'; // ← your desired password
  const hash = await bcrypt.hash(password, 10);
  console.log(hash);
}

hashPassword();
