export const formateDate = (date) => {
    let month = date.getMonth() + 1;
    if (month < 10) month = "0" + month;
    let dateOfMonth = date.getDate();
    if (dateOfMonth < 10) dateOfMonth = "0" + dateOfMonth;
    const year = date.getFullYear().toString().substr(-2);
    return dateOfMonth + "/" + month + "/" + year;
  };