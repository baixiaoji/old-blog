const moment = require("moment")

const log = console.log

// 获取当地的时间
log( moment().locale() )

//获取当下的时间
log('现在的时间是：', moment() )
log('现在的时间是：', moment('2017-08-28','YYYY-MM-DD HH:mm') )

// Set / Get
log(
 'Minute', moment().minutes(),"\n",
 'Hour',moment().hour(),"\n",
 'date',moment().date(),"\n",
 'yeaterday',moment().day(-1),"\n",
 'weekday', moment().weekday(0),"\n",
 'gain the month', moment().month(),"\n",
 'gain the last day in month', moment().month('2').daysInMonth(),'\n'
)

for(i = 0; i<=11; i++){
  const lastDayInMonth = moment().month(i).daysInMonth()
  console.log( (i+1)+'月的最后一天是：'+ lastDayInMonth)
}
