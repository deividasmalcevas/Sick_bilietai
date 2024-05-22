export function create_local_storage(name, content){
    localStorage.setItem(name, JSON.stringify(content))
}
export function get_local_storage(name){
    return JSON.parse(localStorage.getItem(name))
}
export function del_local_storage(name){
    localStorage.removeItem(name)
}
export function user_login(user){
    if(user === `user`){
        let LS = get_local_storage(`users`)
        if(!LS){
            let Users = [`User_1`]
            create_local_storage(`users`,Users)
            create_local_storage(`logged`, `User_1`)
        }
        else{
            const lastItem = LS[LS.length - 1];
            let new_user = parseInt(lastItem.slice(5))
            new_user++
            LS.push(`User_${new_user}`)
            create_local_storage(`users`, LS)
            create_local_storage(`logged`, `User_${new_user}`)
        }
    }
    else{
        console.log(`here`)
        create_local_storage(`logged`, `admin`)
    }
}
export function logged_in(){
    return get_local_storage(`logged`)
}
export function check(title, img, seats) {
    const fields = [title, img, seats];
    fields.forEach(field => change_input_bg(field, 'white'));

    if (!fields.every(field => field.value)) {
        fields.filter(field => !field.value).forEach(field => change_input_bg(field, 'red'));
        alert('Missing fields');
        return false;
    }
    if (title.value.length > 300) {
        change_input_bg(title, 'red');
        alert('Title too long');
        return false;
    }
    if (!valid_img(img.value)) {
        change_input_bg(img, 'red');
        alert('Please enter a valid image URL.');
        return false;
    }
    const seatsValue = parseInt(seats.value, 10);
    if (seatsValue < 1 || seatsValue > 100) {
        change_input_bg(seats, 'red');
        alert('There can only be 1-100 seats.');
        return false;
    }
    return true;
}
function change_input_bg(input, color){
   input.style.backgroundColor =  color
}
function valid_img(url) {
    const imageExtensions = /\.(jpeg|jpg|gif|png|svg|webp|bmp|tiff?)$/i;
    return imageExtensions.test(url);
}
export function create_movie(title, img, seats) {
    let movies = get_local_storage('movies') || [];
    let all_seats = [];
    for (let i = 1; i <= seats; i++) {
        all_seats.push({
            seat_nr: i,
            reserved: false
        });
    }
    movies.push({ title: title, img: img, all_seats});
    create_local_storage('movies', movies);
    window.location.href = 'movie_list.html';
}
export function display_movies(div){

    let movies = get_local_storage('movies') || [];
    movies.forEach((mov, index) =>{
        let del = false
        const movie = document.createElement('div');
        movie.classList.add('movie');

        const movie_img = document.createElement('div');
        movie_img.classList.add('movie_img');
        movie_img.style.backgroundImage = `url("${mov.img}")`
        const movie_info = document.createElement('div');
        let avi_seats = mov.all_seats.filter(seat => !seat.reserved);
        movie_info.innerHTML = `<div class="movie_title">${mov.title}</div>
        <h6>Available seats: ${avi_seats.length} / ${mov.all_seats.length}</h6>`
        movie.onclick = () => {
            if(del === false){
                create_local_storage(`selected_movie`, mov)
                window.location.href = 'single_movie.html';
            }
        }
        movie.appendChild(movie_img)
        movie.appendChild(movie_info)
        if(logged_in() === `admin`){
            const btn_del = document.createElement('button');
            btn_del.classList.add('btn', `btn-danger`);
            btn_del.textContent = `Remove Movie`
            btn_del.onclick = () => {
                movies = movies.filter((_, i) => i !== index);
                create_local_storage('movies', movies);
                div.removeChild(movie);
                del = true
            }
            movie.appendChild(btn_del)
        }
        div.appendChild(movie)
    });
}
export function display_single_movie(movie_cover, movie_seats){
    let sel_movie = get_local_storage(`selected_movie`)
    if(sel_movie){
        const movie_img = document.createElement('div');
        movie_img.classList.add('movie_cover');
        movie_img.style.backgroundImage = `url("${sel_movie.img}")`
        movie_cover.appendChild(movie_img)
        const movie_title = document.createElement('div');
        movie_title.classList.add('movie_title');
        movie_title.textContent = `${sel_movie.title}`
        movie_seats.appendChild(movie_title)
        const movie_all_seats = document.createElement('div');
        movie_all_seats.classList.add('movie_all_seats');
        sel_movie.all_seats.forEach((mov) => {
            const movie_seat = document.createElement('div');
            movie_seat.classList.add('movie_seat');
            movie_seat.textContent = `${mov.seat_nr}`
            if(mov.reserved) movie_seat.style.backgroundColor = `red`
            movie_seat.onclick = () => {
                if(!mov.reserved){
                    movie_seat.style.backgroundColor = `green`
                }
            }
            movie_all_seats.appendChild(movie_seat);
        });
        movie_seats.appendChild(movie_all_seats)

    }
}