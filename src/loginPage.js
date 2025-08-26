//loginPage.js
import supabase from "./config/supabaseClient.js"
//import { useEffect, userState } from "react";

//Wrapping the login button event listener in an async function so we can wait for the data to be loaded
document.querySelectorAll('.js-login-button')
    .forEach((button) => {
        button.addEventListener('click',async () => {
            //Await the data fetch here
            const userList = await fetchUserListData();

            //Pass the fetched data directly to our checkLogin function
            if (userList){//checks if not blank
                checkLogin(userList);
            }
        });
    });

//this is where we get the user data from our supabase table
async function fetchUserListData(){
    try {
        const { data, error } = await supabase
            .from('user_list')
            .select('*');

        if (error) {
            console.error('Error fetching data:', error);
            return;
        }
        return data;
        //console.log('Fetched data:', userList);
        // You can now use the 'data' variable to display your information.

    } catch (err) {
        console.error('An unexpected error occurred:', err);
    }
}

function checkLogin(userListVar){
    const userNameInputElement = document.querySelector('.js-User-Name');
    const userNameInput = userNameInputElement.value;
    
    const userPasswordInputElement = document.querySelector('.js-User-Password');
    const userPasswordInput = userPasswordInputElement.value;

    let loginSuccess = false;
    console.log(userListVar);

    userListVar.forEach((user) => {
        //const user = userArray[0];
        const userName = user.username; //getting the saved username
        const userPassword = user.password;//getting the save user password
        console.log(userName);
        console.log(userPassword);
        if(userNameInput === userName && userPasswordInput === userPassword) { //checks to make sure the user input the correct username and password from our list
            loginSuccess = true;
            if(user.role === 'PM' || user.role === 'VP'){
                localStorage.setItem('loggedInUser',JSON.stringify(user.username));
                window.location.href = '/src/pmPage.html' //this opens our pmDashboard.html and the code associated with that
                //console.log('success')
                //alert('success')
                return; //exit the loop early
            };
            if(user.role === 'Admin'){
                localStorage.setItem('loggedInUser',JSON.stringify(user.userName));
                window.location.href = '/src/adminPage.html'
                return; //exit the loop early
            };
            return;//exit the loop early
        };
    });

    if(!loginSuccess){
        alert('Incorrect username or password.');
    }
}
