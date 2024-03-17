## Easyfuck Programming Language

Easyfuck is an open-source interpreted esoteric programming language designed as a derivative of Brainfuck, with enhancements aimed at improving usability. It offers features such as functions, initializer data, and more, all represented by ASCII characters.

### Getting Started

To begin using the Easyfuck interpreter, follow these steps:

1. **Clone the Repository**: Start by cloning the Easyfuck repository and navigating into it:
    ```powershell
    git clone https://github.com/Quadruplay/easyfuck
    cd easyfuck
    ```

2. **Install Dependencies**: Ensure that Node.js is installed, then proceed to install the required dependencies using npm:
    ```powershell
    npm install node
    npm install node-web-audio-api
    npm install -g @yao-pkg/pkg
    ```

3. **Run the Batch file**: 
    ```powershell
    ./RUNME.bat
    ```

4. **Install the official syntax highlighting extension for vscode (optional)**:

    https://marketplace.visualstudio.com/items?itemName=Quadruplay.easyfuck-syntax

Note: Easyfuck files must use the `.ef` file extension.

---


### Memory Management

Easyfuck operates on a right-infinite array of 8-bit cells, with the pointer indicating the current cell. Additionally, a separate 8-bit storage cell exists. The language provides commands for moving the pointer within the array:

| Command | Description |
|---------|-------------|
| `>`     | Moves the pointer one cell to the right. |
| `<`     | Moves the pointer one cell to the left. If the pointer reaches below the 0th cell, it loops around to the furthest explored cell to the right. |
| `J`     | Moves the pointer back to the 0th cell. |
| `U`     | Unexplores the furthest explored cell to the right, setting it to 0, and moving it back to the unexplored state. |
| `P`     | Moves the pointer to the right by the value of the signed integer stored in the cell at the pointer. Negative values move the pointer left. All unexplored cells passed by the pointer get explored, and if the pointer reaches below the 0th cell, it loops around.

In Easyfuck, the concept of an **explored cell** refers to any cell previously visited by the pointer or one that holds a non-zero value.

Note: Unexploring a cell while pointing to it immediately explores it again.

---

### Data Movement

Data manipulation in Easyfuck involves moving data around using the storage cell and three associated commands:

| Command | Description |
|---------|-------------|
| `$`     | Copies the contents of the cell at the pointer to the storage cell |
| `!`     | Copies the contents of the storage cell to the cell at the pointer |
| `S`     | Swaps the contents of the storage cell and the cell at the pointer |

---


### I/O Operations

Easyfuck supports conventional input and output operations through various commands:

| Command | Description |
|---------|-------------|
| `,`     | Waits for a character and puts its Unicode value modulo 256 into the cell at the pointer. |
| `.`     | Outputs the Unicode character associated with the value stored in the cell at the pointer. |
| `"`     | Waits for a number from 0 to 255 and puts it into the cell at the pointer. |
| `'`     | Outputs the value stored in the cell at the pointer as an unsigned integer. |
| `I`     | Waits for a number from 0 to 65536 and puts it into the bi-cell at the pointer. |
| `O`     | Outputs the value stored in the bi-cell at the pointer as an unsigned integer. |
| `R`     | Clears the output. |
| `L`     | Clears a single line of the output. |
| `Q`     | Waits for a character and puts its Unicode value modulo 256 into the cell at the pointer. If a character is not received promptly, it defaults to 0. The waiting time is calculated in milliseconds by multiplying the value of the cell at the pointer by 10. |
| `G`     | Moves the output cursor to the column decided by the value in the cell to the left, and the row decided by the cell at the pointer. |

In Easyfuck, a bi-cell refers to the cell at the pointer and the cell immediately to the left, acting together as a 16-bit number.

A command exists that modifies the output of `.`.

| Command | Description |
|---------|-------------|
| `H`     | Switches the output of `.` to use a different table. Using it again switches it back to the default |

<details>
<summary>The table below provides a more detailed representation:</summary>

