'use strict';
class RTree{
    constructor(){
        this.bound=new Bound();
        this.num=0;
    }
    created(locations){
        locations.forEach(loc => {
            let flag=  this.bound.insert(loc.lng,loc.lat,"point");
        });
        return this.bound
    }
    visit(bounds){
        if(bounds.contain_type=="rectangle"){
            bounds.children.forEach((child)=>{
                this.visit(child);
            })
        }
        else{
           bounds.children.forEach((child)=>{
               console.log(child.boundary)
           })

        }
    }
}
class Bound{
    constructor(){
        this.children=[];
        this.boundary={left:180,right:0,top:0,bottom:90};
        this.contain_type="point";
        this.maxContain=5;
        this.num=0
    }
    setBoundary(new_boundary){
        this.boundary=Object.assign(new_boundary)
    }
    insert(x,y,type){
        //console.log(x+" "+y);
        if(this.contain_type==="point"){
            //insert in many point
            let point={boundary: {left:x,right:x,top:y,bottom:y} };
            this.children.push(point);
        }else{
            
            //insert in many rectangle
            let min_d_height=1000;
            let min_d_width=1000;
            let idx=0;

            //find the closer bound
            this.children.forEach((child,i)=>{
                let d_w = 0;
                let d_h = 0;
                if (x < child.boundary.left) {
                    d_w += (child.boundary.left - x);
                   
                }
                if (x > child.boundary.right) {
                    d_w += (x - child.boundary.right);
                }
                if (y > child.boundary.top) {
                    d_h += (y-child.boundary.top);
                }
                if (y < child.boundary.bottom ) {
                    d_h += (child.boundary.bottom-y);
                }
                if (d_w + d_h < min_d_width + min_d_height) {
                    min_d_width = d_w;  
                    min_d_height = d_h;
                    idx = i;
                   
                }
                
            })
            
            if(this.children[idx].insert(x,y,type)){
                let newChildren=this.children[idx].getSplitChildren();        
                this.children.splice(idx);
                newChildren.forEach((child)=>{
                    this.children.push(child);
                })
            }
                

        }
        //expand rectangle
        if(x < this.boundary.left)this.boundary.left=x;    
        if(x > this.boundary.right)this.boundary.right=x;
        if(y > this.boundary.top)this.boundary.top=y;
        if(y <this.boundary.bottom)this.boundary.bottom=y;
        if(this.isOverFlow()){
            return true;
        }   
        else{
            return false
        }
    }
    isOverFlow(){
        if(this.children.length>=this.maxContain){
            if (this.contain_type == "point") {
                
                //find minimum perimeter with top/left sorting
                this.minBound(2);
                
            } else {
                //find munimum perimeter with all boundary sorting
                this.minBound(4);
            }
            return true
        }
        else
            return false
    }
    minBound(cmp_time){
        let new_b1 = new Bound();
        let new_b2 = new Bound();
        let new_bdy={left:180,right:0,top:0,bottom:90};
        let total_perimeter=1000;
        let minB=this.maxContain*0.4;
        for(let k=0;k<cmp_time;++k){  
            this.sortByDir(k);
            //min 0.4B max B point
            for(let i=minB ; i<=this.maxContain-minB ; ++i){
                new_bdy={left:180,right:0,top:0,bottom:90};
                let perimeter=0;
                let b1=new Bound();
                let b2=new Bound();
                for(let j=0;j<i;++j){     
                    //find the new boundary
                    let top=this.children[j].boundary.top;
                    let left=this.children[j].boundary.left;
                    let btm=this.children[j].boundary.bottom;
                    let right=this.children[j].boundary.right;
                    if(top> new_bdy.top)
                        new_bdy.top=top;
                    if(btm <new_bdy.bottom)
                        new_bdy.bottom=btm;
                    if(left < new_bdy.left)
                        new_bdy.left=left;
                    if(right > new_bdy.right)
                        new_bdy.right=right;
                    //console.log("top:"+new_bdy.top+" left:"+new_bdy.left+" right:"+new_bdy.right+" bottom:"+new_bdy.bottom)
                    let new_child=this.children[j];
                    b1.children.push(new_child);                    
                }
                b1.setBoundary(new_bdy);
                perimeter=(Math.abs(new_bdy.right-new_bdy.left)+Math.abs(new_bdy.top-new_bdy.bottom));
                new_bdy={left:180,right:0,top:0,bottom:90};
                for(let j=i ;j<this.maxContain;++j){
                    //find the new boundary
                    let top=this.children[j].boundary.top;
                    let left=this.children[j].boundary.left;
                    let btm=this.children[j].boundary.bottom;
                    let right=this.children[j].boundary.right;
                    if(top> new_bdy.top)
                        new_bdy.top=top;
                    if(btm <new_bdy.bottom)
                        new_bdy.bottom=btm;
                    if(left < new_bdy.left)
                        new_bdy.left=left;
                    if(right > new_bdy.right)
                        new_bdy.right=right;
                    let new_child=this.children[j];
                    b2.children.push(new_child);
                }
                b2.setBoundary(new_bdy);
                perimeter+=(Math.abs(new_bdy.right-new_bdy.left)+Math.abs(new_bdy.top-new_bdy.bottom));
                
                if(perimeter < total_perimeter){
                    
                    try {
                        new_b1=Object.assign(b1)
                        new_b2=Object.assign(b2)

                    } catch (error) {
                        console.log(error)
                    }
                    total_perimeter=perimeter
                }
            }
        }
        this.children=[];
        if(this.contain_type=="point"){
            new_b1.contain_type="point"
            new_b2.contain_type="point"
            this.contain_type="rectangle"
        }
        else{
            new_b1.contain_type="rectangle"
            new_b2.contain_type="rectangle"
        }
        this.children.push(new_b1)
        this.children.push(new_b2)
        //console.log(this.children)

    }
    sortByDir(boundary){
        switch(boundary){
            case 0:
                this.children.sort((a,b)=>{
                    return a.boundary.left-b.boundary.left
                })
                break;
            case 1:       
                this.children.sort((a,b)=>{
                    return a.boundary.top-b.boundary.top
                })
                break;
            case 2:       
                this.children.sort((a,b)=>{
                    return a.boundary.right-b.boundary.right
                })
            break;
            case 3:       
                this.children.sort((a,b)=>{
                    return a.boundary.bottom-b.boundary.bottom
                })
            break;
        }
    }
    getSplitChildren(){
        return this.children;
    }
    

    

}
let dataBase=new RTree();
module.exports={
    dataBase
}