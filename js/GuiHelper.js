// localizations
let keys = "`1234567890-=\tqwertyuiop[]\\asdfghjkl;'zxcvbnm,./ ~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:\"ZXCVBNM<>?"

//permance

let pdown

//util

function hitbox(x, y, w, h, px, py)
{
	return px > x && px < x + w && py > y && py < y + h;
}

function findID(t, l)
{
	for (let i of l)
	{
		if (t == i)
			return true
	}
	return false
}

function gridlock(g, m)
{
	return round(g / m) * m
}

function clamp(v, m, x)
{
	return v > x ? x : (v < m ? m : v)
}

function lop(t, f)
{
	for (let i = 0; i < t; i++)
	{
		f(i)
	}
}

//shape

function centredtext(_text, x, y)
{
	text(_text, x - textWidth(_text) / 2, y);
}

function hyperect(x, y, w, h, c)
{
	beginShape();
	vertex(x + c, y);
	vertex(x + w - c, y);
	vertex(x + w, y + c);
	vertex(x + w, y + h - c);
	vertex(x + w - c, y + h);
	vertex(x + c, y + h);
	vertex(x, y + h - c);
	vertex(x, y + c);
	endShape(CLOSE);
}

//general

function activateGUI()
{
	pdown = mouseIsPressed
}

//function

function button(x, y, w, h, r)
{
	if (!r) rect(x, y, w, h, 5)

	if (hitbox(x, y, w, h, mouseX, mouseY))
	{
		fill("#dddddd44");
		rect(x, y, w, h, r || 5);
		cursor(HAND);
	}

	if (
		hitbox(x, y, w, h, mouseX, mouseY) &&
		mouseIsPressed &&
		pdown != mouseIsPressed
	)
	{
		return true;
	}

	return false;
}

function checkbox(v, x, y, w, h, r)
{
	if (!r)
	{
		rect(x, y, w, h, 5)
		text(v ? "⊙" : "⊗", x + (w / 2) - 9, y + (h / 2) + 7)
	}

	if (button(x, y, w, h))
	{
		return !v
	}

	return v
}

function vslider(v, x, y, h, m, f, r, g)
{
	let uy = clamp(map(v, m, f, y, y + h), y, y + h);

	if (!r)
	{
		noFill();
		line(x, y, x, uy - 5);
		line(x, y + h, x, uy + 5);
		rect(x - 2, uy - 5, 4, 10, 5);
	}

	if (hitbox(x - 5, y, 10, h, mouseX, mouseY))
	{
		cursor("grab")
		if (mouseIsPressed)
		{
			cursor("grabbing")
			if (keyIsDown(17) && g)
			{
				return clamp(gridlock(map(mouseY, y, y + h, m, f), g), m, f);
			}
			return clamp(map(mouseY, y, y + h, m, f), m, f);
		}
	}

	return clamp(v, m, f);
}

function slider(v, x, y, w, m, f, r, g)
{
	let ux = map(v, m, f, x, x + w);

	if (!r)
	{
		noFill();
		line(x, y, ux - 5, y);
		line(x + w, y, ux + 5, y);
		rect(ux - 5, y - 2, 10, 4, 5);
	}

	if (hitbox(x, y - 5, w, 10, mouseX, mouseY))
	{
		cursor("grab")
		if (mouseIsPressed)
		{
			cursor("grabbing")
			if (keyIsDown(17) && g)
			{
				return clamp(gridlock(map(mouseX, x, x + w, m, f), g), m, f);
			}
			return clamp(map(mouseX, x, x + w, m, f), m, f);
		}
	}

	return clamp(v, m, f);
}

function slider2d(v, x, y, w, h, mw, fw, mh, fh, r, g)
{
	let ux = map(v.x - 1, mw, fw, x, x + w);
	let uy = map(v.y - 1, mh, fh, y, y + h);

	v.x = clamp(v.x, mw, fw)
	v.y = clamp(v.y, mh, fh)

	if (!r)
	{
		noFill();
		rect(x, y, w, h, 5)
		line(x, uy + 5, ux, uy + 5)
		line(x + w, uy + 5, ux + 10, uy + 5)
		line(ux + 5, y, ux + 5, uy)
		line(ux + 5, y + h, ux + 5, uy + 10)
		rect(ux, uy, 10, 10, 3);
	}

	if (hitbox(x - 1, y - 1, w + 2, h + 2, mouseX, mouseY))
	{
		cursor("grab")
		if (mouseIsPressed)
		{
			cursor("grabbing")
			if (keyIsDown(17) && g)
			{
				return {
					x: gridlock(map(mouseX - 5, x, x + w, mw, fw), g) + 1,
					y: gridlock(map(mouseY - 5, y, y + h, mh, fh), g) + 1
				};
			}
			return {
				x: map(mouseX - 5, x, x + w, mw, fw) + 1,
				y: map(mouseY - 5, y, y + h, mh, fh) + 1
			};
		}
	}

	return v;
}