| Value | Alt Character | Default Character | Value | Alt Character | Default Character | Value | Alt Character | Default Character | Value | Alt Character |  Default Character  |
|-------|-----------|-|-------|-----------|-|-------|-----------|-|-------|-----------|-|
| `0`   |   `─`     | `NUL` | `64` |    `▌`    | `@` | `128` |    `♕`    | `PAD` | `192` |    `ඞ`    | `À`
| `1`   |   `│`     | `SOH` | `65` |    `▍`    | `A` | `129` |    `♖`    | `HOP` | `193` |    `Α`    | `Á`
| `2`   |   `┌`     | `STX` | `66` |    `▎`    | `B` | `130` |    `♗`    | `BPH` | `194` |    `Β`    | `Â`
| `3`   |   `┐`     | `ETX` | `67` |    `▏`    | `C` | `131` |    `♘`    | `NBH` | `195` |    `Γ`    | `Ã`
| `4`   |   `└`     | `EOT` | `68` |    `▐`    | `D` | `132` |    `♙`    | `IND` | `196` |    `Δ`    | `Ä`
| `5`   |   `┘`     | `ENQ` | `69` |    `▕`    | `E` | `133` |    `♥`    | `NEL` | `197` |    `Ε`    | `Å`
| `6`   |   `├`     | `ACK` | `70` |    `▖`    | `F` | `134` |    `♦`    | `SSA` | `198` |    `Ζ`    | `Æ`
| `7`   |   `┤`     | `BEL` | `71` |    `▗`    | `G` | `135` |    `♣`    | `ESA` | `199` |    `Η`    | `Ç`
| `8`   |   `┬`     | `BS` | `72` |    `▘`    | `H` | `136` |    `♠`    | `HTS` | `200` |    `Θ`    | `È`
| `9`   |   `┴`     | `TAB` | `73` |    `▙`    | `I` | `137` |    `♩`    | `HTJ` | `201` |    `Ι`    | `É`
| `10`  |   `┼`     | `LF` | `74` |    `▚`    | `J` | `138` |    `♪`    | `LTS` | `202` |    `Κ`    | `Ê`
| `11`  |   `═`     | `VT` | `75` |    `▛`    | `K` | `139` |    `♫`    | `PLD` | `203` |    `Λ`    | `Ë`
| `12`  |   `║`     | `FF` | `76` |    `▜`    | `L` | `140` |    `♬`    | `PLU` | `204` |    `Μ`    | `Ì`
| `13`  |   `╒`     | `CR` | `77` |    `▝`    | `M` | `141` |    `♭`    | `RI` | `205` |    `Ν`    | `Í`
| `14`  |   `╓`     | `SO` | `78` |    `▞`    | `N` | `142` |    `♮`    | `SS2` | `206` |    `Ξ`    | `Î`
| `15`  |   `╔`     | `SI` | `79` |    `▟`    | `O` | `143` |    `♯`    | `SS3` | `207` |    `Ο`    | `Ï`
| `16`  |   `╕`     | `DLE` | `80` |    `░`    | `P` | `144` |    `♰`    | `DCS` | `208` |    `Π`    | `Ð`
| `17`  |   `╖`     | `DC1` | `81` |    `▒`    | `Q` | `145` |    `⚀`    | `PU1` | `209` |    `Ρ`    | `Ñ`
| `18`  |   `╗`     | `DC2` | `82` |    `▓`    | `R` | `146` |    `⚁`    | `PU2` | `210` |    `Σ`    | `Ò`
| `19`  |   `╘`     | `DC3` | `83` |    `■`    | `S` | `147` |    `⚂`    | `STS` | `211` |    `Τ`    | `Ó`
| `20`  |   `╙`     | `DC4` | `84` |    `□`    | `T` | `148` |    `⚃`    | `CCH` | `212` |    `Υ`    | `Ô`
| `21`  |   `╚`     | `NAK` | `85` |    `▢`    | `U` | `149` |    `⚄`    | `MW` | `213` |    `Φ`    | `Õ`
| `22`  |   `╛`     | `SYN` | `86` |    `▣`    | `V` | `150` |    `⚅`    | `SPA` | `214` |    `Χ`    | `Ö`
| `23`  |   `╜`     | `ETB` | `87` |    `▤`    | `W` | `151` |    `⚇`    | `EPA` | `215` |    `Ψ`    | `×`
| `24`  |   `╝`     | `CAN` | `88` |    `▥`    | `X` | `152` |    `⚉`    | `SOS` | `216` |    `Ω`    | `Ø`
| `25`  |   `╞`     | `EM` | `89` |    `▦`    | `Y` | `153` |    `⚚`    | `SGCI` | `217` |    `α`    | `Ù`
| `26`  |   `╟`     | `SUB` | `90` |    `▧`    | `Z` | `154` |    `⚠`    | `SCI` | `218` |    `β`    | `Ú`
| `27`  |   `╠`     | `ESC` | `91` |    `▨`    | `[` | `155` |    `⚲`    | `CSI` | `219` |    `γ`    | `Û`
| `28`  |   `╡`     | `FS` | `92` |    `▩`    | `\` | `156` |    `⚳`    | `ST` | `220` |    `δ`    | `Ü`
| `29`  |   `╢`     | `GS` | `93` |    `◀`    | `]` | `157` |    `⚴`    | `OSC` | `221` |    `ε`    | `Ý`
| `30`  |   `╣`     | `RS` | `94` |    `▲`    | `^` | `158` |    `⚵`    | `PM` | `222` |    `ζ`    | `Þ`
| `31`  |   `╤`     | `US` | `95` |    `▶`    | `_` | `159` |    `⚶`    | `APC` | `223` |    `η`    | `ß`
| `32`  |   `╥`     | `Space` | `96` |    `▼`    | `` ` `` | `160` |    `⚷`    | `NBSP` | `224` |    `θ`    | `à`
| `33`  |   `╦`     | `!` | `97` |    `◆`    | `a` | `161` |    `⚸`    | `¡` | `225` |    `ι`    | `á`
| `34`  |   `╧`     | `"` | `98` |    `▮`    | `b` | `162` |    `⚿`    | `¢` | `226` |    `κ`    | `â`
| `35`  |   `╨`     | `#` | `99` |    `▬`    | `c` | `163` |    `⛀`    | `£` | `227` |    `λ`    | `ã`
| `36`  |   `╩`     | `$` | `100`|    `●`    | `d` | `164` |    `⛁`    | `¤` | `228` |    `μ`    | `ä`
| `37`  |   `╪`     | `%` | `101`|    `☄`    | `e` | `165` |    `⛂`    | `¥` | `229` |    `ν`    | `å`
| `38`  |   `╫`     | `&` | `102`|    `★`    | `f` | `166` |    `⛃`    | `¦` | `230` |    `ξ`    | `æ`
| `39`  |   `╬`     | `'` | `103`|    `☆`    | `g` | `167` |    `⛆`    | `§` | `231` |    `ο`    | `ç`
| `40`  |   `╭`     | `(` | `104`|    `☐`    | `h` | `168` |    `⛇`    | `¨` | `232` |    `π`    | `è`
| `41`  |   `╮`     | `)` | `105`|    `☜`    | `i` | `169` |    `⛤`    | `©` | `233` |    `ρ`    | `é`
| `42`  |   `╯`     | `*` | `106`|    `☞`    | `j` | `170` |    `⛧`    | `ª` | `234` |    `ς`    | `ê`
| `43`  |   `╰`     | `+` | `107`|    `☢`    | `k` | `171` |    `⛭`    | `«` | `235` |    `σ`    | `ë`
| `44`  |   `╱`     | `,` | `108`|    `☣`    | `l` | `172` |    `𐕣`    | `¬` | `236` |    `τ`    | `ì`
| `45`  |   `╲`     | `-` | `109`|    `☤`    | `m` | `173` |    `⛉`    | ­`SHY` | `237` |    `υ`    | `í`
| `46`  |   `╳`     | `.` | `110`|    `☥`    | `n` | `174` |    `⛊`    | `®` | `238` |    `φ`    | `î`
| `47`  |   `╴`     | `/` | `111`|    `☭`    | `o` | `175` |    `🕭`    | `¯` | `239` |    `χ`    | `ï`
| `48`  |   `╵`     | `0` | `112`|    `☺`    | `p` | `176` |    `🕮`    | `°` | `240` |    `ψ`    | `ð`
| `49`  |   `╶`     | `1` | `113`|    `☻`    | `q` | `177` |    `🕱`    | `±` | `241` |    `ω`    | `ñ`
| `50`  |   `╷`     | `2` | `114`|    `☼`    | `r` | `178` |    `🕾`    | `²` | `242` |    `€`    | `ò`
| `51`  |   `▀`     | `3` | `115`|    `☉`    | `s` | `179` |    `🖂`    | `³` | `243` |    `𓁌`    | `ó`
| `52`  |   `▔`     | `4` | `116`|    `☽`    | `t` | `180` |    `🗲`   | `´` | `244` |    `𓃒`   | `ô`
| `53`  |   `▁`     | `5` | `117`|    `☾`    | `u` | `181` |    `⚐`   | `µ` | `245` |    `𓃗`   | `õ`
| `54`  |   `▂`     | `6` | `118`|    `☿`    | `v` | `182` |    `⚑`   | `¶` | `246` |    `𓃩`   | `ö`
| `55`  |   `▃`     | `7` | `119`|    `♀`    | `w` | `183` |    `🗿`   | `·` | `247` |    `𓅃`   | `÷`
| `56`  |   `▄`     | `8` | `120`|    `♁`    | `x` | `184` |    `⭠`   | `¸` | `248` |    `𓆈`   | `ø`
| `57`  |   `▅`     | `9` | `121`|    `♂`    | `y` | `185` |    `⭡`   | `¹` | `249` |    `𓆌`   | `ù`
| `58`  |   `▆`     | `:` | `122`|    `♃`    | `z` | `186` |    `⭢`   | `º` | `250` |    `𓆉`   | `ú`
| `59`  |   `▇`     | `;` | `123`|    `♄`    | `{` | `187` |    `⭣`   | `»` | `251` |    `𓆏`   | `û`
| `60`  |   `█`     | `<` | `124`|    `♅`    | <code>&#124;</code> | `188` |    `⭦`   | `¼` | `252` |    `𓆙`   | `ü`
| `61`  |   `▉`     | `=` | `125`|    `♆`    | `}` | `189` |    `⭧`   | `½` | `253` |    `𓆟`   | `ý`
| `62`  |   `▊`     | `>` | `126`|    `♇`    | `~` | `190` |    `⭨`   | `¾` | `254` |    `𓆤`   | `þ`
| `63`  |   `▋`     | `?` | `127`|    `♔`    | `DEL` | `191` |    `⭩`   | `¿` | `255` |    `𓆣`   | `ÿ`
</details>

