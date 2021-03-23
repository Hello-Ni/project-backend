const fs=require('fs');
const path=require('path');
const MapData = require('../models/Map');
const { all } = require('../routers/MapRouters');
const RTree=require('./RTree');

const mapSearch = (req,res)=>{
    try {
        let allBound=fs.readFileSync(path.join(__dirname,'../public/RTree.json'),'utf-8')
        allBound=JSON.parse(allBound)
        //RTree.dataBase.searchTree(allBound,location,nearMark)
        let location=req.body
        let nearMark=[];
        RTree.dataBase.searchDataBaseTree(allBound,location,nearMark)
        console.log(nearMark)
        res.send({data:nearMark})
    } catch (error) {
        console.log(error)
    }
  
}
const mapInsert = (req,res)=>{  
    try {
        let total=0
        MapData.countDocuments({},function(err,count){
            total=count
        })
        let allBound=fs.readFileSync(path.join(__dirname,'../public/RTree.json'),'utf-8')
        allBound=JSON.parse(allBound)
        let location=req.body
        RTree.dataBase.insertDataBaseTree(allBound,total,location);

        
    } catch (error) {
        
    }
}
const mapCreate=(req,res)=>{

    try {
        console.log("enter!")
        const data=fs.readFileSync(path.join(__dirname,'../public/location.json'),'utf-8');
        let locations=JSON.parse(data);
        let roots=RTree.dataBase.created(locations);
        let total=RTree.dataBase.visit(roots)
        
        let allNode=RTree.dataBase.allNode
        roots.type="root"
        allNode.push(roots)//add parent to node
        allNode.reverse()
        // MapData.insertMany(allNode)
        // .then(function(){ 
        //     console.log("Data inserted")  // Success 
        // }).catch(function(error){ 
        //     console.log(error)      // Failure 
        // });

        let writeData=JSON.stringify(allNode,null,"\t")
        fs.writeFileSync(path.join(__dirname,'../public/RTree.json'),writeData,'utf-8')
        
        res.send({status:1})
    } catch (error) {
        res.send({status:0})
    }

    
}
const mapGetAllMarker=(req,res)=>{
    const data=fs.readFileSync(path.join(__dirname,'../public/location.json'),'utf-8');
    let locations=JSON.parse(data)
    res.send({data:locations})
}
module.exports={
    mapSearch,
    mapCreate,
    mapInsert,
    mapGetAllMarker
}