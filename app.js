const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const User = require("./models/User");
const {Item} = require("./models/Item");
const List = require("./models/List");
const authRoutes = require("./routes/auth");
const bodyParser = require("body-parser");
const sendEmail = require('./config/mailjet'); // Require the Nodemailer configuration

const _ = require("lodash");
require("dotenv").config();

const password = process.env.PASSWORD;

const app = express();

// Set up session middleware
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set("strictQuery",false);
mongoose.connect("mongodb+srv://admin-Bosir:"+ password +"@cluster0.alguskt.mongodb.net/todolistDB");

// Configure Passport.js
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Use the authentication routes
app.use(authRoutes);

const item1 = new Item ({
  name: "! Welcome to our TodoList !"
});

const item2 = new Item ({
  name: "Hit the '+' button to add a new item."
});

const item3 = new Item ({
  name: "<-- Hit this to delete an item."
});

const defaultItems = [item1,item2,item3];

app.post('/schedule-email', (req, res) => {
  const userEmail = req.user.username; // Retrieve the user's email from your authentication system
  const emailDateTimeStr = req.body.emailDateTime;
  const emailDateTime = new Date(emailDateTimeStr);

  // Schedule the email to be sent at the specified time
  const currentDate = new Date();
  const timeDifference = emailDateTime - currentDate;

  if (timeDifference <= 0) {
    // Handle error: Scheduled time is in the past
    console.error('Scheduled time is in the past.');
    res.status(400).send('Scheduled time is in the past.');
    return;
  }

  // Schedule the email using a setTimeout
  setTimeout(() => {
    // Send the email using the sendEmail function
    sendEmail(userEmail, (error) => {
      if (error) {
        // Handle the error as needed
        console.error('Error scheduling and sending email:', error);
      } else {
        console.log('Email scheduled and sent successfully.');
      }
    });
  }, timeDifference);

  // Respond to the client with a success message
  res.redirect("/Dashboard?message=EmailScheduled");
});

app.get("/:customListName",(req,res)=>{
  if(req.isAuthenticated()){
      const customListName = _.capitalize(req.params.customListName);
      const userId = req.user.id; // Get the user's unique MongoDB _id
      const userLists = [];
     // Find the user's lists based on their _id
    List.find({ id: userId }, (err, lists) => {
      if (err) {
        console.error(err);
        // Handle the error as needed (e.g., sending an error response)
        return res.status(500).send("Error fetching user's lists");
      }

      // Populate the userLists array with the user's lists
      userLists.push(...lists);
      // console.log(ul = userLists);

      // Continue with your existing logic
      List.findOne({ name: customListName,id: userId }, (err, foundList) => {
        if (!err) {
          if (!foundList) {
            // If not found, create a list associated with the user
            const list = new List({
              name: customListName,
              items: defaultItems,
              id: userId
            });

            list.save();
            res.redirect("/" + customListName);
          } else {
            // Show an existing list
            res.render("list", { listTitle: foundList.name, newListItems: foundList.items,userLists });
          }
        }
      });
    });
  }
  else{
    res.redirect("/");
  }
});

// Add a route to handle creating a new list
app.post("/create-list", function (req, res) {
  if(req.isAuthenticated()){
      const newListTitle = req.body.newListTitle;
    const userId = req.user._id;

    // Redirect the user to the newly created list
    res.redirect("/" + newListTitle);
  }
  else res.redirect("/");
});

app.post("/", function(req, res){
  if(req.isAuthenticated()){
    const itemName = req.body.newItem;
    const listName = req.body.list;
    const userId = req.user.id;

    const item = new Item({
      name: itemName
    });

    List.findOne({name: listName,id: userId},(err,foundList)=>{
      foundList.items.push(item);
      foundList.save();
      res.redirect("/"+listName);
    })
  }
  else res.redirect("/"); 
  
});


app.post("/delete",(req,res)=>{
  if(req.isAuthenticated()){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
  
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, (err,foundList)=>{
      if(!err) res.redirect("/" + listName);
    })
  }
  else res.redirect("/");
});

// Add a route to handle list deletion
app.post("/delete-list", function (req, res) {

  if(req.isAuthenticated()){
    const listId = req.body.listId;
  
    // Delete the list based on its _id
    List.findByIdAndRemove(listId, (err) => {
      if (err) {
        console.error(err);
        // Handle the error as needed (e.g., sending an error response)
        return res.status(500).send("Error deleting the list");
      }
  
      // Redirect the user back to their dashboard or another appropriate page
      res.redirect("/dashboard"); // You can change the URL as needed
    });
  }
  else res.redirect("/");
});

app.listen(PORT, function() {
  console.log("Server started on port 3000");
});
