//pmPage.js
import supabase from "./config/supabaseClient.js"

// Get the username from supabase
const loggedInUsername = await checkAuthenticationAndRedirect();//this calls the function to ensure our user is valid old=await supabase.auth.getSession();
// Get the assigned projects from 
const assignedUserProjects = await fetchUsersProjectData();//this calls the function to select our signed in users projects old=await fetchUserData();

loadProjectQcList(assignedUserProjects);//this is the function taht gives us our html to display a project and it's QC milestones
saveMilestones(assignedUserProjects)//this attaches the save buttons code and saves it to Supabase when pressed

async function checkAuthenticationAndRedirect(){
    //const {data: {user}} = await supabase.auth.getUser() //this is the old one that would get the signed in user from supabase
    const user = JSON.parse(sessionStorage.getItem('loggedInUser'));//gets the user value from sessionStorage
    //if there is no user, redirect to login page
    if(!user){
        alert('Must be logged in')
        window.location.href = '/index.html'
        return false;
    }

    //displays the user name in our title
    const userNameGrabbed = JSON.parse(sessionStorage.getItem('loggedInUserNameOnly'));
    document.querySelector('.js-title').innerHTML = `<h3 class="js-title">${userNameGrabbed}'s QC Dashboard</h3>`
    //return the data outside the function
    return user;
}

//this is where we get the project data from our supabase table
async function fetchUsersProjectData() {
  try {
    // 1 Get the logged-in user from Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('User not logged in or auth error', authError);
      return [];
    }
    const userUid = user.id; // UUID of the logged-in user

    // 2 Get all project_ids assigned to this user
    const { data: assignments, error: assignmentsError } = await supabase
      .from('project_assignments') //table to select from
      .select('project_id')//column to select from
      .eq('uid', userUid); //ensuring the colum uid matches our userUid value so we only show the user their projects

    if (assignmentsError) {
      console.error('Error fetching project assignments:', assignmentsError);
      return [];
    }

    const assignedProjectIds = assignments.map(a => a.project_id); //creates list of projects
    if (assignedProjectIds.length === 0) return []; // User has no projects

    // 3 Fetch full project data from project_qc_list for assigned projects
    const { data: projects, error: projectsError } = await supabase
      .from('project_qc_list') //table to select from
      .select('*')//selects all the project columns
      .in('project_id', assignedProjectIds) //checks the project ids and only allows in if they match
      .order('project_id',{ascending: true}); //puts them in sequential order by projectid

    if (projectsError) {
      console.error('Error fetching project details:', projectsError);
      return [];
    }

    return projects; // Array of full project objects assigned to the user

  } catch (err) {
    console.error('Unexpected error fetching user projects:', err);
    return [];
  }
}

