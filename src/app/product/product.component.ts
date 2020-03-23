import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
import { Product, Pallier } from '../world';
import { delay } from '../utils/delay.function';


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
  @Output() notifyUnlocked: EventEmitter<Pallier> = new EventEmitter<Pallier>();

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
    setInterval(() => { this.calcScore();}, 100);
    this.productsUnlocks();
    
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

  calcMaxCanBuy() {
  let quantiteMax = 0;
  let totalCost = 0;
  let costForOne = this.product.cout*(this.product.croissance**this.product.quantite);
  while ((totalCost+costForOne) <= this._money) {
    totalCost +=costForOne;
    quantiteMax ++;
    costForOne = costForOne * this.product.croissance;
  }
  return quantiteMax;
}

calcCost (qty : number) {
  let totalCost = 0;
  let costForOne = this.product.cout*(this.product.croissance**this.product.quantite);
  for(let i=0; i<qty; i++){
    totalCost += costForOne;
    costForOne = costForOne*this.product.croissance;
  }
  return totalCost;
}

  onBuy(){
    let qty : number;
    if(this._qtmulti === 'X1'){
      qty=1;
    }else if(this._qtmulti === 'X10'){
        qty=10;
    }else if(this._qtmulti == 'X100'){
        qty=100
    }else{
      qty=this.calcMaxCanBuy();
    }
    var coutAchat = this.calcCost(qty);
    console.log(coutAchat);
    if(this._money >= coutAchat){
      this.notifyBuying.emit(coutAchat);
      this.product.quantite = this.product.quantite + qty;
    }
    this.productsUnlocks();
  }

  calcUpgrade(pallier: Pallier) {
      switch (pallier.typeratio) {
      case 'VITESSE':
        this.product.vitesse = this.product.vitesse / pallier.ratio;
        break;
      case 'GAIN':
        this.product.revenu = this.product.revenu * pallier.ratio;
        break;
      }
  }

  productsUnlocks(){
    this.product.palliers.pallier.forEach(palier => {
      if(!palier.unlocked && this.product.quantite >= palier.seuil){
        palier.unlocked = true;
        this.calcUpgrade(palier);
        this.notifyUnlocked.emit(palier);
      }
      
    });

    }

}
