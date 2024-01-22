import { Component, ElementRef, HostBinding, Input } from '@angular/core';
import { ModalControllerService } from '../../../core/services/modal-controller.service';

@Component({
    selector: 'modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
    modalId!: string;
    content: any;

    @HostBinding("class.closed")
    isModalOpen: boolean = false;

    constructor(
        private modalService: ModalControllerService,
        private elementRef: ElementRef
    ) {
        this.modalService.getModal().subscribe({
            next: (value: boolean) => {
                this.isModalOpen = !value;
            }
        });
    }

    close(): void {
        this.modalService.hideModal(this.modalId);
    }



}
