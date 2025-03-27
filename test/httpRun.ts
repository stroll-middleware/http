import HTTP from './../src';

const http: any = new HTTP({
  baseURL: 'http://localhost:6060',
});

// http.getStreamText({
//   url:'/stream'
// }, (res: any)=> {
//   console.log('res', res)
// }).then((res: any)=> {
//   console.log('res----------', res)
// });

http.get({url: "/test"}).then((res: any)=> {
  console.log('test', res.data)
});