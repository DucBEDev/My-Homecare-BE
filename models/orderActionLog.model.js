class OrderActionLog {
    constructor(logId, ordId, empId, actionType, timestamp, description) {
        this.logId = logId;
        this.ordId = ordId;
        this.empId = empId;
        this.actionType = actionType;
        this.timestamp = timestamp;
        this.description = description;
    }
}

module.exports = OrderActionLog;