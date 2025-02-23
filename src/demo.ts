let arr:string[] = ['a', 'b', 'c'];

let arr2:Array<string> = ['a', 'b', 'c'];


let tupleArr:[string, number] = ['a', 1];   


enum Color {Red, Green, Blue};
let c:Color = Color.Green;  


function hello():void {
    console.log('Hello World!');
}


let a:never;

a=(()=>{throw new Error('exception')})();




interface Button{
    type: string
    text: string
}

type ButtonType = keyof Button; // 'type' | 'text'

function copy<T extends Button>(arg:T): T {
    return arg;
}   