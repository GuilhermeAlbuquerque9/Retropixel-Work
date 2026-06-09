const rows = 30;
const cols = 15;

const spreadsheet =
document.getElementById("spreadsheet");

let currentCell = null;

let sheets = [];

let currentSheet = 0;

/* ==========================
   PLANILHAS
========================== */

function createEmptyData(){

    const data = [];

    for(let r = 0; r < rows; r++){

        data[r] = [];

        for(let c = 0; c < cols; c++){

            data[r][c] = "";
        }
    }

    return data;
}

function renderTabs(){

    const tabs =
    document.getElementById("tabs");

    tabs.innerHTML = "";

    sheets.forEach((sheet,index)=>{

        const btn =
        document.createElement("button");

        btn.className =
        "sheet-tab";

        if(index === currentSheet){

            btn.classList.add(
                "active"
            );
        }

        btn.textContent =
        sheet.name;

        btn.onclick =
        () => switchSheet(index);

        tabs.appendChild(btn);
    });

    const add =
    document.createElement("button");

    add.className =
    "sheet-tab add-tab";

    add.textContent = "➕";

    add.onclick =
    addSheet;

    tabs.appendChild(add);
}

function saveCurrentSheet(){

    const table =
    document.querySelector("table");

    if(!table) return;

    const data = [];

    const rowsDOM =
    table.querySelectorAll("tr");

    rowsDOM.forEach((row,index)=>{

        if(index === 0) return;

        const rowData = [];

        row.querySelectorAll("td")
        .forEach(cell=>{

            rowData.push(
                cell.dataset.formula ||
                cell.textContent
            );
        });

        data.push(rowData);
    });

    sheets[currentSheet].data =
    data;
}

function loadSheet(index){

    currentSheet = index;

    createSheet();

    const data =
    sheets[index].data;

    const cells =
    document.querySelectorAll("td");

    let i = 0;

    data.forEach(row=>{

        row.forEach(value=>{

            if(cells[i]){

                cells[i].textContent =
                value;
            }

            i++;
        });
    });

    updateFormulas();

    renderTabs();
}

function switchSheet(index){

    saveCurrentSheet();

    loadSheet(index);
}

function addSheet(){

    saveCurrentSheet();

    sheets.push({

        name:
        "Planilha" +
        (sheets.length + 1),

        data:
        createEmptyData()
    });

    loadSheet(
        sheets.length - 1
    );
}

/* ==========================
   TABELA
========================== */

function cellName(col,row){

    return String.fromCharCode(
        65 + col
    ) + row;
}

function createSheet(){

    spreadsheet.innerHTML = "";

    const table =
    document.createElement("table");

    const header =
    document.createElement("tr");

    header.appendChild(
        document.createElement("th")
    );

    for(let c = 0; c < cols; c++){

        const th =
        document.createElement("th");

        th.textContent =
        String.fromCharCode(
            65 + c
        );

        header.appendChild(th);
    }

    table.appendChild(header);

    for(let r = 1; r <= rows; r++){

        const tr =
        document.createElement("tr");

        const rowHead =
        document.createElement("th");

        rowHead.textContent = r;

        tr.appendChild(rowHead);

        for(let c = 0; c < cols; c++){

            const td =
            document.createElement("td");

            td.contentEditable = true;

            td.dataset.cell =
            cellName(c,r);

            td.addEventListener(
                "focus",
                selectCell
            );

            td.addEventListener(
                "input",
                cellEdited
            );

            tr.appendChild(td);
        }

        table.appendChild(tr);
    }

    spreadsheet.appendChild(table);
}

function cellEdited(e){

    const cell = e.target;

    cell.dataset.formula =
    cell.textContent;

    updateFormulas();
}

function selectCell(e){

    currentCell = e.target;

    document.getElementById(
        "selectedCell"
    ).textContent =
    currentCell.dataset.cell;

    document.getElementById(
        "formulaInput"
    ).value =
    currentCell.dataset.formula ||
    currentCell.textContent;
}

/* ==========================
   FÓRMULAS
========================== */

function getCellValue(ref){

    const cell =
    document.querySelector(
        `[data-cell="${ref}"]`
    );

    if(!cell) return 0;

    const value =
    parseFloat(
        cell.textContent
    );

    return isNaN(value)
    ? 0
    : value;
}

