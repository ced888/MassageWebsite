
//not a page
function Validation(values){
    let error = {}
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/

    if(values.Email === "") {
        error.Email = "Email is empty"
    } else if(!email_pattern.test(values.Email)){
        error.Email = "Email doesn't match"
    } else {
        error.Email = ""
    }

    if(values.PasswordHash === ""){
        error.PasswordHash = "Password is empty"
    } else if(!password_pattern.test(values.PasswordHash)){
        error.PasswordHash = "Password doesn't match"
    } else {
        error.PasswordHash = ""
    }

    return error;
}

export default Validation;