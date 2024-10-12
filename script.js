// Utility functions

// Function to generate a random integer from 0 to max-1
function rand(max) {
  return Math.floor(Math.random() * max); // Use Math.floor to round down the random number
}

// Function to shuffle an array using the Fisher-Yates algorithm
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) { // Loop through the array from end to start
    const j = Math.floor(Math.random() * (i + 1)); // Pick a random index from 0 to i
    [a[i], a[j]] = [a[j], a[i]]; // Swap elements at i and j
  }
  return a; // Return the shuffled array
}

// Function to adjust the brightness of a sprite
function changeBrightness(factor, sprite) {
  var virtCanvas = document.createElement("canvas"); // Create a virtual canvas
  virtCanvas.width = 700; // Set canvas width
  virtCanvas.height = 700; // Set canvas height
  var context = virtCanvas.getContext("2d"); // Get 2D rendering context
  context.drawImage(sprite, 0, 0, 700, 700); // Draw the sprite on the canvas

  var imgData = context.getImageData(0, 0, 700, 700); // Get image data

  for (let i = 0; i < imgData.data.length; i += 4) { // Loop through pixel data
    imgData.data[i] = imgData.data[i] * factor; // Adjust red channel
    imgData.data[i + 1] = imgData.data[i + 1] * factor; // Adjust green channel
    imgData.data[i + 2] = imgData.data[i + 2] * factor; // Adjust blue channel
  }
  context.putImageData(imgData, 0, 0); // Put adjusted image data back on canvas

  var spriteOutput = new Image(); // Create a new image object
  spriteOutput.src = virtCanvas.toDataURL(); // Set its source to the canvas data URL
  virtCanvas.remove(); // Remove the virtual canvas
  return spriteOutput; // Return the adjusted sprite
}

// Display victory message
function displayVictoryMess(moves) {
  document.getElementById("moves").innerHTML = "You Moved " + moves + " Steps."; // Update moves count in HTML
  toggleVisablity("Message-Container"); // Show the message container
}

// Toggle visibility of an element
function toggleVisablity(id) {
  if (document.getElementById(id).style.visibility == "visible") { // If element is visible
    document.getElementById(id).style.visibility = "hidden"; // Hide it
  } else {
    document.getElementById(id).style.visibility = "visible"; // Otherwise, show it
  }
}

// Maze constructor
function Maze(Width, Height) {
  var mazeMap; // Will hold the maze structure
  var width = Width; // Maze width
  var height = Height; // Maze height
  var startCoord, endCoord; // Start and end coordinates
  var dirs = ["n", "s", "e", "w"]; // Possible directions
  var modDir = { // Direction modifiers
    n: { y: -1, x: 0, o: "s" },
    s: { y: 1, x: 0, o: "n" },
    e: { y: 0, x: 1, o: "w" },
    w: { y: 0, x: -1, o: "e" }
  };

  this.map = function () { // Getter for maze map
    return mazeMap;
  };
  this.startCoord = function () { // Getter for start coordinate
    return startCoord;
  };
  this.endCoord = function () { // Getter for end coordinate
    return endCoord;
  };

  // Generate the maze map
  function genMap() {
    mazeMap = new Array(height); // Create 2D array for maze
    for (y = 0; y < height; y++) {
      mazeMap[y] = new Array(width); // Initialize each row
      for (x = 0; x < width; ++x) {
        mazeMap[y][x] = { // Initialize each cell
          n: false, s: false, e: false, w: false, // Walls
          visited: false, // Visited flag
          priorPos: null // Previous position
        };
      }
    }
  }

  // Define the maze structure
  function defineMaze() {
    var isComp = false; // Completion flag
    var move = false; // Move flag
    var cellsVisited = 1; // Count of visited cells
    var numLoops = 0; // Loop counter
    var maxLoops = 0; // Maximum allowed loops
    var pos = { x: 0, y: 0 }; // Current position
    var numCells = width * height; // Total number of cells
    while (!isComp) {
      move = false; // Reset move flag
      mazeMap[pos.x][pos.y].visited = true; // Mark current cell as visited

      if (numLoops >= maxLoops) { // If max loops reached
        shuffle(dirs); // Shuffle directions
        maxLoops = Math.round(rand(height / 8)); // Set new max loops
        numLoops = 0; // Reset loop counter
      }
      numLoops++; // Increment loop counter
      for (index = 0; index < dirs.length; index++) { // Check each direction
        var direction = dirs[index]; // Get current direction
        var nx = pos.x + modDir[direction].x; // Calculate new x coordinate
        var ny = pos.y + modDir[direction].y; // Calculate new y coordinate

        if (nx >= 0 && nx < width && ny >= 0 && ny < height) { // If within bounds
          // Check if the tile is already visited
          if (!mazeMap[nx][ny].visited) {
            // Carve through walls from this tile to next
            mazeMap[pos.x][pos.y][direction] = true; // Remove wall in current cell
            mazeMap[nx][ny][modDir[direction].o] = true; // Remove wall in next cell

            // Set Currentcell as next cells Prior visited
            mazeMap[nx][ny].priorPos = pos; // Set prior position
            // Update Cell position to newly visited location
            pos = { x: nx, y: ny }; // Move to next cell
            cellsVisited++; // Increment visited cells count
            // Recursively call this method on the next tile
            move = true; // Set move flag
            break; // Exit loop
          }
        }
      }

      if (!move) { // If no move was made
        // If it failed to find a direction,
        // move the current position back to the prior cell and Recall the method.
        pos = mazeMap[pos.x][pos.y].priorPos; // Move back to previous position
      }
      if (numCells == cellsVisited) { // If all cells visited
        isComp = true; // Set completion flag
      }
    }
  }

  // Define start and end coordinates
  function defineStartEnd() {
    switch (rand(4)) { // Randomly choose start and end positions
      case 0:
        startCoord = { x: 0, y: 0 };
        endCoord = { x: height - 1, y: width - 1 };
        break;
      case 1:
        startCoord = { x: 0, y: width - 1 };
        endCoord = { x: height - 1, y: 0 };
        break;
      case 2:
        startCoord = { x: height - 1, y: 0 };
        endCoord = { x: 0, y: width - 1 };
        break;
      case 3:
        startCoord = { x: height - 1, y: width - 1 };
        endCoord = { x: 0, y: 0 };
        break;
    }
  }

  // Initialize the maze
  genMap(); // Generate the map
  defineStartEnd(); // Set start and end points
  defineMaze(); // Create the maze structure
}

