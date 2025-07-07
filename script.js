let array = [];
let delay = 50;
let isSorting = false;
let comparisonCount = 0;
let swapCount = 0;

const container = document.getElementById('array');
const sizeSlider = document.getElementById('sizeSlider');
const speedSlider = document.getElementById('speedSlider');
const algoSelect = document.getElementById('algoSelect');
const randomizeBtn = document.getElementById('randomizeBtn');
const sortBtn = document.getElementById('sortBtn');
const sizeValue = document.getElementById('sizeValue');
const speedValue = document.getElementById('speedValue');
const comparisonDisplay = document.getElementById('comparisonCount');
const swapDisplay = document.getElementById('swapCount');
const algoDesc = document.getElementById('algoDesc');

const algoDescriptions = {
    bubble: "Bubble Sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.",
    selection: "Selection Sort repeatedly finds the minimum element from the unsorted part and puts it at the beginning.",
    insertion: "Insertion Sort builds the sorted array one item at a time by comparing and inserting elements into their correct position.",
    merge: "Merge Sort divides the array into halves, sorts each half, and merges them back together.",
    quick: "Quick Sort picks a pivot and partitions the array around the pivot, recursively sorting the subarrays."
};

// Update displayed values for sliders
sizeSlider.addEventListener('input', () => {
    sizeValue.textContent = sizeSlider.value;
    if (!isSorting) generateArray();
});
speedSlider.addEventListener('input', () => {
    speedValue.textContent = speedSlider.value;
    delay = 101 - speedSlider.value;
});

// Show algorithm description
algoSelect.addEventListener('change', () => {
    const desc = algoDescriptions[algoSelect.value] || "";
    algoDesc.textContent = desc;
});
algoDesc.textContent = algoDescriptions[algoSelect.value];

// Button event listeners
randomizeBtn.addEventListener('click', generateArray);
sortBtn.addEventListener('click', async () => {
    if (isSorting) return;
    isSorting = true;
    sortBtn.disabled = true;
    sortBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Sorting...';
    comparisonCount = 0;
    swapCount = 0;
    updateMetrics();
    try {
        const algorithm = algoSelect.value;
        switch (algorithm) {
            case "bubble": await bubbleSort(); break;
            case "selection": await selectionSort(); break;
            case "insertion": await insertionSort(); break;
            case "merge": await mergeSort(0, array.length - 1); break;
            case "quick": await quickSort(0, array.length - 1); break;
        }
    } catch (error) {
        console.error("Sorting error:", error);
    } finally {
        isSorting = false;
        sortBtn.disabled = false;
        sortBtn.innerHTML = '<i class="fa fa-play"></i> Sort';
        highlightComplete();
    }
});

function updateMetrics() {
    comparisonDisplay.textContent = comparisonCount;
    swapDisplay.textContent = swapCount;
}

function generateArray() {
    array = [];
    container.innerHTML = "";
    const size = sizeSlider.value;
    const containerWidth = container.clientWidth;
    const barWidth = Math.max(2, Math.floor(containerWidth / size) - 2);
    for (let i = 0; i < size; i++) {
        const value = Math.floor(Math.random() * 380) + 20;
        array.push(value);
        const bar = document.createElement('div');
        bar.style.height = `${value}px`;
        bar.style.width = `${barWidth}px`;
        bar.classList.add('bar');
        container.appendChild(bar);
    }
    updateMetrics();
}
function resetBarColors() {
    const bars = document.getElementsByClassName('bar');
    for (let bar of bars) {
        bar.className = 'bar';
    }
}
function highlightComplete() {
    const bars = document.getElementsByClassName('bar');
    for (let i = 0; i < bars.length; i++) {
        setTimeout(() => {
            bars[i].className = 'bar sorted';
        }, i * 10);
    }
}

// Sorting Algorithms with Visuals

async function bubbleSort() {
    const bars = document.getElementsByClassName('bar');
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            comparisonCount++;
            updateMetrics();
            bars[j].className = 'bar comparing';
            bars[j + 1].className = 'bar comparing';
            await sleep(delay);
            if (array[j] > array[j + 1]) {
                swapCount++;
                updateMetrics();
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                bars[j].style.height = `${array[j]}px`;
                bars[j + 1].style.height = `${array[j + 1]}px`;
                bars[j].className = 'bar swapping';
                bars[j + 1].className = 'bar swapping';
                await sleep(delay);
            }
            bars[j].className = 'bar';
            bars[j + 1].className = 'bar';
        }
        bars[array.length - i - 1].className = 'bar sorted';
    }
}

