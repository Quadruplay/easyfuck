const readline = require('readline');
const fs = require('fs');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

console.clear = () => {
    process.stdout.write('\x1bc')
}

let path = "";

async function runNew() {
    new Promise(async (resolve, reject) => {
        let loadedData;
        async function requestPath() {
            console.clear();
            console.log("Please enter the path to the file:");
            await new Promise(async (r) => {
                let input = '';
                let writingIndex = 0;
                process.stdin.on('data', (chunk) => {

                    function renderInput() {
                        console.clear();
                        console.log("Please enter the path to the file:");
                        process.stdout.write(input);
                        process.stdout.write('\r');
                        for (let i = 0; i < writingIndex; i++) {
                            process.stdout.write('\x1b[C');
                        };
                    }

                    switch (chunk.toString()) {
                        case String.fromCharCode(13):
                            process.stdin.removeAllListeners('data')
                            console.clear();
                            if (["'",'"'].includes(input[0]) && ["'",'"'].includes(input.at(-1))) {
                                input = input.slice(1, -1);
                            }
                            path = input;
                            r()
                            break;
                        case String.fromCharCode(8):
                            input = input.slice(0, writingIndex-1) + input.slice(writingIndex);
                            if (writingIndex > 0) {
                                writingIndex--;
                            }
                            renderInput();
                            break;
                        case '\u001B\u005B\u0041':
                            break;
                        case '\u001B\u005B\u0042':
                            break;
                        case '\u001B\u005B\u0043':
                            if (writingIndex < input.length) {
                                writingIndex++;
                                renderInput();
                            }
                            break;
                        case '\u001B\u005B\u0044':
                            if (writingIndex > 0) {
                                writingIndex--;
                                renderInput();
                            }
                            break;
                        case '\u001B\u005B\u0033\u007E':
                            input = input.slice(0, writingIndex) + input.slice(writingIndex+1);
                            renderInput();
                            break;
                        case '\u0003':
                            process.exit();
                            break;
                        default:
                            if (writingIndex == input.length) {
                                input += chunk.toString();
                            } else {
                                input = input.slice(0, writingIndex) + chunk.toString() + input.slice(writingIndex);
                            }
                            writingIndex++;
                            renderInput();
                            break;
                    }
                });
            });
            return new Promise(async (res, rej) => {
                await new Promise((re) => {
                    fs.stat(path, async (err, stats) => {
                        if (err || !path.includes(".ef") || stats.isDirectory() || !stats.isFile()) {
                            console.error("incorrect path");
                            await new Promise((r) => {
                                setTimeout(() => {
                                    r();
                                }, 750);
                            });
                            await requestPath();
                            res();
                        }
                        re();
                    })
                });
                fs.readFile(path, 'utf8', (err, data) => {
                    if (err) {
                        console.error(err);
                        reject();
                    }
                    loadedData = data
                    res();
                })
            })
        }
        await requestPath();
        let fileData = loadedData.split("@")
        let memory = [0];
        let initData = fileData.length > 1 ? fileData.pop() : undefined;
        if (initData) memory = [...initData].map((e) => e.charCodeAt(0)%256);
        let code = ""
        while (fileData.length) {
            code += fileData.shift()+"@"
        }
        {
            let codeArr = code.split("");
            let codeTemp = ""
            let inComment = false;
            while (codeArr.length) {
                let first = codeArr.shift()
                if (inComment) {
                    if (["#","\n","\r"].includes(first)) {
                        inComment = false;
                    }
                } else {
                    if (first == "#") {
                        inComment = true;
                    } else {
                        codeTemp += first;
                    }
                }
            }
            codeTemp = codeTemp.split("\n").join("");
            codeTemp = codeTemp.split("\r").join("");
            codeTemp = codeTemp.split("	").join("");
            codeTemp = codeTemp.split(" ").join("");
            code = codeTemp;
        }
        if (memory != [0]) {
            code += memory.map((e) => String.fromCharCode(e)).join("");
        }
        async function save() {
            return new Promise((res, rej) => {
                fs.writeFile(path.replace(".ef","-minified.ef"), code, (err) => {
                    if (err) {
                        console.error(err);
                        rej();
                    }
                    res();
                });
            });
        }
        await save();
        console.log("File saved as "+path.replace(".ef","-minified.ef"));
        process.exit();
    });
}
runNew();