// Function to draw the maze
function DrawMaze(Maze, ctx, cellsize, endSprite = null) {
  var map = Maze.map(); // Get the maze map
  var cellSize = cellsize; // Cell size
  var drawEndMethod; // Method to draw the end point
  ctx.lineWidth = cellSize / 40; // Set line width

  this.redrawMaze = function (size) { // Method to redraw maze
    cellSize = size; // Update cell size
    ctx.lineWidth = cellSize / 50; // Update line width
    drawMap(); // Redraw the map
    drawEndMethod(); // Redraw the end point
  };

  // Draw a single cell
  function drawCell(xCord, yCord, cell) {
    var x = xCord * cellSize; // Calculate x coordinate
    var y = yCord * cellSize; // Calculate y coordinate

    if (cell.n == false) { // If there's a wall to the north
      ctx.beginPath(); // Begin drawing path
      ctx.moveTo(x, y); // Move to top-left corner
      ctx.lineTo(x + cellSize, y); // Draw line to top-right corner
      ctx.stroke(); // Stroke the line
    }
    if (cell.s === false) { // If there's a wall to the south
      ctx.beginPath(); // Begin drawing path
      ctx.moveTo(x, y + cellSize); // Move to bottom-left corner
      ctx.lineTo(x + cellSize, y + cellSize); // Draw line to bottom-right corner
      ctx.stroke(); // Stroke the line
    }
    if (cell.e === false) { // If there's a wall to the east
      ctx.beginPath(); // Begin drawing path
      ctx.moveTo(x + cellSize, y); // Move to top-right corner
      ctx.lineTo(x + cellSize, y + cellSize); // Draw line to bottom-right corner
      ctx.stroke(); // Stroke the line
    }
    if (cell.w === false) { // If there's a wall to the west
      ctx.beginPath(); // Begin drawing path
      ctx.moveTo(x, y); // Move to top-left corner
      ctx.lineTo(x, y + cellSize); // Draw line to bottom-left corner
      ctx.stroke(); // Stroke the line
    }
  }

  // Draw the entire map
  function drawMap() {
    for (x = 0; x < map.length; x++) { // Loop through rows
      for (y = 0; y < map[x].length; y++) { // Loop through columns
        drawCell(x, y, map[x][y]); // Draw each cell
      }
    }
  }

  // Draw the end flag if no sprite is provided
  function drawEndFlag() {
    var coord = Maze.endCoord(); // Get end coordinates
    var gridSize = 4; // Size of the grid for the flag
    var fraction = cellSize / gridSize - 2; // Size of each square in the flag
    var colorSwap = true; // Flag to alternate colors
    for (let y = 0; y < gridSize; y++) { // Loop through rows
      if (gridSize % 2 == 0) { // If grid size is even
        colorSwap = !colorSwap; // Swap color flag
      }
      for (let x = 0; x < gridSize; x++) { // Loop through columns
        ctx.beginPath(); // Begin drawing path
        ctx.rect( // Draw a rectangle
          coord.x * cellSize + x * fraction + 4.5,
          coord.y * cellSize + y * fraction + 4.5,
          fraction,
          fraction
        );
        if (colorSwap) { // If color swap flag is true
          ctx.fillStyle = "rgba(0, 0, 0, 0.8)"; // Set fill color to black
        } else {
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)"; // Set fill color to white
        }
        ctx.fill(); // Fill the rectangle
        colorSwap = !colorSwap; // Swap color flag
      }
    }
  }

  // Draw the end sprite
  function drawEndSprite() {
    var offsetLeft = cellSize / 50; // Left offset
    var offsetRight = cellSize / 25; // Right offset
    var coord = Maze.endCoord(); // Get end coordinates
    ctx.drawImage( // Draw the sprite
      endSprite,
      2,
      2,
      endSprite.width,
      endSprite.height,
      coord.x * cellSize + offsetLeft,
      coord.y * cellSize + offsetLeft,
      cellSize - offsetRight,
      cellSize - offsetRight
    );
  }

  // Clear the canvas
  function clear() {
    var canvasSize = cellSize * map.length; // Calculate canvas size
    ctx.clearRect(0, 0, canvasSize, canvasSize); // Clear the entire canvas
  }

  // Initialize the maze drawing
  if (endSprite != null) { // If end sprite is provided
    drawEndMethod = drawEndSprite; // Set end drawing method to sprite
  } else {
    drawEndMethod = drawEndFlag; // Set end drawing method to flag
  }
  clear(); // Clear the canvas
  drawMap(); // Draw the maze
  drawEndMethod(); // Draw the end point
}

