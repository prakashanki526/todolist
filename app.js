const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://prakashankit526:AnkitPrakash@cluster0.qmiocbo.mongodb.net/todolist",{useNewUrlParser:true});

const itemsSchema = {
    name : String
}

const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({
    name : "Wake up early"
});
const item2 = new Item({
    name : "Take breakfast"
});
const item3 = new Item({
    name : "Study"
});

const defaultitems = [item1,item2,item3];

app.get("/",function(req,res){
    Item.find({},function(err,founditems){
        if(founditems.length===0){
            Item.insertMany(defaultitems,function(err){
                if(err)
                    console.log(err);
                else
                    console.log("Items inserted");
            });  
            res.redirect("/");
        }
        else{
            res.render("list",{listtitle: "Today", newlistitems: founditems});
        }
    });
})

app.post("/",function(req,res){
    const itemname = req.body.newtext;
    const listname = req.body.list;

    const item = new Item({
        name : itemname
    });
    if(listname === "Today"){
        item.save();
        res.redirect("/");
    }
    else{
        List.findOne({name:listname},function(err,foundlist){
            foundlist.items.push(item);
            foundlist.save();
            res.redirect("/"+listname);
        })
    }
    
});

const listschema = {
    name : String,
    items: [itemsSchema]
}

const List = mongoose.model("List",listschema);

app.get("/:customlistname",function(req,res){
    const customlistname = req.params.customlistname;
    List.findOne({name : customlistname},function(err,foundlist){
        if(!err){
            if(!foundlist){
                const list = new List({
                    name : customlistname,
                    items : defaultitems
                });
                list.save();
                res.redirect("/"+customlistname);
            }
            else{
                res.render("list",{listtitle:foundlist.name,newlistitems:foundlist.items});
            }
        }
    });
})

app.post("/work",function(req,res){
    const itemname = req.body.newtext;
    const item = new workitem
})

app.get("/about",function(req,res){
    res.render("about");
})

app.post("/delete",function(req,res){
    const checkeditemid = req.body.checkbox;
    const listname = req.body.listname;

    if(listname === "Today"){
        Item.findByIdAndRemove(checkeditemid,function(err){
            if(!err)
                // console.log("Deleted successfully");
                res.redirect("/");
        });
    }
    else{
        List.findOneAndUpdate({name:listname}, {$pull: {items: {_id: checkeditemid}}},function(err,foundlist){
            if(!err){
                res.redirect("/"+listname);
            }
        });
    }
});

let port = process.env.PORT;
if(port==null || port==""){
    port = 3000;
}

app.listen(port,function(req,res){
    console.log("Listening");
})