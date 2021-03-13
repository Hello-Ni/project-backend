const fs=require('fs');
const path=require('path');
const RTree=require('./RTree');
const map_search = (req,res)=>{
    try {
        let allBound=fs.readFileSync(path.join(__dirname,'../public/RTree.json'),'utf-8')
        allBound=JSON.parse(allBound)
        let location=req.body
        
        let nearMark=[];
        RTree.dataBase.searchTree(allBound,location,nearMark)
        console.log(nearMark)
        res.send(nearMark)
    } catch (error) {
        console.log(error)
    }
  
}
const map_create=(req,res)=>{
    console.log("created")
    try {
        
        const data=fs.readFileSync(path.join(__dirname,'../public/location.json'),'utf-8');
        let locations=JSON.parse(data);
        let bound=RTree.dataBase.created(locations);
        RTree.dataBase.visit(bound)
        let writeData=JSON.stringify(bound,null,"\t")
        fs.writeFileSync(path.join(__dirname,'../public/RTree.json'),writeData,'utf-8')
        res.send({status:1})
    } catch (error) {
        res.send({status:0})
    }

    
}
module.exports={
    map_search,
    map_create
}