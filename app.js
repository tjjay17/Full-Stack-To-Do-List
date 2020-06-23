const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const date = require('./date.js');
const mongoose = require('mongoose');
const app = express();
const lodash = require('lodash');
const empty = '';

mongoose.connect('mongodb://localhost:27017/ToDoList', { useNewUrlParser: true, useUnifiedTopology: true });

var itemSchema = new mongoose.Schema({
  name:String
});

var listSchema = new mongoose.Schema({
  name: String,
  items:[itemSchema]
});


const Item = mongoose.model('Item', itemSchema);

const List = mongoose.model('List', listSchema);

const item1 = new Item({
  name:'Start the Day!'
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('static'));
app.set('view engine', 'ejs');

const today = date.date();
app.get("/", function(req, res) {
 // today = date.date();

  Item.find({},function(err, allItems){
     if (err){
       console.log(err);
     }else{
       res.render('list', {dayKind: today, taskdata:allItems,listName:empty});
     }
  });
});

app.get('/:customList',function(req,res){
    const listName = lodash.capitalize(req.params.customList);

    List.findOne({name:listName},function(err,itemsAll) {
    if(!err){

      if(!itemsAll){

        var cusList = new List({
          name:listName,
          items:[item1]
        });

        cusList.save();
        res.redirect("/" + listName);
      }else{
        console.log(err);
          res.render('list', {dayKind:today, taskdata:itemsAll.items, listName:itemsAll.name });
    }
    }

  });
});

// app.get("/:Listname",function(req,res){
//   console.log(req.params.Listname);
// });

app.post("/", function(req, res) {
  const itemName = req.body.newtask;
  const listId = req.body.add;
  console.log(listId +"listID");

  var newItem = new Item({
    name:itemName
  });

if(itemName !== "" && listId === ''){
    newItem.save();
    res.redirect("/");
}else{
  List.findOne({name:listId},function(err,gotItem) {
    // if(err){
    //   console.log(err);
    // }
    gotItem.items.push(newItem);
    gotItem.save();
    res.redirect('/' + listId);
  });
}


 });

 app.post("/delete",function(req,res){
   const delItem = req.body.checkBox;
   const nameList = req.body.nameList;
   console.log(nameList + "line 103");

   if(nameList == ''){
     Item.findByIdAndRemove(delItem,function(err){
       if(err){
         console.log(err);
       }
   });
   res.redirect("/");
 }else{
   List.findOneAndUpdate({name: nameList}, {$pull:{items:{_id:delItem}}},function(err,foundIt){
     if(!err){
       res.redirect("/" + nameList);
     }
   });
 }
 });

app.listen(process.env.port||3000);
