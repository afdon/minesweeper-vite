export const createBoard = (rows, cols) => {
    let board = [];
  
    for (let i = 0; i < rows * cols; i++) {
      board.push(0);
    }
    return board;
  };
  
  export const getRandomIndex = (totalCells) => {
    const index = Math.floor(Math.random() * totalCells);
    return index;
  };
  
  export const generateMineIndices = (numberOfMines, rows, cols) => {
    let totalCells = rows * cols;
    let mineIndices = [];
  
    while (mineIndices.length < numberOfMines) {
      let mineIdx = getRandomIndex(totalCells);
  
      if (!mineIndices.includes(mineIdx)) {
        mineIndices.push(mineIdx);
      }
    }
  
    return mineIndices;
  };
  
  // export const initialize = (settings) => {
  //   let board = createBoard(settings.numRows, settings.numCols);
  //   let mineIndices = generateMineIndices(
  //     settings.numMines,
  //     settings.numRows,
  //     settings.numCols
  //   );
  //   board = fillMines(mineIndices, board, settings);
  //   return board;
  // };
  