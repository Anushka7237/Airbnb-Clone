const express=require("express");
const app = express();
const session=require("express-session")
const flash=require("connect-flash")
const sessionoptions={
    secret:"helloeveryone",
    resave:false,
    saveUninitialized:true,
};

app.use(session(sessionoptions));
app.use(flash());

app.get("/register",(req,res)=>{
    let {name="anonymous"}=req.query;
    req.session.name=name;
    req.flash("succcess","register successfully");
    res.redirect("/hello");
});


app.get("/hello",(req,res)=>{
    res.send(`Hello ${req.session.name}`);
});

app.listen(3000,()=>{
    console.log("app is listening");
});