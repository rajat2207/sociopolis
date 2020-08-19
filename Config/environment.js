const fs = require('fs');
const path = require('path');

const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const rfs = require('rotating-file-stream');

const accessLogStream = rfs.createStream('access.log', {
  interval: '1d',
  path: logDirectory,
});

const development = {
  name: 'development',
  asset_path: './assets',
  session_cookie_key: 'blahsomething',
  db: 'SocioPolis_development',
  smtp: {
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'sociopolissite@gmail.com',
      pass: 'sociopolis123',
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  },
  google_client_id:
    '1001043350512-2bkr91d6cb9o0ruov90lc0oufbftdru1.apps.googleusercontent.com',
  google_client_secret: 'a1ZtpTxJ10dB-Qx4aWYHW32u',
  google_callback_URL: 'http://localhost:8000/users/auth/google/callback',
  jwt_secret_key: 'sociopolis',
  morgan: {
    mode: 'dev',
    options: { stream: accessLogStream },
  },
};

require('dotenv').config();

const production = {
  name: 'production',
  asset_path: process.env.SOCIOPOLIS_ASSETS_PATH,
  session_cookie_key: process.env.SOCIOPOLIS_SESSION_COOKIE,
  db: process.env.SOCIOPOLIS_DB,
  smtp: {
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SOCIOPOLIS_AUTH_USER,
      pass: process.env.SOCIOPOLIS_AUTH_PASS,
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  },
  google_client_id: process.env.SOCIOPOLIS_GOOGLE_CLIENT_ID,
  google_client_secret: process.env.SOCIOPOLIS_GOOGLE_CLIENT_SECRET,
  google_callback_URL: process.env.SOCIOPOLIS_GOOGLE_CALLBACK_URL,
  jwt_secret_key: process.env.SOCIOPOLIS_JWT_SECRET,
  morgan: {
    mode: 'combined',
    options: { stream: accessLogStream },
  },
};

module.exports = eval(process.env.NODE_ENV == production)
  ? development
  : production;

// module.exports = production;
