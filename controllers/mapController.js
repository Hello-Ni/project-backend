const fs=require('fs');
const path=require('path');
const RTree=require('./RTree');
const map_search = (req,res)=>{
    const data = fs.readFileSync(path.join(__dirname,'../public/data.json'), 'utf8')
    let locations=JSON.parse(data);
    console.log(locations.loc0)
    res.send(locations.loc0)
  
}
const map_create=(req,res)=>{
    
    try {
        const data=fs.readFileSync(path.join(__dirname,'../public/location.json'),'utf-8');
        let locations=JSON.parse(data);
        let bound=RTree.dataBase.created(locations);
        RTree.dataBase.visit(bound);
        res.send({status:bound})
    } catch (error) {
        res.send({status:0})
    }

    
}
module.exports={
    map_search,
    map_create
}