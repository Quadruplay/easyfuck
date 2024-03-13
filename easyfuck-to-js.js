const readline = require('readline');
const fs = require('fs');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

console.clear = () => {
    process.stdout.write('\x1bc')
}

let path = "";
let final = "";
let indent = 0;

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

            codeArr = codeTemp.split("");
            codeTemp = [];
            let character = "";
            let count = 0;
            while (codeArr.length) {
                let first = codeArr.shift();
                if (["+","-","<",">"].includes(first) && (first == character || character == "") && codeArr[0] != "`") {
                    if (character == "") {
                        character = first;
                    }
                    count++;
                } else if (character != "") {
                    codeTemp.push({character, count});
                    character = "";
                    count = 0;
                    codeTemp.push(first);
                } else {
                    codeTemp.push(first);
                }
            }

            code = codeTemp;
        }
        let bunch="const readline = require('readline');\nconst fs = require('fs');\nreadline.emitKeypressEvents(process.stdin);\nprocess.stdin.setRawMode(true);\nconst { AudioContext } = require('node-web-audio-api');\nconsole.clear = () => {process.stdout.write('\\x1bc')};\nlet overflow = 0;\nlet startTime;\nlet path;\nlet stopList = [];\nlet moddedAsciiList = ['─','│','┌','┐','└','┘','├','┤','┬','┴','┼','═','║','╒','╓','╔',\n'╕','╖','╗','╘','╙','╚','╛','╜','╝','╞','╟','╠','╡','╢','╣','╤',\n'╥','╦','╧','╨','╩','╪','╫','╬','╭','╮','╯','╰','╱','╲','╳','╴',\n'╵','╶','╷','▀','▔','▁','▂','▃','▄','▅','▆','▇','█','▉','▊','▋',\n'▌','▍','▎','▏','▐','▕','▖','▗','▘','▙','▚','▛','▜','▝','▞','▟',\n'░','▒','▓','■','□','▢','▣','▤','▥','▦','▧','▨','▩','◀','▲','▶',\n'▼','◆','▮','▬','●','☄','★','☆','☐','☜','☞','☢','☣','☤','☥','☭',\n'☺','☻','☼','☉','☽','☾','☿','♀','♁','♂','♃','♄','♅','♆','♇','♔',\n'♕','♖','♗','♘','♙','♥','♦','♣','♠','♩','♪','♫','♬','♭','♮','♯',\n'♰','⚀','⚁','⚂','⚃','⚄','⚅','⚇','⚉','⚚','⚠','⚲','⚳','⚴','⚵','⚶',\n'⚷','⚸','⚿','⛀','⛁','⛂','⛃','⛆','⛇','⛤','⛧','⛭','𐕣','⛉','⛊','🕭',\n'🕮','🕱','🕾','🖂','🗲','⚐','⚑','🗿','⭠','⭡','⭢','⭣','⭦','⭧','⭨','⭩',\n'ඞ','Α','Β','Γ','Δ','Ε','Ζ','Η','Θ','Ι','Κ','Λ','Μ','Ν','Ξ','Ο',\n'Π','Ρ','Σ','Τ','Υ','Φ','Χ','Ψ','Ω','α','β','γ','δ','ε','ζ','η',\n'θ','ι','κ','λ','μ','ν','ξ','ο','π','ρ','ς','σ','τ','υ','φ','χ',\n'ψ','ω','€','𓁌','𓃒','𓃗','𓃩','𓅃','𓆈','𓆌','𓆉','𓆏','𓆙','𓆟','𓆤','𓆣'];\nlet moddedAsciis = false;\nfunction modulo(number, mod, setoverflow = true) {if (setoverflow && (number < 0 || number >= mod)) overflow = 1;\nreturn mod ? ((number%mod)+mod)%mod : 0;\n};\n"
        bunch+="let memory = ["+memory.join(",")+"];\nlet index = 0;\nlet storage = 0;\n";

        function appendLine(line) {
            let closing = (line.match(/}/g) || []).length;
            let opening = (line.match(/{/g) || []).length;
            if (closing > opening) {
                indent += opening-closing;
            }
            let spaces = "";
            for (let i = 0; i < indent; i++) {
                spaces += "    ";
            }
            final+=spaces+line+"\n";
            if (opening > closing) {
                indent += opening-closing;
            }
        }

        appendLine("async function main() {");
        appendLine("return new Promise(async (resolve, reject) => {");
        
        let blockArray = [];
        
        bunch.split("\n").forEach((line) => {
            appendLine(line);
        });
        appendLine("process.stdin.on('data', (chunk) => {");
        appendLine("if (chunk.toString() == '\\u0003') {");
        appendLine("process.exit();");
        appendLine("}");
        appendLine("});");

        appendLine("let a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z;");
        appendLine("startTime = Date.now();");
        appendLine("let skip = 0;");
        let skipCommand = 0;
        let skipLambda = 0
        let skipWhileIn = 0;
        let skipWhileOut = 0;
        let doubleSkip = 0;
        let tripleSkip = 0;

        code.forEach((command, index) => {
            function overflowCheck() {
                if (code[index+1] == "`") appendLine("overflow = 0;");
            }
            if (command == "`" && !tripleSkip) {
                skip = 2;
                switch (code[index+1]) {
                    case "(":
                        skipLambda++;
                        break;
                    case "[":
                        skipWhileIn++;
                        break;
                    case "]":
                        skipWhileOut++;
                        break;
                    case ")":
                        break;
                    case "`":
                        code[index+2] == "`" ? tripleSkip++ : doubleSkip++;
                        break;
                    default:
                        skipCommand++;
                        break;
                }
                return;
            }
            if (skipCommand) {
                if (doubleSkip) {
                    appendLine("if (!overflow) {");
                } else {
                    appendLine("if (overflow) {");
                }
            }
            if (tripleSkip && command != "`") tripleSkip--;
            if (typeof command == "object") {
                let character = command.character;
                let count = command.count;
                switch (character) {
                    case "+":
                        appendLine("memory[index] = modulo(memory[index] + "+count+", 256);");
                        break;
                    case "-":
                        appendLine("memory[index] = modulo(memory[index] - "+count+", 256);");
                        break;
                    case "<":
                        appendLine("index = modulo(index - "+count+", memory.length);");
                        break;
                    case ">":
                        appendLine("index+= "+count+";");
                        appendLine("while (index >= memory.length) {");
                        appendLine("memory.push(0);");
                        appendLine("}");
                        break;
                }
                return;
            }
            switch (command) {
                case ">":
                    appendLine("index++;");
                    appendLine("if (index >= memory.length) {");
                    appendLine("memory.push(0);");
                    appendLine("overflow = 1;");
                    if (code[index+1] == "`") appendLine("} else {");
                    overflowCheck()
                    appendLine("}");
                    break;
                case "<":
                    appendLine("index--;");
                    appendLine("if (index < 0) {");
                    appendLine("index = memory.length-1;");
                    appendLine("overflow = 1;");
                    if (code[index+1] == "`") appendLine("} else {");
                    overflowCheck()
                    appendLine("}");
                    break;
                case "J":
                    appendLine("index = 0;");
                    overflowCheck()
                    break;
                case "U":
                    appendLine("if (index == memory.length-1) {");
                    appendLine("overflow = 1;");
                    appendLine("memory[index] = 0;");
                    appendLine("} else {");
                    appendLine("memory.pop();");
                    overflowCheck()
                    appendLine("}");
                    break;
                case "P":
                    appendLine("index += memory[index] < 128 ? memory[index] : -256+memory[index];");
                    appendLine("if (index < 0) {");
                    appendLine("index = modulo(index, memory.length);");
                    appendLine("overflow = 1;");
                    appendLine("} else if (index >= memory.length) {");
                    appendLine("while (index >= memory.length) {");
                    appendLine("memory.push(0);");
                    appendLine("}");
                    appendLine("overflow = 1;");
                    appendLine("} else {");
                    overflowCheck()
                    appendLine("}");
                    break;
                case "$":
                    appendLine("storage = memory[index];");
                    overflowCheck()
                    break;
                case "!":
                    appendLine("memory[index] = storage;");
                    overflowCheck()
                    break;
                case "S":
                    appendLine("{");
                    appendLine("let temp = memory[index];");
                    appendLine("memory[index] = storage;");
                    appendLine("storage = temp;");
                    appendLine("}");
                    overflowCheck()
                    break;
                case ",":
                    appendLine("await new Promise((r) => {");
                    appendLine("process.stdin.once('keypress', (str, key) => {");
                    appendLine("memory[index] = str.charCodeAt(0)%256;");
                    appendLine("r();");
                    appendLine("});");
                    appendLine("});");
                    overflowCheck()
                    break;
                case ".":
                    appendLine("process.stdout.write(moddedAsciis ? moddedAsciiList[memory[index]] : String.fromCharCode(memory[index]));");
                    overflowCheck()
                    break;
                case '"':
                    appendLine("await new Promise((r) => {");
                    appendLine("let temp = 0;");
                    appendLine("let chars = 0;");
                    appendLine("function end() {");
                    appendLine("for (let i = 0; i < chars; i++) process.stdout.write('\\b');");
                    appendLine("for (let i = 0; i < chars; i++) process.stdout.write(' ');");
                    appendLine("for (let i = 0; i < chars; i++) process.stdout.write('\\b');");
                    appendLine("memory[index] = temp;");
                    appendLine("process.stdin.removeAllListeners('keypress');");
                    appendLine("r();");
                    appendLine("}");
                    appendLine("process.stdin.on('keypress', (str, key) => {");
                    appendLine('if (["0","1","2","3","4","5","6","7","8","9"].includes(str)) {');
                    appendLine("if (temp == 0 && parseInt(str) == 0 && chars > 0) {");
                    appendLine("end();");
                    appendLine("}");
                    appendLine("if (temp*10+str > 255) {");
                    appendLine("end();");
                    appendLine("}");
                    appendLine("temp = temp*10+parseInt(str);");
                    appendLine("chars++;");
                    appendLine("process.stdout.write(str);");
                    appendLine("} else {");
                    appendLine("end();");
                    appendLine("}");
                    appendLine("});");
                    appendLine("});");
                    overflowCheck()
                    break;
                case "'":
                    appendLine("process.stdout.write(String(memory[index]));");
                    overflowCheck()
                    break;
                case "I":
                    appendLine("await new Promise((r) => {");
                    appendLine("let temp = 0;");
                    appendLine("let chars = 0;");
                    appendLine("function end() {");
                    appendLine("for (let i = 0; i < chars; i++) process.stdout.write('\\b');");
                    appendLine("for (let i = 0; i < chars; i++) process.stdout.write(' ');");
                    appendLine("for (let i = 0; i < chars; i++) process.stdout.write('\\b');");
                    appendLine("memory[index] = temp%256;");
                    appendLine("memory[modulo(index-1, memory.length, false)] = Math.floor(temp/256);");
                    appendLine("process.stdin.removeAllListeners('keypress');");
                    appendLine("r();");
                    appendLine("}");
                    appendLine("process.stdin.on('keypress', (str, key) => {");
                    appendLine('if (["0","1","2","3","4","5","6","7","8","9"].includes(str)) {');
                    appendLine("if (temp == 0 && parseInt(str) == 0 && chars > 0) {");
                    appendLine("end();");
                    appendLine("}");
                    appendLine("if (temp*10+str > 65535) {");
                    appendLine("end();");
                    appendLine("}");
                    appendLine("temp = temp*10+parseInt(str);");
                    appendLine("chars++;");
                    appendLine("process.stdout.write(str);");
                    appendLine("} else {");
                    appendLine("end();");
                    appendLine("}");
                    appendLine("});");
                    appendLine("});");
                    overflowCheck()
                    break;
                case "O":
                    appendLine("{");
                    appendLine("let temp = memory[index]+memory[modulo(index-1, memory.length, false)]*256;");
                    appendLine("process.stdout.write(String(temp));");
                    appendLine("}");
                    overflowCheck()
                    break;
                case "R":
                    appendLine("console.clear();");
                    overflowCheck()
                    break;
                case "L":
                    appendLine("process.stdout.write('\\x1b[2K\\x1b[0E\\x1b[0F');");
                    overflowCheck()
                    break;
                case "Q":
                    appendLine("await new Promise((r) => {");
                    appendLine("let timeout = setTimeout(() => {");
                    appendLine("process.stdin.removeAllListeners('keypress');");
                    appendLine("memory[index] = 0;");
                    appendLine("r();");
                    appendLine("}, memory[index]*10);");
                    appendLine("process.stdin.once('keypress', (str, key) => {");
                    appendLine("clearTimeout(timeout);");
                    appendLine("memory[index] = str.charCodeAt(0)%256;");
                    appendLine("r();");
                    appendLine("});");
                    appendLine("});");
                    overflowCheck()
                    break;
                case "G":
                    appendLine("{");
                    appendLine("let x = memory[modulo(index-1, memory.length, false)];");
                    appendLine("let y = memory[index];");
                    appendLine("process.stdout.write('\\x1b['+y+';'+x+'H');");
                    appendLine("}");
                    overflowCheck()
                    break;
                case "H":
                    appendLine("moddedAsciis = !moddedAsciis;");
                    overflowCheck()
                    break;
                case "T":
                    appendLine("{");
                    appendLine("const audioCtx = new AudioContext();");
                    appendLine("const oscillator = audioCtx.createOscillator();");
                    appendLine("switch (Math.sign(memory[index]&128)+Math.sign(memory[index]&64)) {");
                    appendLine("case 0:");
                    appendLine("oscillator.type = 'sine';");
                    appendLine("break;");
                    appendLine("case 1:");
                    appendLine("oscillator.type = 'square';");
                    appendLine("break;");
                    appendLine("case 2:");
                    appendLine("oscillator.type = 'sawtooth';");
                    appendLine("break;");
                    appendLine("case 3:");
                    appendLine("oscillator.type = 'triangle';");
                    appendLine("break;");
                    appendLine("}");
                    appendLine("let note = memory[index]%127;");
                    appendLine("oscillator.frequency.setValueAtTime(440 * Math.pow(2, (note-69)/12), audioCtx.currentTime);");
                    appendLine("oscillator.connect(audioCtx.destination);");
                    appendLine("oscillator.start();");
                    appendLine("setTimeout(() => {");
                    appendLine("oscillator.stop();");
                    appendLine("}, memory[modulo(index+1, memory.length, false)]*10);");
                    appendLine("}");
                    overflowCheck()
                    break;
                case "K":
                    appendLine("{");
                    appendLine("if (Math.sign(memory[index]&128)) == 0) process.stdout.write('\\x1b[6m');");
                    appendLine("else process.stdout.write('\\x1b[25m');");
                    appendLine("if (Math.sign(memory[index]&64)) == 0) process.stdout.write('\\x1b[4m');");
                    appendLine("else process.stdout.write('\\x1b[24m');");
                    appendLine("let r = Math.sign(memory[index]&32)*128 + Math.sign(memory[index]&16)*64");
                    appendLine("let g = Math.sign(memory[index]&8)*128 + Math.sign(memory[index]&4)*64");
                    appendLine("let b = Math.sign(memory[index]&2)*128 + Math.sign(memory[index]&1)*64");
                    appendLine("process.stdout.write('\\x1b[38;2;'+r+';'+g+';'+b+'m');");
                    appendLine("}");
                    overflowCheck()
                    break;
                case "+":
                    overflowCheck()
                    appendLine("memory[index] = modulo(memory[index]+1, 256);");
                    break;
                case "-":
                    overflowCheck()
                    appendLine("memory[index] = modulo(memory[index]-1, 256);");
                    break;
                case "=":
                    overflowCheck()
                    appendLine("memory[index] = modulo(memory[index]+storage, 256);");
                    break;
                case "_":
                    overflowCheck()
                    appendLine("memory[index] = modulo(memory[index]-storage, 256);");
                    break;
                case "*":
                    overflowCheck()
                    appendLine("memory[index] = modulo(memory[index]*storage, 256);");
                    break;
                case "/":
                    overflowCheck()
                    appendLine("memory[index] = Math.floor(memory[index]/storage);");
                    break;
                case "%":
                    overflowCheck()
                    appendLine("memory[index] = memory[index]%storage;");
                    break;
                case "\\":
                    overflowCheck()
                    appendLine("memory[index] = Math.floor(Math.sqrt(memory[index]));");
                    break;
                case ":":
                    overflowCheck()
                    appendLine("memory[index] = Math.max(memory[index], storage);");
                    break;
                case "M":
                    appendLine("{");
                    appendLine("let temp = memory[index]+memory[modulo(index-1, memory.length, false)]*256;");
                    appendLine("temp*=storage;");
                    overflowCheck()
                    appendLine("temp = modulo(temp, 65536);");
                    appendLine("memory[index] = temp%256;");
                    appendLine("memory[modulo(index-1, memory.length, false)] = Math.floor(temp/256);");
                    appendLine("}");
                    break;
                case "N":
                    appendLine("{");
                    appendLine("let temp = memory[index]+memory[modulo(index-1, memory.length, false)]*256;");
                    appendLine("temp = Math.floor(temp/storage);");
                    overflowCheck()
                    appendLine("memory[index] = temp%256;");
                    appendLine("memory[modulo(index-1, memory.length, false)] = Math.floor(temp/256);");
                    appendLine("}");
                    break;
                case "V":
                    appendLine("{");
                    appendLine("let temp = memory[index]+memory[modulo(index-1, memory.length, false)]*256;");
                    appendLine("temp = Math.floor(Math.sqrt(temp));");
                    overflowCheck()
                    appendLine("memory[index] = temp%256;");
                    appendLine("memory[modulo(index-1, memory.length, false)] = Math.floor(temp/256);");
                    appendLine("}");
                    break;
                case "0":
                    appendLine("memory[index] = 0;");
                    overflowCheck()
                    break;
                case "1":
                    appendLine("memory[index] = 16;");
                    overflowCheck()
                    break;
                case "2":
                    appendLine("memory[index] = 32;");
                    overflowCheck()
                    break;
                case "3":
                    appendLine("memory[index] = 48;");
                    overflowCheck()
                    break;
                case "4":
                    appendLine("memory[index] = 64;");
                    overflowCheck()
                    break;
                case "5":
                    appendLine("memory[index] = 80;");
                    overflowCheck()
                    break;
                case "6":
                    appendLine("memory[index] = 96;");
                    overflowCheck()
                    break;
                case "7":
                    appendLine("memory[index] = 112;");
                    overflowCheck()
                    break;
                case "8":
                    appendLine("memory[index] = 128;");
                    overflowCheck()
                    break;
                case "9":
                    appendLine("memory[index] = 144;");
                    overflowCheck()
                    break;
                case "A":
                    appendLine("memory[index] = 160;");
                    overflowCheck()
                    break;
                case "B":
                    appendLine("memory[index] = 176;");
                    overflowCheck()
                    break;
                case "C":
                    appendLine("memory[index] = 192;");
                    overflowCheck()
                    break;
                case "D":
                    appendLine("memory[index] = 208;");
                    overflowCheck()
                    break;
                case "E":
                    appendLine("memory[index] = 224;");
                    overflowCheck()
                    break;
                case "F":
                    appendLine("memory[index] = 240;");
                    overflowCheck()
                    break;
                case "{":
                    appendLine("overflow = memory[index] >= 128 ? 1 : 0;");
                    appendLine("memory[index] = (memory[index] << 1) & 255;");
                    break;
                case "}":
                    appendLine("overflow = memory[index]%2;");
                    appendLine("memory[index] = memory[index] >>> 1;");
                    break;
                case "~":
                    appendLine("memory[index] = ~memory[index];");
                    overflowCheck()
                    break;
                case "&":
                    appendLine("memory[index] = memory[index] & storage;");
                    overflowCheck()
                    break;
                case "|":
                    appendLine("memory[index] = memory[index] | storage;");
                    overflowCheck()
                    break;
                case "^":
                    appendLine("memory[index] = memory[index] ^ storage;");
                    overflowCheck()
                    break;
                case "Y":
                    appendLine("{");
                    appendLine("let bit1 = memory[index]&1;");
                    appendLine("let bit2 = memory[index]&2;");
                    appendLine("let bit4 = memory[index]&4;");
                    appendLine("let bit8 = memory[index]&8;");
                    appendLine("let bit16 = memory[index]&16;");
                    appendLine("let bit32 = memory[index]&32;");
                    appendLine("let bit64 = memory[index]&64;");
                    appendLine("let bit128 = memory[index]&128;");
                    appendLine("memory[index] = (bit1*128)+(bit2*64)+(bit4*32)+(bit8*16)+(bit16*8)+(bit32*4)+(bit64*2)+(bit128);");
                    appendLine("}");
                    overflowCheck()
                    break;
                case "(":
                    {
                        let temp = code[index-1];
                        if (temp == temp.toLowerCase() && temp != temp.toUpperCase()) {
                            appendLine(temp+" = () => {");
                        } else {
                            appendLine("() => {");
                            if (skipLambda) {
                                if (doubleSkip) {
                                    appendLine("if (overflow) return;");
                                } else {
                                    appendLine("if (!overflow) return;");
                                }
                                skipLambda--;
                                doubleSkip ? doubleSkip-- : null;
                            }
                        }
                        overflowCheck()
                    }
                    blockArray.push("lambda");
                    break;
                case ")":
                    {
                        let temp = index;
                        let depth = 1;
                        while (depth) {
                            temp--;
                            if (code[temp] == ")") {
                                depth++;
                            } else if (code[temp] == "(") {
                                depth--;
                            }
                        }
                        temp--;
                        let command = code[temp];
                        if (command == command.toLowerCase() && command != command.toUpperCase()) {
                            appendLine("}");
                        } else {
                            appendLine("}();");
                        }
                    }
                    overflowCheck()
                    blockArray.pop();
                    break;
                case "W":
                    appendLine("await new Promise((r) => {");
                    appendLine("setTimeout(() => {");
                    appendLine("r();");
                    appendLine("}, memory[index]*10);");
                    appendLine("});");
                    overflowCheck()
                    break;
                case "Z":
                    appendLine("{");
                    appendLine("let temp = Date.now()-startTime;");
                    appendLine("temp/=1000;");
                    appendLine("temp = Math.floor(temp);");
                    appendLine("memory[index] = temp%256;");
                    appendLine("memory[modulo(index-1, memory.length, false)] = Math.floor(temp/256);");
                    appendLine("}");
                    overflowCheck()
                    break;
                case "?":
                    appendLine("memory[index] = Math.floor(Math.random()*256);");
                    overflowCheck()
                    break;
                case "[":
                    if (skipWhileIn) {
                        appendLine("skip=0;");
                        if (doubleSkip) {
                            appendLine("if (overflow) skip++;");
                        } else {
                            appendLine("if (!overflow) skip++;");
                        }
                        doubleSkip ? doubleSkip-- : null;
                    }
                    appendLine("while (memory[index] || skip) {");
                    if (skipWhileIn) {
                        appendLine("skip=0;");
                        skipWhileIn--;
                    }
                    overflowCheck()
                    blockArray.push("while");
                    break;
                case "]":
                    if (skipWhileOut) {
                        if (doubleSkip) {
                            appendLine("if (overflow) break;");
                        } else {
                            appendLine("if (!overflow) break;");
                        }
                        skipWhileOut--;
                        doubleSkip ? doubleSkip-- : null;
                    }
                    appendLine("}");
                    overflowCheck()
                    blockArray.pop();
                    break;
                case ";":
                    overflowCheck()
                    if (blockArray.length) {
                        if (blockArray.at(-1) == "while") {
                            appendLine("break;");
                        } else if (blockArray.includes("lambda")) {
                            appendLine("return;");
                        }
                    } else {
                        appendLine("process.exit();");
                    }
                    break;
                case "@":
                    overflowCheck()
                    if (blockArray.length && blockArray.includes("lambda")) {
                        appendLine("return;");
                    } else {
                        appendLine("process.exit();");
                    }
                    break;
                case "X":
                    appendLine("process.exit();");
                    break;
                default:
                    if (code[index+1] != "(") {
                        appendLine("if ("+command+") {");
                        overflowCheck()
                        appendLine(command+"();");
                        appendLine("}");
                    }
                    break;
            }
            if (skipCommand) {
                appendLine("}");
                skipCommand--;
                doubleSkip ? doubleSkip-- : null;
            }
        });

        appendLine("process.exit();");
        appendLine("});");
        appendLine("}");
        appendLine("main();");

        async function save() {
            return new Promise((res, rej) => {
                fs.writeFile(path.replace('.ef','.js'), final, (err) => {
                    if (err) {
                        console.error(err);
                        rej();
                    }
                    res();
                });
            });
        }
        await save();
        console.log("File saved as "+path.replace(".ef",".js"));
        process.exit();
    });
}
runNew();