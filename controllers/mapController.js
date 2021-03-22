const fs=require('fs');
const path=require('path');
const RTree=require('./RTree');
const MapData=require('../models/Map')
const mapSearch = (req,res)=>{
    try {
        MapData.find().then((result)=>{                     
            console.log(result)
        })
        let allBound=fs.readFileSync(path.join(__dirname,'../public/RTree.json'),'utf-8')
        allBound=JSON.parse(allBound)
        let location=req.body
        
        let nearMark=[];
        RTree.dataBase.searchTree(allBound,location,nearMark)
        //console.log(nearMark)
        res.send({data:nearMark})
    } catch (error) {
        console.log(error)
    }
  
}
const mapCreate=(req,res)=>{

    try {
        const data=fs.readFileSync(path.join(__dirname,'../public/location.json'),'utf-8');
        let locations=JSON.parse(data);
        let bound=RTree.dataBase.created(locations);
        //RTree.dataBase.visit(bound)
        const map_data=new MapData(bound)
        map_data.save().then(result=>{
            console.log(result)
        }).cache((error)=>{
            console.log(error)
        })
        let writeData=JSON.stringify(bound,null,"\t")
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
    mapGetAllMarker
}