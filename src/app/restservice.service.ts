import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { World, Pallier, Product} from './world';

@Injectable({
  providedIn: 'root'
})
export class RestserviceService {
  server = 'http://localhost:8080/isis/'
  user = "";

  constructor(private http:HttpClient) {}

  public getUser() :string {
    return this.user;
  }

public setUser(user:string) {
  return this.user;
}

public getServer() : string {
  return this.server;
}

 private handleError(error: any): Promise<any> { 
    console.error('An error occurred', error); 
    return Promise.reject(error.message || error); 
  } 
  
  getWorld(): Promise<World> { 
    return this.http.get(this.server + "generic/world")
     .toPromise().catch(this.handleError);
    };

  private setHeaders (user: string) : HttpHeaders {
    var headers = new HttpHeaders();
    headers.append("X-User", user);
    return headers;
  }

}
