//loginPage.js
import supabase from "./config/supabaseClient.js"

// Wrap the entire login logic in an event listener
document.querySelector('.js-login-button').addEventListener('click', async () => {
    const userNameInput = document.querySelector('.js-User-Name').value;
    const userPasswordInput = document.querySelector('.js-User-Password').value;

    // Use a try/catch block for error handling
    try {
        // Sign in using user input email and password.
        const { data, error } = await supabase.auth.signInWithPassword({ //this actually sends the user input email and password to Supabase for verification
            email: userNameInput,
            password: userPasswordInput,
        });
        
        if (error) {
            // Handle login error
            alert('Incorrect username or password. Please try again.');
            console.error('Login error:', error);
            return;
        }

        // Handle successful login
        const loggedInUser = data.user;//save our loggedInUser variable
        const { data: userData, error: userError } = await supabase
            .from('user_list') //table we're checking for user information such as role
            .select('role') // Fetch the role from your user_list table
            .eq('emailAddress', loggedInUser.email); // Assuming username is stored as the email

        if (userError) {
            console.error('Error fetching user role:', userError);
            return;
        }

        const { data: userName} = await supabase
            .from('user_list') //table we're checking for user information such as role
            .select('name') // Fetch the role from your user_list table
            .eq('emailAddress', loggedInUser.email); // Assuming username is stored as the email
        
        userName.forEach((justName) =>{//this is what gives us just the name so we can use it in the dashboard
            const userNameText = justName.name;
            sessionStorage.setItem('loggedInUserNameOnly', JSON.stringify(userNameText));
        })

        if (userData && userData.length > 0) {
            const userRole = userData[0].role;
            sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser.email));//saves the user info for use in other code bases like pmPage.js
            setTimeout(() => { //makes the page wait a few seconds before sign in so everything is loaded
                if (userRole === 'PM' || userRole === 'VP') { //ensures what role user has so we can send them to correct page
                    window.location.href = 'pmPage.html';
                } else if (userRole === 'Admin') {
                    window.location.href = '/src/adminPage.html';
                }
            },500)
        }
    } catch (err) {
        console.error('An unexpected error occurred:', err);
    }
});

//Here we add some functionality for the user to reset their password. This first function adds event listener to the forgot password button
document.querySelector('.js-forgot-password').addEventListener('click', async () => {
    const userNameInput = document.querySelector('.js-User-Name').value;
    sendPasswordResetEmail(userNameInput);

});
//This function runs when forgot password button is pressed
async function sendPasswordResetEmail(email){
    const{data, error} = await supabase.auth.resetPasswordForEmail(email, { //supabase can send an authenticated email to the user
        redirectTo: 'https://testomegatools.github.io/qc-dashboard2/resetPassword.html',//and redirects them to this url we provide. This is the new form 
    })

    if(error){
        console.error ('Error sending password reset email.')
        alert('An error occured. Please try again later')
    }else{
        alert('Password reset email sent successfully. Please check your inbox.')
    }
};