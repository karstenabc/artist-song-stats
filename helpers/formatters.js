// Format date
export function dateToString(dateString) {
    let date = new Date(dateString)
    return date.toDateString()
}
   
// Comma seperate thousands
export function formattedNumber(number) {
    return number 
    ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : ''
}
