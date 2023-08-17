export const createBoard = (rows, cols) => {
    let board = [];
  
    for (let i = 0; i < rows * cols; i++) {
      board.push(0);
    }
    return board;
  };
  
  export const getRandomIndex = (rows, cols) => {
    const index = Math.floor(Math.random() * rows * cols);
    return index;
  };
  
  export const generateMineIndices = (rows, cols, mines) => {
    let mineIndices = [];
  
    while (mineIndices.length < mines) {
      let mineIdx = getRandomIndex(rows * cols);
  
      if (!mineIndices.includes(mineIdx)) {
        mineIndices.push(mineIdx);
      }
    }
  
    return mineIndices;
  };
  
  export const cellIndex = (rowIndex, colIndex, rows, cols) => {
    if (rowIndex < 0 || rowIndex >= rows || colIndex < 0 || colIndex >= cols) {
      return null;
    }
    const cellIdx = rowIndex * cols + colIndex;
    return cellIdx;
  };
  
  export const fillMines = (mineIndices, board, rows, cols) => {
    for (let i = 0; i < mineIndices.length; i++) {
      let mineIdx = mineIndices[i];
      board[mineIdx] = 10; // += 10??
      incrementNeighbors(mineIdx, board, rows, cols);
    }
    return board;
  };
  
  export const incrementNeighbors = (mineIdx, board, rows, cols) => {
    let neighbors = getNeighborsIdx(mineIdx, rows, cols);
    for (let i = 0; i < neighbors.length; i++) {
      let idx = neighbors[i];
      if (typeof board[idx] === 'number') {
        board[idx] += 1;
      }
    }
    return board;
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
      southwest: cellIndex(rowIdx + 1, colIdx - 1, rows, cols),
    };
  
    return Object.values(neighbors);
  };
  
  export const initialize = (rows, cols, mines) => {
    let board = createBoard(rows, cols);
    let mineIndices = generateMineIndices(rows, cols, mines);
    board = fillMines(mineIndices, board, rows, cols, mines);
    return board;
  };
  