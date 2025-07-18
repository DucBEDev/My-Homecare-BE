class Question {
    constructor(quesId, question, answer, author, publishDate, status, createdAt, updatedAt, updatedBy, deleted) {
        this.quesId = quesId;
        this.question = question;
        this.answer = answer;
        this.author = author;
        this.publishDate = publishDate;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.updatedBy = updatedBy;
        this.deleted = deleted;
    }
}

module.exports = Question;