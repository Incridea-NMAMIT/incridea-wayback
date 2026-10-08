import {existsSync} from 'node:fs';
import {spawn} from 'node:child_process';
import {createServer,request} from 'node:http';
if(existsSync('/app/public-static')) { process.env.STATIC_ROOT='/app/public-static'; await import('./static-server.mjs'); }
else {
 const child=spawn('node',['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3007'],{stdio:'inherit',env:{...process.env,NODE_ENV:'production'}});
 const server=createServer((req,res)=>{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
  const upstream=request({host:'127.0.0.1',port:3007,path:req.url==='/health/ready'?'/':req.url,method:req.method,headers:{...req.headers,host:req.headers.host}},response=>{
   if(req.url==='/health/ready'){response.resume();res.writeHead(response.statusCode>=500?503:200,{'Content-Type':'application/json'});res.end(JSON.stringify({releaseSha:process.env.RELEASE_SHA,status:'ready'}));return;}
   res.writeHead(response.statusCode,response.headers);response.pipe(res);
  });upstream.on('error',()=>{res.writeHead(503);res.end();});req.pipe(upstream);
 });server.listen(8080,'0.0.0.0');
 for(const signal of ['SIGTERM','SIGINT'])process.once(signal,()=>{server.close();child.kill(signal);});
 child.on('exit',code=>process.exit(code??1));
}
