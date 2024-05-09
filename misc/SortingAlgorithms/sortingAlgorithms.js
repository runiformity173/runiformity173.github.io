// Circle Sort
// Smooth Sort

function bubbleSort(arr) {
  let sorts = 1;
  while (sorts > 0) {
    sorts = 0;
    for (let i = 1;i<arr.length;i++) {
      if (arr[i] < arr[i-1]) {
        arr.swap(i,i-1);
        sorts++;
      }
    }
  }
}
function anytimeQuickSort(arr){
  const q = new PriorityQueue();
  q.push([arr.length,0,arr.length-1]);
  while (!q.isEmpty()) {
    let [s,start,end] = q.pop();
    if (start >= end) {
      continue;
    }
    var rStart = start, rEnd = end;
    var pivot = arr[Math.floor(Math.random() * (end - start + 1) + start)];
    while (start < end) {
      while (arr[start] <= pivot) start++;
      while (arr[end] > pivot) end--;
      if (start < end) {
        arr.swap(start,end);
      }
    }
    q.push([(start-1-rStart),rStart,start-1]);
    q.push([(rEnd-start),start,rEnd]);
  }
}
function quickSort(arr){
  let i = 0;
  const q = [];
  q.push([i++,0,arr.length-1]);
  while (q.length > 0) {
    let [s,start,end] = q.pop();
    if (start >= end) {
      continue;
    }
    var rStart = start, rEnd = end;
    var pivot = arr[Math.floor(Math.random() * (end - start + 1) + start)];
    while (start < end) {
      while (arr[start] <= pivot) start++;
      while (arr[end] > pivot) end--;
      if (start < end) {
        arr.swap(start,end);
      }
    }
    q.push([i++,start,rEnd]);
    q.push([i++,rStart,start-1]);
  }
}
function combSort(arr) {
  let length = arr.length;
  let shrink = 1.3;
  let gap = length;
  let sorted = false;
  while (!sorted) {
    gap = parseInt(gap/shrink);
    if (gap <= 1) {
      sorted = true;
      gap = 1;
  }
  for (let i = 0; i < length-gap; i++) {
    let sm = gap + i;
    if (arr[i] > arr[sm]) {
      arr.swap(i,sm)
      sorted = false;
      }
    }
  }
}

function oddEvenSort(list) {
  var sorted = false;
  while (!sorted) {
    sorted = true;
    for (var i = 1; i < list.length - 1; i += 2) {
      if (list[i] > list[i+1]) {
        list.swap(i,i+1);
        sorted = false;
      }
    }
    for (var i = 0; i < list.length - 1; i += 2) {
      if (list[i] > list[i+1]) {
        list.swap(i,i+1);
        sorted = false;
      }
    }
  }
}
function mergeSort(arr,oglow=0,oghigh=-1) {
  if (oghigh == -1) oghigh=arr.length-1;
  let high=oghigh, low=oglow;
  while (high-low > 0){
    mid = Math.floor((oghigh-oglow)/2) + oglow;
    mergeSort(arr,oglow,mid);
    mid = Math.floor((oghigh-oglow)/2) + oglow;
    mergeSort(arr,mid+1,oghigh);
    mid = Math.floor((oghigh-oglow)/2) + oglow;
    start2 = mid + 1;
    if (arr[mid] <= arr[start2]) {break;}
    while (low <= mid && start2 <= high) {
      if (arr[low] <= arr[start2]) low += 1;
      else {
        // value = arr[start2];
        // index = start2;
        // while (index != low) {
        //   // arr[index] = arr[index - 1];
        //   arr.swap(index,index-1);
        //   index -= 1;
        // }
        // // arr[low] = value;
        arr.shiftDown(low,start2);
        low += 1;
        mid += 1;
        start2 += 1;
      }
    }
    break;
  }
  return arr;
}
function cocktailShakerSort(nums) {
  let is_Sorted = true;
  while (is_Sorted) {
    for (let i = 0; i< nums.length - 1; i++) {
      if (nums[i] > nums[i + 1]) {
        nums.swap(i,i+1)
        is_Sorted = true;
      }
    }
    if (!is_Sorted) break;
    is_Sorted = false;
    for (let j = nums.length - 1; j > 0; j--) {
      if (nums[j-1] > nums[j]) {
        nums.swap(j,j-1);
        is_Sorted = true;
      }
    }
  }
}
function bitonicSort(arr) {
  let n = arr.length;
  let k, j, l, i, temp;
  for (k = 2; k <= n; k *= 2) {
    for (j = k/2; j > 0; j /= 2) {
      for (i = 0; i < n; i++) {
        l = i ^ j;
        if (l > i) {
          if ( ((i&k)==0) && (arr[i] > arr[l]) || ( ( (i&k)!=0) && (arr[i] < arr[l])) )  {
            arr.swap(i,l);
          }
        }
      }
    }
  }
}
function shellSort(arr) {
  let n = arr.length;
  for (let gap = Math.floor(n/2); gap > 0; gap = Math.floor(gap/2)) {
    for (let i = gap; i < n; i += 1)  {
      let temp = arr[i];

      let j;
      for (j = i; j >= gap && arr[j-gap] > temp; j-=gap)  {
        arr[j] = arr[j-gap];
      }
      arr[j] = temp;
    }
  }
  return arr;
}
function circleSortRec(a, low, high) {
  let swapped = false;
  if (low === high) {
    return false;
  }
  let lo = low, hi = high;
  while (lo < hi) {
    if (a[lo] > a[hi]) {
      a.swap(lo,hi);
      swapped = true;
    }
    lo++;
    hi--;
  }
  if (lo === hi) {
    if (a[lo] > a[hi + 1]) {
      a.swap(low,hi+1);
      swapped = true;
    }
  }
  let mid = Math.floor((high - low) / 2);
  let firstHalf = circleSortRec(a, low, low + mid);
  let secondHalf = circleSortRec(a, low + mid + 1, high);
  return swapped || firstHalf || secondHalf;
}
function circleSort(a) {
  c = 0;
  while (circleSortRec(a, 0, a.length-1) && c<20) {
    c+=1
  }
}
function heapify(arr, n, i) {
  let largest = i;
  const left = 2 * i + 2; // Changing the calculation for left child
  const right = 2 * i + 1; // Changing the calculation for right child
  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }
  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }
  if (largest !== i) {
    arr.swap(i, largest);
    heapify(arr, n, largest);
  }
}

function buildMaxHeap(arr) {
  const n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
}

function heapSort(arr) {
  buildMaxHeap(arr);
  for (let i = arr.length - 1; i > 0; i--) {
    arr.swap(0, i);
    heapify(arr, i, 0);
  }
  return arr;
}

const sortingAlgorithms = {
  "Bubble Sort":bubbleSort,
  "Quick Sort":quickSort,
  "Anytime Quick Sort":anytimeQuickSort,
  "Comb Sort":combSort,
  "Odd Even Sort":oddEvenSort,
  "Merge Sort":mergeSort,
  "Cocktail Shaker Sort":cocktailShakerSort,
  "Bitonic Sort":bitonicSort,
  "Circle Sort":circleSort,
  "Heap Sort":heapSort,

}
const badMethods = ["Bubble Sort","Cocktail Shaker Sort","Odd Even Sort"];