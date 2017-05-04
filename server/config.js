module.exports = {
  PORT: process.env.PORT || 8080,
  DEBUG: process.env.DEBUG,
  API_PROXY_PATH: '/api',
  API_ENDPOINT: process.env.API_ENDPOINT || 'https://api.gndf.io/',
  API_CLIENTID: process.env.API_CLIENTID,
  API_CLIENTSECRET: process.env.API_CLIENTSECRET,
  PROVIDERS_BUGSNAG_APIKEY: process.env.PROVIDERS_BUGSNAG_APIKEY,
  PROVIDERS_BUGSNAG_STAGE: process.env.PROVIDERS_BUGSNAG_STAGE,
};
