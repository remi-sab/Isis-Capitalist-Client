import { Component, OnInit } from '@angular/core';
import { RestserviceService } from './restservice.service';
import { World, Product, Pallier } from './world';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'IsisCapitalist-Client';
  world: World = new World();
  server: string;
  qtmulti : string = "X1";
  managerDispo : boolean;

  constructor(private service: RestserviceService){
    this.server = service.getServer(); 
    service.getWorld().then(
      world => { this.world = world; 
        console.log("world:",world);
      }).catch(error => {console.log("error:",error)});
  }

  onProductionDone(p : Product){
    this.world.money = this.world.money + p.revenu;
    this.world.score = this.world.score + p.revenu;
  }

  commutateur(){
    switch(this.qtmulti){
      case 'X1' : this.qtmulti = 'X10';
      break;
      case 'X10' : this.qtmulti = 'X100';
      break;
      case 'X100' : this.qtmulti = 'Max';
      break;
      case 'Max' : this.qtmulti = 'X1';
      break;
      default : this.qtmulti = 'X1';
      break;
    }
  }

  onBuyDone(n : number){
    if(this.world.money >= n){
    this.world.money = this.world.money - n;
    } else {
      this.world.money = this.world.money;
    }
  }

  managerDisponibility() : void {
    this.managerDispo = false;
    this.world.managers.pallier.forEach(val => {
      if(!this.managerDispo){
        if(this.world.money > val.seuil){
          this.managerDispo = true;
        }
      }
    })
  }

  achatManager(m : Pallier){
    if(this.world.money >= m.seuil){
      this.world.money = this.world.money - m.seuil;
      var index = this.world.managers.pallier.indexOf(m);
      this.world.managers.pallier[index].unlocked = true;

      this.world.products.product.forEach(element => {
        if(m.idcible==element.id){
           var index = this.world.products.product.indexOf(element);
           this.world.products.product[index].managerUnlocked = true;
        }
      });
      this.managerDisponibility();
    }
  }

}
