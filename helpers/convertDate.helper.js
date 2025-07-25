module.exports.convertToISODate = (dateStr) => {
    if (!dateStr) 
        return null;
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
}