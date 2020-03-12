import { Component } from '@angular/core';
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

  constructor(private service: RestserviceService){
    this.server = service.getServer(); 
    service.getWorld().then(
      world => { this.world = world; 
        console.log("world:",world);
      }).catch(error => {console.log("error:",error)});
  }

  onProductionDone(p : Product){
    this.world.money = this.world.money + p.revenu;
    console.log("je suis passé");
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
}
