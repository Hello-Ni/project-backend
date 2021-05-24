"use strict";
const MapData = require("../models/Map");
class Instruction {
  created(data) {
    let rootBound = new Bound();
    let Rtree = new RTree();

    data.forEach((d, idx) => {
      console.log(idx);
      let flag = Rtree.insertTree(
        rootBound,
        d.place.lng,
        d.place.lat,
        idx,
        "point",
        d
      );
    });
    //console.log(rootBound)
    return rootBound;
  }

  search(bounds, location, marks, details) {
    //the rectangle is intersected or not
    if (
      parseFloat(location.left) > bounds.boundary.right ||
      parseFloat(location.right) < bounds.boundary.left
    )
      return;
    if (
      parseFloat(location.top) < bounds.boundary.bottom ||
      parseFloat(location.bottom) > bounds.boundary.top
    )
      return;
    if (bounds.children.length > 0) {
      bounds.children.forEach((child) => {
        this.search(child, location, marks, details);
      });
    } else {
      let lng = bounds.boundary.left;
      let lat = bounds.boundary.top;
      let number = bounds.number;
      let detail = bounds.detail;
      if (
        lng > parseFloat(location.left) &&
        lng < parseFloat(location.right) &&
        lat < parseFloat(location.top) &&
        lat > parseFloat(location.bottom)
      ) {
        marks.push({ lng: lng, lat: lat });
        details.push(detail);
      }
    }
  }
  insert(bounds, location, detail, index) {
    console.log(index);
    let Rtree = new RTree();
    let x = parseFloat(location.longitude);
    let y = parseFloat(location.latitude);
    Rtree.insertTree(bounds, x, y, index, "point", detail);
    return bounds;
  }
  visit(bounds) {
    if (bounds.contain_type == "rectangle") {
      bounds.children.forEach((child) => {
        let number = this.visit(child);
        bounds.nodes.push(number);
        this.node.push(child);
      });
      this.nodeNum++;
      bounds.number = this.nodeNum;
      delete bounds.children; //just record the number marker
      return bounds.number;
    } else {
      bounds.children.forEach((child) => {
        bounds.nodes.push(child.number);
        delete child.children;
        this.node.push(child);
      });
      this.nodeNum++;
      bounds.number = this.nodeNum;
      delete bounds.children; //just record the number marker
      return bounds.number;
    }
  }
  searchRecs(bounds, rectangles) {
    bounds.children.forEach((bound) => {
      if (bound.contain_type == "rectangle") rectangles.push(bound.boundary);
      this.searchRecs(bound, rectangles);
    });
  }
  insertDataBaseTree(bounds, maxIdx, parent, location) {
    let x = parseFloat(location.longitude);
    let y = parseFloat(location.latitude);
    //find bound
    while (parent.contain_type === "rectangle") {
      let queues = [...parent.nodes];
      let min_d_height = 1000;
      let min_d_width = 1000;
      queues.forEach((q) => {
        let node = bounds.find((bound) => bound.number == q);
        let d_w = 0;
        let d_h = 0;
        if (x < node.boundary.left) {
          d_w += node.boundary.left - x;
        }

        if (x > node.boundary.right) {
          d_w += x - node.boundary.right;
        }

        if (y > node.boundary.top) {
          d_h += y - node.boundary.top;
        }

        if (y < node.boundary.bottom) {
          d_h += node.boundary.bottom - y;
        }
        if (d_w + d_h < min_d_width + min_d_height) {
          min_d_width = d_w;
          min_d_height = d_h;

          parent = { ...node };
        }
      });
    }
    //insert
    let point = new Bound();
    point.boundary = { left: x, right: x, top: y, bottom: y };
    point.number = ++maxIdx;
    parent.nodes.push(point.number);
    if (parent.nodes.length >= parent.maxContain) this.boundsOverFlow(parent);
  }
  searchDataBaseTree(bounds, root, location, marks) {
    if (
      parseFloat(location.left) > root.boundary.right ||
      parseFloat(location.right) < root.boundary.left
    )
      return;
    if (
      parseFloat(location.top) < root.boundary.bottom ||
      parseFloat(location.bottom) > root.boundary.top
    )
      return;
    let queue = [...root.nodes];
    while (queue.length > 0) {
      let n = queue.pop();
      let target = bounds.find((bound) => bound.number == n);
      if (target.nodes.length > 0) {
        if (
          parseFloat(location.left) > target.boundary.right ||
          parseFloat(location.right) < target.boundary.left
        )
          continue;
        if (
          parseFloat(location.top) < target.boundary.bottom ||
          parseFloat(location.bottom) > target.boundary.top
        )
          continue;
        queue = queue.concat(target.nodes);
      } else {
        console.log(target);
        //the leaf of R tree
        let lng = target.boundary.left;
        let lat = target.boundary.top;
        let number = target.number;
        if (
          lng > parseFloat(location.left) &&
          lng < parseFloat(location.right) &&
          lat < parseFloat(location.top) &&
          lat > parseFloat(location.bottom)
        )
          marks.push({ lng: lng, lat: lat, number: number, type: "dog" });
        //console.log(marks)
      }
    }
  }
}
class RTree {
  insertTree(bounds, x, y, number, type, detail) {
    if (bounds.contain_type === "point") {
      //insert in many point

      let point = new Bound();
      point.boundary = { left: x, right: x, top: y, bottom: y };
      //console.log(point.boundary)
      point.number = number;
      point.detail = detail;
      bounds.children.push(point);
    } else {
      //insert in many rectangle
      let min_d_height = 1000;
      let min_d_width = 1000;
      let idx = 0;

      //find the closer bound
      bounds.children.forEach((child, i) => {
        let d_w = 0;
        let d_h = 0;
        if (x < child.boundary.left) {
          d_w += child.boundary.left - x;
        }
        if (x > child.boundary.right) {
          d_w += x - child.boundary.right;
        }
        if (y > child.boundary.top) {
          d_h += y - child.boundary.top;
        }
        if (y < child.boundary.bottom) {
          d_h += child.boundary.bottom - y;
        }
        if (d_w + d_h < min_d_width + min_d_height) {
          min_d_width = d_w;
          min_d_height = d_h;
          idx = i;
        }
      });
      if (this.insertTree(bounds.children[idx], x, y, number, type, detail)) {
        let newChildren = this.getSplitChildren(bounds.children[idx]);
        bounds.children.splice(idx, 1);
        newChildren.forEach((child) => {
          bounds.children.push(child);
        });
      }
    }
    //expand rectangle
    if (x < bounds.boundary.left) bounds.boundary.left = x;
    if (x > bounds.boundary.right) bounds.boundary.right = x;
    if (y > bounds.boundary.top) bounds.boundary.top = y;
    if (y < bounds.boundary.bottom) bounds.boundary.bottom = y;
    if (this.isOverFlow(bounds)) {
      return true;
    } else {
      return false;
    }
  }
  isOverFlow(bounds) {
    if (bounds.children.length >= bounds.maxContain) {
      if (bounds.contain_type == "point") {
        //find minimum perimeter with top/left sorting
        this.minBound(2, bounds);
      } else {
        //find munimum perimeter with all boundary sorting
        this.minBound(4, bounds);
      }
      return true;
    } else return false;
  }
  minBound(cmp_time, bounds) {
    let new_b1 = new Bound();
    let new_b2 = new Bound();
    let new_bdy = { left: 180, right: 0, top: 0, bottom: 90 };
    let total_perimeter = 1000;
    let minB = bounds.maxContain * 0.4;
    for (let k = 0; k < cmp_time; ++k) {
      this.sortByDir(k, bounds);
      //min 0.4B max B point
      for (let i = minB; i <= bounds.maxContain - minB; ++i) {
        new_bdy = { left: 180, right: 0, top: 0, bottom: 90 };
        let perimeter = 0;
        let b1 = new Bound();
        let b2 = new Bound();
        for (let j = 0; j < i; ++j) {
          //find the new boundary
          let top = bounds.children[j].boundary.top;
          let left = bounds.children[j].boundary.left;
          let btm = bounds.children[j].boundary.bottom;
          let right = bounds.children[j].boundary.right;
          if (top > new_bdy.top) new_bdy.top = top;
          if (btm < new_bdy.bottom) new_bdy.bottom = btm;
          if (left < new_bdy.left) new_bdy.left = left;
          if (right > new_bdy.right) new_bdy.right = right;
          //console.log("top:"+new_bdy.top+" left:"+new_bdy.left+" right:"+new_bdy.right+" bottom:"+new_bdy.bottom)
          let new_child = bounds.children[j];
          b1.children.push(new_child);
        }
        b1.boundary = new_bdy;
        perimeter =
          Math.abs(new_bdy.right - new_bdy.left) +
          Math.abs(new_bdy.top - new_bdy.bottom);
        new_bdy = { left: 180, right: 0, top: 0, bottom: 90 };
        for (let j = i; j < bounds.maxContain; ++j) {
          //find the new boundary
          let top = bounds.children[j].boundary.top;
          let left = bounds.children[j].boundary.left;
          let btm = bounds.children[j].boundary.bottom;
          let right = bounds.children[j].boundary.right;
          if (top > new_bdy.top) new_bdy.top = top;
          if (btm < new_bdy.bottom) new_bdy.bottom = btm;
          if (left < new_bdy.left) new_bdy.left = left;
          if (right > new_bdy.right) new_bdy.right = right;
          let new_child = bounds.children[j];
          b2.children.push(new_child);
        }
        b2.boundary = new_bdy;
        perimeter +=
          Math.abs(new_bdy.right - new_bdy.left) +
          Math.abs(new_bdy.top - new_bdy.bottom);

        if (perimeter < total_perimeter) {
          try {
            new_b1 = Object.assign(b1);
            new_b2 = Object.assign(b2);
          } catch (error) {
            console.log(error);
          }
          total_perimeter = perimeter;
        }
      }
    }
    bounds.children = [];
    if (bounds.contain_type == "point") {
      new_b1.contain_type = "point";
      new_b2.contain_type = "point";
      bounds.contain_type = "rectangle";
    } else {
      new_b1.contain_type = "rectangle";
      new_b2.contain_type = "rectangle";
    }
    bounds.children.push(new_b1);
    bounds.children.push(new_b2);
    //console.log(bounds.children)
  }
  sortByDir(boundary, bounds) {
    switch (boundary) {
      case 0:
        bounds.children.sort((a, b) => {
          return a.boundary.left - b.boundary.left;
        });
        break;
      case 1:
        bounds.children.sort((a, b) => {
          return a.boundary.top - b.boundary.top;
        });
        break;
      case 2:
        bounds.children.sort((a, b) => {
          return a.boundary.right - b.boundary.right;
        });
        break;
      case 3:
        bounds.children.sort((a, b) => {
          return a.boundary.bottom - b.boundary.bottom;
        });
        break;
    }
  }
  getSplitChildren(bounds) {
    return bounds.children;
  }
}
class Bound {
  constructor() {
    this.type = "node";
    this.children = [];
    this.boundary = { left: 180, right: 0, top: 0, bottom: 90 };
    this.contain_type = "point";
    this.maxContain = 5;
    this.number = 0;
  }
}
let instruction = new Instruction();
module.exports = {
  instruction,
};
