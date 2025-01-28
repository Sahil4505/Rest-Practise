const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const { v4: uuidv4 } = require("uuid");
var methodOverride = require('method-override');


app.use(methodOverride('_method'));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Set up view engine and views folder
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// Serve static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
    console.log("Listening to port ", port);
});

// Home route for basic response
app.get("/", (req, resp) => {
    resp.send("This is basic respo");
});

// Sample posts array
let posts = [
    {
        id: uuidv4(),
        username: "Apna College",
        content: "I love coding!!",
    },
    {
        id: uuidv4(),
        username: "Aman",
        content: "I got my first internship!",
    },
];

// Route to display all posts
app.get("/posts", (req, resp) => {
    resp.render("index.ejs", { posts });
});

// Route to display the form to create a new post
app.get("/posts/new", (req, resp) => {
    resp.render("form.ejs");
});

// Route to handle the creation of a new post
app.post("/posts", (req, resp) => {
    let { username, content } = req.body;
    let id = uuidv4();
    posts.push({ id, username, content });
    resp.redirect("/posts");
});

// Route to display a specific post based on the ID
app.get("/posts/:id", (req, resp) => {
    let { id } = req.params;
    

    let post = posts.find((p) => p.id === id);

    if (!post) {
        return resp.status(404).send("Post not found");
    }

    // console.log("Found Post:", post);
    resp.render("show.ejs", { post });
});

app.get('/posts/:id/change',(req,resp)=>{
    let {id}=req.params;
    let post=posts.find((p)=>(p.id===id));
    resp.render("edit.ejs",{post});
});
app.patch('/posts/:id',(req,resp)=>{
    let {id}=req.params;
    
    let post=posts.find((p)=>(p.id===id));
    
    post.content=req.body.content;
    
    
    resp.redirect("/posts");
});

app.delete('/posts/:id',(req,resp)=>{
    let {id}=req.params;
    posts=posts.filter((p)=>(p.id!==id));
    resp.redirect("/posts");
})