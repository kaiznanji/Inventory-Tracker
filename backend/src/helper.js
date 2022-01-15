module.exports = {
    isArray(a) {
        return (!!a) && (a.constructor === Array);
    },
    findDuplicates(arr) {
        return arr.filter((item, index) => arr.indexOf(item) != index);
    },
    isNumeric(value) {
        return /^-?\d+$/.test(value);
    }
}