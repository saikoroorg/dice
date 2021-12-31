// javascript
// CUBE Basic Engine API.

// Namespace.
var cube = cube || {};

/* VERSION/ *****************************/
cube.version = "0.8.45";
cube.timestamp = "211001";
/************************************* /VERSION*


//************************************************************/

// Wait some counts.
async function cubeWait(time) {
	await cube.count.wait(time);
}

// Get a time count.
function cubeTime() {
	return cube.count.time();
}

// Generate a random count.
function cubeRandom(maximum=0, seed=0) {
	if (seed) {
		cube.count.setSeed(seed);
	}
	return cube.count.random(maximum);
}

// Get a seed count for random.
function cubeSeed() {
	return cube.count.seed();
}

// Create a vector.
// Vector object has x,y and z variables.
function cubeVector(x, y, z=0) {
	return new cube.Vec(x, y, z);
}

// Calculate the division.
function cubeDiv(x, y) {
	return Math.floor(x / y);
}

// Calculate the remainder of the division.
function cubeMod(x, y) {
	return Math.floor(x % y);
}

// Calculate the square root.
function cubeSqrt(x) {
	return Math.floor(Math.sqrt(x));
}

//************************************************************/
// Screen object has these variables.
//  .pos (.x/y) : Position vector on window.
//  .size (.x/y) : Pixel resolution size.

// Get master screen or create new screen.
function cubeScreen(name=null, width=0, height=0, unitSize=0) {
	if (name) {
		var screen = new cube.Screen(name);
		if (width > 0 && height > 0) {
			screen.resize(width, height, unitSize);
		}
		screen.enable();
		return screen;
	}
	return cube.screen;
}

// Clear screen.
function cubeClear(screen=null) {
	if (!screen) {
		screen = cube.screen;
	}
	screen.clear();
}

// Write text to the screen.
function cubeWrite(text, screen=null) {
	if (!screen) {
		screen = cube.screen;
	}
	screen.print(text);
}

// Read text from the screen.
async function cubeRead(prompt=">", screen=null) {
	if (!screen) {
		screen = cube.screen;
	}
	let command = "";
	screen.print(prompt, true);
	while (true) {
		await cube.count.wait(10);

		// Read raw input text.
		let line = cube.joypad.read(true);
		let lines = line.split("\b");
		if (lines.length >= 2) {
			command += lines[0];
			for (let i = 1; i < lines.length; i++) {
				command = command.slice(0, -1) + lines[i];
			}
			screen.print("\n" + prompt + command, true);
		} else if (line != null) {
			screen.print(line, true);
			command += line;
		}

		// Read entered input text.
		line = cube.joypad.read();
		if (line != null) {
			return line;
		}
	}
}

// Move screen position.
function cubeMoveScreen(x, y, screen=null) {
	if (!screen) {
		screen = cube.screen;
	}
	screen.move(new cube.Vec(x, y));
}

// Resize screen resolution.
function cubeResizeScreen(width, height, fontSize=0, screen=null) {
	if (!screen) {
		screen = cube.screen;
	}
	screen.resize(width, height, fontSize);
	screen.enable();
}

// Get screen resolution size.
function cubeScreenSize(screen=null) {
	if (!screen) {
		screen = cube.screen;
	}
	return screen.size;
}

//************************************************************/
// Sprite object has these variables.
//  .pos (.x/y) : Position vector on screen
//  .dir (.x/y) : Direction vector that calculates angle
//  .size (.x/y) : Pixel size of sprite on the original image
//  .frame : Frame number of sprite on the original image
//  .angle : Angle set directory or calculated by directional vector
//  .scale : Actual size is calculated by size * scale

// Get master sprite or create new sprite.
async function cubeSprite(imageName=null, width=0, height=0) {
	if (imageName != null) {
		var sprite = new cube.Sprite(imageName);
		sprite.loadImage(imageName);
		await sprite.waitLoadingImage();
		sprite = sprite.clone(); // @todo: Need clone? to patch for mobile phone loading bug.
		if (width > 0 && height > 0) {
			sprite.resize(width, height);
		}
		return sprite; //.clone(); // @todo: Need clone? to patch for mobile phone loading bug.
	}
	return cube.sprite;
}

// Load image for the sprite.
async function cubeLoadSprite(imageName, sprite=null) {
	if (!sprite) {
		sprite = cube.sprite;
	}
	sprite.loadImage(imageName);
	await sprite.waitLoadingImage();
}

// Set frame and frame size to sprite.
function cubeRect(x, y, width, height, sprite=null) {
	if (!sprite) {
		sprite = cube.sprite;
	}
	sprite.setFrameRect(x, y, width, height);
}

// Set frame to animate.
function cubeAnimate(frame, sprite=null) {
	if (!sprite) {
		sprite = cube.sprite;
	}
	sprite.setFrame(frame);
}

// Move sprite to the position vector.
function cubeMove(x, y, sprite=null) {
	if (!sprite) {
		sprite = cube.sprite;
	}
	sprite.move(new cube.Vec(x, y));
}

// Resize sprite resolution.
function cubeResize(width, height, sprite=null) {
	if (!sprite) {
		sprite = cube.sprite;
	}
	if (width > 0 && height > 0) {
		sprite.resize(width, height);
	}
}

// Look sprite at the directional vector.
function cubeLook(x, y, sprite=null) {
	if (!sprite) {
		sprite = cube.sprite;
	}
	sprite.look(new cube.Vec(x, y));
}

// Rotate to the angle.
function cubeRotate(angle, sprite=null) {
	if (!sprite) {
		sprite = cube.sprite;
	}
	sprite.setAngle(angle);
}

// Set scale to expand sprite.
function cubeExpand(scale, sprite=null) {
	if (!sprite) {
		sprite = cube.sprite;
	}
	sprite.setScale(scale);
}

// Set alpha to dilute sprite.
function cubeDilute(alpha, sprite=null) {
	if (!sprite) {
		sprite = cube.sprite;
	}
	sprite.setAlpha(alpha);
}

// Draw sprite to the screen.
function cubeDraw(sprite=null, screen=null) {
	if (!screen) {
		screen = cube.screen;
	}
	if (!sprite) {
		sprite = cube.sprite;
	}
	sprite.enable(screen);
}

// Get master pixel buffer or create new pixel buffer.
function cubeBuffer(width=0, height=0, scale=10, frames=1) {
    if (width > 0 && height > 0) {
        var buffer = new cube.Buffer(width, height, scale, frames);
        return buffer;
    }
    return cube.buffer;
}

// Add pixels to pixel buffer.
function cubeBufferPixels(pixels, frame=0, buffer=null) {
    if (!buffer) {
        buffer = cube.buffer;
    }
    buffer.addPixels(pixels, frame);
}

// Add lines to pixel buffer.
function cubeBufferLines(lines, frame=0, buffer=null) {
    if (!buffer) {
        buffer = cube.buffer;
    }
    buffer.addLines(lines, frame);
}

// Add rects to pixel buffer.
function cubeBufferRects(rects, frame=0, buffer=null) {
    if (!buffer) {
        buffer = cube.buffer;
    }
    buffer.addRects(rects, frame);
}

// Create new sprite from pixel buffer.
async function cubeBufferSprite(buffer=null) {
    if (!buffer) {
        buffer = cube.buffer;
    }
    return cubeSprite(buffer.toImage(),
        buffer.width * buffer.scale,
        buffer.height * buffer.scale);
}

//************************************************************/
// Joypad object has these variables.
//  .pos (.x/y) : Mouse/Touch position vector on screen
//  .dir (.x/y) : Direction vector that calculated by mouse/touch/keyboard
//  .action : true on Tap/Flick by mouse/touch or Key-up by keyboard
//  .motion : true on Touching by mouse/touch or Key-pressing by keyboard

// Get master joypad or create new joypad.
function cubeJoypad(screen=null) {
	if (screen) {
		var joypad = new cube.Input(screen);
		return joypad;
	}
	return cube.joypad;
}

