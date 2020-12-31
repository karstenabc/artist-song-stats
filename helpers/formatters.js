// Format date
export function dateToString(dateString) {
    let date = new Date(dateString)
    return date.toDateString()
}
   
// Comma seperate thousands
export function formattedNumber(number) {
    if (number) {
        if ((number + '').includes('.')) {
            number = number.toFixed(2)
        }
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
    return ''
}
