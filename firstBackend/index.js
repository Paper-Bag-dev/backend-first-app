import express from "express";
import path from "path" 
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

mongoose.connect("mongodb://localhost:27017/",{dbName: "backend_testing"})
    .then(() => console.log("DB connected"))
    .catch((e) => console.log(e));

    const messageSchema = new mongoose.Schema({
        name : String,
        email : String
    })

    const Message = mongoose.model("Message", messageSchema)

const app = express();

// Using middlewares
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// setting up view engine
app.set("view engine", "ejs");

const isAuthenticated = (req, res, next) => {
    const {token} = req.cookies;
    if(token)
        next();
    else
        res.render("login");
}

app.get("/",isAuthenticated, (req, res) => {
    res.render("logout");
});


app.get("/success", (req, res) => {
    res.render("success");
})

// app.post("/", async (req, res) => {
//     await Message.create({name : req.body.name, email : req.body.email})
//     res.redirect("/success");
// })

app.post("/", async (req, res) => {
    const {name, email} = req.body;
    await Message.create({name, email});
    res.redirect("/success");
})

app.post("/login", async (req, res) =>{
    res.cookie("token", "iamin",{
        httpOnly: true,
        expires: new Date(Date.now() + 60000)
    });
    res.redirect("/");
});

app.post("/logout", async (req, res) =>{
    res.cookie("token", null,{
        httpOnly: true,
        expires: new Date(Date.now())
    });
    res.redirect("/")
});

app.get("/users", (req, res) => {
    res.json({users})
});

app.listen(5000, () => {
    console.log("Server running");
})