// let arr:string[] = ['a', 'b', 'c'];

// let arr2:Array<string> = ['a', 'b', 'c'];


// let tupleArr:[string, number] = ['a', 1];   


// enum Color {Red, Green, Blue};
// let c:Color = Color.Green;  


// function hello():void {
//     console.log('Hello World!');
// }


// let a:never;

// a=(()=>{throw new Error('exception')})();




// interface Button{
//     type: string
//     text: string
// }

// type ButtonType = keyof Button; // 'type' | 'text'

// function copy<T extends Button>(arg:T): T {
//     return arg;
// }   


// import { ref } from "vue";


// interface CodeInfo {
//     AreaCode: number;
//     locationCode: number;
//     warehouseCode: number;
// }

// type Code = keyof CodeInfo;

// const info = ref<CodeInfo[]>([]);


// info.value.push({
//     AreaCode: 1,
//     locationCode: 2,
//     warehouseCode: 3
// })



interface address {
    provice: string;
    city: string;
}

interface User {
    id: number;
    name: string;
    age: number;
    address: address;
}

// type UserKeys = keyof User; // 'id' | 'name' | 'age' | 'address'

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

const user: User = {
    id: 1,
    name: 'tom',
    age: 25,
    address: {
        provice: 'zhejiang',
        city: 'hangzhou'
    }
}

const address = getProperty(user, 'address'); // address: address
console.log(address);




