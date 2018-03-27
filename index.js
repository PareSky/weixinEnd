const Koa = require('koa');
const request = require('request');
const sha1 = require('sha1')


const app = new Koa();

const wxTokenUrl     = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxeb9a8806ee587ed5&secret=d7a5d082ef5dd03ce172fca7e1d8aaa7';
const wxTokenUrlTest = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxe5507486c135d74e&secret=b64a7f6c3ef4f59fcc0b3f357c392c16';

let wxToken = '';
let ticket = '';

request(wxTokenUrlTest, function (error, response, body) {
    let jbody = JSON.parse(body);
	wxToken = jbody.access_token;
	console.log('wxToken',wxToken);

	let ticketUrl = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token='+ wxToken;
	request(ticketUrl, function (error, response, body) {
		let jbody = JSON.parse(body)
		ticket = jbody.ticket;
		console.log('ticket',ticket);
	})
	
	//自定义菜单
	let createMenu = 'https://api.weixin.qq.com/cgi-bin/menu/create?access_token='+ wxToken;
	let data = {
     "button":[
     {    
          "type":"click",
          "name":"今日歌曲",
          "key":"V1001_TODAY_MUSIC"
      },
      {
           "name":"菜单",
           "sub_button":[
           {    
               "type":"view",
               "name":"搜索",
               "url":"http://www.soso.com/"
            },
            {
                 "type":"miniprogram",
                 "name":"wxa",
                 "url":"http://mp.weixin.qq.com",
                 "appid":"wx286b93c14bbf93aa",
                 "pagepath":"pages/lunar/index"
             },
            {
               "type":"click",
               "name":"赞一下我们",
               "key":"V1001_GOOD"
            }]
       }]
	};
	request.post({url:createMenu, form: data}, function(err,httpResponse,body){ 
		let jbody = JSON.parse(body)
		console.log('createMenu',jbody)	
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