// Read and update joypad status.
async function cubeReadJoypad(time=0, joypad=null) {
	if (!joypad) {
		joypad = cube.joypad;
	}
	await cube.count.wait(time);
	joypad.updateDirs();
	return joypad;
}

// Get joypad motion.
function cubeJoypadMotion(joypad=null) {
	if (!joypad) {
		joypad = cube.joypad;
	}
	return joypad.motion();
}

// Get joypad action.
function cubeJoypadAction(joypad=null) {
	if (!joypad) {
		joypad = cube.joypad;
	}
	return joypad.action();
}

/* CUBE Param API *****************************/

// Get master parameter or create new parameter.
function cubeParam(fileName=null) {
	if (fileName) {
		var param = new cube.StorageParams(fileName);
		return param;
	}
	return cube.param;
}

// Loa parameter from local storage or query.
function cubeLoadParam(fileName=null, param=null) {
	if (param) {
		if (fileName) {
			return param = new cube.StorageParams(fileName);
		} else {
			return param = new cube.InitialParams(fileName);
		}
	} else {
		if (fileName) {
			return cube.param = new cube.StorageParams(fileName);
		} else {
			return cube.param = new cube.InitialParams(fileName);
		}

	}
}

// Save parameter to local storage.
function cubeSaveParam(fileName=null, param=null) {
	if (!param) {
		param = cube.param;
	}
	param.save(fileName);
}

// Get all keys of parameter.
function cubeParamKeys(param=null) {
	if (!param) {
		param = cube.param;
	}
	return param.keys();
}

// Get or set value of parameter.
function cubeParamValue(key=0, value=null, param=null) {
	if (!param) {
		param = cube.param;
	}
	if (value) {
		return param.setValue(key, value);
	}
	return param.value(key);
}

// Get interger numbers of parameter.
function cubeParamNumbers(key=0, separator=",", param=null) {
    if (!param) {
        param = cube.param;
    }
    return param.numbers(key, separator);
}

// Get data set of parameter.
function cubeParamData(key=0, param=null) {
    if (!param) {
        param = cube.param;
    }
    return param.data(key);
}

/**/
// javascript
// Basic components.

/*  */

// Vector.
//              y-
//   x-  z-(Near)/z+(Far)  x+
//              y+
cube.Vec = class {
    //x = 0;
    //y = 0;
    //z = 0;

    // Constructor.
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    // clone.
    clone() {
        return new cube.Vec(this.x, this.y, this.z);
    }

    // Get vector by string.
    toString() {
        return "" + this.x.toString() +
            "," + this.y.toString() +
            "," + this.z.toString();
    }

    // Deserialize a text.
    deserialize(text) {
        text.replace(/(\d+),(\d+),(\d+)/, (match, p1, p2, p3) => {
            match;
            this.x = p1 ? Number(p1) : 0;
            this.y = p2 ? Number(p2) : 0;
            this.z = p3 ? Number(p3) : 0;
        });
    }

    // Serialize to a text.
    serialize() {
        return this.toString();
    }

    // Check all number is zero.
    isZero() {
        return this.x == 0 && this.y == 0 && this.z == 0;
    }

    // Get length square.
    lenSq() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    // operator+
    add(other) {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        return this;
    }

    // operator-
    sub(other) {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
        return this;
    }

    // operator*
    mul(value) {
        this.x = Math.round(this.x * value);
        this.y = Math.round(this.y * value);
        this.z = Math.round(this.z * value);
        return this;
    }

    // operator/
    div(value) {
        if (value != 0) {
            this.x = Math.round(this.x / value);
            this.y = Math.round(this.y / value);
            this.z = Math.round(this.z / value);
        } else {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        }
        return this;
    }

    // operator-
    neg() {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    }

    // operator==
    eq(other) {
        return this.x == other.x && this.y == other.y && this.z == other.z;
    }

    // operator!=
    ne(other) {
        return this.x != other.x || this.y != other.y || this.z != other.z;
    }
}


// Vector.
cube.Vec.zero = new cube.Vec(0,0,0);
cube.Vec.x = new cube.Vec(1,0,0);
cube.Vec.y = new cube.Vec(0,1,0);
cube.Vec.z = new cube.Vec(0,0,1);


// Direction set.
//                 3(Up)
//   1(Left)  0(Near)/5(Far)  4(Right)
//                2(Down)
cube.Dirs = class {

    // direction set by bit flags.
    //flags = 0;

    // Constructor.
    constructor(bit = -1) {
        if (bit >= 0 && bit < cube.Dirs.bitMax) {
            this.flags = 1 << bit;
        } else {
            this.flags = 0;
        }
    }

    // clone
    clone() {
        let clone = new cube.Dirs();
        clone.flags = this.flags;
        return clone;
    }

    // Deserialize a text.
    deserialize(text) {
        this.flags = isFinite(text) ? Number(text) : 0;
    }

    // Serialize to a text.
    serialize() {
        return "" + this.flags;
    }

    // Get directions by string.
    toString() {
        let str1 = "";
        for (let i = 0; i < cube.Dirs.bitMax; ++i) {
            str1 += this.test(new cube.Dirs(i)) ? i : "-";
        }
        return str1;
    }

    // Get directions by vector.
    toVec() {
        const table = [cube.Vec.z.clone().neg(),
                       cube.Vec.x.clone().neg(),
                       cube.Vec.y.clone().neg(),
                       cube.Vec.y, cube.Vec.x, cube.Vec.z];
        let vec = new cube.Vec(0, 0, 0);
        for (let i = 0; i < cube.Dirs.bitMax; ++i) {
            if (this.test(new cube.Dirs(i))) {
                vec.add(table[i]);
            }
        }
        return vec;
    }

    // clear bit flags.
    clear() {
        this.flags = 0;
    }

    // Check all bit is down.
    isEmpty() {
        return this.flags == 0;
    }

    // Count number of directions.
    count() {
        count = 0;
        for (let i = 0; i < Dirs.bitMax; ++i) {
            if (this.test(new cube.Dirs(i))) {
                count += 1;
            }
        }
        return count;
    }

    // add directions.
    add(dirs) {
        this.flags |= dirs.flags;
    }

    // Remove directions.
    sub(dirs) {
        this.flags &= ~dirs.flags;
    }

    // Check any flag is up.
    test(dirs) {
        return (this.flags & dirs.flags) > 0;
    }

    // Check near.
    near() {
        return (this.flags & (1 << 0)) > 0;
    }

    // Check far.
    far() {
        return (this.flags & (1 << 5)) > 0;
    }

    // Check right.
    right() {
        return (this.flags & (1 << 4)) > 0;
    }

    // Check left.
    left() {
        return (this.flags & (1 << 1)) > 0;
    }

    // Check Down.
    down() {
        return (this.flags & (1 << 2)) > 0;
    }

    // Check up.
    up() {
        return (this.flags & (1 << 3)) > 0;
    }
}


// Maximum of direction.
cube.Dirs.bitMax = 6;

// Directions.
cube.Dirs.empty = new cube.Dirs();
cube.Dirs.near = new cube.Dirs(0);
cube.Dirs.far = new cube.Dirs(5);
cube.Dirs.right = new cube.Dirs(4);
cube.Dirs.left = new cube.Dirs(1);
cube.Dirs.down = new cube.Dirs(2);
cube.Dirs.up = new cube.Dirs(3);


