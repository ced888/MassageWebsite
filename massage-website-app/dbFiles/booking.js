//for testing purposes only
class Booking{
    constructor(BookingID, CustomerID, EmployeeID, MassageTypeID, DateCreated, DurationInMins, StartDateTime, EndDateTime, PriceTotal, Status, IsPaid){
        this.BookingID = BookingID;
        this.CustomerID = CustomerID;
        this.EmployeeID = EmployeeID;
        this.MassageTypeID = MassageTypeID;
        this.DateCreated = DateCreated;
        this.DurationInMins = DurationInMins;
        this.StartDateTime = StartDateTime;
        this.EndDateTime = EndDateTime;
        this.PriceTotal = PriceTotal;
        this.Status = Status;
        this.IsPaid = IsPaid;
    }
}

module.exports = Booking;