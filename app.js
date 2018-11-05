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

function getCalcPage(req, resp, data) {
  var sb = new StringBuilder({ newline: "\r\n" });

  sb.appendLine("<html>");
  sb.appendLine("<body>");
  sb.appendLine(" <form method='post'>");
  sb.appendLine(" <table>");
  sb.appendLine("   <tr>");
  sb.appendLine("     <td>First Number:</td>");

  if (data && data.txtFirstNumber) {
    sb.appendLine("     <td><input type='text' id='txtFirstNumber' name='txtFirstNumber' value='{0}' /></td>", data.txtFirstNumber);
  } else {
    sb.appendLine("     <td><input type='text' id='txtFirstNumber' name='txtFirstNumber' value='' /></td>");
  }

  sb.appendLine("   </tr>");
  sb.appendLine("   <tr>");
  sb.appendLine("     <td>Second Number:</td>");
  
  if (data && data.txtSecondNumber) {
    sb.appendLine("     <td><input type='text' id='txtSecondNumber' name='txtSecondNumber' value='{0}' /></td>", data.txtSecondNumber);
  } else {
    sb.appendLine("     <td><input type='text' id='txtSecondNumber' name='txtSecondNumber' value='' /></td>");
  }

  sb.appendLine("   </tr>");
  sb.appendLine("   <tr>");
  sb.appendLine("     <td><input type='submit' value='Calculate Sum' /></td>");
  sb.appendLine("   </tr>");

  if (data && data.txtFirstNumber && data.txtSecondNumber) {
    var sum = parseInt(data.txtFirstNumber) + parseInt(data.txtSecondNumber);

    sb.appendLine("   <tr>");
    sb.appendLine("     <td>Sum = {0}</td>", sum);
    sb.appendLine("   </tr>");
  }

  
  sb.appendLine(" </table>");
  sb.appendLine(" </form>");
  sb.appendLine("</body>");
  sb.appendLine("</html>");

  sb.build(function(err, result) {
    resp.write(result);
    resp.end();
  });
}

function getCalcForm(req, resp, formData) {
  resp.writeHead(200, { "Content-Type": "text/html" });
  getCalcPage(req, resp, formData);
}

http
  .createServer(function(req, resp) {
    console.log(req.url);
    switch (req.method) {
      case "GET":
        if (req.url === "/") {
          getHomePage(req, resp);
        } else if (req.url === "/calc") {
          getCalcForm(req, resp);
        } else {
          get404(req, resp);
        }
        break;
      case "POST":
        if (req.url === "/calc") {
          var reqBody = '';

          req.on('data', function(data) {
            reqBody += data;
            if (reqBody.length > 1e7) //10mb
            {       
              resp.writeHead('413', 'Data request exceeds 10mb limit', { "Content-Type": "text/html" });
              resp.write(
                "<html><head><title>413</title></head><body>413 Error: Server cannot handle the amount of information requested.<br /> Go to <a href='/'>Home Page</a></body></html>"
              );
              resp.end();
            }
          });

          req.on('end', function(data) {
            var formData = qs.parse(reqBody);
            getCalcForm(req, resp, formData);
          });
        } else {
          get404(req, resp);
        }
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
