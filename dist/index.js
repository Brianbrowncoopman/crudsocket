"use strict";

var _express = _interopRequireDefault(require("express"));
var _socket = require("socket.io");
var _http = _interopRequireDefault(require("http"));
var _uuid = require("uuid");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var notes = [];
var app = (0, _express["default"])();
var server = _http["default"].createServer(app);
var io = new _socket.Server(server);
app.use(_express["default"]["static"](__dirname + "/public"));
io.on("connection", function (socket) {
  //console.log("conexion nueva id:", socket.id);

  socket.emit("server: loadnotes", notes);
  socket.on("client: newnote", function (newNote) {
    var note = _objectSpread(_objectSpread({}, newNote), {}, {
      id: (0, _uuid.v4)()
    });
    //console.log(note);
    notes.push(note);
    io.emit("server: newnote", note);
  });
  socket.on("client: deletenote", function (noteId) {
    //console.log(id);
    notes = notes.filter(function (note) {
      return note.id !== noteId;
    });
    //console.log(notes);
    io.emit("server: loadnotes", notes);
  });
  socket.on("client: getnote", function (noteId) {
    //console.log(id);
    var note = notes.find(function (note) {
      return note.id === noteId;
    });
    //console.log(note);
    socket.emit("server: selectednote", note);
  });
  socket.on("client: updatenote", function (updatedNote) {
    //console.log(note);
    notes = notes.map(function (note) {
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

var port = process.env.PORT || 3000;
server.listen(port, function () {
  console.log("Servidor en puerto", port);
});