
/*WARNING
Do not expose this key publicly. 
We have done so here to make it clear what the code is doing,
 but in a production system you must protect this key using appropriate 
 measures such as a secrets vault, environment variable, or configuration service.
*/
export const jwtConstants = {
  secret: 'secretKey',
  refreshSecret: 'refreshSecret',
  expiresIn: '60s',
  refereshTokenExpiresIn: '7d' //Date.now() + 7*24*60*60*1000 
};

export const guardTypes = {
  jwt: 'jwt',
  jwt_refresh: 'jwt-refresh'
}