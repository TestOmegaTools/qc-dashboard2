import{s as D}from"./supabaseClient-BLHyOY-m.js";let y=[];async function q(){await L();const e=await I();y=e,P(e),U()}q();async function L(){const e=JSON.parse(sessionStorage.getItem("loggedInUser"));if(!e)return alert("Must be logged in"),window.location.href="/index.html",!1;const t=JSON.parse(sessionStorage.getItem("loggedInUserNameOnly"));return document.querySelector(".js-title").innerHTML=`<h3 class="js-title">${t}'s QC Dashboard</h3>`,e}async function I(){try{const{data:{user:e},error:t}=await D.auth.getUser();if(t||!e)return console.error("User not logged in or auth error",t),[];const s=e.id,{data:i,error:r}=await D.from("project_assignments").select("project_id").eq("uid",s);if(r)return console.error("Error fetching project assignments:",r),[];const c=i.map(p=>p.project_id);if(c.length===0)return[];const{data:m,error:d}=await D.from("project_qc_list").select("*").in("project_id",c).order("project_id",{ascending:!0});return d?(console.error("Error fetching project details:",d),[]):m}catch(e){return console.error("Unexpected error fetching user projects:",e),[]}}async function P(e){const t=document.querySelector(".js-project-list");if(!t){console.error("Error: The container with class 'js-project-list' was not found in the DOM.");return}let s=0,i=0,r=0,c=0;const m=new Date,d={},p={};e.forEach(o=>{const _=o.end_dates.split(";"),a=o.task_status.split(";"),h=o.assigned_to.split(";");for(let g=0;g<a.length;g++){const v=new Date(_[g]),k=a[g],l=h[g];d[k]=(d[k]||0)+1,p[l]=(p[l]||0)+1,a[g]==="Not Started"?(m>v?c+=1:B(m,v)<30,s+=1):a[g]==="In Progress"?(m>v&&(c+=1),i+=1):a[g]==="Completed"&&(r+=1)}});let j=`
        <div class = "top-info-container">
            <div class = "kpi-container">
                <div class = "kpi-box">
                    <p class = "kpi-label">In Progress</p>
                    <h3 class = "kpi-value">${i}</h3>
                </div>
                <div class = "kpi-box">
                    <p class = "kpi-label">Overdue</p>
                    <h3 class = "kpi-value">${c}</h3>
                </div>
                <div class = "kpi-box">
                    <p class = "kpi-label">Completed</p>
                    <h3 class = "kpi-value">${r}</h3>
                </div>
                <div class = "kpi-box">
                    <p class = "kpi-label">Not Started</p>
                    <h3 class = "kpi-value">${s}</h3>
                </div>
            </div>
            <div class="chart-container">
                <div class = "pie-chart-container">
                    <canvas id="taskStatusChart"></canvas>
                </div>
                <div class = "bar-chart-container">
                    <canvas id="tasksPerPersonChart"></canvas>
                </div>
            </div>
        </div>
    `;e.forEach(o=>{const _=o.project_qc_list.split(";"),a=o.assigned_to.split(";"),h=o.start_dates.split(";"),g=o.end_dates.split(";"),v=o.completed_date.split(";"),k=o.task_status.split(";"),l=o.priority.split(";"),T=[];for(let n=0;n<_.length;n++){const w={name:_[n],assignedTo:a[n],startDate:h[n],endDate:g[n],completedDate:v[n],taskStatus:k[n],priority:l[n]};T.push(w)}const M=T.length,E=T.filter(n=>n.taskStatus==="Completed").length,A=M>0?E/M*100:0;let C=`
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
        `;T.forEach((n,w)=>{C+=`
                    <tr data-project-id="${o.project_id}">
                        <td>
                            <input
                                type="text"
                                value = "${n.name}"
                                data-project-id = "${o.project_id}"
                                data-milestone-name = "${n.name}"
                                class = "milestone-name-input"
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                value = "${n.assignedTo}"
                                data-project-id = "${o.project_id}"
                                data-milestone-name = "${n.name}"
                                class = "milestone-assigned-to-input"
                            />
                        </td>
                        <td>
                            <select
                                class = "milestone-status-input"
                                data-project-id="${o.project_id}"
                                data-milestone-name="${n.name}"
                            >
                                <option value = "Not Started" ${n.taskStatus==="Not Started"?"selected":""}>Not Started</option>
                                <option value = "In Progress" ${n.taskStatus==="In Progress"?"selected":""}>In Progress</option>
                                <option value = "Completed" ${n.taskStatus==="Completed"?"selected":""}>Completed</option>
                            </select>
                        </td>
                        <td>
                            <input
                                type="text"
                                value = "${n.startDate}"
                                data-project-id = "${o.project_id}"
                                data-milestone-name = "${n.name}"
                                class = "milestone-start-date-input"
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                value = "${n.endDate}"
                                data-project-id = "${o.project_id}"
                                data-milestone-name = "${n.name}"
                                class = "milestone-end-date-input"
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                value = "${n.completedDate}"
                                data-project-id = "${o.project_id}"
                                data-milestone-name = "${n.name}"
                                class = "milestone-completed-date-input"
                            />
                        </td>
                        <td>
                            <select
                                class = "milestone-priority-input"
                                data-project-id="${o.project_id}"
                                data-milestone-name="${n.name}"
                            >
                                <option value = "Urgent" ${n.priority==="Urgent"?"selected":""}>Urgent</option>
                                <option value = "Important" ${n.priority==="Important"?"selected":""}>Important</option>
                                <option value = "Mediume" ${n.priority==="Medium"?"selected":""}>Medium</option>
                                <option value = "Low" ${n.priority==="Low"?"selected":""}>Low</option>
                            </select>
                        </td>
                        <td>
                            <button
                                class = "delete-milestone-button"
                                data-project-id = "${o.project_id}"
                                data-milestone-index="${w}">Delete
                            </button>
                        </td>
                    </tr>
            `}),C+=`
            </tbody>
        </table>
        `,j+=`
            <div class="project-item" data-project-id="${o.project_id}">
                <h3>Project Name: ${o.project_name}</h3>
                <h3 class="project-id-label">ID: ${o.project_id}</h3>
                <div class="progress-milestones-container">
                    <div class="milestone-list">
                        ${C}
                    </div>
                    <div class="progress-info-container">
                        <p>${o.project_name} % Complete</p>
                        <div class="progress-bar-container">
                            <div class="progress-bar" style="width: ${A}%;">
                                ${Math.round(A)}%
                            </div>
                        </div>
                        <div class="last-update-stats">
                            <p>Last Update: ${o.last_update_name}, ${o.last_update_time}</p>
                        </div>
                    </div>
                </div>
                <div class="project-actions">
                    <button class="js-add-milestone-button" data-project-id="${o.project_id}">Add Milestone</button>
                    <button class="js-save-project-button" data-project-id="${o.project_id}">Save Changes</button>
                </div>
            </div>
        `}),t.innerHTML=j;const S=document.getElementById("taskStatusChart"),b=document.getElementById("tasksPerPersonChart");new Chart(S,{type:"doughnut",data:{labels:Object.keys(d),datasets:[{label:"Task Status",data:Object.values(d),backgroundColor:["#4CAF50","#FF9800","#eb5252ff"],hoverOffset:4}]},options:{responsive:!0,plugins:{legend:{position:"bottom"},title:{display:!0,text:"Task Status"}}}});let f=[],$=Object.keys(p);for(let o=0;o<$.length;o++)f.push("#"+Math.round(Math.random()*1e3));new Chart(b,{type:"bar",data:{labels:Object.keys(p),datasets:[{label:"Number of Tasks",data:Object.values(p),backgroundColor:f,borderColor:"#4285F4",borderWidth:1}]},options:{responsive:!0,plugins:{legend:{display:!1},title:{display:!0,text:"Tasks Per Person"}},scales:{y:{beginAtZero:!0,ticks:{stepSize:1}}}}})}function U(){const e=document.querySelector(".js-project-list");if(!e){console.error("Error: the container with class 'js-project-list' was not found");return}e.addEventListener("click",t=>{const s=t.target.closest(".js-save-project-button");if(s){N(s.dataset.projectId);return}const i=t.target.closest(".delete-milestone-button");i&&O(i.dataset.projectId,parseInt(i.dataset.milestoneIndex,10));const r=t.target.closest(".js-add-milestone-button");r&&x(r.dataset.projectId)})}async function N(e){const t=y.find(s=>s.project_id===e);if(t&&t){const s=t.project_qc_list.split(";"),i=t.assigned_to.split(";"),r=t.start_dates.split(";"),c=t.end_dates.split(";"),m=t.completed_date.split(";"),d=t.task_status.split(";"),p=t.priority.split(";"),u=[];for(let a=0;a<s.length;a++){const h={name:s[a],assignedTo:i[a],startDate:r[a],endDate:c[a],completedDate:m[a],taskStatus:d[a],priority:p[a]};u.push(h)}const j=document.querySelectorAll(`.milestone-name-input[data-project-id="${e}"]`),S=document.querySelectorAll(`.milestone-assigned-to-input[data-project-id="${e}"]`),b=document.querySelectorAll(`.milestone-status-input[data-project-id="${e}"]`),f=document.querySelectorAll(`.milestone-start-date-input[data-project-id="${e}"]`),$=document.querySelectorAll(`.milestone-end-date-input[data-project-id="${e}"]`),o=document.querySelectorAll(`.milestone-completed-date-input[data-project-id="${e}"]`),_=document.querySelectorAll(`.milestone-priority-input[data-project-id="${e}"]`);for(let a=0;a<s.length;a++)u[a].name=j[a].value,u[a].assignedTo=S[a].value,u[a].taskStatus=b[a].value,u[a].startDate=f[a].value,u[a].endDate=$[a].value,u[a].completedDate=o[a].value,u[a].priority=_[a].value;Object.assign(t,u),await H(u,t)}}function O(e,t){const s=y.find(j=>j.project_id===e);if(!s)return;const i=s.project_qc_list.split(";");i.splice(t,1);const r=s.assigned_to.split(";");r.splice(t,1);const c=s.start_dates.split(";");c.splice(t,1);const m=s.end_dates.split(";");m.splice(t,1);const d=s.completed_date.split(";");d.splice(t,1);const p=s.task_status.split(";");p.splice(t,1);const u=s.priority.split(";");u.splice(t,1),s.project_qc_list=i.join(";"),s.assigned_to=r.join(";"),s.start_dates=c.join(";"),s.end_dates=m.join(";"),s.completed_date=d.join(";"),s.task_status=p.join(";"),s.priority=u.join(";"),P(y)}function x(e){const t=y.find(s=>s.project_id===e);if(t&&t){const s=t.project_qc_list.split(";");s.push("New Milestone");const i=t.assigned_to.split(";");i.push("");const r=t.start_dates.split(";");r.push("");const c=t.end_dates.split(";");c.push("");const m=t.completed_date.split(";");m.push("");const d=t.task_status.split(";");d.push("");const p=t.priority.split(";");p.push(""),t.project_qc_list=s.join(";"),t.assigned_to=i.join(";"),t.start_dates=r.join(";"),t.end_dates=c.join(";"),t.completed_date=m.join(";"),t.task_status=d.join(";"),t.priority=p.join(";"),P(y)}}async function H(e,t){const s=t.project_id,{data:{user:i}}=await D.auth.getUser();if(!i){alert("You must be logged in to save");return}let c=e.map(l=>l.name).toString().replace(/,/g,";"),d=e.map(l=>l.assignedTo).toString().replace(/,/g,";"),u=e.map(l=>l.startDate).toString().replace(/,/g,";"),S=e.map(l=>l.endDate).toString().replace(/,/g,";"),f=e.map(l=>l.completedDate).toString().replace(/,/g,";"),o=e.map(l=>l.priority).toString().replace(/,/g,";"),a=e.map(l=>l.taskStatus).toString().replace(/,/g,";");const h=new Date,g=h.toLocaleDateString()+" "+h.toLocaleTimeString(),{data:v,error:k}=await D.from("project_qc_list").update({project_qc_list:c,task_status:a,assigned_to:d,start_dates:u,end_dates:S,completed_date:f,priority:o,last_update_name:i.email,last_update_time:g}).eq("project_id",s);alert(`Project: ${s} saved updates`)}function B(e,t){const s=t.getTime()-e.getTime(),i=1e3*60*60*24,r=s/i;return Math.floor(r)}
