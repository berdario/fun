/* @flow */

const mori = require('mori');
const {take, cons, rest, toJs, iterate, lazySeq, map} = mori;



function squareroot1(eps /*: number*/, n /*: number*/)/*: number*/{
  let x = 1
  let y = x + eps * 2;
  while(Math.abs(x-y) > eps){
    y = x
    x = (x + n/x) / 2
  }
  return x
}

































const next = n => x => (x + n/x) / 2





const repeat = (f, a) => cons(a, lazySeq(()=> repeat(f, f(a))))







function within(eps /*: number*/, values){
  const [a, b] = toJs(take(2, values))
  return Math.abs(a - b ) <= eps ? b : within(eps, rest(values))
}

function squareroot2(eps /*: number*/, n /*: number*/)/*: number*/{
  return within(eps, repeat(next(n), 1))
}

console.log("Newton Raphson sqrt", squareroot1(0.0001, 2))
console.log("Newton Raphson sqrt decomposed", squareroot2(0.0001, 2))


const diff = f => x => h => (f(x+h)-f(x)) / h
const halve = x => x/2

function differentiate(h0, f, x){
  return map(diff(f)(x), repeat(halve, h0))
}

function improve(n, values){
  const [a, b] = toJs(take(2, values))
  return cons((b*Math.pow(2,n)-a)/(Math.pow(2,n)-1), lazySeq(()=> improve(n, rest(values))))
}

function derivative(eps, f, x){
  return within(eps,
    improve(2,
      improve(1,
        differentiate(1, f, x))))
}

console.log("x^2 derivative in  0", derivative(0.0001, x=>Math.pow(x,2), 0))
console.log("x^2 derivative in  0.5", derivative(0.0001, x=>Math.pow(x,2), 0.5))
console.log("x^3 derivative in  0.5", derivative(0.0001, x=>Math.pow(x,3), 0.5))
console.log("x^3 derivative in  0.6", derivative(0.0001, x=>Math.pow(x,3), 0.6))