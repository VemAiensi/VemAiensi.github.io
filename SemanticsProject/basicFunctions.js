//Variable pool
let openFileButton = document.getElementById('opnButton');
let lexemeButton = document.getElementById('lxmButton');
let syntaxButton = document.getElementById('stxButton');
let smnticButton = document.getElementById('stcButton');
let clearButton = document.getElementById('clrButton');

let codeForAnalysis = document.getElementById('codeForAnalysis');
let resultOutput = document.getElementById('resultOutput');
let tokens = [];
let fileContents = [];
let contents = "";



//textHandlers
function handleTextareaInput(textarea) 
{
    if (textarea.value.trim() === '') 
    {
        openFileButton.disabled = false;
        clearButton.disabled = true;
        lexemeButton.disabled = true;
        syntaxButton.disabled = true;
        smnticButton.disabled = true;
        resultOutput.innerText = 'Waiting for input!';
    } 
    else 
    {
        openFileButton.disabled = true;
        clearButton.disabled = false;
        lexemeButton.disabled = false;
        syntaxButton.disabled = true;
        smnticButton.disabled = true;
        resultOutput.innerText = 'Ready for analysis!';
    }
}

function loadFile() 
{
    var fileInput = document.getElementById('fileInput');
    var file = fileInput.files[0];
    console.log(typeof file)
    if (file) 
    {
        var reader = new FileReader();

        reader.onload = function (e) 
        {
            // Set the content of the textarea with the file content
            codeForAnalysis.value = e.target.result;
            
            // Trigger the input event manually to update button states
            handleTextareaInput(codeForAnalysis);
        };

        reader.readAsText(file);
    }
}

function clearTextArea() 
{
    // Clear the text area
    codeForAnalysis.value = '';

    // Update the result text
    resultOutput.innerText = 'Waiting for input!';

    // Enable the "Open File" button
    openFileButton.disabled = false;

    // Disable all other buttons
    lexemeButton.disabled = true;
    syntaxButton.disabled = true;
    smnticButton.disabled = true;
    clearButton.disabled = true;

    //Enable typing
    codeForAnalysis.readOnly = false;

    tokens = [];
    fileContents = [];
    contents = "";
}

//input processors
function analyzeLexeme() 
{
    fileContents = codeForAnalysis.value.split("\n");
    codeForAnalysis.readOnly = true;
    const dataTypes = ["int", "double", "char", "String", "boolean"];
    const symbols = ["="];
    const delimiter = [";"];
    const bools = ["true", "false"];

    const identifierPattern = /[a-zA-Z_][a-zA-Z0-9_]*/g;
    const valuePattern = /"(?:[^"\\]|\\.)*"|'[^']*'|\b(?:true|false|\d+(?:\.\d+)?)\b/g;
    const stringLiteralPattern = /"[^"]*"/g;

    let output = [];

    let pattern = new RegExp(`(${identifierPattern.source}|${valuePattern.source}|${stringLiteralPattern.source}|.)`, "g");

    for (let statement of fileContents) 
    {
        const matcher = Array.from(statement.matchAll(pattern));
        let statementOutput = "";
        for (let match of matcher) 
        {
            let lexeme = match[0];
            if (isInArray(lexeme, dataTypes)) 
            {
                statementOutput += "<data_type> ";
            } 
            else if (isInArray(lexeme, symbols)) 
            {
                statementOutput += "<assignment_operator> ";
            } 
            else if (isInArray(lexeme, bools)) 
            {
                statementOutput += "<value> ";
            } 
            else if (lexeme.match(identifierPattern)) 
            {
                statementOutput += "<identifier> ";
            } 
            else if (lexeme.match(stringLiteralPattern))
            {
                statementOutput += "<value> ";
            } 
            else if (lexeme.match(valuePattern)) 
            {
                statementOutput += "<value> ";
            } 
            else if (isInArray(lexeme, delimiter)) 
            {
                statementOutput += "<delimiter> ";
            }
        }
        tokens.push(statementOutput.trim());
    }
    contents = convertListToString(tokens);
    resultOutput.innerText = contents;

    if(resultOutput.innerText != '')
    {
        openFileButton.disabled = true;
        lexemeButton.disabled = true;
        syntaxButton.disabled = false;
        smnticButton.disabled = true;
        clearButton.disabled = false;
    }
}

function isInArray(target, array) 
{
    return array.includes(target);
}

function convertListToString(list)
{
    return list.join("\n");
}

function analyzeSyntax()
{
    const expected = "<data_type> <identifier> <assignment_operator> <value> <delimiter>";

    for (let line of tokens)
    {
        if (line.trim() != expected)
        {
            resultOutput.innerText = 'Syntax is Incorrect: Try Again!';
        }
        else
        {
            resultOutput.innerText = 'Syntax is Correct: Passed!';
        }
    }

    if(resultOutput.innerText === 'Syntax is Correct: Passed!')
    {
        openFileButton.disabled = true;
        lexemeButton.disabled = true;
        syntaxButton.disabled = true;
        smnticButton.disabled = false;
        clearButton.disabled = false;
    }
    else if(resultOutput.innerText === 'Syntax is Incorrect: Try Again!')
    {
        openFileButton.disabled = true;
        lexemeButton.disabled = true;
        syntaxButton.disabled = true;
        smnticButton.disabled = true;
        clearButton.disabled = false;
    }
}

function analyzeSmntix()
{
    let allCorrect = true;

    for (let line of fileContents)
    {
        if (smntixSingleLine(line) === false)
        {
            resultOutput.innerText = 'Semantically Incorrect: Try Again!';
            break;
        }
        resultOutput.innerText = 'Semantically Correct: Passed!';
    }

    if(resultOutput.innerText === 'Semantically Correct: Passed!')
    {
        openFileButton.disabled = true;
        lexemeButton.disabled = true;
        syntaxButton.disabled = true;
        smnticButton.disabled = true;
        clearButton.disabled = false;
    }
}

function smntixSingleLine(line)
{
    let status;
    line = line.trim();

    if (!line.endsWith(';'))
    {
        status = false;
        return status;
    }
    line = line.substring(0, line.length - 1);
    let lineParts = line.split("=");

    if (lineParts.length != 2)
    {
        status = false;
        return status;
    }

    let declaration = lineParts[0].trim();
    let value = lineParts[1].trim();

    let declarationParts = declaration.split(" ");

    if (declarationParts.length != 2)
    {
        status = false;
        return status;
    }

    let dataType = declarationParts[0];

    if (dataType === "int")
    {
        try 
        {
            parseInt(value);
            status = true;
        } 
        catch (e) 
        {
            if (e instanceof TypeError || e instanceof RangeError) 
            {
                status = false;
            }
        }
    }
    else if (dataType === "double")
    {
        try
        {
            parseFloat(value);
            status = true;
        }
        catch (e)
        {
            if (e instanceof TypeError || e instanceof RangeError) 
            {
                status = false;
            }
        }
    }
    else if (dataType === "String") 
    {
        if (value.startsWith("\"") && value.endsWith("\"")) 
        {
            status = true;
        } 
        else 
        {
            status = false;
        }
    }
    else if (dataType === "boolean")
    {
        if (value === "true" || value === "false")
        {
            status = true;
        } 
        else 
        {
            status = false;
        }
    }
    else if (dataType === "char")
    {
        if (value.startsWith("\'") && value.endsWith("\'") && value.length == 3) 
        {
            status = true;
        } 
        else 
        {
            status = false;
        }
    }
    else
    {
        status = false;
    }
    return status;
}