let array = [];
let delay = 50;
let isSorting = false;

const container = document.getElementById('array');
const sizeSlider = document.getElementById('sizeSlider');
const speedSlider = document.getElementById('speedSlider');
const algoSelect = document.getElementById('algoSelect');
const randomizeBtn = document.getElementById('randomizeBtn');
const sortBtn = document.getElementById('sortBtn');
const sizeValue = document.getElementById('sizeValue');
const speedValue = document.getElementById('speedValue');

// Update displayed values for sliders
sizeSlider.addEventListener('input', () => {
    sizeValue.textContent = sizeSlider.value;
    if (!isSorting) generateArray();
});

speedSlider.addEventListener('input', () => {
    speedValue.textContent = speedSlider.value;
    delay = 101 - speedSlider.value;
});

// Button event listeners
randomizeBtn.addEventListener('click', generateArray);
sortBtn.addEventListener('click', async () => {
    if (isSorting) return;
    isSorting = true;
    sortBtn.disabled = true;
    sortBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sorting...';
    
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
        sortBtn.innerHTML = '<i class="fas fa-play"></i> Sort';
        highlightComplete();
    }
});

function generateArray() {
    array = [];
    container.innerHTML = "";
    const size = sizeSlider.value;
    const containerWidth = container.clientWidth;
    const barWidth = Math.max(2, Math.floor(containerWidth / size) - 2);
    
    for (let i = 0; i < size; i++) {
        const value = Math.floor(Math.random() * 380) + 20; // Adjusted for better visualization
        array.push(value);
        const bar = document.createElement('div');
        bar.style.height = `${value}px`;
        bar.style.width = `${barWidth}px`;
        bar.classList.add('bar');
        container.appendChild(bar);
    }
}

function highlightComplete() {
    const bars = document.getElementsByClassName('bar');
    for (let i = 0; i < bars.length; i++) {
        setTimeout(() => {
            bars[i].style.backgroundColor = '#4caf50';
            bars[i].style.boxShadow = '0 0 10px #4caf50';
        }, i * 20);
    }
    
    setTimeout(() => {
        for (let i = 0; i < bars.length; i++) {
            bars[i].style.boxShadow = 'none';
        }
    }, bars.length * 20 + 1000);
}

async function bubbleSort() {
    const bars = document.getElementsByClassName('bar');
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            bars[j].style.backgroundColor = "#ff5a5f";
            bars[j + 1].style.backgroundColor = "#ff5a5f";
            
            if (array[j] > array[j + 1]) {
                await new Promise(r => setTimeout(r, delay));
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                bars[j].style.height = `${array[j]}px`;
                bars[j + 1].style.height = `${array[j + 1]}px`;
            }
            
            bars[j].style.backgroundColor = "#3a86ff";
            bars[j + 1].style.backgroundColor = "#3a86ff";
        }
        bars[array.length - i - 1].style.backgroundColor = "#4caf50";
    }
}

async function selectionSort() {
    const bars = document.getElementsByClassName('bar');
    for (let i = 0; i < array.length; i++) {
        let minIndex = i;
        bars[minIndex].style.backgroundColor = "#ffbe0b";
        
        for (let j = i + 1; j < array.length; j++) {
            bars[j].style.backgroundColor = "#00bbf9";
            await new Promise(r => setTimeout(r, delay));
            
            if (array[j] < array[minIndex]) {
                bars[minIndex].style.backgroundColor = "#3a86ff";
                minIndex = j;
                bars[minIndex].style.backgroundColor = "#ffbe0b";
            } else {
                bars[j].style.backgroundColor = "#3a86ff";
            }
        }
        
        if (minIndex !== i) {
            await new Promise(r => setTimeout(r, delay));
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
            bars[i].style.height = `${array[i]}px`;
            bars[minIndex].style.height = `${array[minIndex]}px`;
        }
        
        bars[i].style.backgroundColor = "#4caf50";
    }
}

async function insertionSort() {
    const bars = document.getElementsByClassName('bar');
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        bars[i].style.backgroundColor = "#00bbf9";
        
        while (j >= 0 && array[j] > key) {
            bars[j].style.backgroundColor = "#ff5a5f";
            await new Promise(r => setTimeout(r, delay));
            array[j + 1] = array[j];
            bars[j + 1].style.height = `${array[j + 1]}px`;
            bars[j].style.backgroundColor = "#3a86ff";
            j = j - 1;
        }
        
        array[j + 1] = key;
        bars[j + 1].style.height = `${array[j + 1]}px`;
        bars[j + 1].style.backgroundColor = "#3a86ff";
    }
    
    for (let i = 0; i < bars.length; i++) {
        bars[i].style.backgroundColor = "#4caf50";
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
        bars[k].style.backgroundColor = "#8338ec";
        await new Promise(r => setTimeout(r, delay));
        
        if (left[i] <= right[j]) {
            array[k] = left[i++];
        } else {
            array[k] = right[j++];
        }
        
        bars[k].style.height = `${array[k]}px`;
        bars[k].style.backgroundColor = "#3a86ff";
        k++;
    }

    while (i < left.length) {
        bars[k].style.backgroundColor = "#8338ec";
        await new Promise(r => setTimeout(r, delay));
        array[k] = left[i++];
        bars[k].style.height = `${array[k]}px`;
        bars[k].style.backgroundColor = "#3a86ff";
        k++;
    }

    while (j < right.length) {
        bars[k].style.backgroundColor = "#8338ec";
        await new Promise(r => setTimeout(r, delay));
        array[k] = right[j++];
        bars[k].style.height = `${array[k]}px`;
        bars[k].style.backgroundColor = "#3a86ff";
        k++;
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
    bars[high].style.backgroundColor = "#4caf50";
    let i = low - 1;

    for (let j = low; j <= high - 1; j++) {
        bars[j].style.backgroundColor = "#ffbe0b";
        await new Promise(r => setTimeout(r, delay));
        
        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
            bars[i].style.height = `${array[i]}px`;
            bars[j].style.height = `${array[j]}px`;
        }
        
        bars[j].style.backgroundColor = "#3a86ff";
    }
    
    await new Promise(r => setTimeout(r, delay));
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    bars[i + 1].style.height = `${array[i + 1]}px`;
    bars[high].style.height = `${array[high]}px`;
    bars[i + 1].style.backgroundColor = "#4caf50";
    bars[high].style.backgroundColor = "#3a86ff";
    
    return i + 1;
}

// Initialize
generateArray();