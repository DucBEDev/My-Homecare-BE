class Policy {
    constructor(policyId, title, content, imgPath, imgDesc, author, publishDate, status, createdAt, updatedAt, updatedBy, deleted) {
        this.policyId = policyId;
        this.title = title;
        this.content = content;
        this.imgPath = imgPath;
        this.imgDesc = imgDesc;
        this.author = author;
        this.publishDate = publishDate;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.updatedBy = updatedBy;
        this.deleted = deleted;
    }
}

module.exports = Policy;