---


### Additional Output Commands

Two additional commands exist for producing output:

| Command | Description |
|---------|-------------|
| `T`     | Produces a sound with the tone defined by the cell at the pointer and length defined by the cell to the right. This operation does not pause the program. |
| `K`     | Changes the color of the characters produced henceforth. |

The color produced by the `K` command is derived from the value of the byte at the pointer and is encoded as follows:

| Bit(s) | Function       |
|--------|----------------|
| `128`  | Toggles blinking on and off |
| `64`   | Toggles underline on and off |
| `32`, `16` | Red    |
| `8`, `4` | Green  |
| `2`, `1` | Blue   |

---


### Arithmetic Operations

Arithmetic operations enable mathematical computations within Easyfuck programs:

| Command | Description |
|---------|-------------|
| `+`     | Increments the cell at the pointer. |
| `-`     | Decrements the cell at the pointer. |
| `=`     | Adds the value of the storage cell to the value in the cell at the pointer, and stores the result in the cell at the pointer. |
| `_`     | Subtracts the value of the storage cell from the value in the cell at the pointer, and stores the result in the cell at the pointer. |
| `*`     | Multiplies the value in the cell at the pointer by the value of the storage cell, and stores the result in the cell at the pointer. |
| `M`     | Multiplies the value of the bi-cell at the pointer by the value of the storage cell, and stores the result in the bi-cell at the pointer. |
| `/`     | Divides the value in the cell at the pointer by the value of the storage cell, and stores the quotient in the cell at the pointer. |
| `N`     | Divides the value of the bi-cell at the pointer by the value of the storage cell, and stores the quotient in the bi-cell at the pointer. |
| `\`     | Calculates the square root of the value in the cell at the pointer, and stores the result in the cell at the pointer. |
| `V`     | Calculates the square root of the value of the bi-cell at the pointer, and stores the result in the bi-cell at the pointer. |
| `%`     | Computes the remainder of dividing the value in the cell at the pointer by the value of the storage cell, and stores the result in the cell at the pointer. |
| `:`     | Finds the maximum value between the cell at the pointer and the storage cell, and stores the result in the cell at the pointer. |

Division by 0 is handled by assuming a cut-off 9-bit divisor: `0b100000000`, effectively dividing by 256.

To simplify number generation, Easyfuck introduces hexadecimal commands:

| Command | Description |
|---------|-------------|
| `0`-`9` `A`-`F` | Sets the value of the cell at the pointer to the corresponding hexadecimal value multiplied by 16. |

---


### Bitwise Operations

For precise data manipulation, Easyfuck provides bitwise operations:

| Command | Description |
|---------|-------------|
| `{`     | Performs a left logical shift on the value of the cell at the pointer. |
| `}`     | Performs a right logical shift on the value of the cell at the pointer. |
| `~`     | Performs a bitwise NOT on the value of the cell at the pointer. |
| <code>&#124;</code>     | Performs a bitwise OR between the value of the cell at the pointer and the value of the storage cell, storing the result in the cell at the pointer. |
| `&`     | Performs a bitwise AND between the value of the cell at the pointer and the value of the storage cell, storing the result in the cell at the pointer. |
| `^`     | Performs a bitwise XOR between the value of the cell at the pointer and the value of the storage cell, storing the result in the cell at the pointer. |
| `Y`     | Reverses the order of bits of the value in the cell at the pointer. |

---


### Functions

Functions in Easyfuck can only be assigned to lowercase letters, following this syntax:

```
f(++++)
```

The code snippet above assigns the function `f` to execute the instructions `++++`. Once assigned, `f` will execute `++++` whenever invoked. Functions can be freely reassigned.

---


### Control Flow

Before discussing control flow commands, let's address miscellaneous commands:

| Command | Description |
|---------|-------------|
| `#`     | Initiates a comment that ends with another `#` or a new line |
| `W`     | Suspends program execution for a duration specified by the value of the cell at the pointer, multiplied by 10 milliseconds |
| `Z`     | Sets the value of the bi-cell at the pointer to the number of seconds elapsed since the start of the program |
| `?`     | Assigns a random value between 0 and 255 to the cell at the pointer |

