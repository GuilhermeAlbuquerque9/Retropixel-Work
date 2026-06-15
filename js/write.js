// =========================
// ELEMENTOS
// =========================

const pagesContainer =
document.getElementById("pagesContainer");

const wordCount =
document.getElementById("wordCount");

const charCount =
document.getElementById("charCount");

const pageCount =
document.getElementById("pageCount");

const fontName =
document.getElementById("fontName");

const fontSize =
document.getElementById("fontSize");

const textColor =
document.getElementById("textColor");

// =========================
// FORMATAÇÃO
// =========================

document.getElementById("boldBtn")
.addEventListener("click", function(){

    document.execCommand("bold");

    this.classList.toggle("active");
});

document.getElementById("italicBtn")
.addEventListener("click", function(){

    document.execCommand("italic");

    this.classList.toggle("active");
});

document.getElementById("underlineBtn")
.addEventListener("click", function(){

    document.execCommand("underline");

    this.classList.toggle("active");
});

// =========================
// ALINHAMENTO
// =========================

document.getElementById("leftBtn")
.addEventListener("click", ()=>{

    document.execCommand(
        "justifyLeft"
    );
});

document.getElementById("centerBtn")
.addEventListener("click", ()=>{

    document.execCommand(
        "justifyCenter"
    );
});

document.getElementById("rightBtn")
.addEventListener("click", ()=>{

    document.execCommand(
        "justifyRight"
    );
});

// =========================
// FONTE
// =========================

fontName.addEventListener(
    "change",
    ()=>{

        document.execCommand(
            "fontName",
            false,
            fontName.value
        );

        document.querySelectorAll(
            ".editor-page"
        ).forEach(page=>{

            page.style.fontFamily =
            fontName.value;
        });
    }
);

// =========================
// TAMANHO
// =========================

fontSize.addEventListener(
    "change",
    ()=>{

        document.querySelectorAll(
            ".editor-page"
        ).forEach(page=>{

            page.style.fontSize =
            fontSize.value + "px";
        });
    }
);

// =========================
// COR
// =========================

textColor.addEventListener(
    "change",
    ()=>{

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
    .toLocaleString("pt-BR");

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
    document.createElement("div");

    paper.className =
    "paper";

    paper.innerHTML = `

        <div
            class="editor-page"
            contenteditable="true">
        </div>

    `;

    pagesContainer
    .appendChild(paper);

    const editor =
    paper.querySelector(
        ".editor-page"
    );

    bindEditor(editor);

    updateStats();
}

// =========================
// DELETAR PÁGINA
// =========================

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

    bindEditor(editor);

    updateStats();
}

// =========================
// ABRIR ARQUIVO
// =========================

function openDocument(){

    document
    .getElementById(
        "fileOpen"
    )
    .click();
}

document
.getElementById(
    "fileOpen"
)
.addEventListener(
    "change",
    event=>{

        const file =
        event.target.files[0];

        if(!file) return;

        const reader =
        new FileReader();

        reader.onload =
        function(){

            const editor =
            document.querySelector(
                ".editor-page"
            );

            editor.innerHTML =
            reader.result;

            updateStats();
        };

        reader.readAsText(file);
    }
);

// =========================
// SALVAR
// =========================

function saveDocument(){

    const formato =
    prompt(
`Escolha o formato:

TXT
HTML
RPW
PDF`
    );

    if(!formato) return;

    const tipo =
    formato
    .toLowerCase()
    .trim();

    if(tipo === "pdf"){

        window.print();

        return;
    }

    let conteudo = "";

    document
    .querySelectorAll(
        ".editor-page"
    )
    .forEach(page=>{

        conteudo +=
        page.innerHTML +
        "\n\n";
    });

    const blob =
    new Blob(
        [conteudo],
        {
            type:"text/plain"
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
    "documento." +
    tipo;

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
    .forEach(page=>{

        text +=
        page.innerText +
        " ";
    });

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

function bindEditor(editor){

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
.forEach(editor=>{

    bindEditor(editor);
});

updateStats();
