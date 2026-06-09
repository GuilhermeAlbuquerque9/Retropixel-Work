function format(command){

    document.execCommand(
        command,
        false,
        null
    );

    updateStats();
}

function changeFont(){

    const font =
        document.getElementById(
            "fontName"
        ).value;

    document.execCommand(
        "fontName",
        false,
        font
    );
}

function changeSize(){

    const size =
        document.getElementById(
            "fontSize"
        ).value;

    document.execCommand(
        "fontSize",
        false,
        size
    );
}

function changeColor(){

    const color =
        document.getElementById(
            "textColor"
        ).value;

    document.execCommand(
        "foreColor",
        false,
        color
    );
}

function insertDate(){

    const date =
        new Date()
        .toLocaleString("pt-BR");

    document.execCommand(
        "insertText",
        false,
        date
    );

    updateStats();
}

function newDocument(){

    if(confirm(
        "Criar novo documento?"
    )){

        document
        .getElementById("editor")
        .innerHTML = "";

        updateStats();
    }
}

function saveDocument(){

    const text =
        document
        .getElementById("editor")
        .innerText;

    const blob =
        new Blob(
            [text],
            {type:"text/plain"}
        );

    const a =
        document.createElement("a");

    a.href =
        URL.createObjectURL(blob);

    a.download =
        "documento.txt";

    a.click();
}

function saveHTML(){

    const title =
        document.getElementById(
            "documentTitle"
        ).value;

    const content =
        document.getElementById(
            "editor"
        ).innerHTML;

    const html =
`<html>
<head>
<title>${title}</title>
</head>
<body>
${content}
</body>
</html>`;

    const blob =
        new Blob(
            [html],
            {type:"text/html"}
        );

    const a =
        document.createElement("a");

    a.href =
        URL.createObjectURL(blob);

    a.download =
        "documento.html";

    a.click();
}

function updateStats(){

    const text =
        document
        .getElementById("editor")
        .innerText
        .trim();

    const words =
        text === ""
        ? 0
        : text.split(/\s+/).length;

    const chars =
        text.length;

    document
    .getElementById("wordCount")
    .textContent =
    `${words} palavras`;

    document
    .getElementById("charCount")
    .textContent =
    `${chars} caracteres`;
}

document
.getElementById("editor")
.addEventListener(
    "input",
    updateStats
);