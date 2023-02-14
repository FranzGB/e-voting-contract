const prod = {
   NETWORK_URL: 'http://0.0.0.0:8548',
   NETWORK_ID: '100'
 };
 const dev = {
   NETWORK_URL: 'http://localhost:8545',
   NETWORK_ID: '1'
 };

 export const config = process.env.NODE_ENV === 'production' ? prod : dev;
