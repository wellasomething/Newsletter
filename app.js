const bodyParser= require("body-parser");
const express = require("express");
const app = express();
const request = require("request");
const https = require("https");

//to render a static file like the css and image
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    var firstName= req.body.fName;
    var lastName = req.body.lName;
    var email = req.body.email;
   
    const data ={
        members: [
            {
                email_address : email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);

    const url ="https://us21.api.mailchimp.com/3.0/lists/fb1c5d77c2";
    const options = {
        method: "POST",
        auth: "wellasomething:d9631372ec28ab425676174977fdd505-us21"
    }

    const request =https.request(url, options, function(response){

        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html")
        }
        else{
            res.sendFile(__dirname + "/failure.html")
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });
    request.write(jsonData);
    request.end();
});

//to redirect back to the homepage from the failure page
app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(process.env.PORT || 5000, function(){
    console.log("Server is running at port 5000")
})

// apiKey
// d9631372ec28ab425676174977fdd505-us21

// list id
// fb1c5d77c2