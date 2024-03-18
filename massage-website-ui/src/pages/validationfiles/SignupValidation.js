
//not a page
function Validation(values){
    let error = {}
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/

    if(values.FirstName === "") {
        error.FirstName = "First Name is empty"
    } else {
        error.FirstName = ""
    }

    if(values.LastName === "") {
        error.LastName = "Last Name is empty"
    } else {
        error.LastName = ""
    }

    if(values.PhoneNumber === "") {
        error.PhoneNumber = "Phone Number is empty"
    } else {
        error.PhoneNumber = ""
    }

    if(values.Email === "") {
        error.Email = "Email is empty"
    } else if(!email_pattern.test(values.Email)){
        error.Email = "Not a valid email"
    } else {
        error.Email = ""
    }
    
    return error;
}

function passValidation(values){
    let error = {}
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/
    
    if(values.PasswordHash === ""){
        error.PasswordHash = "Password is empty"
    } else if(!password_pattern.test(values.PasswordHash)){
        error.PasswordHash = "Password is too weak"
    } else {
        error.PasswordHash = ""
    }
    
    return error;
}

export {Validation, passValidation};