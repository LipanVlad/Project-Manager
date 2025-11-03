async function addProject() {
    const projectContainer = document.getElementById("projectContainer");
    document.getElementById('addProjectButton').disabled = true;

    var div = document.createElement("div");
    div.className = "projectCard";
    div.innerHTML = `
        <input
            type="text"
            class="projectNameInput"
            size="18"
            placeholder="Project Name"
        />
        <div class="projectDetailsButtons">
            <button type="button" 
                    class = "cancelTaskButton" 
                    onclick="this.parentElement.parentElement.remove(); document.getElementById('addProjectButton').disabled = false;">
                Cancel
            </button> 
            <button type="button" class = "saveTaskButton" onclick="saveProject(this)">Save</button>
        </div>
        `;
    projectContainer.appendChild(div);   
}

 async function  saveProject(button){
  const card = button.closest('.projectCard');
  const input = card.querySelector('.projectNameInput');
  const projectName = input.value;
  
  const url = "http://localhost:8080/api/post/project";
  try {
    const response = await authenticatedFetch(url, {
      method:"POST",
      body: JSON.stringify({ name: projectName }),
      headers: {
         "Content-Type": "application/json",
      },
    });
    if (response.ok) {
            document.getElementById('addProjectButton').disabled = false;
            const savedProject = await response.json();
              card.innerHTML = `<h3>${savedProject.name}</h3>`;
              card.onclick = function() {
                openProjectDetails(savedProject.id, savedProject.name);
              };
              document.getElementById('message').style.color = "green";
              document.getElementById('message').textContent = "Project Added!";
          }else{
           const errorText = await response.text();
           document.getElementById('message').style.color = "red";
           document.getElementById('message').textContent = 'Error: ' + errorText;
          }
  }catch (error) {
          document.getElementById('message').textContent = 'Error: ' + error.message;
      }
}

async function loadProjects(){
  const url = "http://localhost:8080/api/get/projects";
  try {
    const response = await authenticatedFetch(url, {});
    if (response.ok) {
            const projectList = await response.json();

            for (const project of projectList){
                displayProject(project);
            }
          }else{
            document.getElementById('message').textContent = 'Error: ' + response.status + ' ' + response.statusText;
          }
    }catch (error) {
          document.getElementById('message').textContent = 'Error: ' + error.message;
      }
    
}

async function displayProject(project){
    const projectContainer = document.getElementById("projectContainer");
    var div = document.createElement("div");
    div.className = "projectCard";
    div.innerHTML = `<h3>${project.name}</h3>`;
    div.onclick = function() {
      openProjectDetails(project.id, project.name);
    };
    projectContainer.appendChild(div);  
}

async function openProjectDetails(projectId, projectName){
    const projectDetailsContainer = document.getElementById("projectDetailsContainer");
    projectDetailsContainer.innerHTML = "";
    var div = document.createElement("div");
    div.className = "projectDetailsContent";
    div.innerHTML = `
    <h2>${projectName}</h2>
    <div id="taskListContainer" class="taskListContainer"> </div>
    <p id="MessageLocationInProjectCardDetails" class="centraliseParagraph"></p>
    <div 
        class="projectDetailsButtons">
        <button type="button" class="cancelTaskButton" onclick="projectDetailsContainer.style.display = 'none'">Close</button>
        <button type="button" class="saveTaskButton" id="AddTaskButton" onclick="addTask(${projectId})">Add Task</button>
    </div>
    `;

    projectDetailsContainer.append(div);
    projectDetailsContainer.style.display = "flex";
    loadTasks(projectId);
}

async function loadTasks(projectId){
  const url = `http://localhost:8080/api/get/tasks/${projectId}`;
  try {
    const response = await authenticatedFetch(url, {});
    if (response.ok) {
            const taskList = await response.json();

            for (const task of taskList){
                displayTask(task);
            }
        }else{
            document.getElementById('MessageLocationInProjectCardDetails').textContent = 'Error: ' + response.status + ' ' + response.statusText;
          }
    }catch (error) {
          document.getElementById('MessageLocationInProjectCardDetails').textContent = 'Error: ' + error.message;
      }
    
}

async function displayTask(task) {
    const taskContainer = document.getElementById("taskListContainer");

    var taskDiv = document.createElement("div");
    taskDiv.className = "taskCard";
    taskDiv.innerHTML = `
        <h4>${task.taskName}</h4>
        <button class="saveTaskButton" id="addSubtaskButtonFor${task.id}" onclick="showAddSubtaskInput(${task.id})">Add Subtask</button>
        <div class="subtaskList" id="subtasksFor${task.id}"> </div>
    `;

    taskContainer.appendChild(taskDiv);
    loadSubtasks(task.id);
}

async function addTask(projectId){
    const taskContainer = document.getElementById("taskListContainer");
    document.getElementById('AddTaskButton').disabled = true;
    var div = document.createElement("div");
    div.className = "taskCard";
    div.innerHTML = `
        <input          
            type="text"
            class="taskNameInput"
            size="18"
            placeholder="Task name"
        />
        <button type="button" class = "saveTaskButton" onclick="saveTask(this, ${projectId})">Save</button>
        <button type="button" class="cancelTaskButton" onclick="cancelAddTask(this)">Cancel</button> 
    `;
    taskContainer.appendChild(div);   
}

