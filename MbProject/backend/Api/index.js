const express = require("express");
const bodyParser = require("body-parser"); 
const mongoose = require ("mongoose");
const cors = require( "cors");
const dotenv = require ("dotenv");

const helmet = require ("helmet");
const morgan =require ("morgan");
const path = require ("path");

const  router = require("./Routers/router");

/* CONFIGURATIONS */

dotenv.config();
const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */

app.use(router);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

   
    
  })
  .catch((error) => console.log(`${error} did not connect  ${PORT}` ));

/* ROUTES 
  //  User.insertMany(users);
    // Post.insertMany(posts); */