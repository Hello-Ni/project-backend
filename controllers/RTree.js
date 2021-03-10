'use strict';
class RTree{
    constructor(){
        this.bound=new Bound();

    }
    created(locations){
        locations.forEach(loc => {
            this.bound.insert(loc.lng,loc.lat,"point");
        });
        //console.log(this.bound.children);
    }
}
class Bound{
    constructor(){
        this.children=[];
        this.direction={left:180,right:0,top:0,bottom:90};
        this.contain_type="point";
        this.maxContain=5;
    }
    insert(x,y,type){
        //console.log(x+" "+y);
        if(this.contain_type==="point"){
            //insert in many point
            let point={left:x,right:x,top:y,bottom:y};
            this.children.push(point);
        }else{
            //insert in many rectangle

        }
        //expand rectangle
        if(x < this.direction.left)this.direction.left=x;    
        if(x > this.direction.right)this.direction.right=x;
        if(y > this.direction.top)this.direction.top=y;
        if(y <this.direction.bottom)this.direction.bottom=y;

        this.isOverFlow();            
        
    }
    isOverFlow(){
        if(this.children.length>=this.maxContain){
            if (this.contain_type == "point") {
                //find minimum perimeter with top/left sorting
                this.minBound(false);
            } else {
                //find munimum perimeter with all direction sorting
                this.minBound(true);
            }
        }
    }
    minBound(isContainRect){
        let new_b1 = new Bound();
        let new_b2 = new Bound();
        let min_top = 90, max_btm = 0, min_left = 180, max_right = 0;
        let height=0, width=0, perimeter = 0;
        let minB=this.maxContain*0.4;
        this.children.sort((a,b)=>{
            return a.left-b.left
        })
        //min 0.4B max B point
        for(let i=minB-1 ; i<this.maxContain-minB-1 ; ++i){
            let b1=new Bound();
            let b2=new Bound();
            for(let j=0;j<i;++j){
                let new_child=this.children[j];
                b1.children.add(new_child);

            }
            for(let j=i;j<this.maxContain;++j){
                let new_child=this.children[j];
                b1.children.add(new_child)
            }
        }
        this.children.sort((a,b)=>{
            return a.top-b.top
        })
        if(isContainRect){
            this.children.sort((a,b)=>{
                return a.right-b.right
            })
            this.children.sort((a,b)=>{
                return a.bottom-b.bottom
            })
        }

    }


    

}
let dataBase=new RTree();
module.exports={
    dataBase
}