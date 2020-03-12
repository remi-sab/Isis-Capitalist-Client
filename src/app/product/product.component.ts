import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Product } from '../world';

declare var require;
const ProgressBar = require("progressbar.js");

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})

export class ProductComponent implements OnInit {
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
    console.log(value);
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
    this._qtmulti = value; 
    if (this._qtmulti && this.product) this.calcMaxCanBuy(); 
  }

  ngOnInit(): void {
    this.progressbar = new ProgressBar.Line("#bar", {
      strokeWidth: 100,
      easing: 'easeInOut',
      color: '#1febfd',
      trailColor: '#eee',
      trailWidth: 1,
      svgStyle: { width: '100%', height: '100%' }
    });
    setInterval(() => { this.calcScore(); }, 100);

  }

  startFabrication() {
    if (this.product.quantite >= 1) {
      this.progressbar.animate(1.0);
      this.product.timeleft = this.product.vitesse;
      this.lastupdate = Date.now();
      this.isRun = true;
      // this.progressbar.animated(1, { duration: this.product.vitesse });
    }
  }

  calcScore() {
    if (this.isRun) {
      if (this.product.timeleft > 0) {
        this.product.timeleft = this.product.timeleft - (Date.now() - this.lastupdate);
      } else {
        this.lastupdate = 0;
        this.product.timeleft = 0;
        this.progressbar.set(0);
        this.notifyProduction.emit(this.product);
        this.isRun = false;
      }
    }
  }

  calcMaxCanBuy() {
    if (this._qtmulti == 'Max') {
      var a = 1 - ((this._money/this.product.cout)*(1-this.product.croissance)) - this.product.croissance;
      var result = (Math.log(a)) - 1;
      this.maxAchat = Math.floor(result);
      this._qtmulti = "X"+this.maxAchat;
      console.log(this.maxAchat);
    }
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
    if(this._qtmulti == 'Max' &&  this._money >= this.product.cout*this.maxAchat){
      var coutAchat = this.product.cout*this.maxAchat;
      this.product.quantite = this.product.quantite + this.maxAchat;
    } 
    this.notifyBuying.emit(coutAchat);
  }

}
