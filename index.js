const express = require('express');
const {Server}  = require('socket.io');
const cors = require('cors');
const http = require('http');
const loginRouter = require('./routes/login');
const signUpRouter = require('./routes/SignUp');
const getUsersRouter = require('./routes/users');
const UserController = require('./controllers/UserController');
const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(cors());
const io = new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"],
    }
});
let users = [];
io.on("connection",(socket)=>{
    console.log("a user connected ",socket.id);
        var userId = socket.handshake.query.userId;
        console.log(userId);
        if(userId != 'null')
        users.push({userId:userId,socketId:socket.id});
        io.sockets.emit("users",{users:users});

        socket.on("disconnect",()=>{
            users = users.filter(user=>{
                return user.socketId != socket.id
            });
            io.sockets.emit("users",{users:users});
        })
    });


////////////////////////////////////////
app.use('/login',loginRouter);
app.use('/signUp',signUpRouter);
app.use('/users',getUsersRouter);



server.listen(5000,()=>{
    console.log("Server is running ...");
});
