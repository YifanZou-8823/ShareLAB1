let scaleX = 3;
let bgImg
let logs = [];
let maxLogs = 16;
let progress = 0

let windowImg = {
  name: 'Curtains',
  img: null,
  x: 0,
  y: 113,
  openBtn: {
    x: 105,
    y: 326,
  },
  closeBtn: {
    x: 92,
    y: 326,
  },
  state: 'open',
}

let coffeeImg = {
  name: 'Coffee machine',
  img: null,
  x: 428.5,
  y: 331,
  openBtn: {
    x: 456,
    y: 370,
  },
  closeBtn: {
    x: 443,
    y: 370,
  },
  state: 'open'
}

let tvImg = {
  name: 'Television',
  img: null,
  x: 540,
  y: 290,
  openBtn: {
    x: 625,
    y: 405,
  },
  closeBtn: {
    x: 612,
    y: 403,
  },
  state: 'close'
}

let light1 = {
  name: 'Desk lamp',
  img: null,
  x: 158,
  y: 312,
  openBtn: {
    x: 182,
    y: 350,
  },
  closeBtn: {
    x: 169,
    y: 350,
  },
  state: 'open'
}
let light2 = {
  name: 'Ceiling light',
  img: null,
  x: 287,
  y: 0,
  openBtn: {
    x: 409,
    y: 17,
  },
  closeBtn: {
    x: 395,
    y: 17,
  },
  state: 'open'
}

function preload() {
  bgImg = loadImage('bg.jpg')

  windowImg.img = loadImage('window.png')
  coffeeImg.img = loadImage('coffee.png')
  tvImg.img = loadImage('tv.png')
  light1.img = loadImage('light1.png')
  light2.img = loadImage('light2.png')
}

function setup() {
  createCanvas(2048 / scaleX + 200, 2048 / scaleX)

  windowImg.img.resize(windowImg.img.width / scaleX, windowImg.img.height / scaleX)
  coffeeImg.img.resize(coffeeImg.img.width / scaleX, coffeeImg.img.height / scaleX)
  tvImg.img.resize(tvImg.img.width / scaleX, tvImg.img.height / scaleX)
  light1.img.resize(light1.img.width / scaleX, light1.img.height / scaleX)
  light2.img.resize(light2.img.width / scaleX, light2.img.height / scaleX)
}

function drawObj(obj) {
  if (obj.state === 'open') {
    image(obj.img, obj.x, obj.y, obj.img.width, obj.img.height)
  }


  fill('red')
  circle(obj.closeBtn.x, obj.closeBtn.y, 10, 10)
  fill('#27c33b')
  circle(obj.openBtn.x, obj.openBtn.y, 10, 10)
}

function draw() {
  background(30)

  image(bgImg, 0, 0, bgImg.width / scaleX, bgImg.height / scaleX)
  drawObj(windowImg)
  drawObj(coffeeImg)
  drawObj(tvImg)
  drawObj(light1)
  drawObj(light2)

  drawLogPanel()
}

function drawLogPanel() {
  push();

  fill('yellow')
  textSize(16);
  textAlign(CENTER);
  text("📋Artificial Dumbness", width - 100, 30);

  textSize(14);
  textAlign(LEFT)
  text('Give commands to AD', width - 190, 50)
  text('Green is ON, Red is OFF', width - 190, 70)
  text('Turn off all devices and leave', width - 190, 90)

  stroke(100, 180, 255);
  strokeWeight(2);
  line(width - 190, 100, width - 10, 100);


  let startY = 125;
  let lineHeight = 32;

  for (let i = max(0, logs.length - 20); i < logs.length; i++) {
    let log = logs[i];
    let y = startY + (i - max(0, logs.length - 20)) * lineHeight;

    push();
    switch (log.type) {
      case 'success':
        fill(76, 175, 80);
        break;
      case 'error':
        fill(244, 67, 54);
        break;
    }
    noStroke();
    rect(width - 190, y - 15, 4, 29);
    pop();

    noStroke();
    strokeWeight(1);

    fill(180);
    textSize(12);
    textAlign(LEFT);
    text(log.time, width - 180, y - 5);

    fill(255);
    textSize(14);
    text(log.message, width - 180, y + 12);
  }

  fill(50, 50, 60, 200);
  noStroke();
  rect(width - 200, height - 30, 200, 30);

  fill(255);
  textSize(14);
  textAlign(CENTER);
  text(`Level progress: ${progress} / 5`, width - 100, height - 11);

  pop();
}

function addLog(deviceName, state) {
  logs.push({
    time: getTimeString(),
    message: deviceName + ' ' + (state === 'open' ? 'turned on' : 'turned off'),
    type: state === 'open' ? 'success' : 'error',
  });

  if (logs.length > maxLogs) {
    logs.shift();
  }
}

function getTimeString() {
  let d = new Date();
  let h = nf(d.getHours(), 2);
  let m = nf(d.getMinutes(), 2);
  let s = nf(d.getSeconds(), 2);
  return `${h}:${m}:${s}`;
}

function btnClicked(btn) {
  return dist(mouseX, mouseY, btn.x, btn.y) <= 5
}
function setState(obj, state) {
  obj.state = state
  addLog(obj.name, obj.state)
}

function switchState(obj) {
  obj.state = obj.state === 'open' ? 'close' : 'open'
  addLog(obj.name, obj.state)
}

function mouseClicked() {
  if (btnClicked(tvImg.closeBtn)) {
    setState(tvImg, 'open')
    switchState(light1)
  } else if (btnClicked(tvImg.openBtn)) {
    setState(tvImg, 'close')
    switchState(light1)
  }

  if (btnClicked(light2.openBtn)) {
    setState(light2, 'close')
    switchState(windowImg)
  } else if (btnClicked(light2.closeBtn)) {
    setState(light2, 'open')
    switchState(windowImg)
  }

  if (btnClicked(light1.closeBtn)) {
    setState(light1, 'close')
    switchState(tvImg)
    switchState(coffeeImg)
  } else if (btnClicked(light1.openBtn)) {
    setState(light1, 'open')
    switchState(tvImg)
    switchState(coffeeImg)
  }

  if (btnClicked(windowImg.openBtn)) {
    setState(windowImg, 'open')
    switchState(light2)
  } else if (btnClicked(windowImg.closeBtn)) {
    setState(windowImg, 'close')
    switchState(light2)
  }

  if (btnClicked(coffeeImg.closeBtn)) {
    setState(coffeeImg, 'close')
    setState(light1, 'close')
  } else if (btnClicked(coffeeImg.openBtn)) {
    setState(coffeeImg, 'open')
    setState(light1, 'open')
  }

  progress = 0
  if (windowImg.state === 'close') progress++
  if (coffeeImg.state === 'close') progress++
  if (tvImg.state === 'close') progress++
  if (light1.state === 'close') progress++
  if (light2.state === 'close') progress++

  if (progress === 5) {
    alert('All devices are turned off, congratulations on passing the level!')
  }
}
