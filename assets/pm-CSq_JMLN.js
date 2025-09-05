import{s as v}from"./supabaseClient-BLHyOY-m.js";let h=[];async function w(){await C();const o=await M();h=o,b(o),P()}w();async function C(){const o=JSON.parse(sessionStorage.getItem("loggedInUser"));if(!o)return alert("Must be logged in"),window.location.href="/index.html",!1;const t=JSON.parse(sessionStorage.getItem("loggedInUserNameOnly"));return document.querySelector(".js-title").innerHTML=`<h3 class="js-title">${t}'s QC Dashboard</h3>`,o}async function M(){try{const{data:{user:o},error:t}=await v.auth.getUser();if(t||!o)return console.error("User not logged in or auth error",t),[];const a=o.id,{data:i,error:r}=await v.from("project_assignments").select("project_id").eq("uid",a);if(r)return console.error("Error fetching project assignments:",r),[];const l=i.map(p=>p.project_id);if(l.length===0)return[];const{data:d,error:c}=await v.from("project_qc_list").select("*").in("project_id",l).order("project_id",{ascending:!0});return c?(console.error("Error fetching project details:",c),[]):d}catch(o){return console.error("Unexpected error fetching user projects:",o),[]}}async function b(o){const t=document.querySelector(".js-project-list");if(!t){console.error("Error: The container with class 'js-project-list' was not found in the DOM.");return}let a=0,i=0,r=0,l=0;const d=new Date;o.forEach(s=>{const g=s.end_dates.split(";"),m=s.task_status.split(";");for(let u=0;u<m.length;u++){const j=new Date(g[u]);m[u]==="Not Started"?(d>j?l+=1:I(d,j)<30,a+=1):m[u]==="In Progress"?(d>j&&(l+=1),i+=1):m[u]==="Completed"&&(r+=1)}});let p=`
        <div class = "kpi-container">
            <div class = "kpi-box">
                <p class = "kpi-label">In Progress</p>
                <h3 class = "kpi-value">${i}</h3>
            </div>
            <div class = "kpi-box">
                <p class = "kpi-label">Overdue</p>
                <h3 class = "kpi-value">${l}</h3>
            </div>
            <div class = "kpi-box">
                <p class = "kpi-label">Completed</p>
                <h3 class = "kpi-value">${r}</h3>
            </div>
            <div class = "kpi-box">
                <p class = "kpi-label">Not Started</p>
                <h3 class = "kpi-value">${a}</h3>
            </div>
        </div>
    `;o.forEach(s=>{const g=s.project_qc_list.split(";"),m=s.assigned_to.split(";"),u=s.start_dates.split(";"),j=s.end_dates.split(";"),S=s.completed_date.split(";"),f=s.task_status.split(";"),D=s.priority.split(";"),n=[];for(let e=0;e<g.length;e++){const T={name:g[e],assignedTo:m[e],startDate:u[e],endDate:j[e],completedDate:S[e],taskStatus:f[e],priority:D[e]};n.push(T)}const _=n.length,$=n.filter(e=>e.taskStatus==="Completed").length,k=_>0?$/_*100:0;let y=`
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
        `;n.forEach((e,T)=>{y+=`
                    <tr data-project-id="${s.project_id}">
                        <td>
                            <input
                                type="text"
                                value = "${e.name}"
                                data-project-id = "${s.project_id}"
                                data-milestone-name = "${e.name}"
                                class = "milestone-name-input"
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                value = "${e.assignedTo}"
                                data-project-id = "${s.project_id}"
                                data-milestone-name = "${e.name}"
                                class = "milestone-assigned-to-input"
                            />
                        </td>
                        <td>
                            <select
                                class = "milestone-status-input"
                                data-project-id="${s.project_id}"
                                data-milestone-name="${e.name}"
                            >
                                <option value = "Not Started" ${e.taskStatus==="Not Started"?"selected":""}>Not Started</option>
                                <option value = "In Progress" ${e.taskStatus==="In Progress"?"selected":""}>In Progress</option>
                                <option value = "Completed" ${e.taskStatus==="Completed"?"selected":""}>Completed</option>
                            </select>
                        </td>
                        <td>
                            <input
                                type="text"
                                value = "${e.startDate}"
                                data-project-id = "${s.project_id}"
                                data-milestone-name = "${e.name}"
                                class = "milestone-start-date-input"
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                value = "${e.endDate}"
                                data-project-id = "${s.project_id}"
                                data-milestone-name = "${e.name}"
                                class = "milestone-end-date-input"
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                value = "${e.completedDate}"
                                data-project-id = "${s.project_id}"
                                data-milestone-name = "${e.name}"
                                class = "milestone-completed-date-input"
                            />
                        </td>
                        <td>
                            <select
                                class = "milestone-priority-input"
                                data-project-id="${s.project_id}"
                                data-milestone-name="${e.name}"
                            >
                                <option value = "Urgent" ${e.priority==="Urgent"?"selected":""}>Urgent</option>
                                <option value = "Important" ${e.priority==="Important"?"selected":""}>Important</option>
                                <option value = "Mediume" ${e.priority==="Medium"?"selected":""}>Medium</option>
                                <option value = "Low" ${e.priority==="Low"?"selected":""}>Low</option>
                            </select>
                        </td>
                        <td>
                            <button
                                class = "delete-milestone-button"
                                data-project-id = "${s.project_id}"
                                data-milestone-index="${T}">Delete
                            </button>
                        </td>
                    </tr>
            `}),y+=`
            </tbody>
        </table>
        `,p+=`
            <div class="project-item" data-project-id="${s.project_id}">
                <h3>Project Name: ${s.project_name}</h3>
                <h3 class="project-id-label">ID: ${s.project_id}</h3>
                <div class="progress-milestones-container">
                    <div class="milestone-list">
                        ${y}
                    </div>
                    <div class="progress-info-container">
                        <p>${s.project_name} % Complete</p>
                        <div class="progress-bar-container">
                            <div class="progress-bar" style="width: ${k}%;">
                                ${Math.round(k)}%
                            </div>
                        </div>
                        <div class="last-update-stats">
                            <p>Last Update: ${s.last_update_name}, ${s.last_update_time}</p>
                        </div>
                    </div>
                </div>
                <div class="project-actions">
                    <button class="js-add-milestone-button" data-project-id="${s.project_id}">Add Milestone</button>
                    <button class="js-save-project-button" data-project-id="${s.project_id}">Save Changes</button>
                </div>
            </div>
        `}),t.innerHTML=p}function P(){const o=document.querySelector(".js-project-list");if(!o){console.error("Error: the container with class 'js-project-list' was not found");return}o.addEventListener("click",t=>{const a=t.target.closest(".js-save-project-button");if(a){E(a.dataset.projectId);return}const i=t.target.closest(".delete-milestone-button");i&&q(i.dataset.projectId,parseInt(i.dataset.milestoneIndex,10));const r=t.target.closest(".js-add-milestone-button");r&&A(r.dataset.projectId)})}async function E(o){const t=h.find(a=>a.project_id===o);if(t&&t){const a=t.project_qc_list.split(";"),i=t.assigned_to.split(";"),r=t.start_dates.split(";"),l=t.end_dates.split(";"),d=t.completed_date.split(";"),c=t.task_status.split(";"),p=t.priority.split(";"),s=[];for(let n=0;n<a.length;n++){const _={name:a[n],assignedTo:i[n],startDate:r[n],endDate:l[n],completedDate:d[n],taskStatus:c[n],priority:p[n]};s.push(_)}const g=document.querySelectorAll(`.milestone-name-input[data-project-id="${o}"]`),m=document.querySelectorAll(`.milestone-assigned-to-input[data-project-id="${o}"]`),u=document.querySelectorAll(`.milestone-status-input[data-project-id="${o}"]`),j=document.querySelectorAll(`.milestone-start-date-input[data-project-id="${o}"]`),S=document.querySelectorAll(`.milestone-end-date-input[data-project-id="${o}"]`),f=document.querySelectorAll(`.milestone-completed-date-input[data-project-id="${o}"]`),D=document.querySelectorAll(`.milestone-priority-input[data-project-id="${o}"]`);for(let n=0;n<a.length;n++)s[n].name=g[n].value,s[n].assignedTo=m[n].value,s[n].taskStatus=u[n].value,s[n].startDate=j[n].value,s[n].endDate=S[n].value,s[n].completedDate=f[n].value,s[n].priority=D[n].value;Object.assign(t,s),await L(s,t)}}function q(o,t){const a=h.find(g=>g.project_id===o);if(!a)return;const i=a.project_qc_list.split(";");i.splice(t,1);const r=a.assigned_to.split(";");r.splice(t,1);const l=a.start_dates.split(";");l.splice(t,1);const d=a.end_dates.split(";");d.splice(t,1);const c=a.completed_date.split(";");c.splice(t,1);const p=a.task_status.split(";");p.splice(t,1);const s=a.priority.split(";");s.splice(t,1),a.project_qc_list=i.join(";"),a.assigned_to=r.join(";"),a.start_dates=l.join(";"),a.end_dates=d.join(";"),a.completed_date=c.join(";"),a.task_status=p.join(";"),a.priority=s.join(";"),b(h)}function A(o){const t=h.find(a=>a.project_id===o);if(t&&t){const a=t.project_qc_list.split(";");a.push("New Milestone");const i=t.assigned_to.split(";");i.push("");const r=t.start_dates.split(";");r.push("");const l=t.end_dates.split(";");l.push("");const d=t.completed_date.split(";");d.push("");const c=t.task_status.split(";");c.push("");const p=t.priority.split(";");p.push(""),t.project_qc_list=a.join(";"),t.assigned_to=i.join(";"),t.start_dates=r.join(";"),t.end_dates=l.join(";"),t.completed_date=d.join(";"),t.task_status=c.join(";"),t.priority=p.join(";"),b(h)}}async function L(o,t){const a=t.project_id,{data:{user:i}}=await v.auth.getUser();if(!i){alert("You must be logged in to save");return}let l=o.map(e=>e.name).toString().replace(/,/g,";"),c=o.map(e=>e.assignedTo).toString().replace(/,/g,";"),s=o.map(e=>e.startDate).toString().replace(/,/g,";"),m=o.map(e=>e.endDate).toString().replace(/,/g,";"),j=o.map(e=>e.completedDate).toString().replace(/,/g,";"),f=o.map(e=>e.priority).toString().replace(/,/g,";"),n=o.map(e=>e.taskStatus).toString().replace(/,/g,";");const _=new Date,$=_.toLocaleDateString()+" "+_.toLocaleTimeString(),{data:k,error:y}=await v.from("project_qc_list").update({project_qc_list:l,task_status:n,assigned_to:c,start_dates:s,end_dates:m,completed_date:j,priority:f,last_update_name:i.email,last_update_time:$}).eq("project_id",a);alert(`Project: ${a} saved updates`)}function I(o,t){const a=t.getTime()-o.getTime(),i=1e3*60*60*24,r=a/i;return Math.floor(r)}
