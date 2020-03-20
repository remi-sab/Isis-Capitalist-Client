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
      this._qtmulti = 'X'+this.calcMaxCanBuy(true);
    } else {
      this._qtmulti = value;
    }
  }

  ngOnInit(): void {
    setInterval(() => { this.calcScore(); }, 100);
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
      });
    }, 100)
}

  startFabrication() {
    if (this.product.quantite >= 1 && !this.isRun) {
    console.log('Fabrication commencée')
    this.product.timeleft = this.product.vitesse;
    this.lastupdate = Date.now();
    this.progressbar.animate(1, { duration: this.product.vitesse });
    this.isRun = true;
    }
  }

  calcScore() {
    if (this.isRun) {
      if (this.product.timeleft > 0) {
        this.product.timeleft = this.product.timeleft - (Date.now() - this.lastupdate);
        this.lastupdate = Date.now();
        console.log('coucou');
      } else {
        this.isRun = false;
        this.lastupdate = 0;
        this.product.timeleft = 0;
        this.progressbar.set(0);
        this.notifyProduction.emit(this.product);
      }
    }
    if (this.product.managerUnlocked) {
      this.startFabrication();
  }
}

calcMaxCanBuy(qty : boolean) {
  let quantiteMax = 0;
  let maxim = 0;
  let max = this.product.cout*(this.product.croissance**this.product.quantite);
  if(max <= this._money){
    while ((maxim+max) < this._money) {
      maxim += max;
      quantiteMax ++;
      max = max * this.product.croissance;
    }
  }
  if(qty === true){
  return quantiteMax;
  } 
  return maxim;
}

calcCost (qty : number) {
  let quantiteMax = 0;
  let maxim = 0;
  let max = this.product.cout*(this.product.croissance**this.product.quantite);
    for (let i =0; i<qty;i++) {
      maxim += max;
      quantiteMax ++;
      max = max * this.product.croissance;
    }
  return maxim;
}

  onBuy(){
    if(this._qtmulti == 'X1' &&  this._money >= this.calcCost(1)){
      var coutAchat = this.product.cout;
      this.product.quantite = this.product.quantite + 1;
    } 
    else if(this._qtmulti == 'X10' &&  this._money >= this.calcCost(10)){
      var coutAchat = this.product.cout*10;
      this.product.quantite = this.product.quantite + 10;
    }
    else if(this._qtmulti == 'X100' &&  this._money >= this.calcCost(100)){
      var coutAchat = this.product.cout*100;
      this.product.quantite = this.product.quantite + 100;
    }
    else {
      var coutAchat = this.calcMaxCanBuy(false);
      this.product.quantite = this.product.quantite + this.calcMaxCanBuy(true);
    } 
    console.log(coutAchat);
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
