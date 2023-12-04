require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const userController = require("./controllers/userController");
const taskController = require("./controllers/taskController");
var cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Creating a new user
app.post(
  "/register",
  userController.validateRegisterRequest,
  userController.registerUser
);
//Get the task
app.get(
  "/tasks",
  taskController.authenticateToken,
  taskController.getTaskIndividual
);

//Create a new task
app.post("/tasks", taskController.authenticateToken, taskController.createTask);

//updating the task
app.put(
  "/tasks/:taskId",
  taskController.authenticateToken,
  taskController.updateTask
);

//delete the task
app.delete(
  "/tasks/:taskId",
  taskController.authenticateToken,
  taskController.deleteTask
);

//Loginuser
app.post("/login", userController.LoginUser);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
