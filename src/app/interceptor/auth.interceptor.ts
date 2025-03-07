import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

 let token = req.clone({
      setHeaders:{
        Authorization : ''
      }
  })

  return next(token);
};
