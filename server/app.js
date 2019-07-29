const express = require('express');
const next = require('next');
const helmet = require('helmet');
const session = require('express-session');
const mongoose = require('mongoose');
const compression = require('compression');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const logger = require('morgan');
const expressValidator = require('express-validator');

//Passport config
require('./models/User')
require('./passport');

//Express config
const routes = require('./routes');
const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
require('dotenv').config();

//MongoDB config
const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
};

mongoose.connect(process.env.MONGO_URI, mongooseOptions).then(() => console.log('DB connected'));
mongoose.connection.on("error", err => {
  console.log(`DB connection error: ${err.message}`);
});

//Express custom server
app.prepare().then(() => {
  const server = express();

  //Security config
  if (!dev) {
    server.use(helmet());
    server.use(compression());
  }
  server.use(express.json());
  server.use(expressValidator());

  //Next config
  server.get("/_next/*", (req, res) => {
    handle(req, res);
  });
  server.get("/static/*", (req, res) => {
    handle(req, res);
  });

  //Session config
  const sessionConfig = {
    name: "memetuoi.sid",
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 14 * 24 * 60 * 60 // save session for 14 days
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 14 // expires in 14 days
    }
  };
  if (!dev) {
    sessionConfig.cookie.secure = true;
    server.set('trust proxy', 1);
  }
  server.use(session(sessionConfig));
  server.use(passport.initialize());
  server.use(passport.session());

  //Create global user object
  server.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
  });
  server.use(
    logger("dev", {
      skip: req => req.url.includes("_next")
    })
  );

  //Custom routes
  server.use("/", routes);

  server.use((err, req, res, next) => {    //Errors handler
    const { status = 500, message } = err;
    res.status(status).json(message);
  });

  server.get("/profile/:userId", (req, res) => {
    const routeParams = Object.assign({}, req.params, req.query);
    return app.render(req, res, "/profile", routeParams);
  });

  server.get("*", (req, res) => {
    handle(req, res);
  });



  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