// 2D grid board.
//  0,0 ... W,0
//   :   x   :
//  0,H ... W,H
cube.Board = class {

    // // Values of each grid on the board.
    // int[,] values;
    //
    // // Objects over each grid on the board.
    // string[,] objects;

    // Constructor.
    constructor(values_) {

        // Use first length to reject jagged array.
        let width = values_ != null && values_.length > 0
                    ? values_[0].length : 0;
        let height = values_ != null ? values_.length : 0;
        //this.values = new string[height, Width];
        //this.objects = new string[height, Width];
        this.values = new Array(height);
        this.objects = new Array(height);
        for (let j = 0; j < height; ++j) {
            this.values[j] = new Array(width);
            this.objects[j] = new Array(width);
            for (let i = 0; i < width; ++i) {

                // Set 0 if no value on jagged array.
                this.values[j][i] = values_[j] ? values_[j][i] : 0;
                this.objects[j][i] = null;
            }
        }
    }

    // clone.
    clone() {
        let clone = new cube.Board();
        let width = this.width();
        let height = this.height();
        // clone.values = new int[height, width];
        // clone.objects = new string[height, width];
        clone.values = new Array(height);
        clone.objects = new Array(height);
        for (let j = 0; j < height; ++j) {
            clone.values[j] = new Array(width);
            clone.objects[j] = new Array(width);
            for (let i = 0; i < width; ++i) {
                clone.values[j][i] = this.values[j][i];
                clone.objects[j][i] = this.objects[j][i];
            }
        }
        return clone;
    }

    // Width of the board.
    width() {
        return this.values != null && this.values.length > 0
               ? this.values[0].length : 0;
    }

    // Height of the board.
    height() {
        return this.values != null ? this.values.length : 0;
    }

    // Check a point is inside the board.
    hasGrid(x, y) {
        return x >= 0 && x < this.width() && y >= 0 && y < this.height();
    }

    // Set a value of a grid.
    setValue(x, y, value) {
        if (this.hasGrid(x, y)) {
            this.values[y][x] = value;
        }
    }

    // Value of a grid.
    value(x, y) {
        return this.hasGrid(x, y) ? this.values[y][x] : cube.Board.invalidValue;
    }

    // Remove all objects.
    removeObjects() {
        let width = this.width();
        let height = this.height();
        for (let j = 0; j < height; ++j) {
            for (let i = 0; i < width; ++i) {
                this.objects[j][i] = null;
            }
        }
    }

    // add an object.
    addObject(obj, x, y) {
        if (this.hasGrid(x, y)) {
            this.objects[y][x] = obj;
        }
    }

    // Get the board and objects by string.
    toString() {
        let width = this.width();
        let height = this.height();

        // Print each grids.
        let str1 = "";
        for (let j = 0; j < height; ++j) {
            for (let i = 0; i < width; ++i) {
                if (this.objects[j][i] != null) {
                    str1 += " " + this.objects[j][i];
                } else {
                    str1 += " " + this.value(i, j);
                }
            }
            str1 += "\n";
        }

        return str1;
    }
}


// Invalid value.
cube.Board.invalidValue = -1;


// Piece.
cube.Piece = class {
    // Vec pos;
    // Dirs dirs;
    // Movement movement;

    // Constructor.
    constructor(pos, movement=null) {
        this.pos = pos;
        this.dirs = new cube.Dirs();
        this.movement = movement;
    }

    // clone
    clone() {
        let clone = new cube.Piece();
        clone.pos = this.pos.clone();
        clone.dirs = this.dirs.clone();
        clone.movement = this.movement;
        return clone;
    }
}

/*  */
// javascript
// Count component.

/*  */

// Count management class.
cube.Count = class {

    // Constructor.
    constructor(seed=0) {
        this._time = Date.now();
        this._seed = seed != 0 ? seed : this._time;
    }

    // Wait time.
    async wait(time) {
        if (time > 0) {

            // let start = Date.now();
            // while (Date.now() - start < time) {}
            await new Promise(r => setTimeout(r, time));
        }
    }

    // Get time count.
    time(diff=false) {
        let timeDiff = Date.now() - this._time;
        this._time = Date.now();

        return diff ? timeDiff : this._time;
    }

    // Get random count.
    random(max) {

        // Xorshift algorythm.
        this._seed = this._seed ^ (this._seed << 13);
        this._seed = this._seed ^ (this._seed >>> 17);
        this._seed = this._seed ^ (this._seed << 15);
        return Math.abs(this._seed % max);

        // LCG algorythm.
        // this._seed = (this._seed * 9301 + 49297) % 233280;
        // let rand = this._seed / 233280;
        // return Math.round(rand * max);
    }

    // Get random seed.
    seed() {
        return this._seed;
    }

    // Set random seed.
    setSeed(seed) {
        this._seed = seed != 0 ? seed : Date.now();
    }
}

// Counter singleton.
cube.count = new cube.Count();

/*  */
// javascript
// Parameters component.

/*  */

// Parameters management base class.
cube.Params = class {

    // Constructor.
    constructor(name=null, text=null) {
        this.name = name;
        this.deserialize(text);
    }

    // Clone.
    clone() {
        let clone = new cube.Params(this.name, this.serialize());
        return clone;
    }

    // Get params by string.
    toString() {
        return this.serialize();
    }

    // Get keys.
    keys() {
        return Object.keys(this.keyvalues);
    }

    // Get value.
    value(key) {
        return this.keyvalues[key] ? this.keyvalues[key] : "";
    }

    // Get value by integer numbers.
    numbers(key, separator=",") {
        let result = [];
        if (this.keyvalues[key]) {
            let params = this.keyvalues[key].split(separator);
            for (var i = 0; i < params.length; i++) {
                if (params[i]) {
                    result[i] = parseInt(params[i], 10);
                }
            }
        }
        return result;
    }

    // Get value by data set.
    //  0 .. 9 =  0 ..  9
    //  A .. Z = 10 .. 35
    data(key) {
        let result = [];
        if (this.keyvalues[key]) {
            for (let i = 0; i < this.keyvalues[key].length; i++) {
                let c = this.keyvalues[key].charCodeAt(i);
                if ("0".charCodeAt(0) <= c && c <= "9".charCodeAt(0)) {
                    result[i] = c - "0".charCodeAt(0);
                } else if ("A".charCodeAt(0) <= c && c <= "Z".charCodeAt(0)) {
                    result[i] = c - "A".charCodeAt(0) + 10;
                } else if ("a".charCodeAt(0) <= c && c <= "z".charCodeAt(0)) {
                    result[i] = c - "a".charCodeAt(0) + 10;
                }
            }
        }
        return result;
    }

    // Set  or delete value.
    setValue(key, value) {
        if (value != null) {
            this.keyvalues[key] = value;
        } else {
            delete this.keyvalues[key];
        }
    }

    // Get all keys and values.
    keyValues() {
        return this.keyvalues;
    }

    // Set all keys and values.
    setKeyValues(keyvalues) {
        if (keyvalues != null) {
            this.keyvalues = keyvalues;
        } else {
            this.keyvalues = {};
        }
    }

    // Deserialize a text to parameters.
    deserialize(text) {
        this.keyvalues = {};
        if (text != null) {
            if (text.includes('&')) {
                text.split('&').forEach((q) => {
                    let keyvalue = q.split('=');
                    if (keyvalue[0] != null && keyvalue[1] != null) {
                        this.keyvalues[keyvalue[0]] = keyvalue[1];
                        // console.log("parameter:" + kv[0] + " = " + kv[1]);
                    }
                });
            } else if (text.includes('=')) {
                let keyvalue = text.split('=');
                if (keyvalue[0] != null && keyvalue[1] != null) {
                    this.keyvalues[keyvalue[0]] = keyvalue[1];
                    // console.log("parameter:" + kv[0] + " = " + kv[1]);
                }
            } else if (text.includes('+')) {
                this.keyvalues = text.split('+');
            } else {
                this.keyvalues[0] = text;
            }
        }
    }

    // Serialize parameters to a text.
    serialize() {
        let keyvalues = [];
        for (let key in this.keyvalues) {
            if (key != null && this.keyvalues[key] != null) {
                keyvalues.push(key + "=" + this.keyvalues[key]);
            }
        }
        return keyvalues.join("&");
    }

    // Wait updating value.
    async waitUpdatingValue() {
        while (!this.updated) {
            await new Promise(r => setTimeout(r, 10));
        }
    }
};

// Initial parameters management class.
cube.InitialParams = class extends cube.Params {

    // Constructor.
    constructor(name=null, text=null) {

        // Load parameters text from local storage.
        if (text == null) {
            let query = window.location.search;
            if (query != null && query != "") {
                console.log("Load query:" + query);
                text = query.slice(1);
            }
        }

        super(name, text);
    }

    // Update parameters text.
    update() {
        let text = super.serialize();
        if (text != null) {
            let query = "?" + text;
            console.log("Flush query:" + query);
            window.history.replaceState(null, "", query);
            // window.location.search = query;
        }
    }
};