async function  saveTask(button, projectId){
  const card = button.parentElement;
  const input = card.querySelector('.taskNameInput');
  const taskName = input.value;
  
  const url = `http://localhost:8080/api/post/task/project/${projectId}`;

  try {
    const response = await authenticatedFetch(url, {
      method:"POST",
      body: JSON.stringify({ taskName: taskName, projectId: projectId}),
      headers: {
         "Content-Type": "application/json",
      },
    });
    if (response.ok) {

      const savedTask = await response.json();
      document.getElementById('AddTaskButton').disabled = false;
      card.innerHTML = `
      <h4>${savedTask.taskName}</h4>
      <button class="saveTaskButton" id="addSubtaskButtonFor${savedTask.id}" onclick="showAddSubtaskInput(${savedTask.id})">Add Subtask</button>

      <div class="subtaskList" id="subtasksFor${savedTask.id}"> </div>
      `;
      
      document.getElementById('MessageLocationInProjectCardDetails').style.color = "green";
      document.getElementById('MessageLocationInProjectCardDetails').textContent = "Task added!"; 
    }else{
      const errorText = await response.text();
      document.getElementById('MessageLocationInProjectCardDetails').style.color = "red";
      document.getElementById('MessageLocationInProjectCardDetails').textContent = 'Error: ' + errorText;
      }
  }catch (error) {
        document.getElementById('MessageLocationInProjectCardDetails').style.color = "red";
        document.getElementById('MessageLocationInProjectCardDetails').textContent = 'Error: ' + error.message;
      }
}


async function loadSubtasks(taskId) {
    const url = `http://localhost:8080/api/get/subtasks/${taskId}`;
    const subtaskContainer = document.getElementById(`subtasksFor${taskId}`);
    try {
        const response = await authenticatedFetch(url, {});
        if (response.ok) {
            const subtaskList = await response.json();
            for (const subtask of subtaskList) {
              displaySubtasks(subtask);
            }
        }else{
            document.getElementById('MessageLocationInProjectCardDetails').style.color = "red";
            document.getElementById('MessageLocationInProjectCardDetails').textContent = 'Error: ' + response.status + ' ' + response.statusText;
          }
    }catch (error) {
          document.getElementById('MessageLocationInProjectCardDetails').style.color = "red";
          document.getElementById('MessageLocationInProjectCardDetails').textContent = 'Error: ' + error.message;
      }
}

function displaySubtasks(subtask) {
    const container = document.getElementById(`subtasksFor${subtask.task.id}`);
    
    var subtaskDiv = document.createElement("div");
    subtaskDiv.className = "subtaskCard";
    subtaskDiv.innerHTML = `<p>${subtask.subtaskName}</p>`;
    container.appendChild(subtaskDiv);
}

async function showAddSubtaskInput(taskId) {
    const subtaskContainer = document.getElementById(`subtasksFor${taskId}`);
    document.getElementById(`addSubtaskButtonFor${taskId}`).disabled = true;
    
    var div = document.createElement("div");
    div.className = "subtaskCard";
    div.innerHTML = `
        <input
            type="text"
            class="taskNameInput" 
            placeholder="Subtask name"
        />
        <button type="button" class="saveTaskButton" onclick="saveSubtask(this, ${taskId})">Save</button>
        <button type="button" class="cancelTaskButton" onclick="cancelAddSubtask(this, ${taskId})">Cancel</button> 
    `;
    subtaskContainer.appendChild(div); 
}
async function cancelAddTask(button) {
    const card = button.closest('.taskCard'); 
    card.remove();
    document.getElementById('AddTaskButton').disabled = false;
}

async function cancelAddSubtask(button, taskId) {
    const card = button.closest('.subtaskCard');
    card.remove();
    document.getElementById(`addSubtaskButtonFor${taskId}`).disabled = false;
}

async function saveSubtask(button, taskId) {
    const card = button.parentElement;
    const input = card.querySelector('input');
    const subtaskName = input.value;

    const url = `http://localhost:8080/api/post/subtask/${taskId}`;

    try {
        const response = await authenticatedFetch(url, {
            method: "POST",
            body: JSON.stringify({ subtaskName: subtaskName }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        
        if (response.ok) {
            document.getElementById(`addSubtaskButtonFor${taskId}`).disabled = false;
            const savedSubtask = await response.json();
            card.innerHTML = '';
            displaySubtasks(savedSubtask);
        document.getElementById('MessageLocationInProjectCardDetails').style.color = "green";
        document.getElementById('MessageLocationInProjectCardDetails').textContent = "Subtask added!"; 
        } else {
            const errorText = await response.text();
            document.getElementById('MessageLocationInProjectCardDetails').style.color = "red";
            document.getElementById('MessageLocationInProjectCardDetails').textContent = 'Error: ' + errorText;
        }
    } catch (error) {
        document.getElementById('MessageLocationInProjectCardDetails').style.color = "red";
        document.getElementById('MessageLocationInProjectCardDetails').textContent = 'Error: ' + error.message;
    }
}

window.onload = loadProjects;