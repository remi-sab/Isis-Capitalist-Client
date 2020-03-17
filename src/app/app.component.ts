import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { RestserviceService } from './restservice.service';
import { World, Product, Pallier } from './world';
import { ProductComponent } from './product/product.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChildren(ProductComponent) public productsComponent: QueryList<ProductComponent>;
  title = 'IsisCapitalist-Client';
  world: World = new World();
  server: string;
  qtmulti : string = "X1";
  managerDispo : boolean;
  upgradeDispo : boolean;

  constructor(private service: RestserviceService, private toastr : ToastrService){
    this.server = service.getServer(); 
    service.getWorld().then(
      world => { this.world = world; 
        console.log("world:",world);
      }).catch(error => {console.log("error:",error)});
  }

  onProductionDone(p : Product){
    this.world.money = this.world.money + p.revenu;
    this.world.score = this.world.score + p.revenu;
    this.managerDisponibility();
    this.upgradeDisponibility();
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
    this.managerDisponibility();
    this.upgradeDisponibility();
  }


  managerDisponibility() : void {
    this.managerDispo = false;
    this.world.managers.pallier.forEach(val => {
      if(!this.managerDispo){
          if(this.world.money > val.seuil && !val.unlocked){
          this.managerDispo = true;
          }
      }
    })
  }

  upgradeDisponibility(){
    this.upgradeDispo = false;
    this.world.upgrades.pallier.map(upgrade => {
      if(!this.upgradeDispo){
        if(!upgrade.unlocked && this.world.money > upgrade.seuil){
          this.upgradeDispo = true
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
      this.toastr.success("Achat de " + m.name + " effectué", "Manager")
    }
  }

  achatUpgrade (u : Pallier){
    if(this.world.money >= u.seuil){
      this.world.money = this.world.money - u.seuil;
      this.world.upgrades.pallier[this.world.upgrades.pallier.indexOf(u)].unlocked = true;
      
      if(u.idcible == 0){
        this.productsComponent.forEach(prod => prod.calcUpgrade(u));
        this.toastr.success("Achat d'un upgrade de "+u.typeratio+" pour tous les produits","Upgrade global");
      }
      else{
        this.productsComponent.forEach(prod => {
          if(u.idcible == prod.product.id){
            prod.calcUpgrade(u);
            this.toastr.success("Achat d'un upgrade de "+u.typeratio+" pour "+prod.product.name,"Upgrade")
          }
        })
      }
      this.upgradeDisponibility();
    }
  }

}