//function to actually show the users project list
async function loadProjectQcList(files) {
    const projectListContainer = document.querySelector('.js-project-list');
    if (!projectListContainer) {
        console.error("Error: The container with class 'js-project-list' was not found in the DOM.");
        return;
    }

    //Here is where we get the KPI's for all the projects
    let notStartedTaskTotal = 0
    let inProgressTaskTotal = 0
    let completeTaskTotal = 0
    let overdueTaskTotal = 0;
    let upcomingEndTaskTotal = 0;
    const now = new Date();
    //Loop to go through each project and look at all the important values we want
    files.forEach(project => {
        //Get the important values for each project individually
        const milestoneEndDates = project.end_dates.split(';');
        const milestoneTaskStatus = project.task_status.split(';');
        for (let i = 0; i < milestoneTaskStatus.length; i++){
            const milestoneEndDate = new Date(milestoneEndDates[i])
            if (milestoneTaskStatus[i] === "Not Started"){
                if (now > milestoneEndDate){
                    overdueTaskTotal += 1
                } else if (getDayDifference(now,milestoneEndDate) < 30){
                    upcomingEndTaskTotal +=1
                }
                notStartedTaskTotal += 1
            } else if(milestoneTaskStatus[i] === "In Progress"){
                if (now > milestoneEndDate){
                    overdueTaskTotal += 1
                }
                inProgressTaskTotal += 1
            } else if(milestoneTaskStatus[i] === "Completed"){
                completeTaskTotal += 1
            }
        }
    })
    //Now, we want to set up our HTML variable
    let projectsKpiHTML = `
        <div class = "kpi-container">
            <div class = "kpi-box">
                <p class = "kpi-label">In Progress</p>
                <h3 class = "kpi-value">${inProgressTaskTotal}</h3>
            </div>
            <div class = "kpi-box">
                <p class = "kpi-label">Overdue</p>
                <h3 class = "kpi-value">${overdueTaskTotal}</h3>
            </div>
            <div class = "kpi-box">
                <p class = "kpi-label">Completed</p>
                <h3 class = "kpi-value">${completeTaskTotal}</h3>
            </div>
            <div class = "kpi-box">
                <p class = "kpi-label">Not Started</p>
                <h3 class = "kpi-value">${notStartedTaskTotal}</h3>
            </div>
        </div>
    `

    //console.log(`Not Started: ${notStartedTaskTotal}, In Progress: ${inProgressTaskTotal}, Completed: ${completeTaskTotal}, Overdue: ${overdueTaskTotal}, Upcoming: ${upcomingEndTaskTotal}`)

    let projectsHTML = projectsKpiHTML;
    files.forEach(project => {
        //here we get our QC list variables from supabase split into arrays based on ;
        const milestoneList = project.project_qc_list.split(';');
        //const milestoneStatusList = project.project_qc_status.split(';').map(s => s ==='true');
        const milestoneAssignedTo = project.assigned_to.split(';');
        const milestoneStartDates = project.start_dates.split(';');
        const milestoneEndDates = project.end_dates.split(';');
        const milestoneCompletedDates = project.completed_date.split(';');
        const milestoneTaskStatus = project.task_status.split(';');
        const milestonePercComplete = project.percent_complete.split(';');
        const milestonePriority = project.priority.split(';');

        const milestoneData = [];
        //now we run through the milestone list to combine them into one array to use later
        for (let i = 0; i < milestoneList.length; i++){
            const milestone = {
                name: milestoneList[i],
                //isCompleted: milestoneStatusList[i],
                assignedTo: milestoneAssignedTo[i],
                startDate: milestoneStartDates[i],
                endDate: milestoneEndDates[i],
                completedDate: milestoneCompletedDates[i],
                taskStatus: milestoneTaskStatus[i],
                percComplete: milestonePercComplete[i],
                priority: milestonePriority[i]
            };
            milestoneData.push(milestone);
        }

        const totalMilestones = milestoneData.length
        const completedMilestones = milestoneData.filter(milestone => milestone.taskStatus==="Completed").length;
        const milestonePercentage = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

        //Starting to create the milestone tables. Here we create the table and each header for the columns
        let milestonesHTML = `
        <table class = "milestones-table">
            <thead>
                <tr>
                    <th>Milestone</th>
                    <th>Assigned To</th>
                    <th>Status</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Completed Date</th>
                    <th>Priority</th>
                </tr>
            </thead>
            <tbody>
        `;

        //Here is where we are creating a table for each project assigned to the user. We create the id of the table, then 
            // we create each row for every milestone
        milestoneData.forEach(milestone => {
            milestonesHTML += `
                    <tr data-project-id="${project.project_id}">
                        <td>
                            <input
                                type="text"
                                value = "${milestone.name}"
                                data-project-id = "${project.project_id}"
                                data-milestone-name = "${milestone.name}"
                                class = "milestone-name-input"
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                value = "${milestone.assignedTo}"
                                data-project-id = "${project.project_id}"
                                data-milestone-name = "${milestone.name}"
                                class = "milestone-assigned-to-input"
                            />
                        </td>
                        <td>
                            <select
                                class = "milestone-status-input"
                                data-project-id="${project.project_id}"
                                data-milestone-name="${milestone.name}"
                            >
                                <option value = "Not Started" ${milestone.taskStatus === 'Not Started' ? 'selected' : ''}>Not Started</option>
                                <option value = "In Progress" ${milestone.taskStatus === 'In Progress' ? 'selected' : ''}>In Progress</option>
                                <option value = "Completed" ${milestone.taskStatus === 'Completed' ? 'selected' : ''}>Completed</option>
                            </select>
                        </td>
                        <td>
                            <input
                                type="text"
                                value = "${milestone.startDate}"
                                data-project-id = "${project.project_id}"
                                data-milestone-name = "${milestone.name}"
                                class = "milestone-start-date-input"
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                value = "${milestone.endDate}"
                                data-project-id = "${project.project_id}"
                                data-milestone-name = "${milestone.name}"
                                class = "milestone-end-date-input"
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                value = "${milestone.completedDate}"
                                data-project-id = "${project.project_id}"
                                data-milestone-name = "${milestone.name}"
                                class = "milestone-completed-date-input"
                            />
                        </td>
                        <td>
                            <select
                                class = "milestone-priority-input"
                                data-project-id="${project.project_id}"
                                data-milestone-name="${milestone.name}"
                            >
                                <option value = "Urgent" ${milestone.priority === 'Urgent' ? 'selected' : ''}>Urgent</option>
                                <option value = "Important" ${milestone.priority === 'Important' ? 'selected' : ''}>Important</option>
                                <option value = "Mediume" ${milestone.priority === 'Medium' ? 'selected' : ''}>Medium</option>
                                <option value = "Low" ${milestone.priority === 'Low' ? 'selected' : ''}>Low</option>
                            </select>
                        </td>
                    </tr>
            `
        });
        milestonesHTML +=`
            </tbody>
        </table>
        `

        // getting the general project information and then adding our previously made milestonesHTML to the HTML. Also creating our project progress bar.
        projectsHTML += `
            <div class="project-item" data-project-id="${project.project_id}">
                <h3>Project Name: ${project.project_name}</h3>
                <h3 class="project-id-label">ID: ${project.project_id}</h3>
                <div class="progress-milestones-container">
                    <div class="milestone-list">
                        ${milestonesHTML}
                    </div>
                    <div class="progress-info-container">
                        <p>${project.project_name} % Complete</p>
                        <div class="progress-bar-container">
                            <div class="progress-bar" style="width: ${milestonePercentage}%;">
                                ${Math.round(milestonePercentage)}%
                            </div>
                        </div>
                        <div class="last-update-stats">
                            <p>Last Update: ${project.last_update_name}, ${project.last_update_time}</p>
                        </div>
                    </div>
                </div>
                <div class="project-actions">
                    <button class="js-save-project-button" data-project-id="${project.project_id}">Save Changes</button>
                </div>
            </div>
        `;
    });

    projectListContainer.innerHTML = projectsHTML;
};

