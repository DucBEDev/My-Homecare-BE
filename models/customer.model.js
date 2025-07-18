class Customer {
    constructor(cusId, accId, fullName, phone, address, point) {
        this.cusId = cusId;
        this.accId = accId;
        this.fullName = fullName;
        this.phone = phone;
        this.address = address;
        this.point = point;
    }
}

module.exports = Customer;