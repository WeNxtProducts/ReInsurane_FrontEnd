import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonLogicService {
   totalCount:any[] = [];
   count = 1; 
  constructor() { }

  generateNextNumber() {
    let formattedNumber = `FAC-${String(this.count).padStart(6, '0')}`; 
    return formattedNumber;
}

validateAndAddNumber() {
  let newNumber = this.generateNextNumber();

  let isValid = !this.totalCount.includes(newNumber);
  
  if (isValid) {
      this.totalCount.push(newNumber);
      this.count++; 
  }
  return this.totalCount
}

}
