require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json());
const posts = [
  {
    username: 'helen',
    title: 'Post 1'
  },
  {
    username: 'Jane',
    title: 'Post 2'
  }
]
app.get('/posts',authenticateToken,(req,res)=>{

  res.json(posts.filter(post=>post.username === req.user.name))
});

/*app.post('/login',(req,res)=>{
  //Authentication
  const username = req.body.username;
  const user = {name:username}
  //sign first going to take our payload which is essentially what we want 
  //to serialize and we want to serialize a user object
  const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET);
  res.json({accessToken:accessToken})
})
*/


function authenticateToken(req,res,next){
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(' ')[1]
  if(token == null) return res.sendStatus(401);
  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
    if(err) return res.sendStatus(403);
    req.user = user;
    next();
  } )
}
app.listen(3000)