// Storage parameters management class.
cube.StorageParams = class extends cube.Params {

    // Constructor.
    constructor(name=null, text=null) {

        // Load parameters text from local storage.
        if (text == null) {
            text = localStorage.getItem(name);
            console.log("Load storage:" + text);
        }

        super(name, text);
    }

    // Save parameters text to local storage.
    save() {
        let text = super.serialize();
        if (text != null) {
            console.log("Save storage:" + text);
            localStorage.setItem(this.name, text);
        }
    }
};

// Message parameters management class.
cube.MessageParams = class extends cube.Params {

    // Constructor.
    constructor(name=null, text=null) {
        super(name, text);
    }

    // Send parameters text to parent window.
    send(to=null) {
        let text = super.serialize();
        if (text != null) {
            if (to != null) {
                console.log("Send message:" + text + " to " + to);
                to.postMessage(text, this.name ? this.name : "*");
            } else if (window.parent != null) {
                 console.log("Send message:" + text + " to " + this.name);
                 window.parent.postMessage(text, this.name ? this.name : "*");
            }
        }
    }
};

// Master Parameters.
cube.param = new cube.InitialParams();

/*  */
// javascript
// Screen components.

/*  */

// Screen management class.
cube.Screen = class {

    // Constructor.
    constructor(type=null) {
        this.type = type ? type.replace(/[¥.¥/]/g, "") : null;
        this.root = null;
        this.screen = null;
        this.parent = null;
        this.size = new cube.Vec(); // Resolution size.
        this.pos = new cube.Vec(); // Position.
        this.scale = 1;
        this.resized = false;

        // Search unused root screen for parent.
        let root = null;
        if (type != null) {
            let screens = document.getElementsByClassName(type);
            if (screens.length > 0) {
                for (let i = 0; i < screens.length; ++i) {
                    if (!cube.Screen.manager().screens.includes(screens[i])) {

                        // Found unused screen.
                        root = screens[i];
                        cube.Screen.manager().screens.push(this.screen);
                        break;
                    }
                }
            }
        }

        // Create root screen for new full screen.
        if (!root) {
            root = document.createElement("div");
            root.style.position = "absolute";
            root.style.left = 0;
            root.style.top = 0;
            root.style.width = "100%";
            root.style.height = "100%";
            root.style.display = "flex";
            root.style.flexDirection = "column";
            root.style.alignItems = "center";
            root.style.justifyContent = "center";
            if (this.type != null) {
                root.setAttribute("class", this.type);
            }

            // Created new screen.
            //document.body.appendChild(root);
            cube.Screen.manager().screens.push(root);
        }

        // Setup new screen.
        this.root = root;
        this.screen = document.createElement("pre");
        this.root.appendChild(this.screen);
        this.screen.style.position = "relative";
        this.screen.style.left = 0;
        this.screen.style.top = 0;
        this.screen.style.margin = 0;
        this.screen.style.width = "100%";
        this.screen.style.height = "100%";
        this.screen.style.flexShrink = "0";
        this.screen.style.textAlign = "left";
        this.screen.style.verticalAlign = "top";
        this.screen.style.display = "flex";
        this.screen.style.flexDirection = "row";
        this.screen.style.alignItems = "start";
        this.screen.style.justifyContent = "start";
        this.screen.style.clipPath = "border-box";
        window.addEventListener("resize", (evt) => this.onResize(evt));
    }

    // Clone.
    clone() {
        let clone = new cube.Screen(this.type);
        clone.resize(this.size.x, this.size.y, this.size.z);
        clone.pos = this.pos.clone();
        return clone;
    }

    // Calculate global pos by local pos.
    posToGlobalPos(pos) {
        let globalPos = new cube.Vec();
        globalPos.x = pos.x * this.scale + this.pos.x;
        globalPos.y = pos.y * this.scale + this.pos.y;
       return globalPos;
    }

    // Calculate local pos by global pos.
    posToLocalPos(pos) {
        let localPos = new cube.Vec();
        localPos.x = (pos.x - this.pos.x) / this.scale;
        localPos.y = (pos.y - this.pos.y) / this.scale;
        return localPos;
    }

    // Set screen position vector.
    move(pos) {
        this.root.style.position = "relative";
        this.root.style.left = pos.x;
        this.root.style.top = pos.y;

        // Set abolute pos.
        let rect = this.screen.getBoundingClientRect();
        this.pos.x = window.pageXOffset + rect.left + pos.x;
        this.pos.y = window.pageYOffset + rect.top + pos.y;

        //if (this.scale >= 1) {
        //    this.screen.style.left = this.pos.x + this.size.x * (this.scale - 1) * 0.5;
        //    this.screen.style.top = this.pos.y + this.size.y * (this.scale - 1) * 0.5;
        //} else {
        //}
    }

    // Set screen resolution size.
    resize(w, h, u=0) {

        // Set screen size.
        this.size = new cube.Vec(w, h, u);
        this.screen.style.width = this.size.x;
        this.screen.style.height = this.size.y;

        // Fit screen to parent pane.
        if (this.root.clientWidth > 0 && this.root.clientHeight > 0) {
            let sx = this.root.clientWidth / this.size.x;
            let sy = this.root.clientHeight / this.size.y;
            this.scale = Math.min(sx, sy);
            let t1 = (this.scale * 100) + "%";
            let t2 = "scale(" + this.scale + ")";
            this.screen.style.transform = t2;
        }

        // Set font size by unit size.
        if (this.size.z > 0) {
           this.screen.style.fontFamily = "Courier,monospace,sans-serif";
           this.screen.style.fontSize = this.size.z;
        }

        // Reset abolute pos.
        let rect = this.screen.getBoundingClientRect();
        this.pos.x = window.pageXOffset + rect.left;
        this.pos.y = window.pageYOffset + rect.top;

        this.resized = true;
        console.log("resize: scale=" + this.scale + " pos=" + this.pos);
    }

    // Resize event handler.
    onResize(evt) {
        evt = evt != null ? evt : window.event;
        evt.preventDefault();
        if (this.resized) {

            // Fit screen to parent pane.
            if (this.root.clientWidth > 0 && this.root.clientHeight > 0) {
                let sx = this.root.clientWidth / this.size.x;
                let sy = this.root.clientHeight / this.size.y;
                this.scale = Math.min(sx, sy);
                let t1 = (this.scale * 100) + "%";
                let t2 = "scale(" + this.scale + ")";
                this.screen.style.transform = t2;
            }

            // Set abolute pos.
            let rect = this.screen.getBoundingClientRect();
            this.pos.x = window.pageXOffset + rect.left;
            this.pos.y = window.pageYOffset + rect.top;
        }
        console.log("event:" + evt.type + " scale=" + this.scale + " pos=" + this.pos);
    }

    // Enable to show or disable to hide.
    enable(parent=null, enable=true) {
        if (this.root != null) {
            parent = parent != null ? parent.screen : document.body;
            if (enable) {
                if (!parent.contains(this.root)) {
                    parent.appendChild(this.root);
                    /*
                    this.root.style.position = "absolute";
                    this.root.style.left = this.pos.x = x;
                    this.root.style.top = this.pos.y = y;
                    if (this.resized) {
                        this.resize(this.size.x, this.size.y);
                    } else {
                        this.screen.style.width = this.size.x = this.root.clientWidth;
                        this.screen.style.height = this.size.y = this.root.clientHeight;
                    }
                    */

                    // Fit screen to parent pane.
                    if (this.root.clientWidth > 0 && this.root.clientHeight > 0) {
                        let sx = this.root.clientWidth / this.size.x;
                        let sy = this.root.clientHeight / this.size.y;
                        this.scale = Math.min(sx, sy);
                        let t1 = (this.scale * 100) + "%";
                        let t2 = "scale(" + this.scale + ")";
                        this.screen.style.transform = t2;
                    }

                    // Set abolute pos.
                    let rect = this.screen.getBoundingClientRect();
                    this.pos.x = window.pageXOffset + rect.left;
                    this.pos.y = window.pageYOffset + rect.top;

                    console.log("enable: scale=" + this.scale + " pos=" + this.pos);
                }
            } else {
                if (parent.contains(this.root)) {
                    parent.removeChild(this.root);
                }
            }
        }
    }

    // // Set screen scale.
    // setScale(scale) {
    //     this.scale = scale;
    //     let t = "scale(" + this.scale + ")";
    //     this.screen.style.transform = t;
    // }

    // Print text to screen.
    print(text, noenter=false) {
        let textNode = document.createTextNode(text + (!noenter ? "\n" : ""));
        this.screen.appendChild(textNode);
    }

    // Clear text on screen.
    clear() {
        this.screen.textContent = null;
    }

    // Get manager for screens.
    static manager() {
        if (this._manager == null) {
            this._manager = {};
            this._manager.screens = [];
            this._manager.images = {};
        }
        return this._manager;
    }
}


