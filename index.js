var express = require("express");
var app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

let server=require("./server");
let config=require("./config");
let middleware=require("./middleware");
const response= require("express");

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://127.0.0.1:27017";
const dbName = 'Hospital_Management';
let db
MongoClient.connect(url,{useUnifiedTopology:true,useNewUrlParser:true}, (err, client) => {
    if (err) return console.log(err);
    db = client.db(dbName);
    console.log(`Connected Database: ${url}`);
    console.log(`Database : ${dbName}`);
});


//Hospital details
app.get('/hospital',middleware.checkToken, (req, res) => {
    console.log("Fetching data from Hospital collection");
    var data = db.collection("Hospital").find().toArray().then(result => res.json(result));

});
//Ventilator Details
app.get('/ventilator',middleware.checkToken, (req, res) => {
    console.log("Fetching data from ventilator collection");
    var data = db.collection("ventilators").find().toArray().then(result => res.json(result));
});
//Search Ventilator by status
app.post('/searchventilatorbystatus',middleware.checkToken, (req, res) => {
    var status = req.body.status;
    console.log("search ventilator by status");
    var data = db.collection("ventilators").find({ "status": status }).toArray().then(result => res.json(result));
});

//Search Ventilator by ventilator Id
app.post('/searchventilatorbyid',middleware.checkToken, (req, res) => {
    var ventid = req.query.ventilatorId;
    console.log("search ventilator by ventilator Id");
    var data = db.collection("ventilators").find({ "ventilatorId": new RegExp(ventid,'i')}).toArray().then(result => res.json(result));
});

//Search Ventilator by Hospital name
app.post('/searchventilatorbyHospitalname',middleware.checkToken, (req, res) => {
    var name = req.query.name;
    console.log("search ventilator by Hospital name");
    var data = db.collection("ventilators").find({ "name": new RegExp(name,'i')}).toArray().then(result => res.json(result));
});

//Search Hospital by name
app.post('/searchHospitalbyname',middleware.checkToken, (req, res) => {
    var name = req.query.name;
    console.log("search Hospital by name");
    var data = db.collection("Hospital").find({ "name":new RegExp(name,'i')}).toArray().then(result => res.json(result));
});

//update ventilator details
app.put('/updateventilatorbystatus',middleware.checkToken,(req,res)=>{
    var ventid={"ventilatorId":req.body.ventilatorId};
    console.log(ventid);
    var newvalues={$set:{"status":req.body.status}};
    db.collection("ventilators").updateOne(ventid,newvalues,function (err,result){
        res.json('1 document updated');
        if(err) throw err;
    })
});

//Add ventilator
app.put('/addventilatorbyuser',middleware.checkToken,(req,res)=>{
    var hid=req.body.hId;
    var ventilatorId=req.body.ventilatorId;
    var status=req.body.status;
    var name=req.body.name;
    var item={"hId" : hid,
    "ventilatorId" : ventilatorId,
    "status" :status,
    "name" : name};
    console.log("adding ventilator by user");
    db.collection('ventilators').insertOne(item,function(err,result){
        res.json('item inserted');
    });
});

//delete ventilator by ventilatorId
app.put('/deleteventilatorbyid',middleware.checkToken,(req,res)=>{
    var ventid={"ventilatorId":req.body.ventilatorId};
    console.log("delete ventilator by ventilatorId"+ventid);
    db.collection("ventilators").deleteOne(ventid,function (err,result){
        res.json('1 document deleted');
        if(err) throw err;
    })
});

app.listen(3000);