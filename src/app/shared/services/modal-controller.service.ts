import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalControllerService {
  
  private modal$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }


  public getModal(): Observable<boolean> {
    return this.modal$;
  }

  public getModalValue(): boolean {
    return this.modal$.value;
  }

  public toggleModal() : void {
    
    this.modal$.next(!this.modal$.value);
  }
}