function saveMilestones(projectsArray){
    const saveButtons = document.querySelectorAll('.js-save-project-button')
    saveButtons.forEach(button => {
        button.addEventListener('click', () =>{
            const projectIdToSave = button.getAttribute('data-project-id');//getting the projectId we're saving from the save button
            
            const projectToUpdate = projectsArray.find(p => p.project_id === projectIdToSave);//checking to see if our project ID to button gives us matches one we have stored
            //console.log(projectToUpdate);
            if (projectToUpdate) {
                //here we get our QC list from supabase split based on ;
                const milestoneList = projectToUpdate.project_qc_list.split(';');
                //const milestoneStatusList = projectToUpdate.project_qc_status.split(';').map(s => s ==='true');
                const milestoneAssignedTo = projectToUpdate.assigned_to.split(';');
                const milestoneStartDates = projectToUpdate.start_dates.split(';');
                const milestoneEndDates = projectToUpdate.end_dates.split(';');
                const milestoneCompletedDates = projectToUpdate.completed_date.split(';');
                const milestoneTaskStatus = projectToUpdate.task_status.split(';');
                const milestonePercComplete = projectToUpdate.percent_complete.split(';');
                const milestonePriority = projectToUpdate.priority.split(';');

                const milestoneData = [];
                //now we run through the milestone list to combine them into one array to use later
                for (let i = 0; i < milestoneList.length; i++){
                    const milestone = {
                        name: milestoneList[i],
                        //isCompleted: milestoneStatusList[i],
                        assignedTo: milestoneAssignedTo[i],
                        startDate: milestoneStartDates[i],
                        endDate: milestoneEndDates[i],
                        completedDate: milestoneCompletedDates[i],
                        taskStatus: milestoneTaskStatus[i],
                        percComplete: milestonePercComplete[i],
                        priority: milestonePriority[i]
                    };
                    milestoneData.push(milestone);
                }
                
                //Now we are getting our new values from the user
                const projectMilestoneNameInputs = document.querySelectorAll(`.milestone-name-input[data-project-id="${projectIdToSave}"]`);
                const projectAssignedToInputs = document.querySelectorAll(`.milestone-assigned-to-input[data-project-id="${projectIdToSave}"]`);
                const projectMilestoneStatusInputs = document.querySelectorAll(`.milestone-status-input[data-project-id="${projectIdToSave}"]`);
                const projectStartDateInputs = document.querySelectorAll(`.milestone-start-date-input[data-project-id="${projectIdToSave}"]`);
                const projectEndDateInputs = document.querySelectorAll(`.milestone-end-date-input[data-project-id="${projectIdToSave}"]`);
                const projectCompletedDateInputs = document.querySelectorAll(`.milestone-completed-date-input[data-project-id="${projectIdToSave}"]`);
                const projectPriorityInputs = document.querySelectorAll(`.milestone-priority-input[data-project-id="${projectIdToSave}"]`);
                //And here we start remapping our milestoneData matric which contains all of our data
                for (let i = 0; i < milestoneList.length; i++){
                    milestoneData[i].name = projectMilestoneNameInputs[i].value;
                    milestoneData[i].assignedTo = projectAssignedToInputs[i].value;
                    milestoneData[i].taskStatus = projectMilestoneStatusInputs[i].value;
                    milestoneData[i].startDate = projectStartDateInputs[i].value;
                    milestoneData[i].endDate = projectEndDateInputs[i].value;
                    milestoneData[i].completedDate = projectCompletedDateInputs[i].value;
                    milestoneData[i].priority = projectPriorityInputs[i].value;
                }

                //now saving the new project list
                saveProjectChanges(milestoneData, projectToUpdate);
            }
        });
    });
};

