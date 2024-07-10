
// const events = require("events");
// const fs = require("fs");
// const watchFile = "log.txt";
// const bf = require('buffer');
// const TRAILING_LINES = 10;
// const buffer = new Buffer.alloc(bf.constants.MAX_STRING_LENGTH);


// class Watcher extends events.EventEmitter {
//     constructor(watchFile) {
//         super();
//         this.watchFile = watchFile;
//         this.store = [];
//     }
//     getLogs() {
//         return this.store;
//     }

//     watch(curr, prev) {
//         const watcher = this;
//         fs.open(this.watchFile, (err, fd) => {
//             if (err) throw err;
//             let data = '';
//             let logs = [];
//             fs.read(fd, buffer, 0, buffer.length, prev.size, (err, bytesRead) => {
//                 if (err) throw err;
//                 if (bytesRead > 0) {
//                     data = buffer.slice(0, bytesRead).toString();
//                     logs = data.split("\n").slice(1);
//                     console.log("logs read:" + logs);
//                     if (logs.length >= TRAILING_LINES) {
//                         logs.slice(-10).forEach((elem) => this.store.push(elem));
//                     }
//                     else {
//                         logs.forEach((elem) => {
//                             if (this.store.length == TRAILING_LINES) {
//                                 console.log("queue is full");
//                                 this.store.shift();
//                             }
//                             this.store.push(elem);
//                         });
//                     }
//                     console.log(logs)
//                     watcher.emit("process", logs);
//                 }
//             });
//         });

//     }


//     start() {
//         var watcher = this;
//         fs.open(this.watchFile, (err, fd) => {
//             if (err) throw err;
//             let data = '';
//             let logs = [];
//             fs.read(fd, buffer, 0, buffer.length, 0, (err, bytesRead) => {
//                 if (err) throw err;
//                 if (bytesRead > 0) {
//                     data = buffer.slice(0, bytesRead).toString();
//                     logs = data.split("\n");
//                     this.store = [];
//                     logs.slice(-10).forEach((elem) => this.store.push(elem));
//                 }
//                 fs.close(fd);
//             });
//             fs.watchFile(this.watchFile, { "interval": 1000 }, function (curr, prev) {
//                 watcher.watch(curr, prev);
//             });
//         });
//     }
// }

// // module.exports = Watcher;
// // view rawwatcher.js hosted with ❤ by GitHub
// let watcher = new Watcher("log.txt");

// watcher.start();

const tail = fs.watch('./log.txt', (type, file) => {
    // on file change
    if (type === "change") {
        const lines = tailLog('./log.txt', 2);

        // Send each line as an event to the client
        lines.forEach((line) => {
            console.log(`data: ${line}\n`);
        });
    }
});

const tailLog = (path, lineNumber) => {
    const c = fs.readFileSync(path, "utf-8");
    // used to filter out empty lines
    const lines = c.split("\n").filter(Boolean);
    const start = Math.max(lines.length - lineNumber, 0);
    return lines.slice(start);
};

