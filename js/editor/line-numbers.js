let lines = 1
let linesArray = [1]

let lineContainer = document.getElementById('line-numbers-container')

// Initialize with the first line
const orLine = document.createElement("SPAN")
orLine.innerText = 1;
lineContainer.appendChild(orLine);

export function lineCal() {
    const keySection = document.querySelector('#code-editor');
    
    if (!keySection) {
        console.warn('Editor element not found');
        return;
    }

    lines = lines + 1;
    linesArray.push(lines);
    
    // Update line numbers after modifying the array
    updateLineNumbers();
}

export function lineDecal() {
    const keySection = document.querySelector('#code-editor');
    
    if (!keySection) {
        console.warn('Editor element not found');
        return;
    }

    if (lines > 1) { // Don't go below line 1
        lines = lines - 1;
        linesArray.pop();
    }
    
    // Update line numbers after modifying the array
    updateLineNumbers();
}

export function updateLineNumbers() {
    const lineContainer = document.getElementById('line-numbers-container');

    // Clear old line numbers
    lineContainer.innerHTML = '';

    // Add line numbers based on actual content
    for (let i = 1; i <= linesArray.length; i++) {
        const span = document.createElement('span');
        span.textContent = i;
        lineContainer.appendChild(span);
    }
}

/* export function lineCalculate() {
    const keySection = document.querySelector('#code-editor');
    if (!keySection) {
        console.warn('Editor element not found');
        return;
    }

    const content = keySection.innerText || '';
    const lines = content.split('\n').length;

    console.log(`Number of lines: ${lines}`);
} */
