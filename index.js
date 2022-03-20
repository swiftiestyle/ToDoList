const express = require('express'); //start the server
const app = express(); //start the server
const dotenv = require('dotenv'); //connect to the database
const mongoose = require("mongoose"); //Mongoose provides a straight-forward, schema-based solution to model your application data.
const TodoTask = require("./models/TodoTask"); //models

dotenv.config(); //connect to the database

app.use("/static", express.static("public"));

app.use(express.urlencoded({ extended: true })); //URLencoded allows data extraction from the form by adding it to the body property of the request

//run server only after the connection is made
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
console.log("Connected to db!");

app.set("view engine", "ejs"); //view engine configuration

app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
    res.render("todo.ejs", { todoTasks: tasks });
    });
    });

//UPDATE
app
.route("/edit/:id")
.get((req, res) => {
const id = req.params.id;
TodoTask.find({}, (err, tasks) => {
res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
});
})
.post((req, res) => {
const id = req.params.id;
TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
if (err) return res.send(500, err);
res.redirect("/");
});
});

//DELETE
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
    if (err) return res.send(500, err);
    res.redirect("/");
    });
    });

//POST METHOD
app.post('/create',async (req, res) => {
    const todoTask = new TodoTask({
    content: req.body.content
    });
    try {
    await todoTask.save();
    res.redirect("/");
    } catch (err) {
    res.redirect("/");
    }
    });

app.get('/health', (req, res) => {
    const data = {
        uptime: process.uptime(),
        message: 'Ok',
        date: new Date()
    }
    
    res.status(200).send(data);
    });

app.listen(3000, () => console.log("Server Up and running")); //tell express app to listen to port 3000
});
