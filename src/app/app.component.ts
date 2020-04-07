import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { RestserviceService } from './restservice.service';
import { World, Product, Pallier } from './world';
import { ProductComponent } from './product/product.component';
import { ToastrService } from 'ngx-toastr';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { delay } from './utils/delay.function';
import { calcPossibleSecurityContexts } from '@angular/compiler/src/template_parser/binding_parser';

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
  username: string = '';
  qtmulti : string = "X1";
  managerDispo : boolean;
  upgradeDispo : boolean;
  angelDispo : boolean;
  angelsToClaim : number = 0;
  interval;

  constructor(private service: RestserviceService, private toastr : ToastrService){
    this.server = service.getServer(); 
    service.getWorld().then(
      world => { this.world = world; 
        console.log("world:",world);
      }).catch(error => {console.log("error:",error)});

      this.createUsername();
  }

  ngOnInit() : void {
    this.interval = setInterval(() => { 
      this.service.saveWorld(this.world);
      this.managerDisponibility();
      this.upgradeDisponibility();
      this.bonusAllunlock();
      this.angelQty();
    }, 1000)

    
  }

  onUsernameChanged(): void {
    console.log(this.username);
    clearInterval(this.interval);
    localStorage.setItem("username", this.username);
    this.service.setUser(this.username);
    this.service.getWorld().then(
      world => { this.world = world; 
        console.log("world:",world);
      }).catch(error => {console.log("error:",error)});
    this.interval = setInterval(() => { 
      this.service.saveWorld(this.world);
      this.managerDisponibility();
      this.upgradeDisponibility();
      this.bonusAllunlock();
      this.angelQty();
    }, 1000)
  }

  createUsername(): void {
    this.username = localStorage.getItem("username");
    if (this.username == '') {
      this.username = 'Jedi' + Math.floor(Math.random() * 10000);
      localStorage.setItem("username", this.username);
    }
    this.service.setUser(this.username);
  }

  onProductionDone(p : Product){
    this.world.money = this.world.money + p.revenu*p.quantite*(this.world.angelbonus**this.world.activeangels);
    this.world.score = this.world.score + p.revenu*p.quantite*(this.world.angelbonus**this.world.activeangels);
    this.managerDisponibility();
    this.upgradeDisponibility();
    this.service.putProduct(p);

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
    }
  }

  async onBuyDone(n : number){
    if(this.world.money >= n){
      this.world.money = this.world.money - n;
    } else {
      this.world.money = this.world.money;
    }
    await delay(0);
    this.managerDisponibility();
    this.upgradeDisponibility();
    this.bonusAllunlock();
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

  angelUpgradesDisponibility() {
    this.angelDispo = false;
    this.world.angelupgrades.pallier.map(angel => {
      if (!this.angelDispo) {
        if (!angel.unlocked && this.world.activeangels > angel.seuil) {
          this.angelDispo = true;
          angel.unlocked == true;
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
      this.toastr.success("Achat du Manager " + m.name + " effectué");
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
      this.service.putUpgrade(u);
    }
  }

  achatAngelUpgrade(p: Pallier) {
    if (this.world.activeangels > p.seuil) {
      this.world.activeangels = this.world.activeangels - 1;
      this.world.angelupgrades.pallier[this.world.angelupgrades.pallier.indexOf(p)].unlocked = true;
      if (p.typeratio == "ANGE") {
        this.world.money = this.world.money * p.ratio + this.world.money;
        this.world.score = this.world.score * p.ratio + this.world.score;
        this.toastr.success("Achat d'un upgrade de " + p.typeratio + " pour tous les produits", "Upgrade Angels")
      }
      //au cas ou c'est pas un upgrade de type ange
     else {
        //au cas ou c'est un upgrade global
        if (p.idcible = 0) {
          this.productsComponent.forEach(prod => prod.calcUpgrade(p));
          this.toastr.success("Achat d'un upgrade de " + p.typeratio + " pour tous les produits", "Upgrade Angels");
        }
        //au cas ou c'est ciblé pour un produit
        else {
          this.productsComponent.forEach(prod => {
            if (p.idcible == prod.product.id) {
              prod.calcUpgrade(p);
              this.toastr.success("Achat d'un upgrade de " + p.typeratio + " pour " + prod.product.name, "Upgrade Angels")
            }
          })

        }
      }
    }
  }

  bonusAllunlock() {
    this.world.allunlocks.pallier.forEach(palier => {
      let minQuantite : boolean = true;
      this.productsComponent.forEach(p => {
        if(p.product.quantite < palier.seuil){
          minQuantite = false;
        }
      });
      if(minQuantite){
        this.world.allunlocks.pallier[this.world.allunlocks.pallier.indexOf(palier)].unlocked = true;
        this.productsComponent.forEach(prod => prod.calcUpgrade(palier));
        this.toastr.success("Bonus de " + palier.typeratio + " effectué sur tous les produits");
        this.service.putUpgrade(palier);
      }
    });
  }

  productUnlockDone  (p : Pallier){
    this.productsComponent.forEach(prod => {
      if (p.idcible == prod.product.id) {
        this.toastr.success("Bonus de " + p.typeratio + " effectué sur " + prod.product.name);
        }
    });
  }

  angelQty () {
    this.angelsToClaim = Math.round(150 * Math.sqrt((this.world.score) / Math.pow(10, 15))) - this.world.totalangels;
    console.log("Nombre d'Anges : " + this.angelsToClaim);
    return this.angelsToClaim;
  }

  resetWorld(){
    this.service.deleteWorld().then(()=>{
      this.service.getWorld().then(world => {
        this.world = world;
      })
    });
  }
  
}
