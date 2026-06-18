// =========================
// TAREFAS
// =========================

let tasks = [];

const STORAGE =
"retropixel_tasks";

function saveTasks(){

    localStorage.setItem(
        STORAGE,
        JSON.stringify(tasks)
    );

    updateStats();
}

function loadTasks(){

    const saved =
    localStorage.getItem(
        STORAGE
    );

    if(saved){

        tasks =
        JSON.parse(saved);
    }

    renderTasks();
}

function addTask(){

    const text =
    document
    .getElementById("taskInput")
    .value
    .trim();

    if(!text) return;

    tasks.push({

        text,

        done:false,

        priority:
        document.getElementById(
            "priority"
        ).value,

        dueDate:
        document.getElementById(
            "dueDate"
        ).value
    });

    saveTasks();

    renderTasks();

    document
    .getElementById("taskInput")
    .value="";
}

function renderTasks(){

    const container =
    document.getElementById(
        "taskList"
    );

    const search =
    document.getElementById(
        "search"
    ).value
    .toLowerCase();

    container.innerHTML="";

    tasks
    .filter(task=>
        task.text
        .toLowerCase()
        .includes(search)
    )
    .forEach((task,index)=>{

        const div =
        document.createElement(
            "div"
        );

        div.className =
        `task priority-${task.priority}`;

        if(task.done){

            div.classList.add(
                "completed"
            );
        }

        div.innerHTML = `
        <input
            type="checkbox"
            ${task.done ? "checked" : ""}>

        <div class="task-info">

            <strong>${task.text}</strong>

            <br>

            📅 ${task.dueDate || "Sem data"}

        </div>

        <button onclick="removeTask(${index})">
            🗑️
        </button>
        `;

        div.querySelector(
            "input"
        ).addEventListener(
        "change",
        ()=>{

            task.done =
            !task.done;

            saveTasks();

            renderTasks();
        });

        container.appendChild(div);
    });

    updateStats();
}

function removeTask(index){

    tasks.splice(index,1);

    saveTasks();

    renderTasks();
}

function updateStats(){

    document.getElementById(
        "totalTasks"
    ).textContent =
    tasks.length;

    document.getElementById(
        "completedTasks"
    ).textContent =
    tasks.filter(
        t=>t.done
    ).length;

    document.getElementById(
        "pendingTasks"
    ).textContent =
    tasks.filter(
        t=>!t.done
    ).length;
}

// =========================
// CALENDÁRIO
// =========================

const EVENTS_STORAGE =
"retropixel_events";

let events =
JSON.parse(
    localStorage.getItem(
        EVENTS_STORAGE
    )
) || {};

let currentDate =
new Date();

let selectedDate =
null;

function saveEvents(){

    localStorage.setItem(
        EVENTS_STORAGE,
        JSON.stringify(events)
    );
}

function openCalendar(){

    document
    .getElementById(
        "calendarModal"
    )
    .classList.add(
        "show"
    );

    renderCalendar();
}

function closeCalendar(){

    document
    .getElementById(
        "calendarModal"
    )
    .classList.remove(
        "show"
    );
}

function previousMonth(){

    currentDate.setMonth(
        currentDate.getMonth()-1
    );

    renderCalendar();
}

function nextMonth(){

    currentDate.setMonth(
        currentDate.getMonth()+1
    );

    renderCalendar();
}

function renderCalendar(){

    const grid =
    document.getElementById(
        "calendarGrid"
    );

    const title =
    document.getElementById(
        "calendarTitle"
    );

    grid.innerHTML = "";

    const months = [

        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
    ];

    title.textContent =
    months[
        currentDate.getMonth()
    ] +
    " " +
    currentDate.getFullYear();

    const firstDay =
    new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
    ).getDay();

    const daysInMonth =
    new Date(
        currentDate.getFullYear(),
        currentDate.getMonth()+1,
        0
    ).getDate();

    for(
        let i=0;
        i<firstDay;
        i++
    ){

        const empty =
        document.createElement(
            "div"
        );

        grid.appendChild(
            empty
        );
    }

    for(
        let day=1;
        day<=daysInMonth;
        day++
    ){

        const div =
        document.createElement(
            "div"
        );

        div.className =
        "calendar-day";

        const key =
        `${currentDate.getFullYear()}-${
        String(
            currentDate.getMonth()+1
        ).padStart(2,"0")
        }-${
        String(day)
        .padStart(2,"0")
        }`;

        if(events[key]){

            div.classList.add(
                "has-event"
            );
        }

        div.textContent =
        day;

        div.onclick =
        ()=>{

            selectDate(
                key
            );
        };

        grid.appendChild(
            div
        );
    }
}

function selectDate(date){

    selectedDate =
    date;

    const event =
    events[date];

    document
    .getElementById(
        "eventTitle"
    )
    .value =
    event
    ? event.title
    : "";

    document
    .getElementById(
        "eventDescription"
    )
    .value =
    event
    ? event.description
    : "";
}

function saveEvent(){

    if(!selectedDate){

        alert(
            "Selecione um dia."
        );

        return;
    }

    const title =
    document
    .getElementById(
        "eventTitle"
    )
    .value
    .trim();

    const description =
    document
    .getElementById(
        "eventDescription"
    )
    .value
    .trim();

    if(!title){

        alert(
            "Digite um título."
        );

        return;
    }

    events[selectedDate] = {

        title,
        description
    };

    saveEvents();

    renderCalendar();

    alert(
        "Evento salvo!"
    );
}

function deleteEvent(){

    if(!selectedDate){

        return;
    }

    if(
        !events[selectedDate]
    ){

        return;
    }

    if(
        confirm(
            "Excluir evento?"
        )
    ){

        delete
        events[
            selectedDate
        ];

        saveEvents();

        document
        .getElementById(
            "eventTitle"
        )
        .value = "";

        document
        .getElementById(
            "eventDescription"
        )
        .value = "";

        renderCalendar();
    }
}

// =========================
// EVENTOS
// =========================

document
.getElementById("search")
.addEventListener(
    "input",
    renderTasks
);

loadTasks();
