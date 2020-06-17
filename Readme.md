# web-grpc
After cloning the application, folder structure will be 
```
├── client
│   ├── client.js
│   ├── echo_grpc_web_pb.js
│   ├── echo_pb.js
│   ├── echoapp.js
│   ├── echotest.html
│   ├── package-lock.json
│   ├── package.json
│   └── webpack.config.js
├── client.js
├── dist
│   └── main.js
├── echo.proto
├── envoy.Dockerfile
├── envoy.yaml
├── helloworld.proto
├── helloworld_grpc_web_pb.js
├── helloworld_pb.js
├── index.html
├── package-lock.json
├── package.json
├── server
│   ├── package-lock.json
│   ├── package.json
│   ├── server.js
│   ├── test.csv
│   ├── test.txt
│   └── test.xlsx
└── server.js
```
Steps to run the application:
1. cd client and run `npm install`
2. cd server and run `npm install`
3. docker build -t helloworld/envoy -f ./envoy.Dockerfile .
Here we are tagging the docker image as `helloworld/envoy` this can be anything such as envoy:v1
4. docker run -d -p 8080:8080 -p 9901:9901 helloworld/envoy
5. Start the server: cd server and `node server.js`
6. Build client: cd client and `npx webpack client.js` then start the client with `python3 -m http.server 8081`

### Generate Protobuf Messages and Client Service Stub
To generate the protobuf messages and client service stub class from your .proto definitions, we need:

the protoc binary, and
the protoc-gen-grpc-web plugin.
You can download the protoc-gen-grpc-web protoc plugin from our [release](https://github.com/grpc/grpc-web/releases) page.

If you don't already have protoc installed, you will have to download it first from [here](https://github.com/protocolbuffers/protobuf/releases).

Make sure they are both executable and are discoverable from your PATH.

For example, in MacOS, you can do:
```
$ sudo mv ~/Downloads/protoc-gen-grpc-web-1.1.0-darwin-x86_64 \
  /usr/local/bin/protoc-gen-grpc-web
```
```
$ sudo chmod +x /usr/local/bin/protoc-gen-grpc-web
```
When you have both protoc and protoc-gen-grpc-web installed, you can now run this command:

```
$ protoc -I=. helloworld.proto \
  --js_out=import_style=commonjs:. \
  --grpc-web_out=import_style=commonjs,mode=grpcwebtext:.
```