// Player constructor
function Player(maze, c, _cellsize, onComplete, sprite = null) {
  var ctx = c.getContext("2d"); // Get canvas context
  var drawSprite; // Function to draw the sprite
  var moves = 0; // Move counter
  drawSprite = drawSpriteCircle; // Default to circle sprite
  if (sprite != null) { // If sprite is provided
    drawSprite = drawSpriteImg; // Use image sprite
  }
  var player = this; // Reference to player object
  var map = maze.map(); // Get maze map
  var cellCoords = { // Starting cell coordinates
    x: maze.startCoord().x,
    y: maze.startCoord().y
  };
  var cellSize = _cellsize; // Cell size
  var halfCellSize = cellSize / 2; // Half cell size

  this.redrawPlayer = function (_cellsize) { // Method to redraw player
    cellSize = _cellsize; // Update cell size
    drawSpriteImg(cellCoords); // Redraw player sprite
  };

  // Draw player as a circle if no sprite is provided
  function drawSpriteCircle(coord) {
    ctx.beginPath(); // Begin drawing path
    ctx.fillStyle = "yellow"; // Set fill color to yellow
    ctx.arc( // Draw a circle
      (coord.x + 1) * cellSize - halfCellSize,
      (coord.y + 1) * cellSize - halfCellSize,
      halfCellSize - 2,
      0,
      2 * Math.PI
    );
    ctx.fill(); // Fill the circle
    if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) { // If at end point
      onComplete(moves); // Call completion callback
      player.unbindKeyDown(); // Unbind key events
    }
  }

  // Draw player using the provided sprite
  function drawSpriteImg(coord) {
    var offsetLeft = cellSize / 50; // Left offset
    var offsetRight = cellSize / 25; // Right offset
    ctx.drawImage( // Draw the sprite
      sprite,
      0,
      0,
      sprite.width,
      sprite.height,
      coord.x * cellSize + offsetLeft,
      coord.y * cellSize + offsetLeft,
      cellSize - offsetRight,
      cellSize - offsetRight
    );
    if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) { // If at end point
      onComplete(moves); // Call completion callback
      player.unbindKeyDown(); // Unbind key events
    }
  }

  // Remove the player sprite from its current position
  function removeSprite(coord) {
    var offsetLeft = cellSize / 50; // Left offset
    var offsetRight = cellSize / 25; // Right offset
    ctx.clearRect( // Clear the sprite
      coord.x * cellSize + offsetLeft,
      coord.y * cellSize + offsetLeft,
      cellSize - offsetRight,
      cellSize - offsetRight
    );
  }

  // Check for valid moves and update player position
  function check(e) {
    var cell = map[cellCoords.x][cellCoords.y];
    moves++;
    switch (e.keyCode) {
      case 65:
      case 37: // west
        if (cell.w == true) {
          removeSprite(cellCoords);
          cellCoords = {
            x: cellCoords.x - 1,
            y: cellCoords.y
          };
          drawSprite(cellCoords);
        }
        break;
      case 87:
      case 38: // north
        if (cell.n == true) {
          removeSprite(cellCoords);
          cellCoords = {
            x: cellCoords.x,
            y: cellCoords.y - 1
          };
          drawSprite(cellCoords);
        }
        break;
      case 68:
      case 39: // east
        if (cell.e == true) {
          removeSprite(cellCoords);
          cellCoords = {
            x: cellCoords.x + 1,
            y: cellCoords.y
          };
          drawSprite(cellCoords);
        }
        break;
      case 83:
      case 40: // south
        if (cell.s == true) {
          removeSprite(cellCoords);
          cellCoords = {
            x: cellCoords.x,
            y: cellCoords.y + 1
          };
          drawSprite(cellCoords);
        }
        break;
    }
  }

  // Bind keyboard and touch events
  this.bindKeyDown = function () {
    window.addEventListener("keydown", check, false);

    const view = document.getElementById("view");
    let touchStartX, touchStartY;

    view.addEventListener("touchstart", function (event) {
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
    }, false);

    view.addEventListener("touchend", function (event) {
      if (!touchStartX || !touchStartY) {
        return;
      }

      let touchEndX = event.changedTouches[0].clientX;
      let touchEndY = event.changedTouches[0].clientY;

      let dx = touchEndX - touchStartX;
      let dy = touchEndY - touchStartY;

      // Determine the direction of the swipe
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) {
          check({ keyCode: 39 }); // right
        } else {
          check({ keyCode: 37 }); // left
        }
      } else {
        if (dy > 0) {
          check({ keyCode: 40 }); // down
        } else {
          check({ keyCode: 38 }); // up
        }
      }

      touchStartX = null;
      touchStartY = null;
    }, false);
  };

  // Unbind keyboard and touch events
  this.unbindKeyDown = function () {
    window.removeEventListener("keydown", check, false);
    const view = document.getElementById("view");
    view.removeEventListener("touchstart", null, false);
    view.removeEventListener("touchend", null, false);
  };

  // Initialize the player
  drawSprite(maze.startCoord());
  this.bindKeyDown();
}

