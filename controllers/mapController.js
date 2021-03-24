const fs=require('fs');
const path=require('path');
const MapData = require('../models/Map');
const { all } = require('../routers/MapRouters');
const RTree=require('./RTree');

const mapSearch = (req,res)=>{
    try {
        let allBound=fs.readFileSync(path.join(__dirname,'../public/RTree.json'),'utf-8')
        allBound=JSON.parse(allBound)
        let location=req.body
        let nearMark=[];
        RTree.instruction.search(allBound,location,nearMark)
        // let root=allBound.find(bound=>bound.type==="root")
        // RTree.instruction.searchDataBaseTree(allBound,root,location,nearMark)
        res.send({data:nearMark})
    } catch (error) {
        console.log(error)
    }
  
}
const mapInsert = (req,res)=>{  
    try {
        let allBound=fs.readFileSync(path.join(__dirname,'../public/RTree.json'),'utf-8')
        allBound=JSON.parse(allBound)
        let location=req.body
        let newBounds=RTree.instruction.insert(allBound,location)
        let writeData=JSON.stringify(newBounds,null,"\t")
        fs.writeFileSync(path.join(__dirname,'../public/RTree.json'),writeData,'utf-8')
        // let root=allBound.find(bound=>bound.type==="root")
        // RTree.instruction.insertDataBaseTree(allBound,allBound.length,root,location);
        res.send({status:'OK'})
        
    } catch (error) {
        
    }
}
const mapCreate=(req,res)=>{

    try {
        const data=fs.readFileSync(path.join(__dirname,'../public/location.json'),'utf-8');
        let locations=JSON.parse(data);
        let roots=RTree.instruction.created(locations);



        /** for not recursive solve */
        //let total=RTree.instruction.visit(roots)
        // let allNode=RTree.instruction.allNode
        // roots.type="root"
        // allNode.push(roots)//add parent to node
        // allNode.reverse()


        // MapData.insertMany(allNode)
        // .then(function(){ 
        //     console.log("Data inserted")  // Success 
        // }).catch(function(error){ 
        //     console.log(error)      // Failure 
        // });

        let writeData=JSON.stringify(roots,null,"\t")
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