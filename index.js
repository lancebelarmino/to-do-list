const userLocale = require('get-user-locale');

exports.getDate = () => {
    let date = new Date();
    let options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    };

    return date.toLocaleDateString(userLocale, options); /* or 'en-US' */
};

exports.getTime = () => {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const convertedHour = unconvertedHour(hours);

    function unconvertedHour(int) {
        return int % 12 || 12;
    }

    return `${convertedHour}:${minutes}:${seconds}`;
};