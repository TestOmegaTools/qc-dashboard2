//pmPage.js
import supabase from "./config/supabaseClient.js"

// Get the username from supabase
const loggedInUsername = await checkAuthenticationAndRedirect();//this calls the function to ensure our user is valid old=await supabase.auth.getSession();
// Get the assigned projects from 
const assignedUserProjects = await fetchUsersProjectData();//this calls the function to select our signed in users projects old=await fetchUserData();

//displays the user email in our title
//document.querySelector('.js-title').innerHTML = `<h3 class="js-title">${loggedInUsername} QC Dashboard</h3>`
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

    let projectsHTML = '';
    files.forEach(project => {
        //here we get our QC list from supabase split based on ;
        const milestoneList = project.project_qc_list.split(';');
        const milestoneStatusList = project.project_qc_status.split(';').map(s => s ==='true');
        const milestoneData = [];
        //now we run through the milestone list to combine them into one array to use later
        for (let i = 0; i < milestoneList.length; i++){
            const milestone = {
                name: milestoneList[i],
                isCompleted: milestoneStatusList[i]
            };
            milestoneData.push(milestone);
        }
        const totalMilestones = milestoneData.length
        const completedMilestones = milestoneData.filter(milestone => milestone.isCompleted).length;
        const milestonePercentage = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

        //running through each milestone and getting our html for it
        let milestonesHTML = '';
        //project.milestones.forEach(milestone => {
        milestoneData.forEach(milestone => {
            milestonesHTML += `
                <div class="milestone-item">
                    <input
                        type="checkbox"
                        ${milestone.isCompleted ? 'checked' : ''}
                        id="${project.project_id}-${milestone.name.replace(/\s/g, '-')}-checkbox"
                        data-project-id="${project.project_id}"
                        data-milestone-name="${milestone.name}"
                        class="milestone-checkbox" />
                    <label for="${project.project_id}-${milestone.name.replace(/\s/g, '-')}-checkbox">
                        ${milestone.name}
                    </label>
                </div>
            `;
        });

        // getting the general project information and then adding our previously made milestonesHTML to the HTML. Also creating our project progress bar.
        projectsHTML += `
            <div class="project-item" data-project-id="${project.project_id}">
                <h3>Project Name: ${project.project_name}</h3>
                <h3 class="project-id-label">ID: ${project.project_id}</h3>
                <h4>Milestones:</h4>
                <div class="progress-milestones-container">
                    <div class="milestone-list">
                        ${milestonesHTML}
                    </div>
                    <div class="progress-info-container">
                        <p>${project.project_name} QC Progress</p>
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
                const milestoneStatusList = projectToUpdate.project_qc_status.split(';').map(s => s ==='true');
                const milestoneData = [];
                //now we run through the milestone list to combine them into one array to use later
                for (let i = 0; i < milestoneList.length; i++){
                    const milestone = {
                        name: milestoneList[i],
                        isCompleted: milestoneStatusList[i]
                    };
                    milestoneData.push(milestone);
                }

                const projectCheckboxes = document.querySelectorAll(`.milestone-checkbox[data-project-id="${projectIdToSave}"]`);//find all the checkboxes related to or projectId
                //now updating the "completed" status of milestones based on checkbox state
                projectCheckboxes.forEach(checkbox => {
                    const milestoneName = checkbox.dataset.milestoneName; //getting the full milestone names
                    milestoneData.forEach(nameCheck => {
                        if (nameCheck.name === milestoneName){//if true, we found our matching milestone
                            nameCheck.isCompleted = checkbox.checked; //changes the save isCompleted value to our checkbox value from the user
                        }
                    })
                });

                //now saving the new project list
                saveProjectChanges(milestoneData, projectToUpdate);
            }
        });
    });
};

//function for saving udpated data
async function saveProjectChanges(updatedData, projectData) {
    //e.preventDefault()
    const projectIDedit = projectData.project_id
    const{ data: {user}} = await supabase.auth.getUser();
    if (!user){
        alert('You must be logged in to save');
        return;
    }
    //console.log(projectIDedit);
    let transformedStatus = updatedData.map(milestone => milestone.isCompleted);
    let newStatus = transformedStatus.toString().replace(/,/g,';');
    //let newStatus = transformedStatus.replace('[','').replace(']','').replace(',',';');
    const now = new Date();
    const dateTime = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
    const {data, error} = await supabase
        .from('project_qc_list')
        .update({
            project_qc_status: newStatus,
            last_update_name: user.email,
            last_update_time: dateTime
        }) //Pass the columns and the new values
        .eq('project_id', projectIDedit);//Filter to match the specific row for the project
    alert(`Project: ${projectIDedit} saved updates`)
}