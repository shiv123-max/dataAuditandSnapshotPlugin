const DASP = require(".");
const { diff, formatDiff, destructure, revert } = require('./diff');
const newData = {
    employee_id: 'b519007',
    name: 'Ramesh',
    address: {
        adress_line_1: 'B/67,sector-4',
        adress_line_2: 'Jaydev-vihar',
        city: 'Bhubaneswar',
        state: 'Odisha'
    },
    age: 27,
    phone_number: '9465637892'
}
const oldData = {
    employee_id: 'b519007',
    name: 'Ramesh',
    address: {
        adress_line_1: 'B/156,sector-1',
        adress_line_2: 'Nalco nagar',
        city: 'Bhubaneswar',
        state: 'Odisha'
    },
    age: 27,
    email: 'ramesh@gmail.com'
}

console.log(JSON.stringify(formatDiff(diff(oldData, newData)), null, 2));

//{ inside: { insider: { before: 'this', after: 'that' } } }

// console.log(JSON.stringify(diff(data, newData), null,4))

// const difference = diff(data, newData);
// console.log(JSON.stringify(difference,null,2));
// console.log(JSON.stringify(formatDiff(difference),null,2));
// destructure(difference);
// console.log(JSON.stringify(difference, null, 2));
// console.log(JSON.stringify(revert(newData,difference),null,2));
// console.log("diff:",JSON.stringify(difference, null, 2));
// // console.log(JSON.stringify(data, null, 2));
// console.log(JSON.stringify(revert(newData, difference), null, 2));
// console.log(diff(data, revert(newData, difference)));

// console.log(revert(newData, formatDiff(diff(data, newData))))



// const newStore = new DASP(data);
// // console.log(newStore.getData());
// newStore.updateData(newData);
// // console.log(newStore.getData());
// newStore.save();
// console.log(JSON.stringify(newStore.revertToVersion(1),null,2));


//RITVIZ
// let num = 1;
// const initialData = {
//     "factorial": 1,
//     "version": 0
// }

// const ritviz = new DASP(initialData);

// for(let i=1; i<5; ++i) {
//     ritviz.updateData({
//         factorial: num*(i+1), 
//         version: i
//     },
//     "aman");
//     num = num*(i+1);
// }

// console.log(JSON.stringify(ritviz.getChangesByDate('2022-01-30','2025-01-01'),null,2));
// console.log(ritviz.revertToVersion(1));

// ritviz.save();

// const ritviz = new DASP();
// ritviz.restore('991c8f9669abc5934156f2eecaa47eb9');
// console.log(ritviz.getData());

// console.log("aggregate: ",ritviz.aggregateChanges(2,4));
// const oldStore = new DASP();
// oldStore.restore('d88e3427308dfc574dd75165f43fb918');
// // console.log(JSON.stringify(oldStore.getAllChanges(),null,2));
// oldStore.updateData(newData);
// oldStore.save();
// console.log(JSON.stringify(oldStore.getChangesByDate(1643304549001,1643306772840),null,2));
// oldStore.save();
// console.log(oldStore.getData());
// console.log(oldStore.getId());
