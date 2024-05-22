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
