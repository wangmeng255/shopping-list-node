var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');

var should = chai.should();
var app = server.app;
var storage = server.storage;

chai.use(chaiHttp);

describe('Shopping List', function() {
    it('should list items on GET', function(done) {
        chai.request(app)
            .get('/items')
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length(3);
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('id');
                res.body[0].should.have.property('name');
                res.body[0].id.should.be.a('number');
                res.body[0].name.should.be.a('string');
                res.body[0].name.should.equal('Broad beans');
                res.body[1].name.should.equal('Tomatoes');
                res.body[2].name.should.equal('Peppers');
                done();
            });
    });
    it('should add an item on POST', function(done) {
        chai.request(app)
            .post('/items')
            .set('contengType', 'application/json')
            .send({'name': 'Kale'})
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('id');
                res.body.name.should.be.a('string');
                res.body.id.should.be.a('number');
                res.body.name.should.equal('Kale');
                storage.items.should.be.a('array');
                storage.items.should.have.length(4);
                storage.items[3].should.be.a('object');
                storage.items[3].should.have.property('id');
                storage.items[3].should.have.property('name');
                storage.items[3].id.should.be.a('number');
                storage.items[3].name.should.be.a('string');
                storage.items[3].name.should.equal('Kale');
                done();
            });
    });
    it('should edit an item on put', function(done) {
        chai.request(app)
            .put('/items/0')
            .set('contentType', 'application/json')
            .send({name: 'Green beans', id: 0})
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length(4);
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('id');
                res.body[0].should.have.property('name');
                res.body[0].id.should.be.a('number');
                res.body[0].name.should.be.a('string');
                storage.items[0].name.should.equal('Green beans');
                storage.items[1].name.should.equal('Tomatoes');
                storage.items[2].name.should.equal('Peppers');
                storage.items[3].name.should.equal('Kale');
                done();
            });
    });
    it('should delete an item on delete', function(done) {
        chai.request(app)
            .delete('/items/0')
            .set('contentType', 'application/json')
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length(3);
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('id');
                res.body[0].should.have.property('name');
                res.body[0].id.should.be.a('number');
                res.body[0].name.should.be.a('string');
                storage.items[0].name.should.equal('Tomatoes');
                storage.items[1].name.should.equal('Peppers');
                storage.items[2].name.should.equal('Kale');
                done();
            });
    });
    it('POST to an ID that exists');
    it('POST without body data', function(done) {
        chai.request(app)
        .post('/items')
            .set('contentType', 'application/json')
            .send({})
            .end(function(err, res) {
                res.should.have.status(400);
                done();
            });
    });
    it('POST with something other than valid JSON', function(done) {
        chai.request(app)
            .post('/items')
            .send('I am not a json')
            .end(function(err, res) {
                res.should.have.status(400);
                done();
            });
    });
    it('PUT without an ID in the endpoint', function(done) {
        chai.request(app)
            .put('/items/')
            .set('contentType', 'application/json')
            .send({name: 'a', id: 0})
            .end(function(err, res) {
                res.should.have.status(404);
                done();
            });
    });
    it('PUT with different ID in the endpoint than the body', function(done) {
        chai.request(app)
            .put('/items/0')
            .set('contentType', 'application/json')
            .send({name: 'a', id: 1})
            .end(function(err, res) {
                res.should.have.status(400);
                done();
            });
    });
    it('PUT to an ID that doesnt exist', function(done) {
        chai.request(app)
            .put('/items/5')
            .set('contentType', 'application/json')
            .send({name: 'a', id: 5})
            .end(function(err, res) {
                res.should.have.status(200);
                storage.items[0].name.should.equal('Tomatoes');
                storage.items[1].name.should.equal('Peppers');
                storage.items[2].name.should.equal('Kale');
                storage.items[3].name.should.equal('a');
                done();
            });
    });
    it('PUT without body data', function(done) {
        chai.request(app)
            .put('/items/0')
            .set('contentType', 'application/json')
            .end(function(err, res) {
                res.should.have.status(400);
                done();
            });
    });
    it('PUT with something other than valid JSON', function(done) {
        chai.request(app)
            .put('/items/0')
            .set('contentType', 'application/json')
            .send('I am not a json')
            .end(function(err, res) {
                res.should.have.status(400);
                done();
            });
    });
    it('DELETE an ID that doesnt exist', function(done) {
        chai.request(app)
            .delete('/items/0')
            .set('contentType', 'application/json')
            .end(function(err, res) {
                res.should.have.status(404);
                done();
            });
    });
    it('DELETE without an ID in the endpoint', function(done) {
        chai.request(app)
            .delete('/items/')
            .set('contentType', 'application/json')
            .end(function(err, res) {
                res.should.have.status(404);
                done();
            });
    });
});