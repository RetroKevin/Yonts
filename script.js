"use strict";
const canvas = document.querySelector("#canvas");
const width = canvas.width;
const height = canvas.height;

let ctx = canvas.getContext("2d");
const size = 16;
let playerWidth = size;
let playerHeight = size;
const spriteSize = [size, size];
const landSpriteSheet = new Image();
landSpriteSheet.src = "/img/Ground/Grass.png";
const playerSpriteSheet = new Image();
playerSpriteSheet.src = "/img/Characters/Soldiers/Melee/SwordsmanTemplate.png";
const tallGrassSpriteSheet = new Image();
tallGrassSpriteSheet.src = "img/Ground/TexturedGrass.png";
const dirtSpriteSheet = new Image();
dirtSpriteSheet.src = "img/Ground/DeadGrass.png";
const housesSpriteSheet = new Image();
housesSpriteSheet.src = "img/Buildings/Wood/Houses.png";
const treesSpriteSheet = new Image();
treesSpriteSheet.src = "img/Nature/Trees.png";
const orcMageSpriteSheet = new Image();
orcMageSpriteSheet.src = "img/Characters/Monsters/Orcs/OrcMage.png";
orcMageSpriteSheet.onload = () => init();

const rng = function (min, max) {
  const rng = Math.floor(Math.random() * (max - min) + min);
  return rng;
};

const player = {
  x: 112,
  y: 96,
};
const grass = {
  id: "grass",
  pos: [0, 16, ...spriteSize],
  layer: 0,
  sheet: tallGrassSpriteSheet,
};
const lightGrass = {
  id: "lightgrass",
  pos: [0, 0, ...spriteSize],
  layer: 0,
  sheet: tallGrassSpriteSheet,
};
const tallGrass1 = {
  id: "tallgrass",
  pos: [16, 16, ...spriteSize],
  layer: 0,
  sheet: tallGrassSpriteSheet,
};
const tallGrass2 = {
  id: "tallgrass",
  pos: [32, 16, ...spriteSize],
  layer: 0,
  sheet: tallGrassSpriteSheet,
};
const tallLightGrass1 = {
  id: "talllightgrass",
  pos: [16, 0, ...spriteSize],
  layer: 0,
  sheet: tallGrassSpriteSheet,
};
const tallLightGrass2 = {
  id: "talllightgrass",
  pos: [32, 0, ...spriteSize],
  layer: 0,
  sheet: tallGrassSpriteSheet,
};
const water = {
  id: "water",
  pos: [0, 0, ...spriteSize],
  layer: 1,
  sheet: landSpriteSheet,
};
const dirtPathHorz = {
  id: "dirtpath",
  pos: [48, 0, ...spriteSize],
  layer: 0,
  sheet: landSpriteSheet,
};
const dirtPathVert = {
  id: "dirtpath",
  pos: [64, 0, ...spriteSize],
  layer: 0,
  sheet: landSpriteSheet,
};
const house1 = {
  id: "house",
  pos: [0, 32, ...spriteSize],
  layer: 1,
  sheet: housesSpriteSheet,
};
const house2 = {
  id: "house",
  pos: [16, 32, ...spriteSize],
  layer: 1,
  sheet: housesSpriteSheet,
};
const house3 = {
  id: "house",
  pos: [32, 32, ...spriteSize],
  layer: 1,
  sheet: housesSpriteSheet,
};
const house4 = {
  id: "house",
  pos: [0, 48, ...spriteSize],
  layer: 1,
  sheet: housesSpriteSheet,
};
const house5 = {
  id: "house",
  pos: [16, 48, ...spriteSize],
  layer: 1,
  sheet: housesSpriteSheet,
};
const house6 = {
  id: "house",
  pos: [32, 48, ...spriteSize],
  layer: 1,
  sheet: housesSpriteSheet,
};
const tree1 = {
  id: "tree",
  pos: [16, 0, ...spriteSize],
  layer: 0,
  sheet: treesSpriteSheet,
};
const tree2 = {
  id: "tree",
  pos: [32, 0, ...spriteSize],
  layer: 0,
  sheet: treesSpriteSheet,
};
const tree3 = {
  id: "tree",
  pos: [48, 0, ...spriteSize],
  layer: 0,
  sheet: treesSpriteSheet,
};

const house = [house1, house2, house3, house4, house5, house6];
const tree = [tree1, tree2, tree3];
const ground = [
  grass,
  lightGrass,
  grass,
  lightGrass,
  grass,
  lightGrass,
  grass,
  lightGrass,
  grass,
  lightGrass,
  grass,
  lightGrass,
  grass,
  lightGrass,
  grass,
  lightGrass,
  grass,
  lightGrass,
  tallGrass1,
  tallLightGrass1,
  tallGrass2,
  tallLightGrass2,
  water,
  dirtPathHorz,
  dirtPathVert,
];

let map = new Map();
let map2 = new Map();

const genMap = function () {
  for (let i = 0; i < Math.ceil(height / size); i++) {
    let groundTile = [];
    for (let u = 0; u < Math.ceil(width / size); u++) {
      let mapRNG = rng(0, ground.length - 1);
      groundTile.push(ground[mapRNG]);
    }
    map.set(i, groundTile);
  }
};
genMap();

const genMap2 = function () {
  for (let j = 0; j < Math.ceil(height / size); j++) {
    let groundTile = [];
    const treePush = () =>
      groundTile.push({
        id: "",
        pos: [0, 16, ...spriteSize],
        layer: 0,
        sheet: treesSpriteSheet,
      });
    for (let k = 0; k < Math.ceil(width / size); k++) {
      if (map.get(j)[k].id === "dirtpath") {
        let mapRNG = rng(0, house.length);
        groundTile.push(house[mapRNG]);
      } else if (map.get(j)[k].id === "grass") {
        if (rng(1, 100) >= 90) {
          let mapRNG = rng(0, tree.length);
          groundTile.push(tree[mapRNG]);
        } else {
          treePush();
        }
      } else {
        treePush();
      }
      map2.set(j, groundTile);
    }
  }
};
genMap2();

