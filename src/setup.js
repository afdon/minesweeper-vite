
// export const SETTINGS = {
//     numMines: 25,
//     numRows: 16,
//     numCols: 30,
//   };
  
  // export const cellSize = `calc(100vmin / ${Math.max(SETTINGS.numRows, SETTINGS.numCols)})`;
  // export const cellSize = `${90 / (Math.max(SETTINGS.numRows, SETTINGS.numCols))})vmin`;


// export const start = {
//   initialize: initialize,
//   createBoard: createBoard,
//   generateMineIndices: generateMineIndices,
//   fillMines: fillMines,
// }
  
  let board = [];
  let mineIndices = [];
  
  export const createBoard = (rows, cols) => {
    for (let i = 0; i < rows * cols; i++) {
      board.push(0);
    }
    return board;
  };
  
  const cellIndex = (rowIndex, colIndex, rows, cols) => {
    if (rowIndex < 0 || rowIndex >= rows || colIndex < 0 || colIndex >= cols) {
      return null;
    }
    const cellIdx = rowIndex * cols + colIndex;
    return cellIdx;
  };
  
  export const getRandomIndex = (totalCells) => {
    const index = Math.floor(Math.random() * totalCells);
    return index;
  };
  
  export const generateMineIndices = (numberOfMines, rows, cols) => {
    let totalCells = rows * cols;
    let mineIndices = []
  
    while (mineIndices.length < numberOfMines) {
      let mineIdx = getRandomIndex(totalCells);
  
      if (!mineIndices.includes(mineIdx)) {
        mineIndices.push(mineIdx);
      }
    }
  
    return mineIndices;
  };
  
  export const fillMines = (mineIndices, board, settings) => {
    for (let i = 0; i < mineIndices.length; i++) {
      let mineIdx = mineIndices[i];
      board[mineIdx] += 10; // += 10??
  
      incrementNeighbors(mineIdx, settings.numRows, settings.numCols);
    }
    return board;
  };
  
  export const incrementNeighbors = (mineIdx, rows, cols) => {
    let neighbors = getNeighborsIdx(mineIdx, rows, cols);
    for (let i = 0; i < neighbors.length; i++) {
      let idx = neighbors[i];
      if (typeof board[idx] === "number") {
        board[idx]++;
      }
    }
  };
  
  export const getNeighborsIdx = (index, rows, cols) => {
    const rowIdx = Math.floor(index / cols);
    const colIdx = index % cols;
  
    const neighbors = {
      north: cellIndex(rowIdx - 1, colIdx, rows, cols),
      east: cellIndex(rowIdx, colIdx + 1, rows, cols),
      south: cellIndex(rowIdx + 1, colIdx, rows, cols),
      west: cellIndex(rowIdx, colIdx - 1, rows, cols),
      northeast: cellIndex(rowIdx - 1, colIdx + 1, rows, cols),
      northwest: cellIndex(rowIdx - 1, colIdx - 1, rows, cols),
      southeast: cellIndex(rowIdx + 1, colIdx + 1, rows, cols),
      southwest:  cellIndex(rowIdx + 1, colIdx - 1, rows, cols),
    };

    return Object.values(neighbors);
  };
  
  export const initialize = (settings) => {
    let board = createBoard(settings.numRows, settings.numCols);
    let mineIndices = generateMineIndices(
      settings.numMines,
      settings.numRows,
      settings.numCols
    );
    board = fillMines(mineIndices, board, settings);
    return board;
  };
  
  export const getDisplayValues = (array) => {
    return array.map((element) => {
      if (element === 0) { return "" } // blanks
      if (element >= 10) { return "💣" } // 💣 🍘
      if (element > 0 && element < 10) { return element } // adjacents
      // if (element < 0) { return "" } // hidden
      return element; // return the element as is if none of the conditions match
    });
  }
  
  export const findConnectedCellsToReveal = (index, board, settings) => {
      let queue = [index];
      let visited = [];
      let cellsToReveal = [];
  
      let counter = 0;
  
      while (queue.length > 0 && counter < settings.numRows * settings.numCols) {
          counter++;
          let curCell = queue.shift();
  
          if (board[curCell] === 0) {
              let neighbors = getNeighborsIdx(curCell, settings.numRows, settings.numCols).slice(0, 4);
              neighbors.forEach(n => {
                  cellsToReveal.push(n);
  
                  if (n !== null && !visited.includes(n) && board[n] === 0) {
                      visited.push(n);
                      queue.push(n);
                  }
              })
          }
      }
  
      return cellsToReveal;
  }