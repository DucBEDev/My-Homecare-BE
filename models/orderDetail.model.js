class OrderDetail {
    constructor(ordId, detailId, helperId, discId, workingDate, ordDetailCost, helperCost, isLoseThings, isBreakThings, comment, rating, status, orderReceivedAt, workStartedAt, workEndedAt) {
        this.ordId = ordId;
        this.detailId = detailId;
        this.helperId = helperId;
        this.discId = discId;
        this.workingDate = workingDate;
        this.ordDetailCost = ordDetailCost;
        this.helperCost = helperCost;
        this.isLoseThings = isLoseThings;
        this.isBreakThings = isBreakThings;
        this.comment = comment;
        this.rating = rating;
        this.status = status;
        this.orderReceivedAt = orderReceivedAt;
        this.workStartedAt = workStartedAt;
        this.workEndedAt = workEndedAt;
    }
}

module.exports = OrderDetail;