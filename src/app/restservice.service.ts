import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { World, Pallier, Product } from './world';

@Injectable({
  providedIn: 'root'
})
export class RestserviceService {
  server = 'http://localhost:8080/isis/'
  user = "";

  constructor(private http: HttpClient) { }

  public getUser(): string {
    return this.user;
  }

  public setUser(user: string) {
    this.user = user;
  }

  public getServer(): string {
    return this.server;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  getWorld(): Promise<World> {
    return this.http.get(this.server + "generic/world", {
      headers: this.setHeaders(localStorage.getItem("username"))
    })
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  };

  private setHeaders(user: string): HttpHeaders {
    console.log(localStorage.getItem("username"));
    var headers = new HttpHeaders({ 'X-user': localStorage.getItem("username") });
    return headers;
  }

  public saveWorld (world : World) {
    this.http
    .put(this.server + "generic/world", world, {
      headers: {"X-user": localStorage.getItem("username")}
    })
    .subscribe(
      () => {
        console.log('Enregistrement effectué');
      },
      (error)=>{
        console.log('Erreur : ' + error);
      }
      );
    
  }

  putManager(manager: Pallier): Promise<Response> {
    return this.http.put(this.server + "generic/manager", manager, {
      headers: this.setHeaders(this.user)
    })
      .toPromise().then(response => response)
      .catch(this.handleError);
  };

  putProduct(product: Product): Promise<Response> {
    return this.http.put(this.server + "generic/product", product, {
      headers: this.setHeaders(this.user)
    })
      .toPromise().then(response => response)
      .catch(this.handleError);
  };

  putUpgrade(upgrade: Pallier): Promise<Response> {
    return this.http.put(this.server + "generic/product", upgrade, {
      headers: this.setHeaders(this.user)
    })
      .toPromise().then(response => response)
      .catch(this.handleError);
  };

}
