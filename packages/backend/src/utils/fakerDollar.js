class FakerDollar {
    constructor(count = 6) {
        this.today = new Date()
        this.startDate = new Date(this.today); 
        this.months = count
        this.dollarInitial = 51.9
    }

    createDates() {
        const dates = []

        // set start date 
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

