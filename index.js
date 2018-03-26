const Koa = require('koa');
const app = new Koa();
const request = require('request');

const wxTokenUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxeb9a8806ee587ed5&secret=d7a5d082ef5dd03ce172fca7e1d8aaa7';

let wxToken = '';

request('wxTokenUrl', function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
  wxToken = body.ACCESS_TOKEN;
  console.log('wxToken',wxToken);
});

app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(3000);
console.log('listening:3000')