import { Injectable } from '@angular/core';
import { Menu } from '../models/menu.model';

@Injectable({
    providedIn: 'root',
})
export class MenuService {
    private rightMenu!: Menu;
    private targetedMenu!: Menu | null;
    private backdropDiv!: HTMLElement | null;

    constructor() { }

    initializeSwipeGesture(element: HTMLElement, rightMenu: Menu): void {
        this.rightMenu = rightMenu;
        const backdrop = document.createElement('div');
        backdrop.id = 'swipe-menu-backdrop';
        backdrop.style.display = 'block';
        backdrop.style.visibility = 'hidden';
        backdrop.style.width = '100%';
        backdrop.style.height = '100%';
        backdrop.style.position = 'absolute';
        backdrop.style.top = '0';
        backdrop.style.left = '0';
        backdrop.style.zIndex = '999';
        backdrop.style.backgroundColor = '#000000';
        backdrop.style.opacity = '0.5';

        element.appendChild(backdrop);
        this.backdropDiv = document.getElementById('swipe-menu-backdrop');
        this.backdropDiv?.addEventListener('click', () => {
            let openedMenu = this.rightMenu.opened ? this.rightMenu : null;
            
            if(openedMenu == null) return;

            this.toggleMenu(openedMenu.side);
        });
    }


    toggleMenu(side: 'right'): void {
        this.targetedMenu = side === 'right' ? this.rightMenu : null;
        if (this.targetedMenu == null) return;

        if (this.targetedMenu.opened) {
            this.targetedMenu.close();
        } else {
            this.targetedMenu.open();
        }

        this.backdropDiv!.style.visibility = this.targetedMenu.opened ? 'visible' : 'hidden';

        this.targetedMenu = null;
    }

    closeMenu(side: 'right'): void {
        this.targetedMenu = side === 'right' ? this.rightMenu : null;
        if (this.targetedMenu) {
            this.targetedMenu.close();

            this.backdropDiv!.style.visibility = 'hidden';

            this.targetedMenu = null;
        }
    }
}
