const canvas =
document.getElementById("canvas");

let currentTool = "rect";

let startX;
let startY;

let currentElement = null;

function setTool(tool){

    currentTool = tool;
}

canvas.addEventListener(
"mousedown",
startDraw
);

canvas.addEventListener(
"mousemove",
draw
);

canvas.addEventListener(
"mouseup",
stopDraw
);

function startDraw(e){

    if(currentTool === "select")
        return;

    const rect =
    canvas.getBoundingClientRect();

    startX =
    e.clientX - rect.left;

    startY =
    e.clientY - rect.top;

    const fill =
    document.getElementById(
        "fillColor"
    ).value;

    const stroke =
    document.getElementById(
        "strokeColor"
    ).value;

    const width =
    document.getElementById(
        "strokeWidth"
    ).value;

    if(currentTool === "rect"){

        currentElement =
        document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
        );

        currentElement.setAttribute(
            "x",
            startX
        );

        currentElement.setAttribute(
            "y",
            startY
        );
    }

    if(currentTool === "circle"){

        currentElement =
        document.createElementNS(
        "http://www.w3.org/2000/svg",
        "ellipse"
        );

        currentElement.setAttribute(
            "cx",
            startX
        );

        currentElement.setAttribute(
            "cy",
            startY
        );
    }

    if(currentTool === "line"){

        currentElement =
        document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
        );

        currentElement.setAttribute(
            "x1",
            startX
        );

        currentElement.setAttribute(
            "y1",
            startY
        );

        currentElement.setAttribute(
            "x2",
            startX
        );

        currentElement.setAttribute(
            "y2",
            startY
        );
    }

    currentElement.setAttribute(
        "fill",
        fill
    );

    currentElement.setAttribute(
        "stroke",
        stroke
    );

    currentElement.setAttribute(
        "stroke-width",
        width
    );

    canvas.appendChild(
        currentElement
    );
}

function draw(e){

    if(!currentElement)
        return;

    const rect =
    canvas.getBoundingClientRect();

    const x =
    e.clientX - rect.left;

    const y =
    e.clientY - rect.top;

    if(currentTool === "rect"){

        currentElement.setAttribute(
            "width",
            Math.abs(x-startX)
        );

        currentElement.setAttribute(
            "height",
            Math.abs(y-startY)
        );
    }

    if(currentTool === "circle"){

        currentElement.setAttribute(
            "rx",
            Math.abs(x-startX)
        );

        currentElement.setAttribute(
            "ry",
            Math.abs(y-startY)
        );
    }

    if(currentTool === "line"){

        currentElement.setAttribute(
            "x2",
            x
        );

        currentElement.setAttribute(
            "y2",
            y
        );
    }
}

function stopDraw(){

    currentElement = null;
}

function addText(){

    const text =
    prompt("Texto:");

    if(!text)
        return;

    const element =
    document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text"
    );

    element.setAttribute(
        "x",
        100
    );

    element.setAttribute(
        "y",
        100
    );

    element.textContent =
    text;

    canvas.appendChild(
        element
    );
}

function saveProject(){

    const data =
    canvas.innerHTML;

    const blob =
    new Blob(
        [data],
        {
            type:"text/plain"
        }
    );

    const a =
    document.createElement("a");

    a.href =
    URL.createObjectURL(blob);

    a.download =
    "desenho.rpd";

    a.click();
}

document
.getElementById("openFile")
.addEventListener(
"change",
function(e){

    const file =
    e.target.files[0];

    if(!file)
        return;

    const reader =
    new FileReader();

    reader.onload =
    function(event){

        canvas.innerHTML =
        event.target.result;
    };

    reader.readAsText(file);
});

function exportPNG(){

    alert(
    "Exportação PNG será adicionada na próxima versão."
    );
}