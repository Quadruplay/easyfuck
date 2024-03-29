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
        let code = ""
        let memory = [];
        if (loadedData.includes("@")) {
            let fileData = loadedData.split("@")
            let initData = fileData.length > 1 ? fileData.pop() : undefined;
            if (initData) memory = [...initData].map((e) => e.charCodeAt(0)%256);
            if (memory != []) {
                while (fileData.length) {
                    code += fileData.shift()+"@"
                }
            } else code = fileData[0];
        } else code = loadedData
        {
            let codeArr = code.split("");
            let codeTemp = ""
            let inComment = false;
            while (codeArr.length) {
                let first = codeArr.shift()
                if (inComment) {
                    if (["\n","\r"].includes(first)) {
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
        code += memory.map((e) => String.fromCharCode(e)).join("");
        let cCode = "";
        let bits = "";
        code = code.split("");
        while (code.length) {
            // Convert ASCII character to binary string
            let byte = code.shift().charCodeAt(0).toString(2).split("");

            // Pad the binary string to ensure it's 7 bits long
            while (byte.length < 7) {
                byte.unshift("0");
            }
            
            // Convert binary string back to ASCII character and add to output
            bits += byte.join("");
        }
        // Pad the binary string to ensure it's a multiple of 8
        if (bits.length % 7 == 0 && bits.length % 8 == 1) {
            for (let i = 0; i < 7; i++) bits += "0";
            for (let i = 0; i < 8; i++) bits += "1";
        } else while (bits.length % 8 != 0) {
            bits += "0";
        }
        for (let i = 0; i < bits.length; i += 8) {
            let byte = bits.slice(i, i + 8);
            cCode += String.fromCharCode(parseInt(byte, 2));
        }
        async function save() {
            return new Promise((res, rej) => {
                fs.writeFile(path.replace(".ef",".ef7"), cCode, "latin1", (err) => {
                    if (err) {
                        console.error(err);
                        rej();
                    }
                    res();
                });
            });
        }
        await save();
        console.log("File saved as "+path.replace(".ef",".ef7")+": "+cCode.length+" bytes");
        let codeReadable = "";
        let charMap = {
            0: "␀",
            1: "␁",
            2: "␂",
            3: "␃",
            4: "␄",
            5: "␅",
            6: "␆",
            7: "␇",
            8: "␈",
            9: "␉",
            10: "␊",
            11: "␋",
            12: "␌",
            13: "␍",
            14: "␎",
            15: "␏",
            16: "␐",
            17: "␑",
            18: "␒",
            19: "␓",
            20: "␔",
            21: "␕",
            22: "␖",
            23: "␗",
            24: "␘",
            25: "␙",
            26: "␚",
            27: "␛",
            28: "␜",
            29: "␝",
            30: "␞",
            31: "␟",
            32: "␠",
            60: "&lt;",
            127: "␡",
            128: "<sup>PAD</sup>",
            129: "<sup>HOP</sup>",
            130: "<sup>BPH</sup>",
            131: "<sup>NBH</sup>",
            132: "<sup>IND</sup>",
            133: "<sup>NEL</sup>",
            134: "<sup>SSA</sup>",
            135: "<sup>ESA</sup>",
            136: "<sup>HTS</sup>",
            137: "<sup>HTJ</sup>",
            138: "<sup>VTS</sup>",
            139: "<sup>PLD</sup>",
            140: "<sup>PLU</sup>",
            141: "<sup>RI</sup>",
            142: "<sup>SS2</sup>",
            143: "<sup>SS3</sup>",
            144: "<sup>DCS</sup>",
            145: "<sup>PU1</sup>",
            146: "<sup>PU2</sup>",
            147: "<sup>STS</sup>",
            148: "<sup>CCH</sup>",
            149: "<sup>MW</sup>",
            150: "<sup>SPA</sup>",
            151: "<sup>EPA</sup>",
            152: "<sup>SOS</sup>",
            153: "<sup>SGCI</sup>",
            154: "<sup>SCI</sup>",
            155: "<sup>CSI</sup>",
            156: "<sup>ST</sup>",
            157: "<sup>OSC</sup>",
            158: "<sup>PM</sup>",
            159: "<sup>APC</sup>",
            160: "<sup>NBSP</sup>",
            173: "<sup>SHY</sup>"
        };
        cCode.split("").forEach((e) => {
            if (charMap[e.charCodeAt(0)]) {
                codeReadable += charMap[e.charCodeAt(0)];
            } else {
                codeReadable += e;
            }
        });
        async function save2() {
            return new Promise((res, rej) => {
                fs.writeFile(path.replace(".ef",".txt"), codeReadable, "utf8", (err) => {
                    if (err) {
                        console.error(err);
                        rej();
                    }
                    res();
                });
            });
        }
        await save2();
        process.exit();
    });
}
runNew();