// Sprite management class.
cube.Sprite = class {

    // Constructor.
    constructor(type=null) {
        this.type = type ? type.replace(/[^0-9a-z]/gi, '') : null;
        this.root = null;
        this.sprite = null;

        this.imageType = null;
        this.imageSize = null; // Image natural size.
        this.animeType = null;

        this.imagePos = new cube.Vec(); // Texture position.
        this.size = new cube.Vec(); // Sprite size.
        this._frame = 0; // Texture frame for calculating texture position.

        this.pos = new cube.Vec();
        this.dir = new cube.Vec();
        this.angle = 0;
        this.scale = 1;
        this.alpha = 1;

        // Setup new sprite.
        this.root = document.createElement("div");
        this.sprite = document.createElement("div");
        this.root.appendChild(this.sprite);

        // Set class type.
        if (this.type != null) {
            this.sprite.setAttribute("class", this.type);
        }
    }

    // Clone.
    clone() {
        let clone = new cube.Sprite(this.type);
        clone.setImage(this.imageType, this.imageSize);
        clone.setAnime(this.animeType);
        clone.setFrameRect(this.imagePos.x, this.imagePos.y, this.size.x, this.size.y);
        clone.setPos(this.pos);
        clone.setDir(this.dir);
        clone.setAngle(this.angle);
        clone.setScale(this.scale);
        clone.setAlpha(this.alpha);
        return clone;
    }

    // Load image for sprite.
    loadImage(data) {
        if (this.root != null) {
            let loader = new Image();
            loader.onload = () => {

                // Create new style.
                let style = document.createElement('style');
                document.head.appendChild(style);

                // Image type.
                let count = cube.Screen.manager().images[this.type] ?
                    cube.Screen.manager().images[this.type] + 1 : 1;
                cube.Screen.manager().images[this.type] = count;
                let imageType = this.type + "_" + count;

                // Image size.
                let imageSize = new cube.Vec(loader.naturalWidth, loader.naturalHeight);

                // Create new style rule with image.
                let rule = "." + imageType + "{" +
                    "background-image:url(\"" + data + "\");" +
                    "width:" + imageSize.x + ";" +
                    "height:" + imageSize.y + ";" +
                    "}";
                style.sheet.insertRule(rule);

                // Set sprite resolution size.
                if (this.size.x > 0 && this.size.y > 0) {
                    this.sprite.style.width = this.size.x;
                    this.sprite.style.height = this.size.y;
                    /*let nx = (imageSize.x / this.size.x);
                    let ny = (imageSize.y / this.size.y);
                    this.sprite.style.backgroundSize = "" + nx + " " + ny;*/
                }

                // Set image type for sprite.
                this.setImage(imageType, imageSize);
            }
            loader.src = data;

            // Manual loading for data format image.
            if (loader.src.match("^data:")) {

                // Wait for borwser delay about setting natural image size.
                setTimeout(loader.onload, 10);
            }
        }
    }

    // Wait loading image.
    async waitLoadingImage() {
        while (this.imageType == null) {
            await new Promise(r => setTimeout(r, 10));
        }
    }

    // Load image and wait loading image.
    async load(data) {
        this.loadImage(data);
        await this.waitLoadingImage();
    }

    // Move to the position.
    move(pos) {
        this.setPos(pos);
    }

    // Look to the direction.
    look(dir) {
        this.setDir(dir);
    }

    // Set resolution size of image.
    resize(w, h) {
        this.size.x = w;
        this.size.y = h;
        if (this.imageType != null) {
            this.sprite.style.width = this.size.x;
            this.sprite.style.height = this.size.y;
            /*if (this.imageSize.x > 0 && this.imageSize.y > 0) {
                let nx = (this.imageSize.x / w);
                let ny = (this.imageSize.y / h);
                this.sprite.style.backgroundSize = "" + nx + " " + ny;
            } else {
                this.sprite.style.backgroundSize = "" + w + " " + h;
            }*/
        }
    }

    // Enable to show or disable to hide.
    async enable(screen, enable=true) {
        if (screen.screen != null) {
            if (enable) {
                if (!screen.screen.contains(this.root)) {
                    screen.screen.appendChild(this.root);
                }
            } else {
                if (screen.screen.contains(this.root)) {
                    screen.screen.removeChild(this.root);
                }
            }
        }
    }

    // Set style of image type.
    setImage(type, size) {
        if (!this.sprite.classList.contains(type)) {
            this.sprite.classList.remove(this.imageType);
            this.sprite.classList.add(type);
            this.imageType = type;
            this.imageSize = size ? size.clone() : null;
        }
    }

    // Set style of animation type.
    setAnime(type) {
        if (!this.sprite.classList.contains(type)) {
            this.sprite.classList.remove(this.animeType);
            this.sprite.classList.add(type);
            this.animeType = type;
        }
    }

    // Set cliping frame pos of image.
    setFrame(frame) {
        if (this.imageType != null) {
            this._frame = frame;
            var nx = (this.imageSize.x / this.size.x);
            this.imagePos.x = Math.floor(frame % nx) * this.size.x;
            this.imagePos.y = Math.floor(frame / nx) * this.size.y;
            this.sprite.style.backgroundPosition = "" + (-this.imagePos.x) + " " + (-this.imagePos.y);
        }
    }

    // Set frame rect of image.
    setFrameRect(x, y, w, h) {
        if (this.imageType != null) {
            this._frame = 0;
            this.sprite.style.width = this.size.x = w;
            this.sprite.style.height = this.size.y = h;
            this.imagePos.x = x;
            this.imagePos.y = y;
            this.sprite.style.backgroundPosition = "" + (-x) + " " + (-y);
            /*if (this.imageSize.x > 0 && this.imageSize.y > 0) {
                let nx = (this.imageSize.x / w);
                let ny = (this.imageSize.y / h);
                this.sprite.style.backgroundSize = "" + nx + " " + ny;
            } else {
                this.sprite.style.backgroundSize = "" + w + " " + h;
            }*/
            let mx = w * (this.scale - 1) / 2;
            let my = h * (this.scale - 1) / 2;
            this.root.style.marginLeft = mx;
            this.root.style.marginRight = mx;
            this.root.style.marginTop = my;
            this.root.style.marginBottom = my;
        }
    }

    // Print text to sprite.
    print(text) {
        this.root.appendChild(document.createTextNode(text + "\n"));
    }

    // Clear text on sprite.
    clear() {
        this.root.textContent = null;
    }

    // Check pos is in sprite rect.
    isInRect(pos) {
        if (pos != null) {
            let rect = this.root.getBoundingClientRect();
            return pos.x > rect.left && pos.x < rect.right &&
                   pos.y > rect.top && pos.y < rect.bottom;
        }
        return false;
    }

    // Draw this sprite to screen.
    draw(screen) {
        if (screen.screen != null) {

            // Update image size and position.
            if (this.size.x > 0 && this.size.y > 0) {
                this.sprite.style.width = this.size.x;
                this.sprite.style.height = this.size.y;
                /*let nx = (imageSize.x / this.size.x);
                let ny = (imageSize.y / this.size.y);
                this.sprite.style.backgroundSize = "" + nx + " " + ny;*/
            }

            // Update image frame rect.
            if (this._frame > 0) {
                this.imagePos.x = Math.floor(this._frame % nx) * this.size.x;
                this.imagePos.y = Math.floor(this._frame / nx) * this.size.y;
                this.sprite.style.backgroundPosition = "" + (-this.imagePos.x) + " " + (-this.imagePos.y);
            }

            // Update position.
            if (this.pos != null) {
                this.root.style.position = "absolute";
                let cx = this.size.x * this.scale / 2;
                let cy = this.size.y * this.scale / 2;
                this.root.style.left = this.pos.x - cx;
                this.root.style.top = this.pos.y - cy;
            } else {
                this.root.style.position = "relative";
            }

            // Update transform matrix.
            if (!this.dir.isZero()) {
                const angle_radian = 180 / Math.PI;
                this.angle = Math.atan2(this.dir.y, this.dir.x) * angle_radian;
            }
            this.root.style.transform =
                "scale(" + this.scale + ")" +
                "rotate(" + this.angle + "deg)";

            // Update center position.
            if (this.scale > 0) {
                let mx = this.size.x * (this.scale - 1) / 2;
                let my = this.size.y * (this.scale - 1) / 2;
                this.root.style.marginLeft = mx;
                this.root.style.marginRight = mx;
                this.root.style.marginTop = my;
                this.root.style.marginBottom = my;
            }

            // Update alpha.
            this.root.style.opacity = this.alpha;

            if (!screen.screen.contains(this.root)) {
                screen.screen.appendChild(this.root);
            }
        }
    }

    // Set sprite position vector.
    setPos(pos) {
        if (this.imageType != null) {
            this.pos = pos;
            if (pos != null) {
                this.root.style.position = "absolute";
                let w = this.size.x * this.scale / 2;
                let h = this.size.y * this.scale / 2;
                this.root.style.top = this.pos.y - w;
                this.root.style.left = this.pos.x - h;
            } else {
                this.root.style.position = "relative";
            }
        }
    }

    // Set sprite direction vector.
    setDir(dir) {
        this.dir = dir;
        if (dir != null) {
            const angle_radian = 180 / Math.PI;
            this.angle = Math.atan2(this.dir.y, this.dir.x) * angle_radian;
            this.root.style.transform =
                "scale(" + this.scale + ")" +
                "rotate(" + this.angle + "deg)";
        }
    }

    // Set sprite angle.
    setAngle(angle) {
        this.dir = new cube.Vec(); // Can not set direction vector.
        this.angle = angle;
        this.root.style.transform =
            "scale(" + this.scale + ")" +
            "rotate(" + this.angle + "deg)";
    }

    // Set sprite scale.
    setScale(scale) {
        if (this.imageType != null) {
            this.scale = scale;
            this.root.style.transform =
                "scale(" + this.scale + ")" +
                "rotate(" + this.angle + "deg)";
            let mx = parseInt(this.sprite.style.width) * (scale - 1) / 2;
            let my = parseInt(this.sprite.style.height) * (scale - 1) / 2;
            this.root.style.marginLeft = mx;
            this.root.style.marginRight = mx;
            this.root.style.marginTop = my;
            this.root.style.marginBottom = my;
        }
    }

    // Set sprite aplha.
    setAlpha(alpha) {
        this.alpha = alpha;
        this.root.style.opacity = this.alpha;
    }
}

