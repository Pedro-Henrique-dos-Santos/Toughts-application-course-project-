const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("express-flash");
const path = require("path");
const os = require("os");
const conn = require("./db/conn");

const app = express();

const Tought = require("./models/Toughts");
const User = require("./models/User");

const toughtsRoutes = require("./routes/toughtsRouter");
const authRoutes = require('./routes/authRoutes')
const ToughtController = require("./controllers/ToughtsController");


app.engine(
  "handlebars",
  exphbs.engine({ extname: ".handlebars", defaultLayout: "app" })
);
app.set("view engine", "handlebars");

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.use(
  session({
    name: "session",
    secret: "our_secret",
    resave: true,
    saveUninitialized: true,
    store: new FileStore({
      logFn: function () {},
      path: path.join(os.tmpdir(), "sessions"),
    }),
    cookie: {
      secure: false,
      maxAge: 360000,
      expires: new Date(Date.now() + 360000),
      httpOnly: true,
    },
  })
);

app.use(flash());
app.use(express.static("public"));
app.use((req, res, next) => {
  if (req.session.userid) {
    res.locals.session = req.session;
  }
  next();
});

app.use('/toughts',toughtsRoutes)
app.use('/',authRoutes)
app.get('/',ToughtController.showToughts)

conn
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((error) => console.error(error));
