var http = require("http");
var port = 9000;

http
  .createServer(function(req, resp) {
    console.log(req.url);
    switch (req.method) {
      case "GET":
        if (req.url === "/") {
          resp.writeHead(200, { "Content-Type": "text/html" });
          resp.write("<html><head><title>Home</title></head><body>Click <a href='/calc'>here</a> for a calculation</body></html>");
          resp.end();
        }
        break;
      case "POST":
        break;
      default:
        break;
    }
    
    /*
    resp.writeHead(200, { "Content-Type": "text/html" });
    resp.write("<html><body>Hello <strong><i>World</i></strong></body></html>");
    resp.end();
    */
  })
  .listen(port);
