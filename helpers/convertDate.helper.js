module.exports.convertToISODate = (dateStr) => {
    if (!dateStr) 
        return null;
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
}

module.exports.convertDateTime = (date, time) => {
    const delimiter = date.includes('/') ? '/' : '-';
    const [day, month, year] = date.split(delimiter);

    if (!day || !month || !year || day.length !== 2 || month.length !== 2 || year.length !== 4) {
        throw new Error(`Định dạng ngày không hợp lệ: ${date}`);
    }

    const formattedDatetime = `${year}-${month}-${day} ${time}:00`;
    return formattedDatetime;
}