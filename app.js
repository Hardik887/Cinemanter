const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const axios = require("axios");
const helmet = require("helmet");

const app = express();

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(flash());
app.use(helmet({ contentSecurityPolicy: false }));

const getSearchimdbID = async (movieSearch) => { 
  const getValue = await axios.get(
    `https://www.omdbapi.com/?s=${movieSearch}&apikey=7f54fa5e`
  );

  let SearchArray = getValue.data.Search;
  let srchimdbID = SearchArray.map((a) => a.imdbID);
  return srchimdbID;
};

const getSearch = async (movieSearch) => {
  const getValue = await axios.get(
    `https://www.omdbapi.com/?s=${movieSearch}&apikey=7f54fa5e`
  );

  let SearchArray = getValue.data.Search;
  return SearchArray;
};

const getimdbID = async (movieID) => {
  const getValue = await axios.get(
    `https://www.omdbapi.com/?i=${movieID}&apikey=7f54fa5e`
  );
  let SearchArray = getValue.data;
  return SearchArray;
};

app.get("/", async (req, res) => {
  const SearchimdbIDvar = await getSearchimdbID("Titanic");
  const Searchvar = await getSearch("Titanic");
  res.render("./movie.ejs", {
    imdbID: SearchimdbIDvar,
    Search: Searchvar,
  });
});

app.get("/movie/:Id", async (req, res) => {
  const id = req.params.Id;
  const idvar = await getimdbID(id);
  res.render("./movieInfo.ejs", {
    imdbID: idvar,
  });
  // console.log(idvar);
});

app.post("/results", async (req, res) => {
  const { query } = req.body;
  const SearchimdbIDvar = await getSearchimdbID(query);
  const Searchvar = await getSearch(query);
  res.render("./movie.ejs", {
    imdbID: SearchimdbIDvar,
    Search: Searchvar,
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`LISTENING ON PORT ${port}`);
});
