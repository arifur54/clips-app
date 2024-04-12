import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  credentials = {
    email: '',
    password: ''
  }

  showAlert = false;
  alertMsg = 'Please Wait! Your Login attempt is being executed!';
  alertColor = 'blue';

  constructor() { }

  ngOnInit(): void {
  }

  login(){
    this.showAlert = true;
  }
 
}
