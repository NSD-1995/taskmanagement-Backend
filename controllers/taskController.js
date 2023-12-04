require("dotenv").config();
const bcrypt = require("bcrypt");
const db = require("../db");
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  const receivedToken = authHeader && authHeader.split(" ")[1];

  if (receivedToken == null) return res.sendStatus(401);

  jwt.verify(receivedToken, process.env.secretKey, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;

    next();
  });
}

async function getTaskIndividual(req, res) {
  const userID = req.user.userId;

  const [rows] = await db.query("SELECT * FROM tasks WHERE user_id = ?", [
    userID,
  ]);

  if (rows.length === 0) {
    return res.status(401).json({ error: "No data found." });
  }
  res.json(rows);
}


async function createTask(req, res) {
    try {
      const userID = req.user.userId;
      const { title, description } = req.body;

   
      const result = await db.query('INSERT INTO tasks (user_id, title, description) VALUES (?, ?, ?)', [userID, title, description]);
  
      const insertedTaskId = result.insertId;
  
      res.status(201).json({ taskId: insertedTaskId, message: 'Task created successfully.' });
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
  

  async function updateTask(req, res) {
    try {
      const userID = req.user.userId;
      const taskId = req.params.taskId;
      console.log("taskId",taskId)
      const { title, description } = req.body;

  
      const result = await db.query('UPDATE tasks SET title = ?, description = ? WHERE id = ? AND user_id = ?', [title, description, taskId, userID]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Task not found.' });
      }
  
      res.json({ message: 'Task updated successfully.' });
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  }

  async function deleteTask(req, res) {
    try {
      const userID = req.user.userId;
      const taskId = req.params.taskId;
  
      const result = await db.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [taskId, userID]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Task not found.' });
      }
  
      res.json({ message: 'Task deleted successfully.' });
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
  

module.exports = {
  authenticateToken,
  getTaskIndividual,
  createTask,
  updateTask,
  deleteTask
};
