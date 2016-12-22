/* @flow */

const mori = require('mori');
const {comp, range, toJs, map} = mori;

/* :: type Point = {x: number, y: number}; */
/* :: type Region = Point => boolean; */


function isInside(r /*: Region*/, p /*: Point*/)/*: boolean*/ {
    return r(p)
}

function intersect(r1 /*: Region*/, r2 /*: Region*/)/*: Region*/{
    return p => r1(p) && r2(p)
}

function union(r1 /*: Region*/, r2 /*: Region*/)/*: Region*/{
    return p => r1(p) || r2(p)
}

const outside = (r /*: Region*/)/*: Region*/ => p => !r(p)

const wholePlane = (_) => true

const intersectAll = (regions) => regions.reduce(intersect, wholePlane)

function pythagoras(p1/*: Point*/, p2/*: Point*/)/*: number*/{
    return Math.sqrt(Math.pow(p2.y - p1.y, 2) + Math.pow(p2.x - p1.x, 2))
}

function circle(center/*: Point*/, radius/*: number*/){
    return p => pythagoras(p, center) < radius
}

function annulus(center/*: Point*/, inner/*: number*/, outer/*: number*/)/*: Region*/{
    return intersect(circle(center, outer), outside(circle(center, inner)))
}

function below(y /*: number*/)/*: Region*/{
    return p => p.y < y
}

const above = comp(outside, below)

function leftOf(x /*: number*/)/*: Region*/{
    return p => p.x < x
}

const rightOf = comp(outside, leftOf)

function rect(lowerLeft /*: Point*/, upperRight /*: Point*/)/*: Region*/{
    return intersectAll([
        rightOf(lowerLeft.x),
        above(lowerLeft.y),
        leftOf(upperRight.x),
        below(upperRight.y)
    ])
}

function rectBorder(lowerLeft /*: Point*/, upperRight /*: Point*/, size /*: number*/)/*: Region*/{
    const [outerLowerLeft, outerUpperRight] = [{x: lowerLeft.x - size, y: lowerLeft.y -size}, {x: upperRight.x + size, y: upperRight.y + size}]
    return intersect(rect(outerLowerLeft, outerUpperRight), outside(rect(lowerLeft, upperRight)))
}


const drawing = union(
    rectBorder({x: -1, y: -1}, {x: 1, y: 1}, 0.1),
    annulus({x:0, y:0}, 1.4, 1.5)
)

const drawingString = toJs(map((y)=>
    toJs(map((x)=>
        isInside(drawing, {x: x, y: y}) ? "■" : " ",
    range(-2, 2, 0.05))).join(''),
range(-2, 2, 0.07))).join('\n')

console.log(drawingString)

isInside((x)=>true, {x:1.0, y:0})
