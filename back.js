const root = path.join(__dirname, "data", "data.json");
const io = require("socket.io")(server);
class dataCreator {
  constructor(data) {
    this.data = data;
  }
  updateFile() {
    fs.writeFile(root, JSON.stringify(this.data), function() {
      console.log("data written");
    });
  }
  static AccessFile() {
    fs.readFile(root, (err, data) => {
      if (err) throw err;
      const uname = JSON.parse(data);
      console.log("data fetched ", uname);
      return uname;
    });
  }
}

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("index", {
    pageTitle: "Chat Hunger",
  });
});

io.on("connection", (socket) => {
  console.log("connected");
  socket.emit("data", "hello from Epxress");

  socket.on("geolocation", ({ lat, log }) => {
    console.log(`lat: ${lat} long: ${log}`);
  });

  socket.on("error", (data) => {
    console.log(data);
  });
});
