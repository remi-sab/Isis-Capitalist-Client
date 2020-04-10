import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timer'
})
export class TimerPipe implements PipeTransform {

  private normalisation(value : number) : string {
    let result : string;
    if(value >= 10){
      result = value.toString();
    } else {
      result = "0"+value;
    }
    return result;
  }

  transform(value: number, ...args: any): string {
    let min : number = 0;
    let sec : number = 0;
    let ms : number = 0;

    if(value > 60000){
      min = Math.trunc(value/60000);
      value = value - (min * 60000);
    }
    if(value >= 1000){
      sec = Math.trunc(value/1000);
      value = value - (sec * 1000);
    }
    if(value < 1000 && value >= 0){
      ms = Math.trunc(value);
    }

    return this.normalisation(min)+":"+this.normalisation(sec)+":"+this.normalisation(ms);

  }
}


