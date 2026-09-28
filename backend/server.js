require('dotenv').config();

const dns = require('dns');

dns.setServers([
  '8.8.8.8',
  '8.8.4.4'
]);

const http = require('http');
const checkEnv = require('./src/config/checkEnv');

checkEnv();

const app = require('./src/app');
const connectDB = require('./src/config/db');
const { initSocket } = require('./src/sockets');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
initSocket(server);

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`✔ Vroomly API listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('✖ Failed to connect to MongoDB:', err.message);
    console.error('  Check MONGO_URI in backend/.env — the server will not start without a database.');
    process.exit(1);
  });

process.on('unhandledRejection', (err) => {
  console.error('Unhandled promise rejection:', err);
});
