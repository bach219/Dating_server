import dateFormat from "dateformat";
const now = new Date();
dateFormat.i18n = {
    dayNames: [
        "CN",
        "T2",
        "T3",
        "T4",
        "T5",
        "T6",
        "T7",
        "Chủ nhật",
        "Thứ 2",
        "Thứ 3",
        "Thứ 4",
        "Thứ 5",
        "Thứ 6",
        "Thứ 7",
    ],
    monthNames: [
        "Thg 1",
        "Thg 2",
        "Thg 3",
        "Thg 4",
        "Thg 5",
        "Thg 6",
        "Thg 7",
        "Thg 8",
        "Thg 9",
        "Thg 10",
        "Thg 11",
        "Thg 12",
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12",
    ],
    timeNames: ["s", "c", "sa", "ch", "S", "C", "SA", "CH"],
};


let getCurrentDate = () => {
    return dateFormat(now, "dddd, dd mmmm, yyyy, h:MM:ss TT"); 
}

let getCurrentMonthName = () => {
    return dateFormat(now, "mmmm");
}

let getCurrentDayName = () => {
    return dateFormat(now, "dddd");
}
let generateRandomNum = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
};


let metaResponse = (status, result, message) => {
    return {
        code: status,
        result: result,
        message: message
    }
};

let metaError = (status, result, message, type) => {
    return {
        code: status,
        result: result,
        message: message,
        type: type
    }
};

let arrayRemove = (arr, value) => {

    return arr.filter(function (ele) {
        return ele._id !== value;
    });

};

module.exports = {
    generateRandomNum,
    metaResponse,
    metaError,
    getCurrentDate,
    arrayRemove,
    getCurrentDayName,
    getCurrentMonthName,
};