require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json());
/*refresh token 
1,can invalidate users that still access that
shouldn't have access
2, you can take all you authentication and authorization code
    and move it away from your normal server
*/
let refreshTokens = []; //in production is database
app.post('/token',(req,res)=>{
  const refreshToken = req.body.token;
  if(refreshTokens ==null) return res.sendStatus(401);
  if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,user)=>{
    if(err) return res.sendStatus(403);
    const accessToken = generateAccessToken({name:user.name})
    res.json({accessToken:accessToken})
  })
})

app.delete('/logout',(req,res)=>{
  //in database just delete it
  refreshTokens = refreshTokens.filter(token=> token!==req.body.token);
  res.sendStatus(204)
})

app.post('/login',(req,res)=>{
  //Authentication
  const username = req.body.username;
  const user = {name:username}
  //sign first going to take our payload which is essentially what we want 
  //to serialize and we want to serialize a user object
  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user,process.env.REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);
  res.json({accessToken:accessToken, refreshToken:refreshToken});
})
function generateAccessToken(user){
  return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn: '300s'})
}

app.listen(4000)