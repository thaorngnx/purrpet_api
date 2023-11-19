import Moment from 'moment';

export const hadelDateinBookHome = async (timeUsed, date) => {

   if(timeUsed === "CAT_11" || timeUsed === "CAT_12" || timeUsed === "CAT_13"){
     const date1 =  Moment(date);
     const date2 = date1.add(1, 'days');
      return date2.format('YYYY-MM-DD');
   }
}