async function selectionSort() {
    const bars = document.getElementsByClassName('bar');
    for (let i = 0; i < array.length; i++) {
        let minIndex = i;
        bars[minIndex].className = 'bar key';
        for (let j = i + 1; j < array.length; j++) {
            comparisonCount++;
            updateMetrics();
            bars[j].className = 'bar comparing';
            await sleep(delay);
            if (array[j] < array[minIndex]) {
                if (minIndex !== i) bars[minIndex].className = 'bar';
                minIndex = j;
                bars[minIndex].className = 'bar key';
            } else {
                bars[j].className = 'bar';
            }
        }
        if (minIndex !== i) {
            swapCount++;
            updateMetrics();
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
            bars[i].style.height = `${array[i]}px`;
            bars[minIndex].style.height = `${array[minIndex]}px`;
            bars[i].className = 'bar swapping';
            bars[minIndex].className = 'bar swapping';
            await sleep(delay);
        }
        bars[i].className = 'bar sorted';
        if (minIndex !== i) bars[minIndex].className = 'bar';
    }
}

async function insertionSort() {
    const bars = document.getElementsByClassName('bar');
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        bars[i].className = 'bar key';
        await sleep(delay);
        while (j >= 0 && array[j] > key) {
            comparisonCount++;
            updateMetrics();
            bars[j].className = 'bar comparing';
            await sleep(delay);
            swapCount++;
            updateMetrics();
            array[j + 1] = array[j];
            bars[j + 1].style.height = `${array[j + 1]}px`;
            bars[j].className = 'bar';
            j = j - 1;
        }
        array[j + 1] = key;
        bars[j + 1].style.height = `${array[j + 1]}px`;
        bars[j + 1].className = 'bar key';
        await sleep(delay);
        for (let k = 0; k <= i; k++) {
            bars[k].className = 'bar sorted';
        }
    }
}

async function mergeSort(l, r) {
    if (l >= r) return;
    const m = l + Math.floor((r - l) / 2);
    await mergeSort(l, m);
    await mergeSort(m + 1, r);
    await merge(l, m, r);
}

async function merge(l, m, r) {
    const bars = document.getElementsByClassName('bar');
    let left = array.slice(l, m + 1);
    let right = array.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    while (i < left.length && j < right.length) {
        comparisonCount++;
        updateMetrics();
        bars[k].className = 'bar comparing';
        await sleep(delay);
        if (left[i] <= right[j]) {
            array[k] = left[i++];
        } else {
            array[k] = right[j++];
            swapCount++;
            updateMetrics();
        }
        bars[k].style.height = `${array[k]}px`;
        bars[k].className = 'bar';
        k++;
    }
    while (i < left.length) {
        bars[k].className = 'bar swapping';
        await sleep(delay);
        array[k] = left[i++];
        bars[k].style.height = `${array[k]}px`;
        bars[k].className = 'bar';
        k++;
        swapCount++;
        updateMetrics();
    }
    while (j < right.length) {
        bars[k].className = 'bar swapping';
        await sleep(delay);
        array[k] = right[j++];
        bars[k].style.height = `${array[k]}px`;
        bars[k].className = 'bar';
        k++;
        swapCount++;
        updateMetrics();
    }
    for (let idx = l; idx <= r; idx++) {
        bars[idx].className = 'bar sorted';
    }
}

async function quickSort(low, high) {
    if (low < high) {
        const pi = await partition(low, high);
        await quickSort(low, pi - 1);
        await quickSort(pi + 1, high);
    }
}

async function partition(low, high) {
    const bars = document.getElementsByClassName('bar');
    let pivot = array[high];
    bars[high].className = 'bar key';
    let i = low - 1;
    for (let j = low; j <= high - 1; j++) {
        comparisonCount++;
        updateMetrics();
        bars[j].className = 'bar comparing';
        await sleep(delay);
        if (array[j] < pivot) {
            i++;
            swapCount++;
            updateMetrics();
            [array[i], array[j]] = [array[j], array[i]];
            bars[i].style.height = `${array[i]}px`;
            bars[j].style.height = `${array[j]}px`;
            bars[i].className = 'bar swapping';
            bars[j].className = 'bar swapping';
            await sleep(delay);
        }
        bars[j].className = 'bar';
    }
    swapCount++;
    updateMetrics();
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    bars[i + 1].style.height = `${array[i + 1]}px`;
    bars[high].style.height = `${array[high]}px`;
    bars[i + 1].className = 'bar sorted';
    bars[high].className = 'bar';
    await sleep(delay);
    return i + 1;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Initialize
generateArray();
