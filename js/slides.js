let slides = [];

let currentSlide = 0;

let presentationMode = false;

const slideTitle =
document.getElementById("slideTitle");

const slideSubtitle =
document.getElementById("slideSubtitle");

const slideCanvas =
document.getElementById("slideCanvas");

/* ==========================
   PERSISTÊNCIA
========================== */

function saveToStorage(){

    localStorage.setItem(
        "retropixel_slides",
        JSON.stringify(slides)
    );

    localStorage.setItem(
        "retropixel_current_slide",
        currentSlide
    );
}

function loadFromStorage(){

    const saved =
    localStorage.getItem(
        "retropixel_slides"
    );

    if(saved){

        slides =
        JSON.parse(saved);

        currentSlide =
        parseInt(
            localStorage.getItem(
                "retropixel_current_slide"
            ) || 0
        );

        return true;
    }

    return false;
}

/* ==========================
   MODELO
========================== */

function createSlide(){

    return {

        title:"",
        subtitle:""
    };
}

/* ==========================
   LISTA
========================== */

function renderSlides(){

    const list =
    document.getElementById(
        "slideList"
    );

    list.innerHTML = "";

    slides.forEach(
    (slide,index)=>{

        const thumb =
        document.createElement("div");

        thumb.className =
        "thumbnail";

        if(index === currentSlide){

            thumb.classList.add(
                "active"
            );
        }

        thumb.textContent =
        slide.title ||
        `Slide ${index+1}`;

        thumb.onclick =
        ()=>openSlide(index);

        list.appendChild(thumb);
    });
}

/* ==========================
   SALVAR
========================== */

function saveCurrentSlide(){

    slides[currentSlide].title =
    slideTitle.value;

    slides[currentSlide].subtitle =
    slideSubtitle.value;

    saveToStorage();
}

/* ==========================
   ABRIR
========================== */

function openSlide(index){

    saveCurrentSlide();

    currentSlide = index;

    slideTitle.value =
    slides[index].title;

    slideSubtitle.value =
    slides[index].subtitle;

    renderSlides();

    saveToStorage();
}

/* ==========================
   NOVO
========================== */

function newSlide(){

    saveCurrentSlide();

    slides.push(
        createSlide()
    );

    openSlide(
        slides.length - 1
    );
}

/* ==========================
   EXCLUIR
========================== */

function deleteSlide(){

    if(slides.length === 1){

        alert(
            "O último slide não pode ser removido."
        );

        return;
    }

    slides.splice(
        currentSlide,
        1
    );

    currentSlide = Math.max(
        0,
        currentSlide - 1
    );

    openSlide(currentSlide);

    saveToStorage();
}

/* ==========================
   SALVAR ARQUIVO
========================== */

function saveProject(){

    saveCurrentSlide();

    const blob =
    new Blob(

        [
            JSON.stringify(
                slides,
                null,
                2
            )
        ],

        {
            type:
            "application/json"
        }
    );

    const a =
    document.createElement("a");

    a.href =
    URL.createObjectURL(blob);

    a.download =
    "apresentacao.rpss";

    a.click();
}

/* ==========================
   ABRIR ARQUIVO
========================== */

document
.getElementById("projectFile")
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

        slides =
        JSON.parse(
            event.target.result
        );

        currentSlide = 0;

        openSlide(0);

        saveToStorage();
    };

    reader.readAsText(file);
});

/* ==========================
   APRESENTAÇÃO
========================== */

function startPresentation(){

    presentationMode = true;

    document.body.classList.add(
        "presentation-mode"
    );

    document.querySelector(
        ".sidebar"
    ).style.display = "none";

    document.querySelector(
        ".ribbon"
    ).style.display = "none";

    document.querySelector(
        ".slides-top"
    ).style.display = "none";

    slideCanvas.style.width =
    "100vw";

    slideCanvas.style.height =
    "100vh";
}

function stopPresentation(){

    presentationMode = false;

    document.body.classList.remove(
        "presentation-mode"
    );

    document.querySelector(
        ".sidebar"
    ).style.display = "";

    document.querySelector(
        ".ribbon"
    ).style.display = "";

    document.querySelector(
        ".slides-top"
    ).style.display = "";

    slideCanvas.style.width = "";
    slideCanvas.style.height = "";
}

/* ==========================
   NAVEGAÇÃO
========================== */

document.addEventListener(
"keydown",
function(e){

    if(!presentationMode)
    return;

    if(
        e.key === "ArrowRight"
    ){

        if(
            currentSlide <
            slides.length - 1
        ){

            openSlide(
                currentSlide + 1
            );
        }
    }

    if(
        e.key === "ArrowLeft"
    ){

        if(
            currentSlide > 0
        ){

            openSlide(
                currentSlide - 1
            );
        }
    }

    if(
        e.key === "Escape"
    ){

        stopPresentation();
    }
});

/* ==========================
   EVENTOS
========================== */

slideTitle.addEventListener(
    "input",
    saveCurrentSlide
);

slideSubtitle.addEventListener(
    "input",
    saveCurrentSlide
);

/* ==========================
   INICIALIZAÇÃO
========================== */

if(!loadFromStorage()){

    slides.push(
        createSlide()
    );
}

openSlide(currentSlide);