let step = 16;
let action = 16;

const stepper = function () {
  if (step >= 64) {
    step = 0;
    updateDirection();
  } else step += 16;
  updateDirection();
};

const actioner = function () {
  if (action >= 80) {
    action = 64;
    updateAction();
  } else action += 16;
  updateAction();
};

let playerDown = [step, 0, ...spriteSize];
let playerUp = [step, 16, ...spriteSize];
let playerRight = [step, 32, ...spriteSize];
let playerLeft = [step, 48, ...spriteSize];
let playerDirection = playerDown;
let aDown = [action, 64, ...spriteSize];
let aUp = [action, 80, ...spriteSize];
let aLeft = [action, 96, ...spriteSize];
let aRight = [action, 112, ...spriteSize];

const updateDirection = function () {
  playerDown = [step, 0, ...spriteSize];
  playerUp = [step, 16, ...spriteSize];
  playerRight = [step, 32, ...spriteSize];
  playerLeft = [step, 48, ...spriteSize];
};

const updateAction = function () {
  aDown = [action, 64, ...spriteSize];
  aUp = [action, 80, ...spriteSize];
  aLeft = [action, 96, ...spriteSize];
  aRight = [action, 112, ...spriteSize];
};

ctx.fillStyle = "#000";

const displayPlayer = function () {
  console.log(playerDirection);

  stepper();
  ctx.drawImage(
    orcMageSpriteSheet,
    ...playerDirection,
    player.x,
    player.y,
    ...spriteSize
  );
};

const drawMap = function () {
  for (let c = 0; c < Math.ceil(height / size); c++) {
    for (let r = 0; r < Math.ceil(width / size); r++) {
      ctx.drawImage(
        map.get(c)[r].sheet,
        ...map.get(c)[r].pos,
        r * size,
        c * size,
        ...spriteSize
      );
    }
  }
};
const drawMap2 = function () {
  for (let c = 0; c < Math.ceil(height / size); c++) {
    for (let r = 0; r < Math.ceil(width / size); r++) {
      ctx.drawImage(
        map2.get(c)[r].sheet,
        ...map2.get(c)[r].pos,
        r * size,
        c * size,
        ...spriteSize
      );
    }
  }
};

function init() {
  drawMap();
  displayPlayer();
  drawMap2();
}

const clearPlayer = function () {
  ctx.clearRect(player.x, player.y, playerWidth, playerHeight);
};

const checkLayer = () =>
  map.get(player.y / 16)[player.x / 16].layer === 1 ||
  map2.get(player.y / 16)[player.x / 16].layer === 1;

const checkBorders = function () {
  if (player.y < 0) {
    player.y = 0;
  }
  if (player.x < 0) {
    player.x = 0;
  }
  if (player.y > height - size) {
    player.y = height - size;
  }
  if (player.x > width - size) {
    player.x = width - size;
  }
};

const waterJump = function () {
  if (playerDirection[1] === 0)
    console.log(map.get(player.y / 16 + 1)[player.x / 16].id);
};

const playerMoveUp = function () {
  playerDirection = playerUp;
  player.y -= size;
  checkBorders();
  if (checkLayer()) {
    player.y += size;
  }
};
const playerMoveRight = function () {
  playerDirection = playerRight;
  player.x += size;
  checkBorders();
  if (checkLayer()) {
    player.x -= size;
  }
};
const playerMoveDown = function () {
  playerDirection = playerDown;
  player.y += size;
  checkBorders();
  if (checkLayer()) {
    player.y -= size;
  }
};
const playerMoveLeft = function () {
  playerDirection = playerLeft;
  player.x -= size;
  checkBorders();
  if (checkLayer()) {
    player.x += size;
  }
};
const playerAction = function () {
  if (
    playerDirection[1] === 16 &&
    map2.get(player.y / 16 - 1)[player.x / 16].id === "house"
  ) {
    playerDirection = aUp;
  }
  if (
    playerDirection[1] === 32 &&
    map2.get(player.y / 16)[player.x / 16 + 1].id === "house"
  ) {
    playerDirection = aRight;
  }
  if (
    playerDirection[1] === 0 &&
    map2.get(player.y / 16 + 1)[player.x / 16].id === "house"
  ) {
    playerDirection = aDown;
  }
  if (
    playerDirection[1] === 48 &&
    map2.get(player.y / 16)[player.x / 16 - 1].id === "house"
  ) {
    playerDirection = aLeft;
  }
  if (playerDirection[1] > 48) {
    if (playerDirection[1] === 64) {
      playerDirection = aDown;
    }
    if (playerDirection[1] === 80) {
      playerDirection = aUp;
    }
    if (playerDirection[1] === 96) {
      playerDirection = aLeft;
    }
    if (playerDirection[1] === 112) {
      playerDirection = aRight;
    }
  }
  actioner();
};

addEventListener("keydown", (e) => {
  // console.log(e.code);
  clearPlayer();
  if (e.code === "KeyD" || e.code === "ArrowRight") {
    playerMoveRight();
  }
  if (e.code === "KeyS" || e.code === "ArrowDown") {
    playerMoveDown();
  }
  if (e.code === "KeyA" || e.code === "ArrowLeft") {
    playerMoveLeft();
  }
  if (e.code === "KeyW" || e.code === "ArrowUp") {
    playerMoveUp();
  }
  if (e.code === "KeyE") {
    waterJump();
    playerAction();
  }
  init();
});
