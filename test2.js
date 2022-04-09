const DASP = require(".");
const highlight = require('cli-highlight').highlight;
const ps = require("prompt-sync");
const prompt = ps();

const showObj = (obj) => {
    return highlight(JSON.stringify(obj, null, 2));
}

let resume;

//this won't be done in final build
//we just restore from an old id

const instance = new DASP();
instance.restore(`4d6e7f0f7340b8456a36c4e8c48823e5`);

resume = prompt("getChangesByDate API - ");
const startDate = prompt("Enter the start date (yyyy-mm-dd): ");
const endDate = prompt("Enter the end date (yyyy-mm-dd): ");
console.log(showObj(instance.getChangesByDate(startDate,endDate)));
resume = prompt("revertToVersion API - ");
const version = prompt("Enter the version you want to revert to: ");
console.log(showObj(instance.revertToVersion(version)));
resume = prompt("aggregateChanges API - ");
const startVersion = prompt("Enter the start version: ");
const endVersion = prompt("Enter the end version: ");
console.log(showObj(instance.aggregateChanges(startVersion,endVersion)));
resume = prompt("Save API - ");
resume = prompt("Press enter to save and compress the changes.");
instance.save();
resume = prompt("Restore API - ");
resume = prompt("Press enter to extract all the changes.");
instance.restore(`4d6e7f0f7340b8456a36c4e8c48823e5`);