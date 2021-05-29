// @ Define data arrays

let userProjects = [];
let lastLocation = {projectStatus : undefined, projectId : undefined, generalOverviewStatus : undefined, specificTabStatus : undefined, tabId : undefined};

// @ Storage Data Functions

function retrieveStorage() {
    // - Retrieving projects data and storing them in userProject array
    if (JSON.parse(localStorage.getItem("userProjects")) != undefined) {
        let projects = JSON.parse(localStorage.getItem("userProjects"));
        projects.forEach(projectProperties => {
            let newProject = new project(projectProperties);
            newProject.tabs = [];
    
            if (projectProperties.tabs != undefined) {
                // Creates an instance of a tab
                projectProperties.tabs.forEach(tabProperties => {
                    let newTab = new tab(tabProperties);
                    if (newTab.id === undefined) {
                        newTab.id = randomId(projectProperties.tabs);
                    }
    
                    newTab.tasks = [];
                    newTab.goals = [];
                    newTab.reminders = [];
        
                    if (tabProperties.tasks != undefined) {
                        // * Create instances of tasks < tabs < projects
                        tabProperties.tasks.forEach(taskProperties => {
                            taskProperties.dueDate = new Date(taskProperties.dueDate);
                            let newTask = new task(taskProperties);
                            // asign a random Id in case it doesn't have it yet
                            if (newTask.id === undefined) {
                                newTask.id = randomId(tabProperties.tasks);
                            }
                            newTab.tasks.push(newTask);
                        });
                    }
                    if (tabProperties.goals != undefined) {
                        // * Create instances of goals < tabs < projects
                        tabProperties.goals.forEach(goalProperties => {
                            let newGoal = new goal(goalProperties);
                            // asign a random Id in case it doesn't have it yet
                            if (newGoal.id === undefined) {
                                newGoal.id = randomId(tabProperties.goals);
                            }
                            newTab.goals.push(newGoal);
                        });
                    }
                    if (tabProperties.reminders != undefined) {
                        // * Create instances of reminders < tabs < projects
                        tabProperties.reminders.forEach(reminderProperties => {
                            reminderProperties.dueDate = new Date(reminderProperties.dueDate);
                            let newReminder = new reminder(reminderProperties);
                            // asign a random Id in case it doesn't have it yet
                            if (newReminder.id === undefined) {
                                newReminder.id = randomId(tabProperties.reminders);
                            }
                            newTab.reminders.push(newReminder);
                        });
                    }
                    newProject.tabs.push(newTab);
                });
            }
            userProjects.push(newProject);
        });
    }

    // - Aside DOM Creation
    // * Create the fav projects container
    userProjects.forEach( projectProperties => {
        if (projectProperties.fav === true) {
            const asideCtr = document.getElementById("asideCtr");
            let favPrjCtr = document.createElement("div");
            favPrjCtr.className = "fav-prjs";
            favPrjCtr.innerHTML = `
            <div class="fav-prjs__title">
            <p>Favorites</p>
            </div>
            <div id="favProjectContainer" class="fav-prjs__prj-ctr">
            </div>
            `;
            asideCtr.appendChild(favPrjCtr);
        }
    });
    // * Add the existing projects to the projects container
    const favProjectContainer = document.getElementById("favProjectContainer");
    const projectContainer = document.getElementById("projectContainer");
    userProjects.forEach(projectProperties => {
        // projects ctr
        let projectDom = document.createElement("div");
        projectDom.className = "prjs__prjs-ctr__prj";
        projectDom.id = `${projectProperties.id}`;
        projectDom.innerHTML = `
            <div class="prjs__prjs-ctr__prj__color"></div>
            <p>${projectProperties.name}</p>
        `;
        projectContainer.appendChild(projectDom);
        // fav projects ctr
        if (projectProperties.fav === true) {
            let favProjectDom = document.createElement("div");
            favProjectDom.className = "prjs__prjs-ctr__prj";
            favProjectDom.id = `${projectProperties.id}`;
            favProjectDom.innerHTML = `
                <div class="prjs__prjs-ctr__prj__color"></div>
                <p>${projectProperties.name}</p>
            `;
            favProjectContainer.appendChild(favProjectDom);
        }
    });

    // - Set aside events listeners
    projectEventCreateListener();
    projectEventOpenListener();

    // - Retrieving user last known location and restoring it
    if (JSON.parse(localStorage.getItem("lastLocation")) != undefined) {
        lastLocation = JSON.parse(localStorage.getItem("lastLocation"));
        if (lastLocation.projectStatus === true) {
            cleanTopBarDom();
            userProjects.forEach(projectProperties => {
                if (projectProperties.id == lastLocation.projectId) {
                    createProjectTopBarDom(projectProperties);
                    if (lastLocation.generalOverviewStatus === true) {
                        createOverviewDOM(projectProperties);
                    }
                    else if ((lastLocation.generalOverviewStatus === false) && (lastLocation.specificTabStatus === true)) {
                        projectProperties.tabs.forEach(tabProperties => {
                            if (tabProperties.id == lastLocation.tabId) {
                                createTabDom(tabProperties);
                            }
                        });
                    }
                }
            });
        }
    }
}
function saveStorage() {    
    localStorage.setItem("userProjects", JSON.stringify(userProjects)); // userPorjects-related data
    localStorage.setItem("lastLocation", JSON.stringify(lastLocation)); // user last known location data
    location.reload(); // refresh the page
}

retrieveStorage();

// localStorage.clear();