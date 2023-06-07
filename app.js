require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  var fName = req.body.firstName;
  var lName = req.body.lastName;
  var email = req.body.email;

  const mailchimp = require("@mailchimp/mailchimp_marketing");

  mailchimp.setConfig({
    apiKey: process.env.API_KEY,
    server: "us13",
  });

  async function run() {
    try {
      const response = await mailchimp.lists.addListMember("19a9397181", {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fName,
          LNAME: lName,
        },
      });
  
      if (response.status === "subscribed") {
        res.sendFile(__dirname + "/success.html");
      } else {
      }
    } catch (error) {
      // Handle the error case or send an error response to the client
      res.sendFile(__dirname + "/failure.html");
    }
  }
  
  run();
  


});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server running successfully on port 3000");
});
