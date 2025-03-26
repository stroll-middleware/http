import HTTP from './../src';

const http = new HTTP({
  baseURL: 'http://localhost:6060',
});

http.getStreamText({
  url:'/stream'
}, (res: any)=> {
  console.log('res', res)
}).then((res: any)=> {
  console.log('res----------', res)
});