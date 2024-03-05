import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Step 1: Make sure that when a user visits the home page,
//   it shows a random activity.You will need to check the format of the
//   JSON data from response.data and edit the index.ejs file accordingly.
app.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://bored-api.appbrewery.com/random");
    const result = response.data;
    res.render("index.ejs", { data: result });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }
});

app.post("/", async (req, res) => {
  try{
    let type = req.body.type;
    let participants = req.body.participants
    let notFoundMsg
    let result
    
    const response = await axios.get(`https://bored-api.appbrewery.com/filter?type=${type}&participants=${participants}`);
    result = response.data
    if(response.status === 404){
        notFoundMsg ="No activities found for your criteria."
        res.render("index.js",{
           errorMessage : notFoundMsg
        })
    }
    let ObjectARRLength = result.length;
    let randomIndex = Math.floor(Math.random()*ObjectARRLength);
    res.render("index.ejs",{
        data : result[randomIndex]
    })
  } 
  catch(err){
    console.error(err);
    res.render("index.ejs",{
         errorMessage :err.message
    })
  }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
