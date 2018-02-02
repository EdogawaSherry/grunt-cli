const PORT = 3003;
const express = require('express');
const app = express();
const path = require('path');
let server;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../test/index.html'));
});
app.use(express.static('test'));
server = app.listen(PORT, '127.0.0.1', () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log('本地服务创建成功: http://%s:%s', host, port);
});
