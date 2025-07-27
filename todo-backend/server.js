// using express framework
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// create an instance of express
const app = express();
app.use(express.json()); // middleware to parse JSON bodies
app.use(cors()); // middleware to enable CORS

// // define a route for the root URL
// app.get("/", (req, res) => {
//   res.send("Hello, World!");
// });

// // list of todos
// const todos = [];

// connecting MongoDB
mongoose
  .connect("mongodb://localhost:27017/todoapp")
  .then(() => {
    console.log("BD connected successfully");
  })
  .catch((err) => {
    console.error(err);
  });

// define a schema for todo items
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: false },
});

// create a model for todo items
const todoModel = mongoose.model("Todo", todoSchema);

// create a new todo item
app.post("/todos", async (req, res) => {
  // logic to create a new todo item
  const { title, description } = req.body;

  //   const newtodo = {
  //     id: todos.length + 1, // simple id generation
  //     title,
  //     description,
  //   };

  //   todos.push(newtodo);
  //   console.log(todos);

  const newTodo = new todoModel({ title, description });
  try {
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// get all todo items
app.get("/todos", async (req, res) => {
  // logic to get all todo items
  try {
    const todos = await todoModel.find();
    res.status(201).json(todos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

//update a todo item
app.put("/todos/:id", async (req, res) => {
  // logic to update a todo item

  try {
    const { title, description } = req.body;
    const id = req.params.id;

    const updatedTodo = await todoModel.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(400).json({ message: "Todo not found" });
    }

    res.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

// delete a todo item
app.delete("/todos/:id", async (req, res) => {
  try {
    // logic to delete a todo item
    const id = req.params.id;

    await todoModel.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

// start the server on port 3000
const PORT = 8000;

// listen for incoming requests
app.listen(PORT, () => {
  console.log("Server is listening on port" + PORT);
});