//permanence

function poperror(rndr, w)
{
	noLoop()

	rndr()

	let tmr = 0

	let o = () =>
	{
		setTimeout(() =>
		{
			if (mouseIsPressed && tmr >= w)
			{
				loop()
				pdown = !true
			} else
			{
				rndr()
				o()
				tmr++
			}
		}, 0)
	}; o()
}

//classes

//@note key repermanace bug (p[a]p[s]r[a])
//@note i think i fixed it but not sure
class onelinetext
{
	constructor(init, x, y, s)
	{
		this.text = init
		this.x = x
		this.y = y
		this.s = s || 20
		this.cursor = 1
		this.spkeydic = {}
	}

	//setters

	position(x, y)
	{
		this.x = x
		this.y = y
	}

	size(s)
	{
		this.s = s
	}

	//events

	enter(f)
	{
		this.entr = f
	}

	charpressed(f)
	{
		this.cpress = f
	}

	sckey(k, f)
	{
		this.spkeydic[k] = f
	}

	update()
	{
		textSize(this.s)

		this.w = textWidth(this.text);

		//inbound cursor

		if (this.cursor < 0)
		{
			this.cursor = 0;
		}
		if (this.cursor > this.text.length)
		{
			this.cursor = this.text.length;
		}

		//cursor string data

		let data = [this.text.substring(0, this.cursor), this.text.substring(this.cursor)]

		if (this.select)
		{
			// move cursor right
			if (keyIsDown(39))
			{
				if (!this.cursorkeyleft || this.cursorkeyleftime > 30)
					this.cursor++;
				this.cursorkeyleft = true
				this.cursorkeyleftime++
			}
			else
			{
				this.cursorkeyleft = false
				this.cursorkeyleftime = 0
			}

			//move cursor left
			if (keyIsDown(37))
			{
				if (!this.cursorkeyright || this.cursorkeyrightime > 30)
					this.cursor--;
				this.cursorkeyright = true
				this.cursorkeyrightime++
			}
			else
			{
				this.cursorkeyright = false
				this.cursorkeyrightime = 0
			}

			//enter
			if (keyIsDown(13))
			{
				if (this.entr) this.entr(this, this.text)
			}

			//delete previous char
			if (keyIsDown(8))
			{
				if (!this.cursorkeydel || this.cursorkeydeltime > 50)
				{
					this.cursor--;
					this.text = data[0].substring(0, this.cursor) + data[1]
				}
				this.cursorkeydel = true
				this.cursorkeydeltime++
			}
			else
			{
				this.cursorkeydel = false
				this.cursorkeydeltime = 0
			}

			//actial typing with timer
			//@note this is where the problem happens
			if (keyIsPressed)
			{
				// console.log(char(keyCode))
				if (findID(key, keys))
					if (!this.cursorkey || key != this.pcursorkey || this.cursorkeytime > 50)
					{
						if (keyIsDown(keyCode))
						{
							this.cursor++
							this.text = data[0] + key + data[1]

							if (this.cpress) this.cpress(this, this.text, key)
							if (this.spkeydic[key]) this.spkeydic[key](this)
						}
					}
				this.cursorkey = true
				this.pcursorkey = key
				this.cursorkeytime++
			} else
			{
				this.cursorkey = false
				this.cursorkeytime = 0
			}
		}

		//select and position the cursor

		if (hitbox(this.x, this.y - this.s - 2.5, (this.w < 10 ? 10 : this.w), this.s + 5, mouseX, mouseY))
		{
			cursor(TEXT)
			if (mouseIsPressed)
			{
				let record = "";
				for (let i = 0; i < this.text.length; i++)
				{
					record += this.text.charAt(i)
					if (hitbox(this.x, this.y - this.s - 2.5, textWidth(record), this.s + 5, mouseX, mouseY))
					{
						this.cursor = i + 1
						break;
					}
				}

				this.select = true
			}
		}
		else
		{
			cursor(ARROW)
			if (mouseIsPressed)
			{
				this.select = false
			}
		}
	}

	draw()
	{
		let data = [this.text.substring(0, this.cursor), this.text.substring(this.cursor)]

		textSize(this.s)

		//draw

		noStroke()
		textSize(this.s)
		text(data[0], this.x, this.y)
		text(data[1], this.x + textWidth(data[0]) + 1, this.y)
		strokeWeight(2)
		stroke(0)
		if (this.select)
			line(this.x + textWidth(data[0]) + 1, this.y, this.x + textWidth(data[0]) + 1, this.y - this.s + 5)
		line(this.x, this.y + 2, this.x + (this.w < 10 ? 10 : this.w), this.y + 2)
	}
}

