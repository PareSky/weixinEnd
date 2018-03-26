const Koa = require('koa');
const request = require('request');
const sha1 = require('sha1')


const app = new Koa();

const wxTokenUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxeb9a8806ee587ed5&secret=d7a5d082ef5dd03ce172fca7e1d8aaa7';

let wxToken = '';
let ticket = '';

request(wxTokenUrl, function (error, response, body) {
  wxToken = body.access_token;
  console.log('wxToken',wxToken);
  
  let ticketUrl = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token='+ wxToken;
  request(ticketUrl, function (error, response, body) {
	  ticket = body.ticket;
	  console.log('ticket',ticket);
  })
});


/**
 * 根据URL获取HTML内容
 * @param  {string} url koa2上下文的url，ctx.url
 * @return {string}     获取HTML文件内容
 */
async function route( url,ctx ) {
  let html = 'hello route'
  if (/wxtest/.test(url)){
	  html = {
		  signature: ctx.query.signature,
		  echostr: ctx.query.echostr,
		  timestamp: ctx.query.timestamp,
		  nonce: ctx.query.nonce,
	  }
	  console.log(html)
	  let token = 'jiioosdf'
	  let list = [token, ctx.query.timestamp, ctx.query.nonce]
	  list.sort()
	  let str = list.reduce((all,v)=>all.toString()+v.toString())
	  console.log('list',str)
	  let hashCode = sha1(str)
	  console.log('hashCode',hashCode)
	  if(hashCode == ctx.query.signature){
		  html = ctx.query.echostr
	  }
  }
  return html
}

app.use( async ( ctx ) => {
  let url = ctx.request.url
  let html = await route( url,ctx )
  ctx.body = html
})

app.use( async ( ctx ) => {
  let url = ctx.url
  // 从上下文的request对象中获取
  let request = ctx.request
  let req_query = request.query
  let req_querystring = request.querystring

  // 从上下文中直接获取
  let ctx_query = ctx.query
  let ctx_querystring = ctx.querystring
  
  console.log(request)
  
  ctx.body = {
    url,
    req_query,
    req_querystring,
    ctx_query,
    ctx_querystring
  }
})

app.listen(80)
console.log('[demo] start-quick is starting at port 80')