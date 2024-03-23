const readline = require('readline');
const fs = require('fs');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
const { AudioContext } = require('node-web-audio-api');

console.clear = () => {
    process.stdout.write('\x1bc')
}

let overflow = 0;
let startTime;
let path;
let stopList = [];

let moddedAsciiList = [
    "─","│","┌","┐","└","┘","├","┤","┬","┴","┼","═","║","╒","╓","╔",
    "╕","╖","╗","╘","╙","╚","╛","╜","╝","╞","╟","╠","╡","╢","╣","╤",
    "╥","╦","╧","╨","╩","╪","╫","╬","╭","╮","╯","╰","╱","╲","╳","╴",
    "╵","╶","╷","▀","▔","▁","▂","▃","▄","▅","▆","▇","█","▉","▊","▋",
    "▌","▍","▎","▏","▐","▕","▖","▗","▘","▙","▚","▛","▜","▝","▞","▟",
    "░","▒","▓","■","□","▢","▣","▤","▥","▦","▧","▨","▩","◀","▲","▶",
    "▼","◆","▮","▬","●","☄","★","☆","☐","☜","☞","☢","☣","☤","☥","☭",
    "☺","☻","☼","☉","☽","☾","☿","♀","♁","♂","♃","♄","♅","♆","♇","♔",
    "♕","♖","♗","♘","♙","♥","♦","♣","♠","♩","♪","♫","♬","♭","♮","♯",
    "♰","⚀","⚁","⚂","⚃","⚄","⚅","⚇","⚉","⚚","⚠","⚲","⚳","⚴","⚵","⚶",
    "⚷","⚸","⚿","⛀","⛁","⛂","⛃","⛆","⛇","⛤","⛧","⛭","𐕣","⛉","⛊","🕭",
    "🕮","🕱","🕾","🖂","🗲","⚐","⚑","🗿","⭠","⭡","⭢","⭣","⭦","⭧","⭨","⭩",
    "ඞ","Α","Β","Γ","Δ","Ε","Ζ","Η","Θ","Ι","Κ","Λ","Μ","Ν","Ξ","Ο",
    "Π","Ρ","Σ","Τ","Υ","Φ","Χ","Ψ","Ω","α","β","γ","δ","ε","ζ","η",
    "θ","ι","κ","λ","μ","ν","ξ","ο","π","ρ","ς","σ","τ","υ","φ","χ",
    "ψ","ω","€","𓁌","𓃒","𓃗","𓃩","𓅃","𓆈","𓆌","𓆉","𓆏","𓆙","𓆟","𓆤","𓆣"
]
let moddedAsciis = false;

