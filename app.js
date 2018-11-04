var http = require("http");
var qs = require("querystring");
var StringBuilder = require("stringbuilder");

var port = 9000;

function getHomePage(req, resp) {
  resp.writeHead(200, { "Content-Type": "text/html" });
  resp.write(
    "<html><head><title>Home</title></head><body>Welcome to the Home Page <br />Click <a href='/calc'>here</a> for a calculation</body></html>"
  );
  resp.end();
}

function get404(req, resp) {
  resp.writeHead(404, "Resource Not Found", { "Content-Type": "text/html" });
  resp.write(
    "<html><head><title>404</title></head><body>404 Error, Page not found. <br /> Go to <a href='/'>Home Page</a></body></html>"
  );
  resp.end();
}

function get405(req, resp) {
  resp.writeHead(405, "Method not supported", { "Content-Type": "text/html" });
  resp.write(
    "<html><head><title>405</title></head><body>405 Error, Method not supported. <br /> Go to <a href='/'>Home Page</a></body></html>"
  );
  resp.end();
}

http
  .createServer(function(req, resp) {
    console.log(req.url);
    switch (req.method) {
      case "GET":
        if (req.url === "/") {
          getHomePage(req, resp);
        } else if (req.url === "/calc") {
          getCalcPage(req, resp);
        } else {
          get404(req, resp);
        }
        break;
      case "POST":
        break;
      default:
        get405(req, resp);
        break;
    }

    /*
    resp.writeHead(200, { "Content-Type": "text/html" });
    resp.write("<html><body>Hello <strong><i>World</i></strong></body></html>");
    resp.end();
    */
  })
  .listen(port);
