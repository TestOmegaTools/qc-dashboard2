//resetPassword.js
import supabase from "./config/supabaseClient.js"

const passwordResetForm = document.getElementById('password-reset-form');
const messageElement = document.getElementById('message');

passwordResetForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const newPassword = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  if (newPassword !== confirmPassword) {
    messageElement.textContent = 'Passwords do not match.';
    return;
  }

  // Use the updateUser method to set the new password for the current user.
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    messageElement.textContent = `Error updating password: ${error.message}`;
    console.error(error);
  } else {
    messageElement.textContent = 'Password updated successfully! Close this window and login again.';
    // Redirect the user to your main dashboard or login page.
    //setTimeout(() => {
    //  window.location.href = '/dashboard.html';
    //}, 2000);
  }
});