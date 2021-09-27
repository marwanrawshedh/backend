"use strict";
require("dotenv").config();
let express = require("express");
let cors = require("cors");
let server = express();
let axios = require("axios");
server.use(cors());
let PORT = process.env.PORT;
server.use(express.json());
const mongoose = require("mongoose");
mongoose.connect(process.env.URL);

server.get("/", () => console.log("hi"));

server.get("/get", get);
function get(req, res) {
  
  const url = `https://flowers-api-13.herokuapp.com/getFlowers`;
  axios
    .get(url)
    .then((result) => {
      res.send(result.data.flowerslist);

      
    })
    .catch((err) => console.log(err));
}

const FlowreSchema = new mongoose.Schema({
  instructions: String,
  photo: String,
  name: String,
  email: String,
});

let Flowre = mongoose.model("flower", FlowreSchema);

server.get("/getdata", getdata);
server.post("/postdata", postdata);
server.put("/updatedata/:id", updatedata);
server.delete("/deletedata/:id", deletedata);

async function getdata(req, res) {
  const email = req.query.email;
  await Flowre.find({ email: email }, (err, result) => {
    if (err) {
      console.log("errorfind");
    } else {
      res.send(result);
    }
  });
}

async function postdata(req, res) {
  const { email, instructions, name, photo } = req.body;
  await Flowre.create({ email, instructions, name, photo });
  Flowre.find({ email: email }, (err, result) => {
    if (err) {
      console.log("error in post");
    } else {
      res.send(result);
    }
  });
}

function updatedata(req, res) {
  const id = req.params.id;
  const { email, instructions, name, photo } = req.body;

  Flowre.findByIdAndUpdate(
    id,
    { email, instructions, name, photo },
    (err, result) => {
      Flowre.find({ email: email }, (err, result) => {
        if (err) {
          console.log("err in update");
        } else {
          res.send(result);
        }
      });
    }
  );
}

async function deletedata(req, res) {
  const id = req.params.id;
  const email = req.query.email;

  await Flowre.deleteOne({ _id: id }, (err, result) => {
    Flowre.find({ email: email }, (err, result) => {
      if (err) {
        console.log("err in delet");
      } else {
        res.send(result);
      }
    });
  });
}

server.listen(PORT, () => console.log(`listening on ${PORT}`));

