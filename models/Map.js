const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const mapSchema=new Schema({
    children:{
        type:Array,
        require:true
    },
    boundary:{
        type:Object,
        require:true
    },
    contain_type:{ 
        type:String,
        require:true
    },
    maxContain:{
        type:Number,
        require:true
    },
    number:{
        type:Number,
        require:true
    }
})
const MapData=mongoose.model('MapData',mapSchema)
module.exports=MapData