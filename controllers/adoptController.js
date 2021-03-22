const fs=require('fs');
const path=require('path');
const AnimalData=require('../models/Animal');
const createAnimal=(req,res)=>{
    try {
        const animal_data=new AnimalData(req.body)
        animal_data.save().then(result=>{
            console.log(result)
        }).cache(error=>{
            console.log(error)
        })
    } catch (error) {
        
    }
}
const findAnimal=(req,res)=>{
    try {
        AnimalData.find({name:"lucy"}).then(result=>{
            console.log(result)
        }).cache(err=>{
            console.log(err)
        })
    } catch (error) {
        
    }
}
module.exports={
    createAnimal,
    findAnimal
}