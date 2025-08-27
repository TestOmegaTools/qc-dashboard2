//loginPage.js
import supabase from "./config/supabaseClient.js"

// Wrap the entire login logic in an event listener
document.querySelector('.js-login-button').addEventListener('click', async () => {
    const userNameInput = document.querySelector('.js-User-Name').value;
    const userPasswordInput = document.querySelector('.js-User-Password').value;
    //console.log(userNameInput + '' + userPasswordInput)
    // Use a try/catch block for error handling
    try {
        // Sign in using email and password.
        // You would need to change your 'username' column to 'email' in the Supabase Auth table.
        // You could also create a custom sign-in function if you want to use the 'username' column,
        // but it's generally better to use the email.
        const { data, error } = await supabase.auth.signInWithPassword({
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
        const loggedInUser = data.user;
        const { data: userData, error: userError } = await supabase
            .from('user_list')
            .select('role') // Fetch the role from your user_list table
            .eq('emailAddress', loggedInUser.email); // Assuming username is stored as the email

        if (userError) {
            console.error('Error fetching user role:', userError);
            return;
        }

        if (userData && userData.length > 0) {
            const userRole = userData[0].role;
            sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser.email));
            setTimeout(() => {
                if (userRole === 'PM' || userRole === 'VP') {
                    window.location.href = 'pmPage.html';
                } else if (userRole === 'Admin') {
                    window.location.href = '/src/adminPage.html';
                }
            },500)
            /*if (userRole === 'PM' || userRole === 'VP') {
                window.location.href = 'pmPage.html';
            } else if (userRole === 'Admin') {
                window.location.href = '/src/adminPage.html';
            }*/
        }
    } catch (err) {
        console.error('An unexpected error occurred:', err);
    }
});