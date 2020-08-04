const express = require("express");
const app = express();
const PORT = 3000;
const routes = require("./components/routes/routes");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const server = http.createServer(app);
app.use(cors());
app.use(bodyParser.json());
app.use("/", routes);

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
