const prod = {
   NETWORK_URL: 'http://0.0.0.0:8548',
   NETWORK_ID: '100'
 };
const dev = {
  NETWORK_URL: 'http://127.0.0.1:8545',
  NETWORK_ID: '1'
};

 const config = process.env.NODE_ENV === 'production' ? prod : dev;

 export default config;
