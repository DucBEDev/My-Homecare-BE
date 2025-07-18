class Service {
    constructor(serviceId, title, desc, basePrice, svcExtra, status, deleted, createdAt, updatedAt) {
        this.serviceId = serviceId;
        this.title = title;
        this.desc = desc;
        this.basePrice = basePrice;
        this.svcExtra = svcExtra;
        this.status = status;
        this.deleted = deleted;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

module.exports = Service;