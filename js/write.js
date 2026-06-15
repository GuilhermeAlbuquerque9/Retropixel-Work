function toggleFormat(button, command){

    document.execCommand(
        command,
        false,
        null
    );

    button.classList.toggle(
        "active"
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
        "styleWithCSS",
        false,
        true
    );

    document.execCommand(
        "fontSize",
        false,
        7
    );

    const fonts =
    document.getElementsByTagName(
        "font"
    );

    for(let i=0;i<fonts.length;i++){

        if(
            fonts[i].size == "7"
        ){

            fonts[i].removeAttribute(
                "size"
            );

            fonts[i].style.fontSize =
            size + "px";
        }
    }
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
    .toLocaleString(
        "pt-BR"
    );

    document.execCommand(
        "insertText",
        false,
        date
    );

    updateStats();
}

function addPage(){

    const page =
    document.createElement(
        "div"
    );

    page.className =
    "paper";

    page.innerHTML = `

        <div
            class="editor"
            contenteditable="true">
        </div>

    `;

    document
    .getElementById(
        "pagesContainer"
    )
    .appendChild(page);

    const editor =
    page.querySelector(
        ".editor"
    );

    editor.addEventListener(
        "input",
        updateStats
    );
}

function newDocument(){

    if(
        !confirm(
            "Criar novo documento?"
        )
    ) return;

    const pages =
    document.querySelectorAll(
        ".paper"
    );

    pages.forEach(
        (page,index)=>{

            if(index > 0){

                page.remove();
            }
        }
    );

    document
    .getElementById(
        "documentTitle"
    ).value = "";

    document
    .getElementById(
        "editor"
    ).innerHTML = "";

    updateStats();
}

function saveDocument(){

    let text = "";

    document
    .querySelectorAll(
        ".editor"
    )
    .forEach(editor=>{

        text +=
        editor.innerText +
        "\n\n";
    });

    const blob =
    new Blob(
        [text],
        {
            type:
            "text/plain"
        }
    );

    const a =
    document.createElement(
        "a"
    );

    a.href =
    URL.createObjectURL(
        blob
    );

    a.download =
    "documento.txt";

    a.click();
}

function saveHTML(){

    const title =
    document
    .getElementById(
        "documentTitle"
    )
    .value;

    let content = "";

    document
    .querySelectorAll(
        ".editor"
    )
    .forEach(editor=>{

        content += `

        <div style="
        page-break-after:always;
        min-height:1000px;
        ">
            ${editor.innerHTML}
        </div>

        `;
    });

    const html =

`<!DOCTYPE html>
<html>
<head>

<meta charset="UTF-8">

<title>
${title}
</title>

</head>

<body>

${content}

</body>
</html>`;

    const blob =
    new Blob(
        [html],
        {
            type:
            "text/html"
        }
    );

    const a =
    document.createElement(
        "a"
    );

    a.href =
    URL.createObjectURL(
        blob
    );

    a.download =
    "documento.html";

    a.click();
}

function updateStats(){

    let fullText = "";

    document
    .querySelectorAll(
        ".editor"
    )
    .forEach(editor=>{

        fullText +=
        editor.innerText +
        " ";
    });

    fullText =
    fullText.trim();

    const words =

    fullText === ""

    ? 0

    : fullText
      .split(/\s+/)
      .length;

    const chars =
    fullText.length;

    document
    .getElementById(
        "wordCount"
    )
    .textContent =

    `${words} palavras`;

    document
    .getElementById(
        "charCount"
    )
    .textContent =

    `${chars} caracteres`;
}

document
.querySelectorAll(
    ".editor"
)
.forEach(editor=>{

    editor.addEventListener(
        "input",
        updateStats
    );
});

updateStats();
