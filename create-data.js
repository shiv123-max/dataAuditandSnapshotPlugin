const DASP = require(".");
const ps = require("prompt-sync");
const prompt = ps();

let values = [
    "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"
];

let primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];

let num = 1;
const initialData = {
    "value": primes[0],
    "day": values[0]
}
//this won't be done in final build
//we just restore from an old id

const instance = new DASP(initialData);
let author = "Ranjan";
for(let i=1; i<7; ++i) {
    instance.updateData({
        value: primes[i], 
        day: values[i]
    },
    (i===4)?author:"Gaurav");
}

let resume = prompt("ruk bsdk");

instance.save();
// const instance = new DASP();
// instance.restore(`eec13e2283329367fc038bf8fff78f96`);