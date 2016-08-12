var express = require('express');

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = function() {
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name) {
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
    return item;
};

var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', function(request, response) {
    response.json(storage.items);
});

app.post('/items', jsonParser, function(request, response) {
    if (!request.body || !request.body.hasOwnProperty('name')) {
        return response.sendStatus(400);
    }
    
    var item = storage.add(request.body.name);
    response.status(201).json(item);
});

app.delete('/items/:id', jsonParser, function(request, response) {
  if(!request.body) return response.sendStatus(400);
  
  var id = parseInt(request.params.id);
  if(isNaN(id)) return response.sendStatus(404);
  
  var isFound = false;
  for(var i = 0; i < storage.items.length; i++) {
    if(storage.items[i].id === id) {
      isFound = true;
      storage.items.splice(i, 1);
    }
  }
  if(isFound) return response.status(200).json(storage.items);
  else return response.sendStatus(404);
});

app.put('/items/:id', jsonParser, function(request, response) {
  if(!request.body || !request.body.hasOwnProperty('name') || !request.body.hasOwnProperty('id')) {
    return response.sendStatus(400);
  }
  
  var id = parseInt(request.params.id);
  if(id !== request.body.id) return response.sendStatus(400);
  
  var isFound = false;
  for(var i = 0; i < storage.items.length; i++) {
    if(storage.items[i].id === id) {
      isFound = true;
      storage.items[i].name = request.body.name;
    }
  }
  if(!isFound) {
    storage.items.push({name: request.body.name, id: request.body.id});
  }
  return response.status(200).json(storage.items);
});

app.listen(process.env.PORT, process.env.IP);

exports.app = app;
exports.storage = storage;