//function for saving udpated data
async function saveProjectChanges(updatedData, projectData) {
    //getting our projectID that we are going to update
    const projectIDedit = projectData.project_id
    //verifying the user is signed in and can edit this project
    const{ data: {user}} = await supabase.auth.getUser();
    if (!user){
        alert('You must be logged in to save');
        return;
    }

    //Now getting our new values from the user inputs in the website
    let transformedMilestoneName = updatedData.map(milestone => milestone.name);
    let newMilestoneName = transformedMilestoneName.toString().replace(/,/g,';');
    let transformedAssignedTo = updatedData.map(milestone => milestone.assignedTo);
    let newAssignedTo = transformedAssignedTo.toString().replace(/,/g,';');
    let transformedStartDate = updatedData.map(milestone => milestone.startDate);
    let newStartDate = transformedStartDate.toString().replace(/,/g,';');
    let transformedEndDate = updatedData.map(milestone => milestone.endDate);
    let newEndDate = transformedEndDate.toString().replace(/,/g,';');
    let transformedCompletedDate = updatedData.map(milestone => milestone.completedDate);
    let newCompletedDate = transformedCompletedDate.toString().replace(/,/g,';');
    let transformedPriority = updatedData.map(milestone => milestone.priority);
    let newPriority = transformedPriority.toString().replace(/,/g,';');
    let transformedStatus = updatedData.map(milestone => milestone.taskStatus);
    let newStatus = transformedStatus.toString().replace(/,/g,';');
    const now = new Date();
    const dateTime = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
    //Now we are passing the data to supabase
    const {data, error} = await supabase
        .from('project_qc_list')
        .update({
            project_qc_list: newMilestoneName,
            task_status: newStatus,
            assigned_to: newAssignedTo,
            start_dates: newStartDate,
            end_dates: newEndDate,
            completed_date: newCompletedDate,
            priority: newPriority,
            last_update_name: user.email,
            last_update_time: dateTime
        }) //Pass the columns and the new values
        .eq('project_id', projectIDedit);//Filter to match the specific row for the project
    alert(`Project: ${projectIDedit} saved updates`)
    
    //Now we run the original functions so everything updates for us
    //const assignedUserProjects = await fetchUsersProjectData();//this calls the function to select our signed in users projects old=await fetchUserData();
    //loadProjectQcList(assignedUserProjects);//this is the function taht gives us our html to display a project and it's QC milestones
}

function getDayDifference(date1, date2) {
    // Get the difference in milliseconds
    const differenceInMilliseconds = date2.getTime() - date1.getTime();

    // Convert milliseconds to days
    const millisecondsInADay = 1000 * 60 * 60 * 24;
    const differenceInDays = differenceInMilliseconds / millisecondsInADay;

    // Return the number of full days
    return Math.floor(differenceInDays);
}