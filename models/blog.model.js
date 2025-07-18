class Blog {
    constructor(blogId, title, tags, description, imgPath, imgDesc, author, content, publishDate, status, createdAt, updatedAt, updatedBy, deleted) {
        this.blogId = blogId;
        this.title = title;
        this.tags = tags;
        this.description = description;
        this.imgPath = imgPath;
        this.imgDesc = imgDesc;
        this.author = author;
        this.content = content;
        this.publishDate = publishDate;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.updatedBy = updatedBy;
        this.deleted = deleted;
    }
}

module.exports = Blog;