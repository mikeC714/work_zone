import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar'

dayjs.extend(calendar)

export const calendarConfig = {
  sameDay: '[Today at] h:mm A',
  nextDay: '[Tomorrow at] h:mm A',      
  nextWeek: '[Next] dddd [at] h:mm A', 
  lastDay: '[Yesterday at] h:mm A',    
  lastWeek: '[Last] dddd [at] h:mm A', 
  sameElse: 'DD/MM/YYYY [at] h:mm A'     
};