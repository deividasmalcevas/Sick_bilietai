//imports
import {user_login, logged_in, check, create_movie, display_movies, get_local_storage, display_single_movie} from './global_functions.js';

//elements from HTML
const logged = document.getElementById(`logged_in`);
const movie_list = document.getElementById(`movie_list`);
const movie_cover = document.getElementById(`movie_cover`);
const movie_seats = document.getElementById(`movie_seats`);
//inputs
const movie_title = document.getElementById(`movieTitle`);
const movie_image = document.getElementById(`movieImage`);
const seats = document.getElementById(`seatsTotal`);
//btns
const btn_login_user = document.getElementById(`btn_login_user`);
const btn_login_admin = document.getElementById(`btn_login_admin`);
const btn_logout = document.getElementById(`btn_logout`);
const btn_create_movie = document.getElementById(`btn_create_movie`);

//vars
let logged_user
//btns clicks
if(btn_login_user){
    btn_login_user.onclick = () => {
        user_login(`user`)
        window.location.href = 'movie_list.html';
    }
}
if(btn_login_admin){
    btn_login_admin.onclick = () => {
        user_login(`admin`)
        window.location.href = 'movie_list.html';
    }
}
if(btn_logout){
    btn_logout.onclick = () => {
        window.location.href = 'index.html';
    }
}
if(btn_create_movie){
    btn_create_movie.onclick = () => {
        if(check(movie_title,movie_image, seats)) {
            create_movie(movie_title.value,movie_image.value, seats.value)
        }
    }
}
if(logged){
    logged_user = logged_in()
    logged.textContent = logged_user
    display_movies(movie_list)
    if(logged_user === `admin`){
        const movie = document.createElement('div');
        movie.classList.add('movie');
        movie.style.textAlign = `center`
        movie.textContent = `ADD new movie`;
        movie.onclick = () => {
            window.location.href = 'add_movie.html';
        }
        movie_list.appendChild(movie)
    }
}
if(movie_cover){
  display_single_movie(movie_cover, movie_seats)
}
