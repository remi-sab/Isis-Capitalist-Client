import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
import { Product, Pallier } from '../world';


declare var require;
const ProgressBar = require("progressbar.js");

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})

export class ProductComponent implements OnInit {
  @ViewChild('bar') progressBarItem: ElementRef;
  progressbar: any;
  lastupdate: number;
  product: Product;
  isRun: boolean;
  maxAchat: number;

  @Output() notifyProduction: EventEmitter<Product> = new EventEmitter<Product>();
  @Output() notifyBuying: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  @Input()
  set prod(value: Product) {
    this.product = value;
    if (this.product && this.product.timeleft > 0){
      this.lastupdate = Date.now();
      let progress = (this.product.vitesse - this.product.timeleft) / this.product.vitesse;
      this.progressbar.set(progress);
      this.progressbar.animate(1, { duration : this.product.timeleft});
    }
  }

  _money: number;
  @Input()
  set money(value: number) {
    this._money = value;
    console.log(this._money)
  }

   _qtmulti: string; 
  @Input() 
  set qtmulti(value: string) { 
    if(value == 'Max'){
      this._qtmulti = 'X'+this.calcMaxCanBuy();
    } else {
      this._qtmulti = value;
    }
  }

  ngOnInit(): void {
    setInterval(() => { this.calcScore(); }, 1000);
  }

  ngAfterViewInit() {
    setTimeout(()=> {
      this.progressbar = new ProgressBar.Line(this.progressBarItem.nativeElement, {
        strokeWidth: 4,
        easing: 'easeInOut',
        color: '#1febfd',
        trailColor: '#eee',
        trailWidth: 1,
        svgStyle: { width: '100%', height: '100%' },
        //step (state, progressbar) => {
          //progressbar.path.setAttribute('stroke', state.color);
        //}        
      });
    }, 100)
}

  startFabrication() {
    if (this.product.quantite >= 1) {
    console.log('Fabrication commencée')
    this.product.timeleft = this.product.vitesse;
    this.lastupdate = Date.now();
    let progress = (this.product.timeleft-this.product.vitesse)/this.product.vitesse;
    this.progressbar.animate(1, { duration: progress });
    
    this.isRun = true;
    }
  }

  calcScore() {
    if (this.isRun) {
      if (this.product.timeleft > 0) {
        this.product.timeleft = this.product.timeleft - (Date.now() - this.lastupdate);
        console.log('coucou');
      } else {
        this.lastupdate = 0;
        this.product.timeleft = 0;
        this.progressbar.set(0);
        this.isRun = false;
      }
      this.notifyProduction.emit(this.product);
    }
    if (this.product.managerUnlocked) {
      this.startFabrication();
  }
}

  calcMaxCanBuy(): number {
    let quantiteMax: number = 0;
    let maxim: number = 0;
    let max: number = 1;
    while (maxim < this._money) {
      max = max * this.product.cout;
      maxim = maxim + max;
      quantiteMax = quantiteMax + 1;
      if(this.product.cout > this._money){
        quantiteMax = 0;
      }
    }
    return quantiteMax;
  }

  onBuy(){
    if(this._qtmulti == 'X1' &&  this._money >= this.product.cout){
      var coutAchat = this.product.cout;
      this.product.quantite = this.product.quantite + 1;
    } 
    if(this._qtmulti == 'X10' &&  this._money >= this.product.cout*10){
      var coutAchat = this.product.cout*10;
      this.product.quantite = this.product.quantite + 10;
    }
    if(this._qtmulti == 'X100' &&  this._money >= this.product.cout*100){
      var coutAchat = this.product.cout*100;
      this.product.quantite = this.product.quantite + 100;
    }
    if(this._qtmulti == 'Max' &&  this._money >= this.product.cout*this.calcMaxCanBuy()){
      var coutAchat = this.product.cout*this.calcMaxCanBuy();
      this.product.quantite = this.product.quantite + this.calcMaxCanBuy();
    } 
    this.notifyBuying.emit(coutAchat);
  }

  calcUpgrade(pallier: Pallier) {
    switch (pallier.typeratio) {
      case 'vitesse':
        this.product.vitesse = this.product.vitesse / pallier.ratio;
        break;
      case 'gain':
        this.product.revenu = this.product.revenu * pallier.ratio;
        break;
    }
  }

}
