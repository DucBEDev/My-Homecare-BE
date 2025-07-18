class Account {
    constructor(accId, roleId, email, password, token, tokenExpiry, status, createdAt, updatedAt) {
        this.accId = accId;
        this.roleId = roleId;
        this.email = email;
        this.password = password;
        this.token = token;
        this.tokenExpiry = tokenExpiry;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

module.exports = Account;