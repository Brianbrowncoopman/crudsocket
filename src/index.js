import express from "express";
import { Server as WebSocketServer } from "socket.io";
import http from "http";
import { v4 as uuid } from "uuid";

let notes = [];

const app = express();
const server = http.createServer(app);
const io = new WebSocketServer(server);

app.use(express.static(__dirname + "/public"));

io.on("connection", (socket) => {
  //console.log("conexion nueva id:", socket.id);

  socket.emit("server: loadnotes", notes);

  socket.on("client: newnote", (newNote) => {
    const note = { ...newNote, id: uuid() };
    //console.log(note);
    notes.push(note);
    io.emit("server: newnote", note);
  });

  socket.on("client: deletenote", (noteId) => {
    //console.log(id);
    notes = notes.filter((note) => note.id !== noteId);
    //console.log(notes);
    io.emit("server: loadnotes", notes);
  });

  socket.on("client: getnote", (noteId) => {
    //console.log(id);
    const note = notes.find((note) => note.id === noteId);
    //console.log(note);
    socket.emit("server: selectednote", note);
  });

  socket.on("client: updatenote", (updatedNote) => {
    //console.log(note);
    notes = notes.map((note) => {
      if (note.id === updatedNote.id) {
        note.title = updatedNote.title;
        note.description = updatedNote.description;
      }
      return note;
    });
    io.emit("server: loadnotes", notes);
  });
});

//server.listen(3000);
//console.log("servidor en puerto", 3000);

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log("Servidor en puerto", port);
});
