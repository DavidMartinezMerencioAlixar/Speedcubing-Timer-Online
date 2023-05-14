import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationComponent } from './registration/registration.component';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from './commons/button/button.component';
import { InputComponent } from './commons/input/input.component';
import { LoginComponent } from './login/login.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { VisualScrambleComponent } from './visual-scramble/visual-scramble.component';



@NgModule({
  declarations: [
    RegistrationComponent,
    HomeComponent,
    ButtonComponent,
    InputComponent,
    LoginComponent,
    EditUserComponent,
    VisualScrambleComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
  ]
})
export class ModulesModule { }
