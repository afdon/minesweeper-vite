// export const createBoard = (rows, cols) => {
//   let board = [];

//   for (let i = 0; i < rows * cols; i++) {
//     board.push(0);
//   }
//   return board;
// };

// const cellIndex = (rowIndex, colIndex, rows, cols) => {
//   if (rowIndex < 0 || rowIndex >= rows || colIndex < 0 || colIndex >= cols) {
//     return null;
//   }
//   const cellIdx = rowIndex * cols + colIndex;
//   return cellIdx;
// };

// export const getRandomIndex = (totalCells) => {
//   const index = Math.floor(Math.random() * totalCells);
//   return index;
// };

// export const generateMineIndices = (numberOfMines, rows, cols) => {
//   let totalCells = rows * cols;
//   let mineIndices = [];

//   while (mineIndices.length < numberOfMines) {
//     let mineIdx = getRandomIndex(totalCells);

//     if (!mineIndices.includes(mineIdx)) {
//       mineIndices.push(mineIdx);
//     }
//   }

//   return mineIndices;
// };

// export const fillMines = (mineIndices, board, settings) => {
//   for (let i = 0; i < mineIndices.length; i++) {
//     let mineIdx = mineIndices[i];
//     board[mineIdx] = 10; // += 10??
//     incrementNeighbors(mineIdx, board, settings);
//   }
//   return board;
// };

// export const incrementNeighbors = (mineIdx, board, settings) => {
//   let neighbors = getNeighborsIdx(mineIdx, settings.numRows, settings.numCols);
//   for (let i = 0; i < neighbors.length; i++) {
//     let idx = neighbors[i];
//     if (typeof board[idx] === 'number') {
//       board[idx] += 1;
//     }
//   }
//   return board;
// };

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
  
  export const findConnectedCellsToReveal = (index, board) => {
    let queue = [index];
    let visited = [];
    let cellsToReveal = [];
  
    let counter = 0;
  
    while (queue.length > 0 && counter < rows * cols) {
      counter++;
      let curCell = queue.shift();
  
      if (board[curCell] === 0) {
        let neighbors = getNeighborsIdx(curCell, rows, cols).slice(0, 4);
        neighbors.forEach((n) => {
          cellsToReveal.push(n);
  
          if (n !== null && !visited.includes(n) && board[n] === 0) {
            visited.push(n);
            queue.push(n);
          }
        });
      }
    }
  
    return cellsToReveal;
  };
  
  export const handleCellClick = (index, rows, cols) => {
    let newCellView;
  
    if (values[index] >= 10) {
      setGameState('lost');
      newCellView = new Array(rows * cols).fill({
        revealed: true,
        flagged: false,
      });
    } else {
      newCellView = [...cellView];
      const cellsToReveal = findConnectedCellsToReveal(index, values);
      cellsToReveal.forEach((c) => {
        newCellView[c][revealed] = true;
      });
      newCellView[index][revealed] = true;
    }
  
    setRevealedCells(newRevCells);
  };
  