// Pixel buffer class.
cube.Buffer = class {

    // Constructor.
    constructor(width=16, height=16, scale=10, frames=1) {
        this.width = width;
        this.height = height;
        this.scale = scale;
        this.frames = frames;
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        this.svg.setAttribute("width", "" + (width * scale * frames));
        this.svg.setAttribute("height", "" + (height * scale));
        this.svg.setAttribute("viewBox", "0 0 " + (width * 2 * frames) + " " + (height * 2));
        this.svg.setAttribute("stroke-width", 1);
        this.svg.setAttribute("stroke-linecap", "butt");
        this.svg.setAttribute("fill", "none");
    }

    // Clone.
    clone() {
        let clone = new cube.Buffer(this.width, this.height, this.scale, this.frames);
        return clone;
    }

    // Resource.
    toImage() {
        return "data:image/svg+xml;base64," + btoa(this.svg.outerHTML);
    }

    // Add pixels.
    addPixels(pixels, frame=0) {
        for (let i = 0; i < pixels.length; i++) {
            if (pixels[i][0] >= 0 && pixels[i][1] >= 0) {
                let x = pixels[i][0] * 2 + 0.5, y = pixels[i][1] * 2 + 0.5;
                let c = pixels[i].length >= 5 ? ("rgb(" + pixels[i][2] + "," + pixels[i][3] + "," + pixels[i][4] + ")") : "#000";
                let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute("stroke", c);
                path.setAttribute("transform", "translate(" + (this.width * 2 * frame) + ",0)");
                path.setAttribute("d", "M" + x + "," + y + "h1v1h-1Z");
                this.svg.appendChild(path);
            }
        }
    }

    // Add lines.
    addLines(lines, frame=0) {
        for (let i = 0; i < lines.length; i++) {
            if (lines[i][0] >= 0 && lines[i][1] >= 0 && lines[i][2] >= 0 && lines[i][3] >= 0) {
                let x0 = lines[i][0] * 2 + 1, y0 = lines[i][1] * 2 + 1;
                let x1 = lines[i][2] * 2 + 1, y1 = lines[i][3] * 2 + 1;
                let c = lines[i].length >= 7 ? ("rgb(" + lines[i][4] + "," + lines[i][5] + "," + lines[i][6] + ")") : "#000";
                let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute("stroke", c);
                path.setAttribute("stroke-width", 2);
                path.setAttribute("stroke-linecap", "square");
                path.setAttribute("fill", "none");
                path.setAttribute("transform", "translate(" + (this.width * 2 * frame) + ",0)");
                path.setAttribute("d", "M" + x0 + "," + y0 + "L" + x1 + "," + y1);
                this.svg.appendChild(path);
            }
        }
    }

    // Add rects.
    addRects(rects, frame=0) {
        for (let i = 0; i < rects.length; i++) {
            if (rects[i][0] >= 0 && rects[i][1] >= 0 && rects[i][2] >= 0 && rects[i][3] >= 0) {
                let x0 = rects[i][0] * 2 + 1, y0 = rects[i][1] * 2 + 1;
                let x1 = rects[i][2] * 2 + 1, y1 = rects[i][3] * 2 + 1;
                let c = rects[i].length >= 7 ? ("rgb(" + rects[i][4] + "," + rects[i][5] + "," + rects[i][6] + ")") : "#000";
                let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.setAttribute("stroke", "none");
                rect.setAttribute("fill", c);
                rect.setAttribute("transform", "translate(" + (this.width * 2 * frame) + ",0)");
                rect.setAttribute("x", x0);
                rect.setAttribute("y", y0);
                rect.setAttribute("width", x1 - x0);
                rect.setAttribute("height", y1 - y0);
                this.svg.appendChild(rect);
            }
        }
    }
};

// Master screen.
cube.screen = new cube.Screen("cubeScreen");
// All screens.
cube.screens = [cube.screen];

// Master sprite.
cube.sprite = new cube.Sprite("cubeSprite");
// All sprites.
cube.sprites = [cube.sprite];

// Master pixel buffer.
cube.buffer = new cube.Sprite("cubeBuffer");

/*  */
// javascript
// Input component.

/*  */

