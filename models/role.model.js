class Role {
    constructor(roleId, title, desc, status, createdAt, updatedAt) {
        this.roleId = roleId;
        this.title = title;
        this.desc = desc;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

module.exports = Role;