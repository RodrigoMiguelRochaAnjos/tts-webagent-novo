import { Component, HostBinding, Input } from '@angular/core';
import { ModalControllerService } from '../../services/modal-controller.service';

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {

  constructor(
    private modalService: ModalControllerService
  ){

  }

  @Input() title!: string;
  
  toggleModal() {
    this.modalService.toggleModal();
    console.log(this.isModalOpen);
  }
  
  
  @HostBinding("class.closed")
  get isModalOpen(): boolean {
    return !this.modalService.getModalValue()
  }

}
