//apparently dont need this cuz we put it in front end
class Employee{
    constructor(EmployeeID, FirstName, LastName, Email, PhoneNumber, PasswordHash, ImageURL, IsPractitioner){
        this.EmployeeID = EmployeeID;
        this.FirstName = FirstName;
        this.LastName = LastName;
        this.Email = Email;
        this.PhoneNumber = PhoneNumber;
        this.PasswordHash = PasswordHash;
        this.ImageURL = ImageURL;
        this.IsPractitioner = IsPractitioner;
    }
}

module.exports = Employee;