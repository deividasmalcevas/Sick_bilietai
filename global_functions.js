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

    movies.push({ title: title, img: img, seats: seats });

    create_local_storage('movies', movies);

    window.location.href = 'movie_list.html';
}
export function display_movies(div){
    let movies = get_local_storage('movies') || [];
    movies.forEach((mov) =>{
        const movie = document.createElement('div');
        movie.classList.add('movie');

        const movie_img = document.createElement('div');
        movie_img.classList.add('movie_img');
        movie_img.style.backgroundImage = `url("${mov.img}")`
        const movie_info = document.createElement('div');
        movie_info.innerHTML = `<h5>${mov.title}</h5><h6>Available seats: ${mov.seats}</h6>`
        movie.onclick = () => {

        }
        movie.appendChild(movie_img)
        movie.appendChild(movie_info)
        if(logged_in() === `admin`){
            const btn_del = document.createElement('button');
            btn_del.classList.add('btn', `btn-danger`);
            btn_del.textContent = `remove movie`
            btn_del.onclick = () => {

            }
            movie.appendChild(btn_del)
        }
        div.appendChild(movie)
    });
}