// routes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Import MySQL connection

// POST route to insert name, email, and age
router.post("/User", (req, res) => {
  // Log the request body
  console.log(req.body);

  const { name, email, age } = req.body;

  // Check if all required fields are provided
  if (!name || !email || !age) {
    return res.status(422).json("Please fill all the data");
  }

  try {
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
      if (err) {
        return res.status(500).json("Database error: " + err);
      }

      if (result.length) {
        return res.status(422).json("This email already exists");
      } else {
        db.query("INSERT INTO users SET ?", { name, email, age }, (err, result) => {
          if (err) {
            return res.status(500).json("Error inserting data: " + err);
          } else {
            return res.status(201).json(req.body);
          }
        });
      }
    });
  } catch (error) {
    return res.status(500).json("Server error: " + error);
  }
});

router.get("/getusers",(req,res)=>{

  db.query("SELECT * FROM users",(err,result)=>{
      if(err){
          res.status(422).json("nodata available");
      }else{
          res.status(201).json(result);
      }
  })
});
// user delete api

router.delete("/deleteuser/:id",(req,res)=>{

  const {id} = req.params;

  db.query("DELETE FROM users WHERE id = ? ",id,(err,result)=>{
      if(err){
          res.status(422).json("error");
      }else{
          res.status(201).json(result);
      }
  })
});
// get single user

router.get("/induser/:id",(req,res)=>{

  const {id} = req.params;

  db.query("SELECT * FROM users WHERE id = ? ",id,(err,result)=>{
      if(err){
          res.status(422).json("error");
      }else{
          res.status(201).json(result);
      }
  })
});

// update users api


router.put("/updateuser/:id",(req,res)=>{

  const {id} = req.params;

  const data = req.body;

  db.query("UPDATE users SET ? WHERE id = ? ",[data,id],(err,result)=>{
      if(err){
          res.status(422).json({message:"error"});
      }else{
          res.status(201).json(result);
      }
  })
});


module.exports = router;
