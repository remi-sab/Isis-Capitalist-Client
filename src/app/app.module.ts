import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { ProductComponent } from './product/product.component';
import { RestserviceService } from './restservice.service';
import { BigvaluePipe } from './bigvalue.pipe';
import { ModalComponent } from './modal/modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { TimerPipe } from './timer.pipe';


@NgModule({
  declarations: [
    AppComponent,
    ProductComponent,
    BigvaluePipe,
    ModalComponent,
    TimerPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [RestserviceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
