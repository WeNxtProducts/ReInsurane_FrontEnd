import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  transform(value: string | Date, format: string = 'DD/MM/YYYY'): string {
    return value ? moment(value).format(format) : 'N/A';
  }

}
