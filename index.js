const fs = require("fs");
const path = require("path");
const { diff, formatDiff, revert } = require("./diff");
const crypto = require("crypto");
const { compressObject, decompressBuffer } = require("./compress");
class DASP {
    constructor(initialData = null, author = "anonymous") {
        if (initialData) {
            this.data = initialData;
            this.version = 1;
            this.dateCreated = new Date();
            this.author = author;
            this.dateUpdated = this.dateCreated;
            this.id = crypto.createHash('md5').update(JSON.stringify(initialData)).digest('hex');
            this.location = path.join('data', this.id);
            try {
                if (!fs.existsSync(`${this.location}`)) {
                    fs.mkdirSync(`${this.location}`, { recursive: true });
                }
                if (!fs.existsSync(path.join(this.location, 'changes'))) {
                    fs.mkdirSync(path.join(this.location, 'changes'), { recursive: true });
                }
            } catch (err) {
                console.error(err);
            }
            if (initialData) {
                try {
                    fs.writeFileSync(path.join(this.location, `${this.id}.json`), JSON.stringify(this));
                } catch (err) {
                    console.log(err);
                }
            }
        }
    }

    restoreFromFile(filepath) {
        try {
            const fileData = fs.readFileSync(filepath, 'utf8');
            Object.assign(this, JSON.parse(fileData));
        } catch (err) {
            console.log(err);
        }
    }

    restore(id) {
        try {
            const compressedChangesBuffer = fs.readFileSync(path.join('data', id, 'changes', 'cmprsd.bin'));
            const changes = JSON.parse(decompressBuffer(compressedChangesBuffer).toString());
            //console.log(changes);
            changes.forEach((change, index) => {
                fs.writeFileSync(path.join('data', id, 'changes', `${id}.${index + 1}.json`), JSON.stringify(change));
            });
            fs.rmSync(path.join('data', id, 'changes', 'cmprsd.bin'));
            const fileData = fs.readFileSync(path.join('data', id, `${id}.json`));
            Object.assign(this, JSON.parse(fileData));
        } catch (err) {
            console.log(err);
        }
    }

    save() {
        try {
            let changes = this.getAllChanges();
            fs.rmSync(path.join(this.location, 'changes'), { recursive: true, force: true });
            fs.mkdirSync(path.join(this.location, 'changes'));
            // const fileNames = fs.readdirSync(path.join('data', this.id, 'changes'));
            // fileNames.forEach(fileName=> {
            //     fs.rmSync(path.join('data', this.id, 'changes', fileName));
            // });
            // fs.rmSync(changeLogs);
            const compressedChangesBuffer = compressObject(changes);
            fs.writeFileSync(path.join(this.location, 'changes', 'cmprsd.bin'), compressedChangesBuffer);
            fs.writeFileSync(path.join(this.location, `${this.id}.json`), JSON.stringify(this));
        } catch (err) {
            console.log(err);
        }
    }

    exportJSONToFile() {

    }

    exportDiffToFile() {

    }

    updateData(newData, changedBy = "anonymous") {
        const changes = diff(this.data, newData);
        let currentTime = new Date();
        let changeLog = {
            changes,
            version: this.version + 1,
            changedBy,
            dateCreated: currentTime
        }
        if (!changes)
            throw new Error("No changes have been made.");
        try {
            fs.writeFileSync(path.join(this.location, 'changes', `${this.id}.${this.version}.json`), JSON.stringify(changeLog));
        } catch (e) {
            console.log(e);
            return;
        }
        this.data = newData;
        this.version = this.version + 1;
        this.dateUpdated = currentTime;
    }

    getAllChanges() {
        const fileNames = fs.readdirSync(path.join('data', this.id, 'changes'));
        let changes = [];
        fileNames.forEach(fileName => {
            const filePath = path.join('data', this.id, 'changes', fileName);
            changes.push(JSON.parse(fs.readFileSync(filePath)));
        });
        return changes;
    }

    getChangesByDate(startDateString, endDateString) {
        let startDate = Date.parse(startDateString);
        let endDate = Date.parse(endDateString);
        startDate = startDate - (startDate%86400);
        endDate = endDate + (86400-(endDate%86400));
        const changes = this.getAllChanges(); // O(n)
        return changes.filter(change => {
            const parsedDate = Date.parse(change.dateCreated);
            return (parsedDate > startDate && parsedDate < endDate);
        });
    }

    getData() {
        return this.data;
    }

    revertToVersion(version) {
        if (version > this.version) {
            throw new Error("We can't travel to the future (yet)");
        }
        let currentData = JSON.parse(JSON.stringify(this.data));
        let currentVersion = this.version;
        let changes = this.getAllChanges();
        while (currentVersion > version) {
            revert(currentData, changes[currentVersion - 2].changes);
            currentVersion--;
        }
        return currentData;
    }

    aggregateChanges(startVersion, endVersion) {
        let changes = this.getAllChanges();
        let startVersionData = {};
        let endVersionData = this.revertToVersion(endVersion);
        {
            if (startVersion > endVersion) {
                throw new Error("We can't travel to the future (yet)");
            }
            let currentData = JSON.parse(JSON.stringify(endVersionData));
            let currentVersion = endVersion;
            let version = startVersion;
            while (currentVersion > version) {
                revert(currentData, changes[currentVersion - 2].changes);
                currentVersion--;
            }
            startVersionData = currentData;
        }
        return diff(startVersionData, endVersionData);
    }

    getId() {
        return this.id;
    }
}

module.exports = DASP;