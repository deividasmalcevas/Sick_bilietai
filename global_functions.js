function create_local_storage(name, content){
    localStorage.setItem(name, JSON.stringify(content))
}
function get_local_storage(name){
    return JSON.parse(localStorage.getItem(name))
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
export function admin_add(movie_list,logged){
    let logged_user = logged_in()
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
            reserved: false,
            reserved_by: `none`
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
                create_local_storage(`selected_movie`, index)
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
    let sel_movies = get_local_storage('movies') || [];
    let sel_movie = sel_movies[ get_local_storage(`selected_movie`)]
    let to_reserve = [];
    let to_un = [];
    if(sel_movie){
        const movie_img = document.createElement('div');
        movie_img.classList.add('movie_cover');
        movie_img.style.backgroundImage = `url("${sel_movie.img}")`
        movie_cover.appendChild(movie_img)

        const movie_title = document.createElement('div');
        movie_title.classList.add('movie_title');
        movie_title.textContent = `${sel_movie.title}`
        movie_seats.appendChild(movie_title)

        const seat_example = document.createElement('div');
        seat_example.classList.add('seat_example');
        for (let i = 0; i < 4; i++) {
            const box = document.createElement('div');
            box.classList.add('movie_seat');
            if(i === 0){
                const text = document.createElement('span');
                text.textContent = `Empty`
                seat_example.appendChild(text)
            }
            if(i === 1){
                const text = document.createElement('span');
                text.textContent = `Selected`
                seat_example.appendChild(text)
                box.style.backgroundColor = `green`
            }
            if(i === 2){
                const text = document.createElement('span');
                text.textContent = `Reserved`
                seat_example.appendChild(text)
                box.style.backgroundColor = `red`
            }
            if(i === 3){
                const text = document.createElement('span');
                text.textContent = `Reserved by you`
                seat_example.appendChild(text)
                box.style.backgroundColor = `grey`
            }
            seat_example.appendChild(box)
        }
        if(logged_in() === `admin`){
            const box = document.createElement('div');
            box.classList.add('movie_seat');
            const text = document.createElement('span');
            text.textContent = `Selected cancel`
            seat_example.appendChild(text)
            box.style.backgroundColor = `black`
            seat_example.appendChild(box)
        }
        movie_seats.appendChild(seat_example)

        const movie_all_seats = document.createElement('div');
        movie_all_seats.classList.add('movie_all_seats');
        sel_movie.all_seats.forEach((mov, index) => {
            let color
            const movie_seat = document.createElement('div');
            movie_seat.classList.add('movie_seat');
            movie_seat.textContent = `${mov.seat_nr}`
            if(mov.reserved) movie_seat.style.backgroundColor = `red`
            if(mov.reserved && mov.reserved_by === logged_in()) movie_seat.style.backgroundColor = `grey`
            movie_seat.onclick = () => {
                if(to_reserve.includes(index)){
                    to_reserve = to_reserve.filter(item => item !== index);
                    movie_seat.style.backgroundColor = `transparent`
                }
                else {
                    if(!mov.reserved){
                        to_reserve.push(index)
                        movie_seat.style.backgroundColor = `green`
                    }
                }
                if(to_un.includes(index)){
                    to_un = to_un.filter(item => item !== index);
                    movie_seat.style.backgroundColor = color
                }
                else {
                    if(mov.reserved && logged_in() === `admin`){
                        to_un.push(index)
                        color = movie_seat.style.backgroundColor
                        movie_seat.style.backgroundColor = `black`
                    }
                }
            }
            movie_all_seats.appendChild(movie_seat);
        });
        movie_seats.appendChild(movie_all_seats)

        const reserve = document.createElement('button');
        reserve.classList.add('btn', `btn-success`, `m-4`);
        reserve.textContent = `Reserve`
        reserve.onclick = () => {
            if(to_reserve.length === 0){
                return  alert(`You have not selected what to reserve`)
            }
            to_reserve.forEach(num =>{
                sel_movie.all_seats[num].reserved = true;
                sel_movie.all_seats[num].reserved_by = logged_in()
                create_local_storage(`movies`, sel_movies)
            });
            alert(`Seats reserved`)
            location.reload();
        }
        movie_seats.appendChild(reserve)

        if(logged_in() === `admin`){
            const un_reserve = document.createElement('button');
            un_reserve.classList.add('btn', `btn-danger`, `m-4`);
            un_reserve.textContent = `Cancel Reservations`
            un_reserve.onclick = () => {
                if(to_un.length === 0){
                    return  alert(`You have not selected what to cancel`)
                }
                to_un.forEach(num =>{
                    sel_movie.all_seats[num].reserved = false;
                    sel_movie.all_seats[num].reserved_by = `none`
                    create_local_storage(`movies`, sel_movies)
                });
                alert(`Seats reservation canceled`)
                location.reload();
            }
            movie_seats.appendChild(un_reserve)
        }

    }
}