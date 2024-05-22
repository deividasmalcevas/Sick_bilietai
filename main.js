//imports
import { user_login, logged_in } from './global_functions.js';

//elements from HTML
const logged = document.getElementById(`logged_in`);
//btns
const btn_login_user = document.getElementById(`btn_login_user`);
const btn_login_admin = document.getElementById(`btn_login_admin`);

//btns clicks
if(btn_login_user){
    btn_login_user.onclick = () => {
        user_login(`user`)
        window.location.href = 'login.html';
    }
}
if(btn_login_admin){
    btn_login_admin.onclick = () => {
        user_login(`admin`)
        window.location.href = 'login.html';
    }
}
if(logged){
    logged.textContent = logged_in()
}

