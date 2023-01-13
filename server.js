const express = require('express');
const serveStatic = require("serve-static")
const path = require('path');
app = express();
app.use(serveStatic(path.join(__dirname, 'build')));
const port = process.env.PORT || 8112;
app.listen(port);