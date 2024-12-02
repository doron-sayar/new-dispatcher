import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {AlertController,LoadingController} from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
// import { validators } from '@ionic/cli-framework';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public credentials:any;
  public username:string;
  public password:string;

  constructor(
    private fb:FormBuilder,
    private loadingController:LoadingController,
    private alertController:AlertController,
    private http:HttpClient,
    private router:Router
  ) { }

  ngOnInit() {
    if (localStorage.getItem('username')){
      this.router.navigate(['home']);
    }
    this.credentials=this.fb.group({
      username: ['',[Validators.required,Validators.email]],
      password:['',[Validators.required,Validators.minLength(6)]]
    });
  }


  login(){
    console.log(this.credentials.value)
    //const loading = await this.loadingController.create();
    //await loading.present();

    this.http.get('https://alpine.pairsite.com/dispatcher-app/login.php?username=' + this.username+'&password='+this.password).toPromise().then((data) => {
      if (data[0]!=null) {
        console.log("USERNAME = "+data[0].Username);
        localStorage.setItem('username', data[0].Username);
        localStorage.setItem('referrer', 'home');
        localStorage.setItem('isApprover',data[0].is_approver);
        this.router.navigate(['home']);
      } else {
        console.log('no such user');
        this.showAlert('Login Failed','Please try again.')
      }
    })
  }

  async showAlert(header: string,message: string){
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

}
