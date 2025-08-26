//pm.js
import supabase from "./config/supabaseClient.js"

let allProjectsData = [];//store the full list of projects here
let projectListPublic = await fetchProjectData();
const loggedInUsername = JSON.parse(localStorage.getItem('loggedInUser'));
const assignedUserProjects = await fetchUserData();
document.querySelector('.js-title').innerHTML = `<h3 class="js-title">${loggedInUsername} QC Dashboard</h3>`
loadProjectQcList(projectListPublic, assignedUserProjects);
saveMilestones(projectListPublic, loggedInUsername)

//this is where we get the project data from our supabase table
async function fetchProjectData(){
    try {
        const { data, error } = await supabase
            .from('project_qc_list')
            .select('*')
            .order('ProjectID',{ascending: true});//this can order the projects by ID

        if (error) {
            console.error('Error fetching data:', error);
            return;
        }
        
        allProjectsData = data;
        return data;

    } catch (err) {
        console.error('An unexpected error occurred:', err);
    }
}

//we get our user table again here to check what projects our user is assigned to
async function fetchUserData(){
    try {
        const { data, error}  = await supabase
            .from('user_list')
            .select('*');

        if (error) {
            console.error('Error fetching data:', error);
            return null;
        }

        const loggedInUser = data.find(user => user.username === loggedInUsername);
        if (loggedInUser) {
            return loggedInUser.assignedProjects;//if true, we found a matching user and now want to get all the projects assigned to them
        } else {
            return null; // Return null if no user is found
        }

    }catch (err) {
        console.error('An unexpected error occurred:', err);
    }
}

//function to actually show the users project list
async function loadProjectQcList(files, usersProjects) {
    const projectListContainer = document.querySelector('.js-project-list');
    if (!projectListContainer) {
        console.error("Error: The container with class 'js-project-list' was not found in the DOM.");
        return;
    }

    let projectsHTML = '';
    files.forEach(project => {
        //testing to make sure user is assigned to this project
        if (usersProjects.includes(project.ProjectName)) { 
            //here we get our QC list from supabase split based on ;
            const milestoneList = project.ProjectQcList.split(';');
            const milestoneStatusList = project.ProjectQcStatus.split(';').map(s => s ==='true');
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

            //running through each milestone and getting out html for it
            let milestonesHTML = '';
            //project.milestones.forEach(milestone => {
            milestoneData.forEach(milestone => {
                milestonesHTML += `
                    <div class="milestone-item">
                        <input
                            type="checkbox"
                            ${milestone.isCompleted ? 'checked' : ''}
                            id="${project.ProjectID}-${milestone.name.replace(/\s/g, '-')}-checkbox"
                            data-project-id="${project.ProjectID}"
                            data-milestone-name="${milestone.name}"
                            class="milestone-checkbox" />
                        <label for="${project.ProjectID}-${milestone.name.replace(/\s/g, '-')}-checkbox">
                            ${milestone.name}
                        </label>
                    </div>
                `;
            });

            // getting the general project information and then adding our previously made milestonesHTML to the HTML. Also creating our project progress bar.
            projectsHTML += `
                <div class="project-item" data-project-id="${project.ProjectID}">
                    <h3>Project Name: ${project.ProjectName}</h3>
                    <h3 class="project-id-label">ID: ${project.ProjectID}</h3>
                    <h4>Milestones:</h4>
                    <div class="progress-milestones-container">
                        <div class="milestone-list">
                            ${milestonesHTML}
                        </div>
                        <div class="progress-info-container">
                            <p>${project.ProjectName} QC Progress</p>
                            <div class="progress-bar-container">
                                <div class="progress-bar" style="width: ${milestonePercentage}%;">
                                    ${Math.round(milestonePercentage)}%
                                </div>
                            </div>
                            <div class="last-update-stats">
                                <p>Last Update: ${project.LastUpdateName}, ${project.LastUpdateTime}</p>
                            </div>
                        </div>
                    </div>
                    <div class="project-actions">
                        <button class="js-save-project-button" data-project-id="${project.ProjectID}">Save Changes</button>
                    </div>
                </div>
            `;
        }
    });

    projectListContainer.innerHTML = projectsHTML;
};

function saveMilestones(projectsArray, user){
    const saveButtons = document.querySelectorAll('.js-save-project-button')
    saveButtons.forEach(button => {
        button.addEventListener('click', () =>{
            const projectIdToSave = button.getAttribute('data-project-id');//getting the projectId we're saving from the save button
            
            const projectToUpdate = projectsArray.find(p => p.ProjectID === projectIdToSave);//checking to see if our project ID to button gives us matches one we have stored
            //console.log(projectToUpdate);
            if (projectToUpdate) {
                //here we get our QC list from supabase split based on ;
                const milestoneList = projectToUpdate.ProjectQcList.split(';');
                const milestoneStatusList = projectToUpdate.ProjectQcStatus.split(';').map(s => s ==='true');
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
                handleSubmit(milestoneData, projectToUpdate, user);
            }
        });
    });
};

//function for displaying graphs of QC milestones
const handleSubmit = async (updatedData, projectData, user) => {
    //e.preventDefault()
    const projectIDedit = projectData.ProjectID
    //console.log(projectIDedit);
    let transformedStatus = updatedData.map(milestone => milestone.isCompleted);
    let newStatus = transformedStatus.toString().replace(/,/g,';');
    //let newStatus = transformedStatus.replace('[','').replace(']','').replace(',',';');
    //console.log(newStatus);
    const now = new Date();
    const dateTime = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
    const {data, error} = await supabase
        .from('project_qc_list')
        .update({
            ProjectQcStatus: newStatus,
            LastUpdateName: user,
            LastUpdateTime: dateTime
        }) //Pass the columns and the new values
        .eq('ProjectID', projectIDedit);//Filter to match the specific row for the project
    alert(`Project: ${projectIDedit} saved updates`)
}