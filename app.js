const express = require("express");
const app = express();
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
let db = null;
const dbPath = path.join(__dirname, "todoApplication.db");
const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at 3000");
    });
  } catch (e) {
    console.log(`Db error '${e.message}'`);
  }
};
initializeDbAndServer();
app.use(express.json());
app.get("/todos/", async (request, response) => {
  let { status = "", priority = "", search_q = "" } = request.query;
  let cond = "";
  if (status != "") {
    cond += ` and status = '${status}'`;
  }
  if (priority != "") {
    cond += ` and priority = '${priority}'`;
  }
  if (search_q != "") {
    cond += ` and todo like '%${search_q}%'`;
  }
  let query = "SELECT * FROM todo WHERE 1=1" + cond;
  const resArr = await db.all(query);
  response.send(db);
});

module.exports = app;
