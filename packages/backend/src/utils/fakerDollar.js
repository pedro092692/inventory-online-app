/**
 * A class to generate fake historical dollar price data.
 */
class FakerDollar {
    /**
     * @param {number} [count=6] - The number of past months to generate data for.
     */
    constructor(count = 6) {
        this.today = new Date()
        this.startDate = new Date(this.today); 
        this.months = count
        this.dollarInitial = 51.9
    }
    /**
     * Creates an array of dates from a specified number of months ago until today.
     * @returns {Array<Date>} An array of Date objects.
     */
    createDates() {
        const dates = []

        // set monts 6 monts ago (default)
        this.startDate.setMonth(this.today.getMonth() - this.months)
        // set startDate to first date of the month
        this.startDate.setDate(1)
        
        // generate each dates
        for(let currentDate = new Date(this.startDate); currentDate <= this.today; currentDate.setDate(currentDate.getDate() + 1)) {
            // generate random hours 
            const randomHour = Math.floor(Math.random() * (17 - 16 + 1)) + 16
            // generate random minutes 
            const randomMinute = Math.floor(Math.random() * 36)
            // generate random seconds
            const randomSeconds = Math.floor(Math.random() * 60)

            // create new date object 
            const dateToAdd = new Date(currentDate);
            
            // set time to current date 
            dateToAdd.setHours(randomHour)
            dateToAdd.setMinutes(randomMinute)
            dateToAdd.setSeconds(randomSeconds)
            dateToAdd.setMilliseconds(0)
            
            // push actual date to date array
            dates.push(dateToAdd)
        }

        return dates
    }

    /**
     * Generates dollar values for a given array of dates, simulating inflation.
     * It skips weekends (Saturday and Sunday).
     * @param {Array<Date>} dates - An array of dates for which to generate dollar values.
     * @returns {Array<{value: number, date: Date}>} An array of objects containing the value and date.
     */
    dollarValues(dates) {
        let value = this.dollarInitial
        const data = []
        for(let date of dates) {
            // exclude sarturday and sunday
            if( ![0,6].includes(date.getDay()) ) {
                // increase dollar value (inflation)
                value = Math.round((value * 1.0058) * 100) / 100
                data.push({
                    value: value,
                    date: date
                })      
            }
        }
        return data
    }
}

const faker = new FakerDollar()
const dates = faker.createDates()
const dollarValues = faker.dollarValues(dates)

export {dollarValues}
