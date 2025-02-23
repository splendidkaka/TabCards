// let arr = {
//     0: 'M',
//     1: 'N',
//     2: 'A',
//     length: 3,
//   }
//   var arrList = []; // 声明的空数组

//   var arrList1 =Array.prototype.slice.call(arr);

//   console.log(arrList1); // [ 'M', 'N', 'A', length: 3 ]

// let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// let arr2 = arr.slice(0,2)

// console.log('arr',arr);
// console.log('arr2',arr2);

// let arr2 = arr.splice(0, 2);

// console.log('arr',arr);
// console.log('arr2',arr2);

// let arr2 = Object.assign([],arr);

// console.log('arr2',arr2);

// arr2[0] = 100;

// console.log(arr);

// arr[0] = 100;

// console.log('arr',arr);

// console.log('arr2',arr2);

// 判断类型
// console.log(Object.prototype.toString.call(arr)); // [object Array]

// typeof  不能判断数组

//

function myInstanceof(left, right) {
  let proto = Object.getPrototypeOf(left);
  const prototype = right.prototype;

  while (proto !== null) {
    if (proto === prototype) {
      return true;
    }
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

function myNew(fn, ...agrs) {
  const obj = Object.create(fn.prototype);

  const res = fn.apply(obj, agrs);

  return res instanceof Object ? res : obj;
}

// 浅比较
function getShallowDiff(parent, child) {
  const diff = {};
  for (let key in parent) {
    console.log("key", key);
    if (!child.hasOwnProperty(key) || parent[key] !== child[key]) {
      diff[key] = parent[key];
    }
  }
  return diff;
}

const parent = { a: 1, b: 2, c: { d: 3 } };
const child = { a: 1, c: { d: 3 } };

// console.log(getShallowDiff(parent,child));

// 深比较

function deBounce(fn, delay) {
  let timer = null;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  };
}

// let flag = Boolean(2)
// console.log(flag); // true

// function shallowCopy(obj){
//     const newObj ={}
//     for(let prop in obj){
//         if(obj.hasOwnProperty(prop)){
//             newObj[prop] = obj[prop];
//         }
//     }
//     return newObj;
// }

// const fxArr = [1,2,3,4,5,6,7,8,9,10];

// const fxArr2 = fxArr.slice(0,3)
// // const fxArr2 = fxArr.concat();

// // fxArr2[0] = 100;

// console.log(fxArr2);
// // console.log(fxArr);

// const obj1={}

// const obj2={a:1}

// const isEmptyObject=(obj)=>{
//     return Object.keys(obj).length === 0;
// }

// console.log(isEmptyObject(obj1));

const arrq = ["a", "b"];

const objq = [
  {
    a: 1,
    b: 2,
  },
];

// console.log(arrq.keys());

// for(let i of arrq.keys()){
//     console.log(i);
// }

// for (let i in arrq)
// {
//     console.log(i);
// }

// for (let i of objq)
// {
//     console.log(i);
//     console.log(objq[i]);
// }

// for(let [index,ele] of objq.entries()){
//     console.log(index,ele);
// }

// arrq.map((item,index)=>{
//     console.log('item',item);
//     console.log('index',index);
// })

// const testObj = {}

// console.log(Object.keys(testObj).length === 0);

// //判断为空对象
// function isEmptyObject(obj){
//     return Object.keys(obj).length === 0;
// }

// const obj = {
//   value: 42,
//   arrowFunc: () => {
//     console.log(this.value); // undefined
//   },
//   regularFunc: function () {
//     console.log(this.value); // 42
//   },
// };

// obj.arrowFunc(); // undefined
// obj.regularFunc(); // 42

// function Timer() {
//     this.seconds = 0;
//     setInterval(() => {
//       this.seconds++;
//       console.log(this.seconds);
//     }, 1000);
//   }

//   const timer = new Timer();

// function Timer() {
//     this.seconds = 0;
//     setInterval(function() {
//       this.seconds++;
//       console.log(this.seconds);
//     }, 1000);
//   }

//   const timer = new Timer(); //如何修改把this指向Timer

// let set = new Set([{a:1},{b:2},{c:3}])

// for(let item of set.values()){
//     console.log(item);
// }

// let str ="352255"
// let uniqueStr = [...new Set(str)]
// console.log(uniqueStr);

// let a =new Set([1,2,3])
// let b =new Set([4,3,2])

// let union = new Set([...a,...b])

// let intersect = new Set([...a].filter(x=>b.has(x)))

// let map = new Map([
//     ['name','张三'],
//     ['age',18]
// ])

// for(let [key,value] of map){
//     console.log(key,value);
// }

// const target = {name:'Tom'}

// const proxy = new Proxy(target,{
//     get(target,key,receiver){
//         console.log('get',key);
//         return Reflect.get(target,key,receiver);
//     },
//     set(target,key,value,receiver){
//         console.log('set',key);
//         target[key] = value;
//         return Reflect.set(target,key,value,receiver);
//     }
// })

// proxy.name = 'Jerry'
// proxy.age = 18

// console.log(target)

// const obj = {
//   value: 42,
//   getValue() {
//     return this.value; // this 指向 obj
//   },

// };

// const proxy = new Proxy(obj, {
//   get(target, prop, receiver) {
//     // 通过 Reflect.get 传递 receiver，保持 this 指向代理对象
//     return Reflect.get(target, prop, receiver);
//   },
// });

// console.log(obj.getValue());  // 正确输出 42

// console.log(proxy.getValue());  // 正确输出 42（若未用 Reflect，this 可能指向原始对象）

// if('')
// {
//   console.log('abc');
// }

var person = { fname: "John", lname: "Doe", age: 25 };

var txt = "";

// for (let x in person)
// {
//   // txt += person[x] + " ";
//   console.log(x);
// }

//判断对象类型
// console.log(Object.prototype.toString.call(person));

// console.log(txt);

// let map = new Map([
//   [1,'张三'],
//   [2,18]
// ])

// let fxArr2 = map.keys()

// console.log(fxArr2);

// let arr = [1,2,3,4,5,6,7,8,9,10]

// let a = Array.from(arr,x=>x+x)

// console.log(a,arr);

// Array.of(1,2,3,4,5,6,7,8,9,10)

// arr.find((item,index)=>{
//   console.log(item,index);
//   // return item === 3;
// })

// function f(v){
//   return v > this.age;
// }

// let person = {name:'John',age:20}
// [10,12,26,15].find(f,person)

// let arr = {a:1,b:2,c:3}
// let arr = [{
//   a: 1,
//   b: 2,
//   c: 3,
// },
// {
//   a: 4,
//   b: 5,
//   c: 6,
// },
// {
//   a: 7,
//   b: 8,
//   c: 9,
// },
// ];

// let arr = {}

// console.log(isEmptyObject instanceof Object);
// console.log(Object.getOwnPropertyNames(arr));

// function flatten(arr) {
//   return arr.reduce((acc, cur) => {
//     arr.concat(Array.isArray(cur) ? flatten(cur) : cur), [];
//   });
// }

// const deBounce = (fn,delay)=>{
//   let timer = null;
//   return function(...agrs){
//     if(timer){
//       clearTimeout(timer);
//     }
//     timer = setTimeout(()=>{
//       fn.apply(this,agrs);
//     },delay)
//   }
// }

// const throttle = (fn,delay)=>{

//   let lastTime = 0;

//   return function(...args){
//    let now = new Date.now();
//    if(now - lastTime > delay){
//      fn.apply(this,args);
//      lastTime = now;
//    }
//   }
// }

// function exampleFunction(...args) {
//   console.log(args);
// }

// exampleFunction(1, 2, 3);

import { ref } from "vue";

const info = ref([]);

const a = 123;

const b = 123;

info.value.push({
  a,
  b,
});


console.log(info.value);

console.log(info.value[0].a); //如何不使用value[0] 

