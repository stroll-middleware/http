import HTTP from './../dist';

const http = new HTTP({
  baseURL: 'http://localhost:6060',
});

http.get({
  url:'/test'
}).then((res: any) => {
  console.log('res', res.data)
})
