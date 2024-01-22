import { ApplicationRef, ComponentRef, EnvironmentInjector, Injectable, createComponent } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ModalComponent } from '../../shared/ui/modal/modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalControllerService {
  
  private modal$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private modalContent: any;
  private modalId!: string;

  private modalHistory: string[] = [];

  constructor(
      private appRef: ApplicationRef,
      private environmentInjector: EnvironmentInjector,
  ) { }


  public getModal(): Observable<boolean> {
    return this.modal$;
  }

  public getModalValue(): boolean {
    return this.modal$.value;
  }

    public showModal(content: any, modalId: string): void {
        this.modalContent = content;
        this.modalId = modalId;
        this.modal$.next(true);

        if (!this.modalHistory.includes(`modal-${this.modalId}`)) this.createModalComponent();
    }

    public hideModal(modalId: string): void {
        this.modalHistory = this.modalHistory.filter((value: string) => value !== `modal-${modalId}`)
        document.getElementById(`modal-${this.modalId}`)?.remove();
    }

    createModalComponent(): void {
        const componentRef: ComponentRef<ModalComponent> = createComponent(ModalComponent, {
            environmentInjector: this.environmentInjector
        });

        componentRef.instance.modalId = this.modalId;
        componentRef.instance.content = this.modalContent;

        const uniqueId = `modal-${this.modalId}`;
        componentRef.location.nativeElement.id = uniqueId;

        document.body.appendChild(componentRef.location.nativeElement);

        this.modalHistory.push(uniqueId);

        this.appRef.attachView(componentRef.hostView);

        componentRef.onDestroy(() => {
            this.appRef.detachView(componentRef.hostView);
            document.getElementById(uniqueId)?.remove();
        });
    }
}
