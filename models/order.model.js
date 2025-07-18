class Order {
    constructor(ordId, cusId, ordDate, paymentType, workingAddress, startDate, endDate, serviceId, status, updatedAt, updatedBy) {
        this.ordId = ordId;
        this.cusId = cusId;
        this.ordDate = ordDate;
        this.paymentType = paymentType;
        this.workingAddress = workingAddress;
        this.startDate = startDate;
        this.endDate = endDate;
        this.serviceId = serviceId;
        this.status = status;
        this.updatedAt = updatedAt;
        this.updatedBy = updatedBy;
    }
}

module.exports = Order;