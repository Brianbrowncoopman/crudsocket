"use strict";

var notesList = document.querySelector("#notes");
var savedId = "";
var noteUi = function noteUi(note) {
  var div = document.createElement("div");

  //console.log(note);
  div.innerHTML = "\n  <div class =\"card card-body rounded-0 mb-2 animate__animated animate__fadeInUp\" >\n    <div class=\"d-flex justify-content-between\" >\n      <h1 class=\"h3 card-title\">".concat(note.title, "</h1>\n      <div>\n        <button class=\"btn btn-danger delete\" data-id=\"").concat(note.id, "\"> borrar</button>\n        <button class=\"btn btn-secondary update\" data-id=\"").concat(note.id, "\"> editar</button>\n      </div>\n    </div>\n    <p>").concat(note.description, "</p>\n  </div>\n  ");
  var btnDelete = div.querySelector(".delete");
  var btnUpdate = div.querySelector(".update");
  btnDelete.addEventListener("click", function () {
    //console.log(btnDelete.dataset.id);
    deleteNote(btnDelete.dataset.id);
  });
  btnUpdate.addEventListener("click", function () {
    //console.log(btnUpdate.dataset.id);
    getNote(btnUpdate.dataset.id);
  });
  return div;
};
var renderNotes = function renderNotes(notes) {
  notesList.innerHTML = "";
  notes.forEach(function (note) {
    notesList.append(noteUi(note));
  });
};
var appendNote = function appendNote(note) {
  notesList.append(noteUi(note));
};