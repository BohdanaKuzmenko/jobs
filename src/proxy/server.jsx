import path from 'path';
import  express from 'express';
import  httpProxy from 'http-proxy';
var apiProxy = httpProxy.createProxyServer();

function app() {
    const apiHost = 'http://192.168.1.52:8090';
    const app = express();
    const indexPath = path.join(__dirname, '/index.html');
    const publicPath = express.static(path.join(__dirname, '/static'));

    app.use('/static', publicPath);
    app.get('/', function (_, res) {
        res.sendFile(indexPath)
    });
    app.get("/api/rest/*", function (req, res) {
        apiProxy.web(req, res, {target: apiHost});
    });
    console.log(apiHost);
    return app
};

app().listen(3000, '0.0.0.0');