// Input management class.
cube.Input = class {

    // Constructor.
    constructor(screen=null) {
        this.dir = null;
        this.pos = null;

        this._dirs = [null, null];
        this.keyCode = null;
        this._commands = ["", ""];
        this.points = null;
        this.keyTime = 0;
        this.tapTime = 0;
        this.flickTime = 0;
        this.downEvent = false;
        this.upEvent = false;
        this.touches = null;

        // Add event listener to anonymous function
        // to use "this" keyword in the function.
        if (screen != null && screen.root != null) {
            this.screen = screen;
            let parent = screen.root;
            document.addEventListener("keyup", (evt) => this.onKeyUp(evt));
            document.addEventListener("keydown", (evt) => this.onKeyDown(evt));
            parent.addEventListener("mousedown", (evt) => this.onMouseDown(evt));
            parent.addEventListener("mousemove", (evt) => this.onMouseMove(evt));
            document.addEventListener("mouseup", (evt) => this.onMouseUp(evt));
            parent.addEventListener("touchstart", (evt) => this.onTouch(evt), {passive: false});
            parent.addEventListener("touchmove", (evt) => this.onTouch(evt), {passive: false});
            parent.addEventListener("touchend", (evt) => this.onTouch(evt));
            parent.addEventListener("touchcancel", (evt) => this.onTouch(evt));
            document.addEventListener("scroll", (evt) => this.onScroll(evt));
        }
    }

    // Clone.
    clone() {
        let clone = new cube.Input();
        if (this._dirs[0] != null) {
            clone._dirs[0] = this._dirs[0].clone();
        }
        if (this._dirs[1] != null) {
            clone._dirs[1] = this._dirs[1].clone();
        }
        clone.keyCode = this.keyCode;
        clone._commands[0] = this._commands[0].substring(0);
        clone._commands[1] = this._commands[1].substring(1);
        if (this.points != null) {
            clone.points = [];
            if (this.points[0] != null) {
                clone.points[0] = this.points[0].clone();
            }
            if (this.points[1] != null) {
                clone.points[1] = this.points[1].clone();
            }
        }
        clone.keyTime = this.keyTime;
        clone.tapTime = this.tapTime;
        clone.flickTime = this.flickTime;
        clone.downEvent = this.downEvent;
        clone.upEvent = this.upEvent;
        // if (this.touches != null) {
        //     clone.touches = [];
        //     for (let i = 0; i < this.touches.length; ++i) {
        //         clone.touches[i].pageX = this.touches[i].pageX;
        //         clone.touches[i].pageY = this.touches[i].pageY;
        //         clone.touches[i].force = this.touches[i].force;
        //     }
        // }
        clone.dir = this.dir ? this.dir.clone() : null;
        clone.pos = this.pos ? this.pos.clone() : null;
        return clone;
    }

    // Action.
    action() {
        return this._dirs[1] ? this._dirs[0].toVec() : null;
    }

    // Check motion.
    motion() {
        return this.points ? this.points[1].clone() : null;
    }

    // Generate directions from key code.
    keyCodeToDirs(keyCode) {
        const keyCodeRight = 39;
        const keyCodeUp = 38;
        const keyCodeLeft = 37;
        const keyCodeDown = 40;

        // Check if pressed key is direction key.
        if (keyCode == keyCodeRight) {
            return cube.Dirs.right.clone();
        } else if (keyCode == keyCodeUp) {
            return cube.Dirs.up.clone();
        } else if (keyCode == keyCodeLeft) {
            return cube.Dirs.left.clone();
        } else if (keyCode == keyCodeDown) {
            return cube.Dirs.down.clone();

        // Pressed key is not direction key.
        } else {
            return new cube.Dirs();
        }
    }

    // Generate directions from key code.
    // 32=SPC 33~47=!~/ 48~57=0~9 58~64=:~@
    // 65~90=A~Z 91~96=[~` 97~122=a~z 123~126={~~
    keyCodeToString(keyCode) {
        if (32 <= keyCode && keyCode <= 126) {
            return String.fromCharCode(keyCode);
        }
        return 0;
    }

    // Test key code.
    // 8=BS 9=TAB 13=RTN 16=SFT 17=CTL 27=ESC
    // 33,34=PUPD 35,36=HE 37~40=LURD 46=DEL
    keyCodeIsBackspace(keyCode) {
        if (keyCode == 8) {
            return true;
        }
        return false;
    }

    // Test key code.
    // 8=BS 9=TAB 13=RTN 16=SFT 17=CTL 27=ESC
    // 33,34=PUPD 35,36=HE 37~40=LURD 46=DEL
    keyCodeIsEnter(keyCode) {
        if (keyCode == 13) {
            return true;
        }
        return false;
    }

    // Generate directions from mouse/touch point vec.
    pointVecToDirs(vec) {
        const pi14 = Math.PI / 4;
        const pi34 = Math.PI * 3 / 4;

        // Check directions.
        let theta = Math.atan2(vec.y, vec.x);
        if (-pi14 < theta && theta <= pi14) {
            return cube.Dirs.right.clone();
        } else if (-pi34 < theta && theta <= -pi14) {
            return cube.Dirs.up.clone();
        } else if (pi34 < theta || theta <= -pi34) {
            return cube.Dirs.left.clone();
        } else if (pi14 < theta && theta <= pi34) {
            return cube.Dirs.down.clone();
        }
        return new cube.dirs();
    }

    // Serialize to parameters.
    serializeParams() {
        let params = new cube.Params();
        if (this._dirs[0] != null) {
            params.setValue("dirs0", this._dirs[0].serialize());
        }
        if (this._dirs[1] != null) {
            params.setValue("dirs1", this._dirs[1].serialize());
        }
        if (this.points != null) {
            if (this.points[0] != null) {
                params.setValue("points0", this.points[0].serialize());
            }
            if (this.points[1] != null) {
                params.setValue("points1", this.points[1].serialize());
            }
        }
        return params;
    }

    // Update command and dirs by screen event.
    read(raw=false) {
        if (raw) {
            let line = this._commands[0].substring(0);
            this._commands[0] = "";
            return line;
        } else {
            let index = this._commands[1].indexOf("\n");
            if (index >= 0) {
                let line = this._commands[1].substring(0, index);
                this._commands[1] = this._commands[1].substring(index + 1);
                return line;
            }
        }
        return null;
    }

    // Update command and dirs by screen event.
    testBackspace() {
    }

    // Update dirs by screen event.
    updateDirs() {
        this.updateDirsByScreen(1000, 10*10, 0.5);
    }

    // Update dirs by serialized parameters.
    updateDirsByParams(params) {
        if (params.value("dirs0") != null) {
            this._dirs[0] = new cube.Dirs();
            this._dirs[0].deserialize(params.value("dirs0"));
        }
        if (params.value("dirs1") != null) {
            this._dirs[1] = new cube.Dirs();
            this._dirs[1].deserialize(params.value("dirs1"));
        }
        if (params.value("points0") != null ||
            params.value("points1") != null) {
            this.points = [];
            if (params.value("points0") != null) {
                this.points[0] = new cube.Vec();
                this.points[0].deserialize(params.value("points0"));
            }
            if (params.value("points1") != null) {
                this.points[1] = new cube.Vec();
                this.points[1].deserialize(params.value("points1"));
            }
        } else {
            this.points = null;
        }

        this.dir = this._dirs[0] ? this._dirs[0].toVec() : null;
        this.pos = this.points ? this.points[1].clone() : null;
    }

    // Update dirs by screen event.
    // - timeout: Timeout time for tap/flick check.
    // - radius2: Play radius for tap/flick check.
    // - depth: Far depth for press check.
    updateDirsByScreen(timeout, radius2, depth) {
        let time = Date.now();

        // No input.
        if (this.keyCode <= 0 && this.points == null) {
            this._dirs[0] = null;
            this.keyTime = time;
            this.tapTime = time;
            this.flickTime = time;

        // Key input.
        } else if (this.keyCode > 0) {
            this._dirs[0] = this.keyCodeToDirs(this.keyCode);
            // console.log("Key input:" + this.tapTime + " " + time);

            // Timeout check.
            if (this.keyTime <= time - timeout) {
                this._dirs[0].add(cube.Dirs.far);
            }

        // Mouse/Touch input.
        } else if (this.points != null) {

            // Play radius check.
            let vec = this.points[1].clone().sub(this.points[0]);
            if (radius2 <= 0 || vec.lenSq() >= radius2) {

                // Flick/Swiping.
                this._dirs[0] = this.pointVecToDirs(vec);

                // Ignore tap after point out of play radius.
                this.tapTime = time - timeout;

                // Timeout or Far depth check.
                if (this.flickTime <= time - timeout
                 || this.points[1].z - this.points[0].z >= depth) {
                    this._dirs[0].add(cube.Dirs.far);

                    // Ignore flick after point reach to far depth.
                    this.flickTime = time - timeout;
                }
            } else {

                // Tap/Touching.
                this._dirs[0] = new cube.Dirs();

                // Timeout or Far depth check.
                if (this.tapTime <= time - timeout
                 || this.points[1].z - this.points[0].z >= depth) {
                    this._dirs[0].add(cube.Dirs.far);

                    // Ignore tap/flick after point reach to far depth.
                    this.tapTime = time - timeout;
                    this.flickTime = time - timeout;
                }
            }
            // console.log("Mouse/Touch input:" + this.tapTime + " " + time);
        }

        // On down event, only update status.
        if (this.downEvent) {
            console.log("Down Event:" + this._dirs[0].toString());
            this._dirs[1] = null;
            this.downEvent = false;

        // On up event, update status and return dirs.
        } else if (this.upEvent) {
            console.log("Up Event:" + this._dirs[0].toString());
            this._dirs[1] = this._dirs[0];
            this.upEvent = false;

        // On after up event.
        } else if (this._dirs[1] != null) {
            console.log("Up Event End.");
            this._dirs[0] = null;
            this._dirs[1] = null;
            this.keyCode = null;
            this.points = null;
        }

        this.dir = this._dirs[0] ? this._dirs[0].toVec() : null;
        this.pos = this.points ? this.points[1].clone() : null;
    }

    // Get input directions.
    dirs(raw=false) {
        if (this._dirs[raw ? 0 : 1] != null) {
            return this._dirs[raw ? 0 : 1].clone();
        }
        return null;
    }

    // Get mouse/touch point position.
    point(raw=false) {
        if (this.points != null) {
            return this.points[raw ? 0 : 1].clone();
        }
        return null;
    }

    // Set input direction directly.
    setDirs(dirs) {
        this._dirs[0] = dirs;
        this._dirs[1] = dirs;
    }

    // Key down event handler.
    onKeyDown(evt) {
        evt = evt != null ? evt : window.event;
        evt.preventDefault();
        this.keyCode = evt.keyCode;
        this.downEvent = true;
        if (this.keyCodeIsEnter(evt.keyCode)) {
            this._commands[0] += "\n";
            this._commands[1] += "\n";
        } else if (this.keyCodeIsBackspace(evt.keyCode)) {
            this._commands[0] += "\b";
            this._commands[1] = this._commands[1].slice(0, -1);
        } else {
            let str = this.keyCodeToString(evt.keyCode);
            if (str) {
                this._commands[0] += str;
                this._commands[1] += str;
            }
        }
        console.log("event:" + evt.type + " keycode:" + evt.keyCode)
    }

    // Key up event handler.
    onKeyUp(evt) {
        evt = evt != null ? evt : window.event;
        evt.preventDefault();
        this.keyCode = evt.keyCode;
        this.upEvent = true;
        console.log("event:" + evt.type + " keycode:" + evt.keyCode);
    }

    // Update point on down event.
    updatePointOnDown(pos) {
        //pos.sub(this.screen.pos).div(this.screen.scale);
        //pos = this.screen.posToGlobalPos(pos);
        this.points = [pos.clone(), pos.clone()];
        this.downEvent = true;
        // console.log("Down:" + pos.toString());
    }

    // Update point on move event.
    updatePointOnMove(pos) {
        //pos.sub(this.screen.pos).div(this.screen.scale);
        //pos = this.screen.posToGlobalPos(pos);
        if (this.points != null) {
            this.points[1] = pos.clone();
        }
        // console.log("Move:" + pos.toString());
    }

    // Update point on up event.
    updatePointOnUp(pos) {
        //pos.sub(this.screen.pos).div(this.screen.scale);
        //pos = this.screen.posToGlobalPos(pos);
        if (this.points != null) {
            this.points[1] = pos.clone();
            this.upEvent = true;
        }
        // console.log("Up:" + pos.toString());
    }

    // Mouse down event handler.
    onMouseDown(evt) {
        evt = evt != null ? evt : window.event;
        evt.preventDefault();
        let mouse = this.screen.posToGlobalPos(new cube.Vec(evt.pageX, evt.pageY));
        this.updatePointOnDown(mouse);
        // console.log("event:" + evt.type + " " + mouse.toString() + " " + evt.pageX + "," + evt.pageY);
    }

    // Mouse move event handler.
    onMouseMove(evt) {
        evt = evt != null ? evt : window.event;
        evt.preventDefault();
        let mouse = this.screen.posToGlobalPos(new cube.Vec(evt.pageX, evt.pageY));
        this.updatePointOnMove(mouse);
        // console.log("event:" + evt.type + " " + mouse.toString() + " " + evt.pageX + "," + evt.pageY);
    }

    // Mouse up event handler.
    onMouseUp(evt) {
        evt = evt != null ? evt : window.event;
        evt.preventDefault();
        let mouse = this.screen.posToGlobalPos(new cube.Vec(evt.pageX, evt.pageY));
        this.updatePointOnUp(mouse);
        // console.log("event:" + evt.type + " " + mouse.toString() + " " + evt.pageX + "," + evt.pageY);
    }

    // Touch down/move/up/cancel event handler.
    onTouch(evt) {
        evt = evt != null ? evt : window.event;
        evt.preventDefault();

        // Touch down first finger.
        if (this.touches == null && evt.touches.length > 0) {
            this.touches = [];
            let touch = new cube.Vec();
            for (let i = 0; i < evt.touches.length; ++i) {
                this.touches.push(evt.touches[i]);
                touch.add(new cube.Vec(evt.touches[i].pageX,
                                       evt.touches[i].pageY,
                                       evt.touches[i].force));
            }
            touch.div(evt.touches.length);
            touch = this.screen.posToGlobalPos(touch);
            this.updatePointOnDown(touch);

            // console.log("Touch 1:" + evt.touches.length + " " + touch.toString());

        // Touch down/up additinal finger or touch move.
        } else {
            let touchesNext = [];
            let moveVec = new cube.Vec();
            let moveCount = 0;
            for (let i = 0; i < evt.touches.length; ++i) {
                touchesNext.push(evt.touches[i]);
                for (let j = 0; j < this.touches.length; ++j) {
                    if (evt.touches[i].identifier == this.touches[j].identifier) {
                        let touchNext = this.screen.posToGlobalPos(new cube.Vec(evt.touches[i].pageX, evt.touches[i].pageY, evt.touches[i].force));
                        let touchPrev = this.screen.posToGlobalPos(new cube.Vec(this.touches[j].pageX, this.touches[j].pageY, this.touches[j].force));
                        moveVec.add(touchNext).sub(touchPrev);
                        moveCount += 1;
                        // console.log("Touch Move ["+i+"]: " + touchPrev.toString() + "->" + touchNext.toString());
                    }
                }
            }

            // Touch move.
            if (this.points != null) {
                if (moveCount > 0) {
                    let touch = this.points[1].add(moveVec.clone().div(moveCount));
                    this.updatePointOnMove(touch);
                    this.touches = touchesNext;

                    // console.log("Touch 2:" + evt.touches.length + " " + touch.toString() + " " + moveVec.toString() + " " + moveCount);

                // Touch up last finger.
                } else {
                    let touch = this.points[1];
                    this.updatePointOnUp(touch);
                    this.touches = null;

                    // console.log("Touch 3:" + evt.touches.length + " " + touch.toString());
                }
            }
        }
    }

    // Scroll event handler.
    onScroll(evt) {
        evt = evt != null ? evt : window.event;
        evt.preventDefault();
        console.log("event:" + evt.type)
    }
}

// Master joypad.
cube.joypad = new cube.Input(cube.screen);
// All joypads.
cube.joypads = [cube.joypad];

/*  */
