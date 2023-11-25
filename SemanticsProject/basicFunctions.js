//Variable pool
let openFileButton = document.getElementById('opnButton');
let lexemeButton = document.getElementById('lxmButton');
let syntaxButton = document.getElementById('stxButton');
let smnticButton = document.getElementById('stcButton');
let clearButton = document.getElementById('clrButton');

let codeForAnalysis = document.getElementById('codeForAnalysis');
let resultOutput = document.getElementById('resultOutput');



//textHandlers
function handleTextareaInput(textarea) {
    if (textarea.value.trim() === '') {
        openFileButton.disabled = false;
        clearButton.disabled = true;
        lexemeButton.disabled = true;
        resultOutput.innerText = 'Waiting for input!';
    } else {
        openFileButton.disabled = true;
        clearButton.disabled = false;
        lexemeButton.disabled = false;
        resultOutput.innerText = 'Ready for analysis!';
    }
}

function loadFile() {
    var fileInput = document.getElementById('fileInput');
    var file = fileInput.files[0];
    console.log(typeof file)
    if (file) {
        var reader = new FileReader();

        reader.onload = function (e) {
            // Set the content of the textarea with the file content
            codeForAnalysis.value = e.target.result;
            
            // Trigger the input event manually to update button states
            handleTextareaInput(codeForAnalysis);
        };

        reader.readAsText(file);
    }
}

function clearTextArea() {
    // Clear the text area
    codeForAnalysis.value = '';

    // Update the result text
    resultOutput.innerText = 'Waiting for input!';

    // Enable the "Open File" button
    openFileButton.disabled = false;

    // Disable all other buttons
    lexemeButton.disabled = true;
    clearButton.disabled = true;
}

//input processors
function analyzeLexeme(){
    //translate the java code here

    resultOutput.innerText = 'Analyzed Tokens: Passed!';

    if(resultOutput.innerText === 'Analyzed Tokens: Passed!'){
        lexemeButton.disabled = true;
        syntaxButton.disabled = false;
    }
}

function analyzeSyntax(){
    //translate the java code here

    resultOutput.innerText = 'Syntax is Correct: Passed!';

    if(resultOutput.innerText === 'Syntax is Correct: Passed!'){
        syntaxButton.disabled = true;
        smnticButton.disabled = false;
    }
}

function analyzeSmntix(){
    //translate the java code here

    resultOutput.innerText = 'Semantically Correct: Passed!';

    if(resultOutput.innerText === 'Semantically Correct: Passed!'){
        smnticButton.disabled = true;
        openFileButton.disabled = false;
    }
}