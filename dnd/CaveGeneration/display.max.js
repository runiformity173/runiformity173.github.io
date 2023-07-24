let MULT = 0;
let ONLY_LARGEST = false;
class matrix_element {
	constructor(row, col) {
		this.row = row;
		this.col = col;
	}
}
function largestConnectedArea(board) {
  let maxArea = 0;
  let maxRow = 0;
  let maxCol = 0;
  let stack = [];
  let count = 0;
  
  function traverse(row, col) {
    stack.push([row, col]);
    while (stack.length > 0) {
      let [r, c] = stack.pop();
      if (board[r][c] === 1) {
        board[r][c] = 2;
        count++;
        if (r > 0) stack.push([r-1, c]);
        if (r < board.length - 1) stack.push([r+1, c]);
        if (c > 0) stack.push([r, c-1]);
        if (c < board[0].length - 1) stack.push([r, c+1]);
      }
    }
  }
  
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (board[i][j] === 1) {
        count = 0;
        traverse(i, j);
        if (count > maxArea) {
          maxArea = count;
          maxRow = i;
          maxCol = j;
        }
      }
    }
  }
  
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (board[i][j] !== 2) {
        board[i][j] = 0;
      } else {
        board[i][j] = 1;
      }
    }
  }
  
  let queue = [[maxRow, maxCol]];
  board[maxRow][maxCol] = 3;
  
  while (queue.length > 0) {
    let [r, c] = queue.shift();
    if (r > 0 && board[r-1][c] === 1) {
      board[r-1][c] = 3;
      queue.push([r-1, c]);
    }
    if (r < board.length - 1 && board[r+1][c] === 1) {
      board[r+1][c] = 3;
      queue.push([r+1, c]);
    }
    if (c > 0 && board[r][c-1] === 1) {
      board[r][c-1] = 3;
      queue.push([r, c-1]);
    }
    if (c < board[0].length - 1 && board[r][c+1] === 1) {
      board[r][c+1] = 3;
      queue.push([r, c+1]);
    }
  }
  
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (board[i][j] !== 3) {
        board[i][j] = 0;
      } else {
        board[i][j] = 1;
      }
    }
  }
  
  return board;
}


function printDistance(arr2){
  if (true) {return [arr2, 1];}
  var arr = arr2.map(function(arr3) {return arr3.slice();});
	let Row_Count = arr.length;
	let Col_Count = arr[0].length;
	let q = [];
		for(let i = 0; i < Row_Count; i++){
		for(let j = 0; j < Col_Count; j++){
			if (arr[i][j] == 0)
				q.push(new matrix_element(i, j));
		}
	}
						let Queue_Size = q.length;
	for(let i = 0; i < Row_Count; i++)
	{
		for(let j = 0; j < Col_Count; j++)
		{
			let distance = 0;
			let min_distance = Number.MAX_VALUE;
			if (arr[i][j] == 1){
				for(let k = 0; k < Queue_Size; k++)
				{
					let One_Pos = q.shift();
					let One_Row = One_Pos.row;
					let One_Col = One_Pos.col;
					distance = (Math.pow(One_Row - i,2) + Math.pow(One_Col - j,2));
					min_distance = Math.min(min_distance, distance);
					if (min_distance == 1){
						arr[i][j] = 1;
						q.push(new matrix_element(One_Row, One_Col));
						break;
					}
					q.push(new matrix_element(One_Row,One_Col));
					arr[i][j] = Math.round(min_distance);
				}
			}
			else
				arr[i][j] = 0;
		}
	}
  var maxRow = arr.map(function(row){ return Math.max.apply(Math, row); });
var max = Math.max.apply(null, maxRow);
	return [arr,max];
}

function createPNG(colors){const canvas=document.createElement('canvas');canvas.width=colors[0].length;canvas.height=colors.length;const ctx=canvas.getContext('2d');const imageData=ctx.createImageData(canvas.width,canvas.height);for(let y=0;y<colors.length;y++){for(let x=0;x<colors[y].length;x++){const color=hexToRgb(colors[y][x]);const index=(y*canvas.width+x)*4;imageData.data[index]=color.r;imageData.data[index+1]=color.g;imageData.data[index+2]=color.b;imageData.data[index+3]=255;}}ctx.putImageData(imageData,0,0);const dataURL=canvas.toDataURL('image/png');return dataURL;}
function hexToRgb(hex1){const r=parseInt(hex1.substring(1,3),16);const g=parseInt(hex1.substring(3,5),16);const b=parseInt(hex1.substring(5,7),16);return{r,g,b};}

function blendHex(hex2, hex1, weight) {
  const r1 = parseInt(hex1.substring(0, 2), 16);
  const g1 = parseInt(hex1.substring(2, 4), 16);
  const b1 = parseInt(hex1.substring(4, 6), 16);
  const r2 = parseInt(hex2.substring(0, 2), 16);
  const g2 = parseInt(hex2.substring(2, 4), 16);
  const b2 = parseInt(hex2.substring(4, 6), 16);
  let r = Math.round((r1 * weight + r2 * (1 - weight)));
  let g = Math.round((g1 * weight + g2 * (1 - weight)));
  let b = Math.round((b1 * weight + b2 * (1 - weight)));
  r = r>255 ? 255 : r;
  g = g>255 ? 255 : g;
  b = b>255 ? 255 : b;
  const blendedHex = "#" +r.toString(16).padStart(2, "0") + g.toString(16).padStart(2, "0") + b.toString(16).padStart(2, "0");
  return blendedHex;
}

function display(board1) {
  let colors = [WALL];
  let b = JSON.parse(JSON.stringify(board1[0]));
  if (ONLY_LARGEST) {b = largestConnectedArea(b);}
  let max = board1[1];
  for (let i = 1; i < max+1; i++) {
    if (i <= MULT) {
    colors.push(blendHex(WALL.replace("#",""), FLOOR.replace("#",""), (i/MULT)));}
    else {colors.push(FLOOR);}
  }
  // document.getElementById('board-container').remove();
  // const container = document.createElement('div');
  // container.id = "board-container";
  // container.style.gridTemplateColumns = "repeat("+WIDTH+", "+(640/WIDTH)+"px)";
  // container.style.gridTemplateRows = "repeat("+HEIGHT+", "+(640/HEIGHT/(WIDTH/HEIGHT))+"px)";
  let board2 = b.map(function(a){return a.map(function(c){return colors[c]})})
  document.getElementById("output").src = createPNG(board2);
//   for (let row = 0; row < HEIGHT; row++) {
//     for (let col = 0; col < WIDTH; col++) {
//       // const cellElem = document.createElement('div');
//       // cellElem.style.backgroundColor = colors[b[row][col]];
//     container.innerHTML += ("<div style='background-color:"+colors[b[row][col]]+";'></div>");
//   }
// }
  // document.getElementById("container-container").appendChild(container);
}