function updateFormulas(){

    document
    .querySelectorAll("td")
    .forEach(cell=>{

        const formula =
        cell.dataset.formula;

        if(
            !formula ||
            !formula.startsWith("=")
        ) return;

        try{

            let expression =
            formula.substring(1);

            expression =
            expression.replace(
                /SUM\((.*?)\)/gi,
                (_,args)=>{

                    return args
                    .split(",")
                    .reduce(
                        (total,item)=>
                        total +
                        getCellValue(
                            item.trim()
                        ),
                        0
                    );
                }
            );

            expression =
            expression.replace(
                /AVERAGE\((.*?)\)/gi,
                (_,args)=>{

                    const values =
                    args
                    .split(",");

                    let total = 0;

                    values.forEach(v=>{

                        total +=
                        getCellValue(
                            v.trim()
                        );
                    });

                    return (
                        total /
                        values.length
                    );
                }
            );

            expression =
            expression.replace(
                /MIN\((.*?)\)/gi,
                (_,args)=>{

                    const values =
                    args
                    .split(",")
                    .map(v=>
                        getCellValue(
                            v.trim()
                        )
                    );

                    return Math.min(
                        ...values
                    );
                }
            );

            expression =
            expression.replace(
                /MAX\((.*?)\)/gi,
                (_,args)=>{

                    const values =
                    args
                    .split(",")
                    .map(v=>
                        getCellValue(
                            v.trim()
                        )
                    );

                    return Math.max(
                        ...values
                    );
                }
            );

            expression =
            expression.replace(
                /([A-Z]+\d+)/g,
                ref =>
                getCellValue(ref)
            );

            cell.textContent =
            eval(expression);

        }

        catch(error){

            cell.textContent =
            "#ERRO";
        }
    });
}

/* ==========================
   BARRA DE FÓRMULAS
========================== */

document
.getElementById("formulaInput")
.addEventListener(
"input",
function(){

    if(!currentCell)
    return;

    currentCell.dataset.formula =
    this.value;

    currentCell.textContent =
    this.value;

    updateFormulas();
});

/* ==========================
   FORMATAÇÃO
========================== */

function toggleBold(){

    if(!currentCell)
    return;

    currentCell.style.fontWeight =
    currentCell.style.fontWeight ===
    "bold"
    ? "normal"
    : "bold";
}

function toggleItalic(){

    if(!currentCell)
    return;

    currentCell.style.fontStyle =
    currentCell.style.fontStyle ===
    "italic"
    ? "normal"
    : "italic";
}

document
.getElementById("textColor")
.addEventListener(
"input",
e=>{

    if(currentCell){

        currentCell.style.color =
        e.target.value;
    }
});

document
.getElementById("cellColor")
.addEventListener(
"input",
e=>{

    if(currentCell){

        currentCell.style.background =
        e.target.value;
    }
});

/* ==========================
   CSV
========================== */

function saveCSV(){

    const rowsData = [];

    document
    .querySelectorAll("tr")
    .forEach((row,index)=>{

        if(index === 0)
        return;

        const line = [];

        row
        .querySelectorAll("td")
        .forEach(cell=>{

            line.push(
                `"${cell.textContent}"`
            );
        });

        rowsData.push(
            line.join(",")
        );
    });

    const blob =
    new Blob(
        [rowsData.join("\n")],
        {
            type:"text/csv"
        }
    );

    const a =
    document.createElement("a");

    a.href =
    URL.createObjectURL(blob);

    a.download =
    "planilha.csv";

    a.click();
}

/* ==========================
   NOVA PLANILHA
========================== */

function newSheet(){

    if(confirm(
        "Limpar a planilha atual?"
    )){

        sheets[currentSheet].data =
        createEmptyData();

        loadSheet(
            currentSheet
        );
    }
}

/* ==========================
   INICIALIZAÇÃO
========================== */

sheets.push({

    name:"Planilha1",

    data:createEmptyData()
});

loadSheet(0);

function deleteCurrentSheet(){

    if(sheets.length === 1){

        alert(
            "A última planilha não pode ser removida."
        );

        return;
    }

    if(!confirm(
        `Excluir ${sheets[currentSheet].name}?`
    )){
        return;
    }

    sheets.splice(
        currentSheet,
        1
    );

    if(currentSheet >= sheets.length){

        currentSheet =
        sheets.length - 1;
    }

    loadSheet(currentSheet);
}

document
.getElementById("csvFile")
.addEventListener(
"change",
function(e){

    const file =
    e.target.files[0];

    if(!file) return;

    const reader =
    new FileReader();

    reader.onload =
    function(event){

        const text =
        event.target.result;

        const lines =
        text.split("\n");

        sheets[currentSheet].data =
        createEmptyData();

        lines.forEach(
        (line,rowIndex)=>{

            const values =
            line.split(",");

            values.forEach(
            (value,colIndex)=>{

                if(
                    rowIndex < rows &&
                    colIndex < cols
                ){

                    sheets[currentSheet]
                    .data[rowIndex][colIndex] =
                    value.replace(
                        /"/g,
                        ""
                    );
                }
            });
        });

        loadSheet(
            currentSheet
        );
    };

    reader.readAsText(file);
});