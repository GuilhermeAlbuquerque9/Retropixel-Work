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

document
.getElementById("search")
.addEventListener(
"input",
renderTasks
);

loadTasks();