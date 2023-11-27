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

    //clear the file
    fileInput.value = '';

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

    //resets variables
    tokens = [];
    fileContents = [];
    contents = "";
}

//input processors
function analyzeLexeme() 
{
    //split code into an array by line
    fileContents = codeForAnalysis.value.split("\n");

    //diable typing and editing
    codeForAnalysis.readOnly = true;

    //things to check for
    const dataTypes = ["int", "double", "char", "String", "boolean"];
    const symbols = ["="];
    const delimiter = [";"];
    const bools = ["true", "false"];

    const identifierPattern = /[a-zA-Z_][a-zA-Z0-9_]*/g;
    const valuePattern = /"(?:[^"\\]|\\.)*"|'[^']*'|\b(?:true|false|\d+(?:\.\d+)?)\b/g;
    const stringLiteralPattern = /"[^"]*"/g;

    //token collector
    let output = [];

    //pattern checker
    let pattern = new RegExp(`(${identifierPattern.source}|${valuePattern.source}|${stringLiteralPattern.source}|.)`, "g");

    //check each array for their tokens
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
            else if (lexeme.match(stringLiteralPattern))
            {
                statementOutput += "<value> ";
            } 
            else if (lexeme.match(valuePattern)) 
            {
                statementOutput += "<value> ";
            } 
            else if (lexeme.match(identifierPattern)) 
            {
                statementOutput += "<identifier> ";
            } 
            else if (isInArray(lexeme, delimiter)) 
            {
                statementOutput += "<delimiter> ";
            }
        }
        //add the outputs into the tokens array
        tokens.push(statementOutput.trim());
    }
    //turn tokens array into a string to output
    contents = convertListToString(tokens);

    //output to result area
    resultOutput.innerText = contents;

    //disable and enable buttons/text fields
    if(resultOutput.innerText !== '')
    {
        openFileButton.disabled = true;
        lexemeButton.disabled = true;
        syntaxButton.disabled = false;
        smnticButton.disabled = true;
        clearButton.disabled = false;
    }
}

//checks if text matches the arrays
function isInArray(target, array) 
{
    return array.includes(target);
}

//turns list to string
function convertListToString(list)
{
    return list.join("\n");
}

function analyzeSyntax()
{
    //expected token sequence
    const expected = "<data_type> <identifier> <assignment_operator> <value> <delimiter>";

    //takes the sequence in the tokens and sees if all the syntax are correct
    for (let line of tokens)
    {
        if (line.trim() !== expected)
        {
            resultOutput.innerText = 'Syntax is Incorrect: Try Again!';
        }
        else
        {
            resultOutput.innerText = 'Syntax is Correct: Passed!';
        }
    }

    //disable and enable buttons/text fields
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
    //see if all lins are correct
    for (let line of fileContents)
    {
        if (smntixSingleLine(line) === false)
        {
            resultOutput.innerText = 'Semantically Incorrect: Try Again!';
            break;
        }
        resultOutput.innerText = 'Semantically Correct: Passed!';
    }

    //disable and enable buttons/text fields
    if(resultOutput.innerText === 'Semantically Correct: Passed!')
    {
        openFileButton.disabled = true;
        lexemeButton.disabled = true;
        syntaxButton.disabled = true;
        smnticButton.disabled = true;
        clearButton.disabled = false;
    }
}

//single line analysis
function smntixSingleLine(line)
{
    //initialize checker
    line = line.trim();

    //checks if the line end with ;
    if (!line.endsWith(';'))
    {
        return false;
    }

    //removes ;
    line = line.substring(0, line.length - 1);

    //split the line into two parts
    let lineParts = line.split("=");

    //checks if both sides of initialization exists
    if (lineParts.length !== 2)
    {
        return false;
    }

    let declaration = lineParts[0].trim();
    let value = lineParts[1].trim();

    //split declaration 
    let declarationParts = declaration.split(" ");

    //checks if both parts of declaration exists

    if (declarationParts.length !== 2)
    {
        return false;
    }

    let dataType = declarationParts[0];

    
    //checks for int by checking if it's an integer, not a string or a double
    if (dataType === "int") 
    {
        try 
        {
            let parsedValue = parseInt(value, 10);
            return !isNaN(parsedValue) && parsedValue.toString() === value.trim();
        } 
        catch (e) 
        {
            return false;
        }
    }
    //checks if the number if it's a valid number and not a string
    else if (dataType === "double")
    {
        try
        {
            let parsedValue = parseFloat(value);
            return !isNaN(parsedValue);
        }
        catch (e)
        {
            return false;
        }
    }
    //checks if double quotes exist
    else if (dataType === "String") 
    {
        if (value.startsWith("\"") && value.endsWith("\"")) 
        {
            return true;
        } 
        else 
        {
            return false;
        }
    }
    //checks if it's either true or false
    else if (dataType === "boolean")
    {
        if (value === "true" || value === "false")
        {
            return true;
        } 
        else 
        {
            return false;
        }
    }
    //checks if it ends with single quotes and only has one character inside
    else if (dataType === "char")
    {
        if (value.startsWith("\'") && value.endsWith("\'") && value.length === 3) 
        {
            return true;
        } 
        else 
        {
            return false;
        }
    }
    else
    {
        return false;
    }
}