function modulo(number, mod, setoverflow = true) {
    if (setoverflow && (number < 0 || number >= mod)) overflow = 2;
    return mod ? ((number%mod)+mod)%mod : 0;
}

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
        let initData = fileData.length > 1 ? fileData.at(-1) : undefined;
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
            code = codeTemp;
        }
        let storage = 0;
        let pointer = 0;
        let loopDepth = 0;
        let functions = {};
        let state = 1;
        moddedAsciis = false;
        async function executeCode(code, executionPoint, debug) {
            if (debug) console.log(memory);
            return new Promise(async (r) => {
                loop: while (code.length && executionPoint < code.length && state) {
                    switch (code[executionPoint]) {
                        case "@":
                            loopDepth = 1;
                            while (loopDepth && executionPoint < code.length) {
                                executionPoint++;
                                if (code[executionPoint] == "(") loopDepth++;
                                else if (code[executionPoint] == ")") loopDepth--;
                            }
                            break loop;
                            break;
                        case "+":
                            memory[pointer]++;
                            memory[pointer]=modulo(memory[pointer], 256);
                            break;
                        case "-":
                            memory[pointer]--;
                            memory[pointer]=modulo(memory[pointer], 256);
                            break;
                        case ">":
                            pointer++;
                            if (memory[pointer] === undefined) {
                                overflow = 2;
                                memory[pointer] = 0;
                            }
                            break;
                        case "<":
                            pointer--;
                            pointer=modulo(pointer, memory.length);
                            break;
                        case "J":
                            pointer = 0;
                            break;
                        case "[":
                            if (memory[pointer] == 0) {
                                loopDepth = 1;
                                while (loopDepth) {
                                    executionPoint++;
                                    if (code[executionPoint] == "[") loopDepth++;
                                    else if (code[executionPoint] == "]") loopDepth--;
                                    if (executionPoint > code.length) {
                                        console.error("Unmatched square brackets");
                                        process.exit();
                                    }
                                }
                            }
                            break;
                        case "]":
                            if (memory[pointer]) {
                                loopDepth = 1;
                                while (loopDepth) {
                                    executionPoint--;
                                    if (code[executionPoint] == "[") loopDepth--;
                                    else if (code[executionPoint] == "]") loopDepth++;
                                    if (executionPoint < 0) {
                                        console.error("Unmatched square brackets");
                                        process.exit();
                                    }
                                }
                            }
                            break;
                        case ".":
                            process.stdout.write( ( moddedAsciis && moddedAsciiList[memory[pointer]] ) ? moddedAsciiList[memory[pointer]] : String.fromCharCode(memory[pointer]));
                            break;
                        case ",":
                            await new Promise((res, rej) => {
                                process.stdin.once('keypress', (str, key) => {
                                    memory[pointer] = str.charCodeAt(0)%256;
                                    res();
                                })
                            })
                            break;
                        case "$":
                            storage = memory[pointer];
                            break;
                        case "!":
                            memory[pointer] = storage;
                            break;
                        case "}":
                            if (memory[pointer] % 2) overflow = 2;
                            memory[pointer] = memory[pointer] >>> 1;
                            break;
                        case "{":
                            if (memory[pointer] > 127) overflow = 2;
                            memory[pointer] = (memory[pointer] << 1) & 255;
                            break;
                        case "~":
                            memory[pointer] = 255 - memory[pointer];
                            break;
                        case "|":
                            memory[pointer] |= storage;
                            break;
                        case "&":
                            memory[pointer] &= storage;
                            break;
                        case "^":
                            memory[pointer] ^= storage;
                            break;
                        case "Y":
                            {
                                let bit128 = Math.sign(memory[pointer]&128);
                                let bit64 = Math.sign(memory[pointer]&64);
                                let bit32 = Math.sign(memory[pointer]&32);
                                let bit16 = Math.sign(memory[pointer]&16);
                                let bit8 = Math.sign(memory[pointer]&8);
                                let bit4 = Math.sign(memory[pointer]&4);
                                let bit2 = Math.sign(memory[pointer]&2);
                                let bit1 = Math.sign(memory[pointer]&1);
                                memory[pointer] = bit1*128 + bit2*64 + bit4*32 + bit8*16 + bit16*8 + bit32*4 + bit64*2 + bit128;
                            }
                            break;
                        case "*":
                            memory[pointer] = modulo(memory[pointer]*storage, 256);
                            break;
                        case "/":
                            memory[pointer] = Math.floor(memory[pointer]/(storage || 256));
                            break;
                        case "=":
                            memory[pointer] = modulo(memory[pointer]+storage, 256);
                            break;
                        case "_":
                            memory[pointer] = modulo(memory[pointer]-storage, 256);
                            break;
                        case "%":
                            memory[pointer] = modulo(memory[pointer], storage, false);
                            break;
                        case "0":
                            memory[pointer] = 0;
                            break;
                        case "1":
                            memory[pointer] = 16;
                            break;
                        case "2":
                            memory[pointer] = 32;
                            break;
                        case "3":
                            memory[pointer] = 48;
                            break;
                        case "4":
                            memory[pointer] = 64;
                            break;
                        case "5":
                            memory[pointer] = 80;
                            break;
                        case "6":
                            memory[pointer] = 96;
                            break;
                        case "7":
                            memory[pointer] = 112;
                            break;
                        case "8":
                            memory[pointer] = 128;
                            break;
                        case "9":
                            memory[pointer] = 144;
                            break;
                        case "A":
                            memory[pointer] = 160;
                            break;
                        case "B":
                            memory[pointer] = 176;
                            break;
                        case "C":
                            memory[pointer] = 192;
                            break;
                        case "D":
                            memory[pointer] = 208;
                            break;
                        case "E":
                            memory[pointer] = 224;
                            break;
                        case "F":
                            memory[pointer] = 240;
                            break;
                        case "#":
                            executionPoint++;
                            while (!["\n","\r"].includes(code[executionPoint])) {
                                executionPoint++;
                                if (executionPoint > code.length) break;
                            }
                            break;
                        case "?":
                            memory[pointer] = Math.floor(Math.random()*256);
                            break;
                        case ";":
                            loopDepth = 1;
                            while (loopDepth) {
                                executionPoint++;
                                if (code[executionPoint] == "[") loopDepth++;
                                else if (code[executionPoint] == "]") loopDepth--;
                                if (executionPoint > code.length) {
                                    break loop;
                                }
                            }
                            break;
                        case ":":
                            memory[pointer] = Math.max(memory[pointer], storage);
                            break;
                        case "(":
                            {
                                let functionID = code[executionPoint-1];
                                if ( functionID == functionID.toLowerCase() && functionID != functionID.toUpperCase()) { //check if is letter and is lowercase
                                    loopDepth = 1;
                                    functions[functionID] = "";
                                    while (loopDepth) {
                                        executionPoint++
                                        if (code[executionPoint] == "(") loopDepth++;
                                        else if (code[executionPoint] == ")") loopDepth--;
                                        if (loopDepth) functions[functionID]+= code[executionPoint];
                                        if (executionPoint > code.length) {
                                            console.error("Unmatched parentheses");
                                            process.exit();
                                        }
                                    }
                                } else {
                                    loopDepth = 1;
                                    lambda = "";
                                    while (loopDepth) {
                                        executionPoint++
                                        if (code[executionPoint] == "(") loopDepth++;
                                        else if (code[executionPoint] == ")") loopDepth--;
                                        if (loopDepth) lambda+= code[executionPoint];
                                        if (executionPoint > code.length) {
                                            console.error("Unmatched parentheses");
                                            process.exit();
                                        
                                        }
                                    }
                                    await executeCode(lambda, 0);
                                }
                            }
                            break;
                        case ")":
                            break;
                        case "'":
                            process.stdout.write(String(memory[pointer]));
                            break;
                        case "`":
                            if (!overflow) {
                                if (code[executionPoint+1] != "(") {
                                    executionPoint++;
                                } else {
                                    executionPoint++
                                    loopDepth = 1;
                                    while (loopDepth) {
                                        executionPoint++
                                        if (code[executionPoint] == "(") loopDepth++;
                                        else if (code[executionPoint] == ")") loopDepth--;
                                    }
                                }
                            }
                            break;
                        case '"':
                            await new Promise((res, rej) => {
                                memory[pointer]=0;
                                loopDepth = 0;
                                process.stdin.on('keypress', (str, key) => {
                                    memory[pointer]*=10
                                    if (["0","1","2","3","4","5","6","7","8","9"].includes(str) && memory[pointer]+parseInt(str) > 0) {
                                        process.stdout.write(str);
                                        loopDepth++;
                                        if (memory[pointer]+parseInt(str) > 255) {
                                            memory[pointer]/=10;
                                            process.stdin.removeAllListeners('keypress');
                                            for (let i = 0; i < loopDepth; i++) {
                                                process.stdout.write(String.fromCharCode(8))
                                            }
                                            for (let i = 0; i < loopDepth; i++) {
                                                process.stdout.write(String.fromCharCode(32))
                                            }
                                            for (let i = 0; i < loopDepth; i++) {
                                                process.stdout.write(String.fromCharCode(8))
                                            }
                                            res();
                                        } else {
                                            memory[pointer]+=parseInt(str);
                                            if (memory[pointer]*10 > 255) {
                                                process.stdin.removeAllListeners('keypress');
                                                for (let i = 0; i < loopDepth; i++) {
                                                    process.stdout.write(String.fromCharCode(8))
                                                }
                                                for (let i = 0; i < loopDepth; i++) {
                                                    process.stdout.write(String.fromCharCode(32))
                                                }
                                                for (let i = 0; i < loopDepth; i++) {
                                                    process.stdout.write(String.fromCharCode(8))
                                                }
                                                res();
                                            }
                                        }
                                    } else {
                                        memory[pointer]/=10;
                                        process.stdin.removeAllListeners('keypress');
                                        for (let i = 0; i < loopDepth; i++) {
                                            process.stdout.write(String.fromCharCode(8))
                                        }
                                        for (let i = 0; i < loopDepth; i++) {
                                            process.stdout.write(String.fromCharCode(32))
                                        }
                                        for (let i = 0; i < loopDepth; i++) {
                                            process.stdout.write(String.fromCharCode(8))
                                        }
                                        res();
                                    }
                                })
                            })
                            break;
                        case 'X':
                            state = 0;
                            break;
                        case 'M':
                            memory[modulo(pointer-1, memory.length, false)] = modulo(memory[modulo(pointer-1, memory.length, false)]*storage + Math.floor(memory[pointer]*storage/256), 256);
                            memory[pointer] = modulo(memory[pointer]*storage, 256, false);
                            break;
                        case 'O':
                            process.stdout.write(String(memory[modulo(pointer-1, memory.length, false)]*256 + memory[pointer]));
                            break;
                        case 'I':
                            await new Promise((res, rej) => {
                                let temp=0;
                                loopDepth = 0;
                                process.stdin.on('keypress', (str, key) => {
                                    temp*=10
                                    if (["0","1","2","3","4","5","6","7","8","9"].includes(str) && temp+parseInt(str) > 0) {
                                        process.stdout.write(str);
                                        loopDepth++;
                                        if (temp+parseInt(str) > 65535) {
                                            temp/=10;
                                            process.stdin.removeAllListeners('keypress');
                                            for (let i = 0; i < loopDepth; i++) {
                                                process.stdout.write(String.fromCharCode(8))
                                            }
                                            for (let i = 0; i < loopDepth; i++) {
                                                process.stdout.write(String.fromCharCode(32))
                                            }
                                            for (let i = 0; i < loopDepth; i++) {
                                                process.stdout.write(String.fromCharCode(8))
                                            }
                                            memory[pointer] = temp%256;
                                            memory[modulo(pointer-1, memory.length, false)] = Math.floor(temp/256);
                                            res();
                                        } else {
                                            temp+=parseInt(str);
                                            if (temp*10 > 65535) {
                                                process.stdin.removeAllListeners('keypress');
                                                for (let i = 0; i < loopDepth; i++) {
                                                    process.stdout.write(String.fromCharCode(8))
                                                }
                                                for (let i = 0; i < loopDepth; i++) {
                                                    process.stdout.write(String.fromCharCode(32))
                                                }
                                                for (let i = 0; i < loopDepth; i++) {
                                                    process.stdout.write(String.fromCharCode(8))
                                                }
                                                memory[pointer] = temp%256;
                                                memory[modulo(pointer-1, memory.length, false)] = Math.floor(temp/256);
                                                res();
                                            }
                                        }
                                    } else {
                                        temp/=10;
                                        process.stdin.removeAllListeners('keypress');
                                        for (let i = 0; i < loopDepth; i++) {
                                            process.stdout.write(String.fromCharCode(8))
                                        }
                                        for (let i = 0; i < loopDepth; i++) {
                                            process.stdout.write(String.fromCharCode(32))
                                        }
                                        for (let i = 0; i < loopDepth; i++) {
                                            process.stdout.write(String.fromCharCode(8))
                                        }
                                        memory[pointer] = temp%256;
                                        memory[modulo(pointer-1, memory.length, false)] = Math.floor(temp/256);
                                        res();
                                    }
                                })
                            })
                            break;
                        case 'N':
                            memory[pointer] = modulo(Math.floor((memory[modulo(pointer-1, memory.length, false)]*256 + memory[pointer])/(storage || 256)), 256, false);
                            memory[modulo(pointer-1, memory.length, false)] = Math.floor(memory[modulo(pointer-1, memory.length, false)]/(storage || 256));
                            break;
                        case 'S':
                            {
                                let temp = memory[pointer];
                                memory[pointer] = storage;
                                storage = temp;
                            }
                            break;
                        case '\\':
                            memory[pointer] = ~~Math.sqrt(memory[pointer]);
                            break;
                        case 'V':
                            {
                                let temp = ~~Math.sqrt(memory[modulo(pointer-1, memory.length, false)]*256 + memory[pointer]);
                                memory[modulo(pointer-1, memory.length, false)] = Math.floor(temp/256);
                                memory[pointer] = temp%256;
                            }
                            break;
                        case 'W':
                            await new Promise((res, rej) => {
                                setTimeout(() => {
                                    res();
                                }, memory[pointer]*10);
                            });
                            break;
                        case 'Q':
                            await new Promise((res, rej) => {
                                let timeout = setTimeout(() => {
                                    process.stdin.removeAllListeners('keypress');
                                    memory[pointer] = 0;
                                    res();
                                }, memory[pointer]*10);
                                process.stdin.once('keypress', (str, key) => {
                                    clearTimeout(timeout);
                                    memory[pointer] = str.charCodeAt(0)%256;
                                    res();
                                })
                            })
                            break;
                        case 'P':
                            pointer += memory[pointer] < 128 ? memory[pointer] : memory[pointer] - 256;
                            if (pointer < 0) {
                                pointer = modulo(pointer, memory.length);
                                break;
                            }
                            if (pointer >= memory.length) {
                                while (pointer >= memory.length) {
                                    memory.push(0);
                                }
                                overflow = 2;
                            }
                            break;
                        case 'K':
                            {
                                if (Math.sign(memory[pointer]&128)) process.stdout.write('\x1b[6m');
                                else process.stdout.write('\x1b[25m');
                                if (Math.sign(memory[pointer]&64)) process.stdout.write('\x1b[4m');
                                else process.stdout.write('\x1b[24m');
                                let r = Math.sign(memory[pointer]&32)*128 + Math.sign(memory[pointer]&16)*64;
                                let g = Math.sign(memory[pointer]&8)*128 + Math.sign(memory[pointer]&4)*64;
                                let b = Math.sign(memory[pointer]&2)*128 + Math.sign(memory[pointer]&1)*64;
                                process.stdout.write('\x1b[38;2;'+r+';'+g+';'+b+'m');
                            }
                            break;
                        case 'R':
                            console.clear();
                            break;
                        case 'L':
                            process.stdout.write('\x1b[2K\x1b[0E\x1b[0F');
                            break;
                        case 'T':
                            {
                                const audioCtx = new AudioContext();
                                const oscillator = audioCtx.createOscillator();
                                switch (Math.sign(memory[pointer]&128)+Math.sign(memory[pointer]&64)) {
                                    case 0:
                                        oscillator.type = "sine";
                                        break;
                                    case 1:
                                        oscillator.type = "square";
                                        break;
                                    case 2:
                                        oscillator.type = "sawtooth";
                                        break;
                                    case 3:
                                        oscillator.type = "triangle";
                                        break;
                                }
                                let note = memory[pointer]&63;
                                oscillator.frequency.setValueAtTime(440 * Math.pow(2, (note-33)/12), audioCtx.currentTime);
                                oscillator.connect(audioCtx.destination);
                                oscillator.start();
                                setTimeout(() => {
                                    oscillator.stop();
                                }, memory[modulo(pointer+1, memory.length, false)]*10);
                            }
                            break;
                        case 'U':
                            if (pointer == memory.length-1) {
                                memory[pointer] = 0;
                                overflow = 2;
                            } else {
                                memory.pop();
                            }
                            break;
                        case 'G':
                            {
                                let x = memory[modulo(pointer-1, memory.length, false)];
                                let y = memory[pointer];
                                process.stdout.write('\x1b['+y+';'+x+'H');
                            }
                            break;
                        case 'H':
                            moddedAsciis = !moddedAsciis;
                            break;
                        case 'Z':
                            {
                                let temp = Date.now()-startTime
                                temp /= 1000;
                                temp = ~~temp;
                                memory[pointer] = temp%256;
                                memory[modulo(pointer-1, memory.length, false)] = Math.floor(temp/256);
                            }
                        default:
                            functions[code[executionPoint]] && code[executionPoint+1] != "(" && await executeCode(functions[code[executionPoint]], 0);
                            break;
                    }
                    overflow && overflow--;
                    executionPoint++;
                }
                r();
            });
        }
        async function end() {
            process.stdout.write('\x1b[0m');
            console.log(String.fromCharCode(10));
            console.log(String.fromCharCode(10));
            console.log(String.fromCharCode(10));
            console.log("Execution time:", Date.now()-startTime, "ms");
            console.log("[0] Exit");
            console.log("[1] Run again");
            console.log("[2] Choose another file");
            await new Promise(async (r) => {
                process.stdin.on('data', (chunk) => {
                    switch (chunk.toString()) {
                        case "0":
                            process.stdin.removeAllListeners('data');
                            process.exit();
                        case "1":
                            process.stdin.removeAllListeners('data');
                            fileData = loadedData.split("@")
                            memory = [0];
                            initData = fileData.length > 1 ? fileData.at(-1) : undefined;
                            if (initData) memory = [...initData].map((e) => e.charCodeAt(0)%256);
                            code = ""
                            while (fileData.length) {
                                code += fileData.shift()+"@"
                            }
                            storage = 0;
                            pointer = 0;
                            loopDepth = 0;
                            functions = {};
                            state = 1;
                            moddedAsciis = false;
                            console.clear();
                            run();
                            r();
                            break;
                        case "2":
                            process.stdin.removeAllListeners('data');
                            runNew();
                            r();
                            break;
                    }
                });
            });
        }
        async function run() {
            startTime = Date.now();
            await executeCode(code, 0)
            await end();
        }
        process.stdin.on('data', (chunk) => {
            if (chunk.toString() == '\u0003') {
                process.exit();
            }
        });
        await run();
    })
}
runNew();