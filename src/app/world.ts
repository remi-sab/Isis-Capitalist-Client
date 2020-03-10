
export class World {
    name : string; 
    logo : string;
    money: number; 
    score: number; 
    totalangels: number;
    activeangels: number;
    angelbonus: number;
    lastupdate: string; 
    products : { "product": Product[] };
    allunlocks: { "pallier": Pallier[]};
    upgrades: { "pallier": Pallier[]};
    angelupgrades: { "pallier": Pallier[]};
    managers: { "pallier": Pallier[]};

    constructor() {
        this.products = { "product":[ ] } ;
        this.managers = { "pallier":[ ] };
        this.upgrades = { "pallier":[ ] };
        this.angelupgrades = { "pallier":[ ] };
        this.allunlocks = { "pallier":[ ] };
    }
}

export class Product {
    id : number;
    name : string;
    logo : string;
    cout : number;
    croissance: number;
    revenu: number;
    vitesse: number;
    quantite: number;
    timeleft: number;
    managerUnlocked: boolean;
    palliers : { "pallier" : Pallier[]};

}

export class Pallier {
    name: string;
    logo: string;
    seuil: number;
    idcible: number;
    ratio: number;
    typeratio: string;
    unlocked: boolean;
}
