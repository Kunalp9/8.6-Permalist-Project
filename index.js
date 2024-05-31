import express from "express";
import bodyParser from "body-parser";
import pg from "pg"

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: '****',
  password: '*****',
  port: 5432
})

db.connect();

async function getItems(){
  const res = await db.query("SELECT * FROM items ORDER BY id ASC");
  return res.rows;
}

app.get("/", async (req, res) => {
  const items = await getItems();
  console.log(items);
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });

});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  try {
    await db.query('INSERT INTO items (title) VALUES ($1)',[item]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
  
});

app.post("/edit", (req, res) => {
  const itemId = req.body.updatedItemId;
  const itemTitle = req.body.updatedItemTitle;
  try {
    db.query('UPDATE items SET title = $1 WHERE id = $2', [itemTitle, itemId]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.post("/delete", (req, res) => {
  const itemId = req.body.deleteItemId;
  try {
    db.query('DELETE FROM items WHERE id = $1', [itemId]);
    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
