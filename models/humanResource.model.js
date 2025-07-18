class HumanResource {
    constructor(hmrId, accId, fullName, phone, address, birthDate, workingStartDate, educationLevel, sex, healthCertificates, availabilitySkills, rating) {
        this.hmrId = hmrId;
        this.accId = accId;
        this.fullName = fullName;
        this.phone = phone;
        this.address = address;
        this.birthDate = birthDate;
        this.workingStartDate = workingStartDate;
        this.educationLevel = educationLevel;
        this.sex = sex;
        this.healthCertificates = healthCertificates;
        this.availabilitySkills = availabilitySkills;
        this.rating = rating;
    }
}

module.exports = HumanResource;