In Easyfuck, two primary control flow structures exist:

- While Loops
- Conditional Statements

**While loops** are constructed using the following commands:

| Command | Description |
|---------|-------------|
| `[`     | Initiates a while loop |
| `]`     | Terminates a while loop |

While loops in Easyfuck lack explicit conditional statements. Instead, they continue execution as long as the value of the cell at the pointer evaluates to true.

Crude conditional statements can be formed using while loops, as shown in the following example:
```
[					# Start of loop A
	f				# Some code represented by function f
	0
]					# End of loop A
```
In this example, if the byte at the pointer is true, execution enters the loop, executes some code, resets the cell at the pointer, and exits the loop. This method overwrites a cell, which, while not problematic, may require additional steps such as replacing `0]` with `S0]S` or copying the cell elsewhere. To address this, breaks have been introduced:

| Command | Description |
|---------|-------------|
| `;`     | Exits the innermost while loop; if not within one, acts as `@` |
| `@`     | Exits the innermost function; if not within one, acts as `X` |
| `X`     | Terminates the program |

This allows conditional statements to avoid interference with stored data when rewritten, such as:
```
[f;]
```
However, more complex conditions can be created, as demonstrated in the next section.

**Conditional Statements** are best achieved using the `` ` `` command:

| Command | Description |
|---------|-------------|
| `` ` `` | Skips the next command unless the previous command sets the overflow flag |

