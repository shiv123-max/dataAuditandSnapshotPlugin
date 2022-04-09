const { diff, formatDiff } = require("./diff");
const highlight = require('cli-highlight').highlight;
const ps = require("prompt-sync");
const prompt = ps();

const showObj = (obj) => {
    return highlight(JSON.stringify(obj, null, 2));
}
const oldData = {
    "first_name": "Chatura",
    "last_name": "Iyengar",
    "address": {
        "street": "877 Roslyn Valley",
        "city": "Pandhāna"
    },
    "emails": [
        "Ena44@hotmail.com",
        "Ressie72@hotmail.com"
    ],
    "joining_date":"2021-01-11",
    "phone_number": "2573019521"
};

const newData = {
    "first_name": "Chatura",
    "last_name": "Iyengar",
    "address": {
        "street": "246 Borer Garden",
        "city": "Pandhāna"
    },
    "emails": [
        "Ena44@hotmail.com"
    ],
    "gender": "Male",
    "phone_number": "2573019521"
};

let resume = prompt("Showing the oldData");

console.log(`Old Data - ${showObj(oldData)}`);
resume = prompt("Showing the newData");

console.log(`New Data - ${showObj(newData)}`);
resume = prompt("Showing the edits");

const formattedDiff = formatDiff(diff(oldData, newData));
console.log(`Edits - ${showObj(formattedDiff.edits)}`);

resume = prompt("Showing the deletions");
console.log(`Deletions - ${showObj(formattedDiff.deletions)}`);

resume = prompt("Showing the additions");
console.log(`Additions - ${showObj(formattedDiff.additions)}`);

