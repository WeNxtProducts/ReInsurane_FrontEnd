
export const percentageValidator = (value:any) =>{
    if (value == null || value === '') {
        return null; 
      }
      value = parseInt(value)
      if (typeof (value === 'number') && value >= 0 && value <= 100) {
        return null;
      }else{
        return { percentage: true };
      }
}