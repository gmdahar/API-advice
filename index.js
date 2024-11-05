import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import expressFlash from "express-flash";
import session from "express-session";

const app = express();
const port = 3000;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);
// Without session management, our app won't be able to store data that persists
// across requests for each user.

app.use(expressFlash());
// to enable flash messages in an Express.js application.
//Flash messages are temporary messages that can be displayed to users,
//typically after they complete an action, like submitting a form or logging in.


const API = "https://api.adviceslip.com/advice/search/"

app.get("/", (req, res) => {
  res.render("index.ejs", { advice: "Advice will be displayed here!" });
});

app.post("/get-advice", async (req, res) => {
 
  const query = req.body.query;

  if (!query || query.trim() === "") {
    req.flash("error", "Please enter a term for which you would like related advice.");
    res.redirect("/");
  } 
  
  else {

  try {
  
   const result = await axios.get(API + query);
   const randomAdvice = result.data.slips[Math.floor(Math.random() * result.data.slips.length)].advice;
   res.render("index.ejs", { advice:  randomAdvice  });
  } 
  
  catch (error) {
   
    res.render("index.ejs", { advice:  "No Advice Found"  });
  }

}

});

// app.get("/api/advice", async (req, res) => {
//   try {
//     const result = await axios.get("https://api.adviceslip.com/advice");
//     const user = req.query.username;
//     res.render("advice.ejs", {
//       advice: result.data.slip.advice,
//       username: user.toUpperCase(),
//     });
//   } catch (error) {
//     console.log(error.response.data);
//     res.status(500);
//   }
// });



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
