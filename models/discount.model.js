class Discount {
    constructor(disId, title, desc, minCost, percentage, usageLimit, startDate, endDate, status, deleted, createdAt, updatedAt) {
        this.disId = disId;
        this.title = title;
        this.desc = desc;
        this.minCost = minCost;
        this.percentage = percentage;
        this.usageLimit = usageLimit;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.deleted = deleted;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

module.exports = Discount;