// Global variables
var mazeCanvas = document.getElementById("mazeCanvas");
var ctx = mazeCanvas.getContext("2d");
var sprite;
var finishSprite;
var maze, draw, player;
var cellSize;
var difficulty;

// Initialize the game when the window loads
window.onload = function () {
  const view = document.getElementById("view");
  let viewWidth = view.offsetWidth;
  let viewHeight = view.offsetHeight;
  if (viewHeight < viewWidth) {
    ctx.canvas.width = viewHeight - viewHeight / 100;
    ctx.canvas.height = viewHeight - viewHeight / 100;
  } else {
    ctx.canvas.width = viewWidth - viewWidth / 100;
    ctx.canvas.height = viewWidth - viewWidth / 100;
  }

  // Load and edit sprites
  var completeOne = false;
  var completeTwo = false;
  var isComplete = () => {
    if (completeOne === true && completeTwo === true) {
      console.log("Runs");
      setTimeout(function () {
        makeMaze();
      }, 500);
    }
  };
  sprite = new Image();
  sprite.src =
    "./key.png" +
    "?" +
    new Date().getTime();
  sprite.setAttribute("crossOrigin", " ");
  sprite.onload = function () {
    sprite = changeBrightness(1.2, sprite);
    completeOne = true;
    console.log(completeOne);
    isComplete();
  };

  finishSprite = new Image();
  finishSprite.src = "./home.png" +
    "?" +
    new Date().getTime();
  finishSprite.setAttribute("crossOrigin", " ");
  finishSprite.onload = function () {
    finishSprite = changeBrightness(1.1, finishSprite);
    completeTwo = true;
    console.log(completeTwo);
    isComplete();
  };
};

// Adjust the maze size when the window is resized
window.onresize = function () {
  const view = document.getElementById("view");
  let viewWidth = view.offsetWidth;
  let viewHeight = view.offsetHeight;
  if (viewHeight < viewWidth) {
    ctx.canvas.width = viewHeight - viewHeight / 100;
    ctx.canvas.height = viewHeight - viewHeight / 100;
  } else {
    ctx.canvas.width = viewWidth - viewWidth / 100;
    ctx.canvas.height = viewWidth - viewWidth / 100;
  }
  cellSize = mazeCanvas.width / difficulty;
  if (player != null) {
    draw.redrawMaze(cellSize);
    player.redrawPlayer(cellSize);
  }
};

// Create a new maze
function makeMaze() {
  if (player != undefined) {
    player.unbindKeyDown();
    player = null;
  }
  var e = document.getElementById("diffSelect");
  difficulty = e.options[e.selectedIndex].value;
  cellSize = mazeCanvas.width / difficulty;
  maze = new Maze(difficulty, difficulty);
  draw = new DrawMaze(maze, ctx, cellSize, finishSprite);
  player = new Player(maze, mazeCanvas, cellSize, displayVictoryMess, sprite);
  if (document.getElementById("mazeContainer").style.opacity < "100") {
    document.getElementById("mazeContainer").style.opacity = "100";
  }
}