'use strict';
const MapData=require('../models/Map')
class RTree{
    constructor(){
        this.bound=new Bound();
        this.nodeNum=0;
        this.node=[]
    }
    get allNode(){
        return this.node
    }
    created(locations){
        this.nodeNum=locations.length
        locations.forEach((loc,idx) => {
            let flag=  this.bound.insert(loc.lng,loc.lat,idx,"point");
        });
        return this.bound
    }
    visit(bounds){
        if(bounds.contain_type=="rectangle"){
            bounds.children.forEach((child)=>{
                let number=this.visit(child)
                bounds.nodes.push(number);
                this.node.push(child)
            })
            this.nodeNum++
            bounds.number=this.nodeNum
            delete bounds.children//just record the number marker
            return bounds.number
        }
        else{
           bounds.children.forEach((child)=>{
               bounds.nodes.push(child.number)
               delete child.children
               this.node.push(child)
           })
           this.nodeNum++
           bounds.number=this.nodeNum
           delete bounds.children//just record the number marker
           return bounds.number
        }
    }
    searchTree(bounds,location,marks){
        //console.log(bounds.boundary)
        //the rectangle is intersected or not
        if(parseFloat(location.left)>bounds.boundary.right || parseFloat(location.right)<bounds.boundary.left)
            return;
        if(parseFloat(location.top)<bounds.boundary.bottom || parseFloat(location.bottom)>bounds.boundary.top)
            return;
        if(bounds.children.length>0){
            bounds.children.forEach((child)=>{
                this.searchTree(child,location,marks)
            })
        }else{
            let lng=bounds.boundary.left;
            let lat=bounds.boundary.top;
            let number=bounds.number;
            if(lng>parseFloat(location.left) && lng<parseFloat(location.right) 
               && lat<parseFloat(location.top) && lat>parseFloat(location.bottom))
                marks.push({lng:lng,lat:lat,number:number,type:"dog"})
        }


    }
    insertDataBaseTree(bounds,num,location){
        let parent=bounds.find(bound=>bound.number==num)
        let x=parseFloat(location.longitude)
        let y=parseFloat(location.latitude)
        while(parent.contain_type==="rectangle"){
            let queues=[...parent.nodes]
            let min_d_height=1000;
            let min_d_width=1000;
            queues.forEach((q)=>{
                let node=bounds.find(bound=>bound.number==q);
                let d_w = 0;
                let d_h = 0;
                if (x < node.boundary.left) {
                    d_w += (node.boundary.left - x);
                   
                }
                
                if (x >node.boundary.right) {
                    d_w += (x - node.boundary.right);
                }
                
                if (y > node.boundary.top) {
                    d_h += (y-node.boundary.top);
                }
                
                if (y < node.boundary.bottom ) {
                    d_h += (node.boundary.bottom-y);
                }
                if (d_w + d_h < min_d_width + min_d_height) {
                    min_d_width = d_w;  
                    min_d_height = d_h;
                    
                    parent={...node}
                }
            })
        }
        console.log(parent.nodes)
    }
    searchDataBaseTree(idx,location,marks){
        let root=bounds.find(bound=>bound.number===idx)
        if(parseFloat(location.left)>root.boundary.right || parseFloat(location.right)<root.boundary.left)
            return;
        if(parseFloat(location.top)<root.boundary.bottom || parseFloat(location.bottom)>root.boundary.top)
            return;
        let queue=[...root.nodes]
        console.log(root)
        while(queue.length>0){
            
            let n=queue.pop()
            let target=bounds.find(bound=>bound.number==n)
            if(target.nodes.length>0){
                if(parseFloat(location.left)>target.boundary.right || parseFloat(location.right)<target.boundary.left)
                    continue;
                if(parseFloat(location.top)<target.boundary.bottom || parseFloat(location.bottom)>target.boundary.top)
                    continue;
                queue=queue.concat(target.nodes)
            }else{
                console.log(target)
                //the leaf of R tree
                let lng=target.boundary.left;
                let lat=target.boundary.top;
                let number=target.number;
                if(lng>parseFloat(location.left) && lng<parseFloat(location.right) 
                && lat<parseFloat(location.top) && lat>parseFloat(location.bottom))
                    marks.push({lng:lng,lat:lat,number:number,type:"dog"})
                //console.log(marks)
            }
        }

    }
}
class Bound{
    constructor(){
        this.type="node";
        this.children=[];
        this.nodes=[];
        this.boundary={left:180,right:0,top:0,bottom:90};
        this.contain_type="point";
        this.maxContain=5;
        this.number=0;

    }
    setBoundary(new_boundary){
        this.boundary=Object.assign(new_boundary)
    }
    insert(x,y,number,type){
        if(this.contain_type==="point"){
            //insert in many point
            let point=new Bound();
            point.setBoundary({left:x,right:x,top:y,bottom:y} )
            point.number=number;
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
            
            if(this.children[idx].insert(x,y,number,type)){
                let newChildren=this.children[idx].getSplitChildren();
                this.children.splice(idx,1);
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