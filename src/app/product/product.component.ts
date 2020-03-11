import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Product } from '../world';

declare var require; 
const ProgressBar = require("progressbar.js");

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})

export class ProductComponent implements OnInit {
  progressbar : any;
  lastupdate: number;
  product : Product;

  constructor() { }

    @Input()
    set prod(value:Product){
      this.product = value;
      console.log(value);
    }

  ngOnInit(): void {
    this.progressbar = new ProgressBar.Line("#bar", {
      strokeWidth: 100,
      easing: 'easeInOut',
      duration: 1400,
      color: '#FFEA82',
      trailColor: '#eee',
      trailWidth: 1,
      svgStyle: {width: '100%', height: '100%'}
    });
    
    
  }

  startFabrication(){
    if(this.product.quantite>=1){
      this.progressbar.animate(1.0);
      this.product.timeleft = this.product.vitesse;
      this.lastupdate = Date.now();
      this.progressbar.animated(1, { duration: this.product.vitesse});
    }
  }

}
