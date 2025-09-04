//resetPassword.js
import supabase from "./config/supabaseClient.js"

const passwordResetForm = document.getElementById('password-reset-form');//get the reset form
const messageElement = document.getElementById('message');

passwordResetForm.addEventListener('submit', async (e) => {//add event listener if the submit button is clicked
  e.preventDefault();

  const newPassword = document.getElementById('password').value;//get our new passwords
  const confirmPassword = document.getElementById('confirm-password').value;

  if (newPassword !== confirmPassword) {//check that they match
    messageElement.textContent = 'Passwords do not match.';
    return;
  }

  // Use the updateUser method to set the new password for the current user.
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {//error handling
    messageElement.textContent = `Error updating password: ${error.message}`;
    console.error(error);
  } else {
    messageElement.textContent = 'Password updated successfully! Close this window and login again.';//tells user password was successfully reset
    // Redirect the user to your main dashboard or login page.
    //setTimeout(() => {
    //  window.location.href = '/dashboard.html';
    //}, 2000);
  }
});