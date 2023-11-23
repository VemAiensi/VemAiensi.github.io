// Place this in your script.js file or include it in your HTML file

function handleTextareaInput(textarea) {
    var openFileButton = document.getElementById('openFileButton');
    var lexemeButton = document.getElementById('lexemeButton');
    var clearButton = document.getElementById('clearButton');
    var resultOutput = document.getElementById('resultOutput');

    if (textarea.value.trim() === '') {
        openFileButton.disabled = false;
        lexemeButton.disabled = true;
        clearButton.disabled = true;
        resultOutput.innerText = 'Waiting for input!';
    } else {
        openFileButton.disabled = true;
        lexemeButton.disabled = false;
        clearButton.disabled = false;
        resultOutput.innerText = 'Ready for analysis!';
    }
}

function loadFile() {
    var fileInput = document.getElementById('fileInput');
    var codeForAnalysis = document.getElementById('codeForAnalysis');
    var resultOutput = document.getElementById('resultOutput');
    var openFileButton = document.getElementById('openFileButton');
    var lexemeButton = document.getElementById('lexemeButton');
    var clearButton = document.getElementById('clearButton');

    var file = fileInput.files[0];

    if (file) {
        var reader = new FileReader();

        reader.onload = function (e) {
            // Set the content of the textarea with the file content
            codeForAnalysis.value = e.target.result;

            // Trigger the input event manually to update button states
            handleTextareaInput(codeForAnalysis);

            // Additional step to ensure resultOutput is updated
            resultOutput.innerText = 'Ready for analysis!';
        };

        reader.readAsText(file);
    }
}

function clearTextArea() {
    var codeForAnalysis = document.getElementById('codeForAnalysis');
    var resultOutput = document.getElementById('resultOutput');
    var openFileButton = document.getElementById('openFileButton');
    var lexemeButton = document.getElementById('lexemeButton');
    var clearButton = document.getElementById('clearButton');

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
