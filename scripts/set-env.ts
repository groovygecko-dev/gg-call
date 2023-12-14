import { writeFile } from 'fs';

require('dotenv').config();

const targetPath = `./.env`;
const envConfigFile = `

DAILY_API_KEY=${process.env.DAILY_API_KEY}
NEXT_PUBLIC_DAILY_DOMAIN=${process.env.NEXT_PUBLIC_DAILY_DOMAIN}
NEXT_PUBLIC_BASE_URL=${process.env.NEXT_PUBLIC_BASE_URL}

`;
writeFile(targetPath, envConfigFile, function(err) {
  if (err) {
    console.log(err);
  }

  console.log(`Output generated at ${targetPath}`);
});
