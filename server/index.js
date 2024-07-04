
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const { exec } = require("child_process");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const userRoutes=require("./web.js")
const server = http.createServer(app);
const io = new Server(server);
const ACTIONS = require("./Actions");
const mongoose=require("mongoose")
const userSocketMap = {};
const getAllConnectedClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
};


app.use(cors());
//database connectivity
app.use(bodyParser.json());
const connectDb=async()=>{
await mongoose.connect("mongodb://127.0.0.1:27017/Compiler")
console.log("Sccessfully contected")  
}
connectDb()

app.use("/user",userRoutes);


// Use body-parser middleware to parse POST requests

// Enable CORS


// Function to compile Java code
const compileJavaCode = (code, callback) => {
  const tempDir = path.join(__dirname, "temp");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }
  const javaFilePath = path.join(tempDir, "Main.java");
  // Write Java code to a temporary file
  fs.writeFileSync(javaFilePath, code);

  // Compile Java code using javac command
  exec(`javac ${javaFilePath}`, (error, stdout, stderr) => {
    if (error) {
      callback(stderr);
    } else {
      // Run the compiled Java code using java command
      exec(`java -cp ${tempDir} Main`, (runError, runStdout, runStderr) => {
        if (runError) {
          callback(runStderr);
        } else {
          callback(runStdout);
        }
      });
    }
  });
};



const compileJsCode = (code, callback) => {
      
    const fileName = 'Temp.js';

    // Save the JavaScript code to a file
    fs.writeFileSync(fileName, code);

    // Run the JavaScript code using Node.js
    exec(`node ${fileName}`, (err, stdout, stderr) => {
        if (err) {
            callback(stderr);
        }
        callback(stdout);
        
    });
};




// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  // Handle code change
  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  // Handle Java code compilation
  socket.on(ACTIONS.COMPILE_JAVA, ({ roomId, code }) => {
    compileJavaCode(code, (output) => {
      io.in(roomId).emit(ACTIONS.COMPILATION_RESULT, { output });
    });
  });
  // Handle Js code compilation
socket.on(ACTIONS.COMPILE_JS, ({ roomId, code }) => {
    console.log("inside js")
    compileJsCode(code, (output) => {
      io.in(roomId).emit(ACTIONS.COMPILATION_RESULT, { output });
    });
  });

  // Sync code with new clients
  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  // Handle disconnecting
  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });

    delete userSocketMap[socket.id];
    socket.leave();
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
