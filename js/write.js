// =========================
// ELEMENTOS
// =========================

const pagesContainer =
document.getElementById(
    "pagesContainer"
);

const wordCount =
document.getElementById(
    "wordCount"
);

const charCount =
document.getElementById(
    "charCount"
);

const pageCount =
document.getElementById(
    "pageCount"
);

const fontName =
document.getElementById(
    "fontName"
);

const fontSize =
document.getElementById(
    "fontSize"
);

const textColor =
document.getElementById(
    "textColor"
);

// =========================
// TOGGLE
// =========================

const boldBtn =
document.getElementById(
    "boldBtn"
);

const italicBtn =
document.getElementById(
    "italicBtn"
);

const underlineBtn =
document.getElementById(
    "underlineBtn"
);

// =========================
// FORMATAÇÃO
// =========================

boldBtn.onclick = () => {

    document.execCommand(
        "bold"
    );

    boldBtn.classList.toggle(
        "active"
    );
};

italicBtn.onclick = () => {

    document.execCommand(
        "italic"
    );

    italicBtn.classList.toggle(
        "active"
    );
};

underlineBtn.onclick = () => {

    document.execCommand(
        "underline"
    );

    underlineBtn.classList.toggle(
        "active"
    );
};

// =========================
// ALINHAMENTO
// =========================

document
.getElementById("leftBtn")
.onclick = () => {

    document.execCommand(
        "justifyLeft"
    );
};

document
.getElementById("centerBtn")
.onclick = () => {

    document.execCommand(
        "justifyCenter"
    );
};

document
.getElementById("rightBtn")
.onclick = () => {

    document.execCommand(
        "justifyRight"
    );
};

// =========================
// FONTE
// =========================

fontName.addEventListener(
    "change",
    () => {

        document.execCommand(
            "fontName",
            false,
            fontName.value
        );
    }
);

// =========================
// TAMANHO
// =========================

fontSize.addEventListener(
    "change",
    () => {

        const px =
        fontSize.value;

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

        for(
            let i = 0;
            i < fonts.length;
            i++
        ){

            if(
                fonts[i].size === "7"
            ){

                fonts[i]
                .removeAttribute(
                    "size"
                );

                fonts[i]
                .style
                .fontSize =
                px + "px";
            }
        }
    }
);

// =========================
// COR
// =========================

textColor.addEventListener(
    "change",
    () => {

        document.execCommand(
            "foreColor",
            false,
            textColor.value
        );
    }
);

// =========================
// DATA
// =========================

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

// =========================
// NOVA PÁGINA
// =========================

function addPage(){

    const paper =
    document.createElement(
        "div"
    );

    paper.className =
    "paper";

    paper.innerHTML = `

        <div
            class="editor-page"
            contenteditable="true">
        </div>

    `;

    pagesContainer
    .appendChild(
        paper
    );

    const editor =
    paper.querySelector(
        ".editor-page"
    );

    bindEditor(
        editor
    );

    updateStats();
}

// =========================
// NOVO DOCUMENTO
// =========================

function newDocument(){

    if(
        !confirm(
            "Criar novo documento?"
        )
    ){
        return;
    }

    pagesContainer.innerHTML = `

        <div class="paper">

            <input
                id="documentTitle"
                class="document-title"
                placeholder="Documento sem título">

            <div
                class="editor-page"
                contenteditable="true">
            </div>

        </div>

    `;

    const editor =
    document.querySelector(
        ".editor-page"
    );

    bindEditor(
        editor
    );

    updateStats();
}

// =========================
// TXT
// =========================

function saveDocument(){

    let content = "";

    document
    .querySelectorAll(
        ".editor-page"
    )
    .forEach(
        page => {

            content +=
            page.innerText +
            "\n\n";
        }
    );

    const blob =
    new Blob(
        [content],
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

// =========================
// HTML
// =========================

function saveHTML(){

    const title =
    document
    .getElementById(
        "documentTitle"
    )?.value ||
    "Documento";

    let pages = "";

    document
    .querySelectorAll(
        ".editor-page"
    )
    .forEach(
        page => {

            pages += `
            <div style="
                page-break-after:always;
                min-height:1000px;
            ">
                ${page.innerHTML}
            </div>
            `;
        }
    );

    const html = `

<!DOCTYPE html>
<html>
<head>

<meta charset="UTF-8">

<title>
${title}
</title>

</head>
<body>

${pages}

</body>
</html>

`;

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

// =========================
// ESTATÍSTICAS
// =========================

function updateStats(){

    let text = "";

    document
    .querySelectorAll(
        ".editor-page"
    )
    .forEach(
        page => {

            text +=
            page.innerText +
            " ";
        }
    );

    text =
    text.trim();

    const words =

    text === ""

    ? 0

    : text
      .split(/\s+/)
      .length;

    const chars =
    text.length;

    wordCount.textContent =
    `${words} palavras`;

    charCount.textContent =
    `${chars} caracteres`;

    const pages =
    document.querySelectorAll(
        ".paper"
    ).length;

    pageCount.textContent =

    pages === 1

    ? "1 página"

    : `${pages} páginas`;
}

// =========================
// EDITORES
// =========================

function bindEditor(
    editor
){

    editor.addEventListener(
        "input",
        updateStats
    );
}

// =========================
// INICIALIZAÇÃO
// =========================

document
.querySelectorAll(
    ".editor-page"
)
.forEach(
    editor => {

        bindEditor(
            editor
        );
    }
);

updateStats();

function deletePage(){

    const pages =
    document.querySelectorAll(
        ".paper"
    );

    if(pages.length <= 1){

        alert(
            "O documento precisa ter pelo menos uma página."
        );

        return;
    }

    pages[
        pages.length - 1
    ].remove();

    updateStats();
}