Notably, chaining two `` ` `` commands skips the subsequent command only if the one before them set the overflow flag. Below is a table of commands that set the overflow flag and their requirements:

| Command | Sets the flag when: |
|---------|---------------------|
| `>`     | Moving the pointer to an unexplored cell |
| `<`     | Looping the pointer around |
| `U`     | Pointing to an unexplored cell, thus exploring it immediately |
| `P`     | Looping the pointer around or exploring new cells |
| `+`     | Overflowing the cell at the pointer |
| `-`     | Underflowing the cell at the pointer |
| `=`     | Overflowing the cell at the pointer |
| `_`     | Underflowing the cell at the pointer |
| `*`     | Overflowing the cell at the pointer |
| `M`     | Overflowing the bi-cell at the pointer |
| `}`     | The lost bit is a 1 |
| `{`     | The lost bit is a 1 |

---


### Lambdas

Lambdas in Easyfuck are functions that are not assigned to a variable and are executed immediately. They are primarily used when you want to skip multiple commands or break out of several nested while loops.

Consider the following example:
```
[ code [ more code [ still more code ; ] even more code ] code. again ]
```
In this example, the `;` command will break only out of the innermost loop. To break out of all nested loops, you can enclose them within a lambda and use `@` to break out of it:
```
( [ code [ more code [ still more code @ ] even more code ] code. again ] )
```
Another use for lambdas is to skip multiple commands. For instance:
```
code `(lambda code)
```

---


### Initializer Data

If you've followed all the steps so far and tried writing a program yourself, you might have encountered an issue when including the `@` symbol. This is because, aside from breaking from functions, `@` is also used to mark the end of the code. 

For example:
```
f('>$<!>>$<!<$>>=`@>.<<<f)>+>+>2<<<f>.<<<'2.>'
```
will be executed as:
```
f('>$<!>>$<!<$>>=`@
```

What happens to the rest of the code? It is used to initialize the array, setting it to:
```
>.<<<f)>+>+>2<<<f>.<<<'2.>'
```
In order to execute everything normally, another `@` is needed at the end of the code:
```
f('>$<!>>$<!<$>>=`@>.<<<f)>+>+>2<<<f>.<<<'2.>'@
```

---

### Example programs
#### Hello World:
```
[.>]@Hello World!
```
#### Fibonacci generator:
```
a(<+`X>)b(=`a)l(<<)r(>>)	#helper functions
f(r$l!>$l!>rr$l!>$l!>rll<$rr=`X>ll$rrbOr.lllf)	#recursive generating-printing function
[.>]1----.0>O2.0r+O2.0+r+O2.0+r2lllf	#initializer data printer, and fibonacci data pregen
@Fibonacci:
```
#### Prime generator:
```
#Array structure:
#cell           space character
#bi-cell        checked number
#bi-cell        copy of checked number (for checking)
#bi-cell        copy of checked number (for comparisons)
#bi-cell        sqrt of checked number (for optimization)

a(<+`X>)i(+`a)  #defining a bi-cell incrementing function i
b(<->)d(-`b)    #defining a bi-cell decrementing function d
r(<$>>!<$>>!)   #defining a function r that copies the current bi-cell to the bi-cell to the right and moves the pointer to it
f(J>>)          #defining a function f that goes back to the first bi-cell
p(fO<<.>>)      #defining a function p that prints the first bi-cell and a space
c(<<<$>>^<$>>^) #defining function c that turns a bi-cell to zero if the bi-cell to the left is the same

[.>]J[U]        #printing and clearing memory
1------.2       #printing new line and setting first cell to a space character
>>iipip         #printing first 2 primes

l(
    fiirrrV     #increment number twice (primes other than 2 are odd) and initialize the other bi-cells
    $<<NM       #divide and multiply 3rd bi-cell by 4th
    c<$>=       #compare with 2nd to check if 3rd mod 4th is 0, afterwards collapse to single cell
    -`@0+       #if 0 break, else set to 1
    frr>>-      #copy 1st to 2nd and 3rd again, then decrement 4th
    -[+         #if 4th is one, skip while loop
    $<<NM       #repeat the steps from before
    c<$>=
    -`@0+
    frr>>-
    -]
    p           #print the number
)
[llfii]        #loop the checking function, incrementing 1st bi-cell twice every second run to target only number of form 6k+1 and 6k+5

#initializer data:
@Primes:
```
#### D6 roller:
```
#Array structure:
#cell           number of dice
#cell           6 (faces)
#cell           145 (die character)
#cell           random
#bi-cell        sum

[.0>]J              #print and reset initialized data
>1------.<          #print new line
"'>.0++++++>9+H     #put user input into cell 0, put 6 into cell 1 and storage, put 145 into cell 2, switch to game typeset
a(=`(<+>))          #define function a that adds storage to bi-cell at pointer
J[
    ->$>>?%$        #decrement cell 0 and generate random number 0-5
    <=._>+$>>       #print the correct die and increase random variable to 1-6
    a               #add rolled value to total sum
J]
1------H.           #print new line
>>>>>O              #print total sum
@Give number of dice:
```