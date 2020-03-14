import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal',
  template: './modal.component.html',
  styleUrls : ['./modal.component.css']
})

export class ModalComponent implements OnInit {

  public visible = false;
  public visibleAnimate = false;

constructor() {}

  public show(): void {
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true, 100);
  }

  public hide(): void {
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
  }

  public onContainerClicked(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains('modal')) {
      this.hide();
    }
  }

  ngOnInit():void{}
}
