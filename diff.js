const util = require("util");

function diff(obj1, obj2) {
    const result = {};
    if (util.isDeepStrictEqual(obj1,obj2)) {
        return undefined;
    }

    if (!obj2 || typeof obj2 !== 'object') {
        return obj2;
    }

    let uniqueKeys = new Set();
    Object.keys(obj1 || {})
        .concat(Object.keys(obj2 || {}))
        .forEach((key) => {
            uniqueKeys.add(key);
        });

    Array.from(uniqueKeys).forEach((key) => {
        if (obj2[key] !== obj1[key] && !Object.is(obj1[key], obj2[key])) {
            let edit = {};
            if ((typeof obj2[key] === 'object' && typeof obj1[key] === 'object') && !(Array.isArray(obj1[key] || Array.isArray(obj2[key])))) {
                edit[key] = {};
            } else {
                edit[key] = {
                    before: obj1[key],
                    after: obj2[key],
                };
                if (edit[key].before=== undefined) delete edit[key].before;
                if (edit[key].after === undefined) delete edit[key].after;
            }

            Object.assign(result, edit);
        }

        if ((typeof obj2[key] === 'object' && typeof obj1[key] === 'object') && !(Array.isArray(obj1[key] || Array.isArray(obj2[key])))) {
            const value = diff(obj1[key], obj2[key]); //recursive call

            if (value !== undefined) {
                Object.assign(result[key], value);
            }
        }
    });
    return result;
}

function formatDiff(diff) {
    let edits = [];
    let deletions = [];
    let additions = [];
    for (let key in diff) {
        let edit = {};
        edit[key] = diff[key];

        if (diff[key].before && diff[key].after) {
            edits.push(edit);
        } else if (diff[key].before) {
            deletions.push(edit);
        } else if (diff[key].after) {
            additions.push(edit);
        }

        if (typeof diff[key] === 'object' && !(diff[key].before || diff[key].after)) {
            let value = formatDiff(diff[key]);

            if (value) {
                value.edits.forEach((e) => {
                    let editObj = {};
                    editObj[key] = e;
                    edits.push(editObj);
                });

                if (value.deletions.length) {
                    value.deletions.forEach((e) => {
                        let delObj = {};
                        delObj[key] = e;
                        deletions.push(delObj);
                    });
                }

                if (value.additions.length) {
                    value.additions.forEach((e) => {
                        let addObj = {};
                        addObj[key] = e;
                        additions.push(addObj);
                    });
                }
            }
        }
    }
    return { edits, deletions, additions };
}

function revert(currentData, change) {
    let result = currentData;
    destructure(change);
    Object.assign(result,change);
    return result;
}

const destructure = (diff) => {
    for (let key in diff) {
        if (diff[key].before) {
            diff[key] = diff[key].before;
        }

        if (typeof diff[key] === 'object' && !(diff[key].before || diff[key].after)) {
            destructure(diff[key]);
        }
    }
}

module.exports = {
    diff,
    formatDiff,
    revert,
    destructure
};
