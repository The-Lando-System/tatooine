module.exports = {
  GOOGLE_TOKEN_INFO_URL: 'https://www.googleapis.com/oauth2/v1/tokeninfo',
  ADMIN_EMAILS: {
    'matt.voget@gmail.com' : true
  },
  PORT: process.env.PORT | 3001,
  DB_CONNECTION: process.env.DB_CONNECTION
};