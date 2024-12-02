import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NgIf } from '@angular/common'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone:true,
  imports:[IonicModule,NgIf]
})
export class HeaderComponent implements OnInit {
  public username:String;
  private current_url:string;
  public header_title:string;
  public icon_home:string;
  public icon_checkmark:string;
  public icon_checkmark_done:string;
  public icon_folder1:string;
  public icon_folder2:string;
  public invoice_num:string;
  public color:string;
  

  constructor(private router:Router) {
    this.username=localStorage.getItem('username');
    if (!this.username){
      router.navigate(['login']);
    }
    //refresh page if bit is set
    if (localStorage.getItem('refresh')=='1'){
      localStorage.setItem('refresh','0');
      window.location.reload();
    }
    this.current_url=this.router.url.replace('/','');
    console.log('url='+this.current_url);
    localStorage.setItem('referrer', this.current_url);
    switch (this.current_url){
      case '':{
        this.color='primary'
        this.header_title='Alpine Dispatcher Home';
        this.icon_home='home';
        this.icon_checkmark='checkmark';
        this.icon_checkmark_done='checkmark-done';
        this.icon_folder1='file-tray-full-outline';
        this.icon_folder2='file-tray-full-outline';
        break;
      }
      case 'home':{
        this.color='primary'
        this.header_title='Alpine Dispatcher Home';
        this.icon_home='home';
        this.icon_checkmark='checkmark';
        this.icon_checkmark_done='checkmark-done';
        this.icon_folder1='file-tray-full-outline';
        this.icon_folder2='file-tray-full-outline';
        break;
      }
   /*   case 'try':{
        this.color='secondary'
        this.header_title='Alpine Dispatcher Home';
        this.icon_home='home';
        this.icon_checkmark='checkmark';
        this.icon_checkmark_done='checkmark-done';
        this.icon_folder1='file-tray-full-outline';
        this.icon_folder2='file-tray-full-outline';
        break;
      }*/
      case 'completed-tickets':{
        this.color='secondary'
        this.header_title='Completed Tickets';
        this.icon_home='home-outline';
        this.icon_checkmark='checkmark-circle';
        this.icon_checkmark_done='checkmark-done';
        this.icon_folder1='file-tray-full-outline';
        this.icon_folder2='file-tray-full-outline';
        break;
      }
      case 'accepted-tickets':{
        this.color='tertiary'
        this.header_title='Priced Tickets';
        this.icon_home='home-outline';
        this.icon_checkmark='checkmark';
        this.icon_checkmark_done='checkmark-done-circle';
        this.icon_folder1='file-tray-full-outline';
        this.icon_folder2='file-tray-full-outline';
        break;
      }
      case 'open-invoices':{
        this.header_title='Open Invoices';
        this.icon_home='home-outline';
        this.icon_checkmark='checkmark';
        this.icon_checkmark_done='checkmark-done';
        this.icon_folder1='file-tray-full';
        this.icon_folder2='file-tray-full-outline';
        break;
      }
      case 'recent-invoices':{
        this.header_title='Recent Invoices';
        this.icon_home='home-outline';
        this.icon_checkmark='checkmark';
        this.icon_checkmark_done='checkmark-done';
        this.icon_folder1='file-tray-full-outline';
        this.icon_folder2='file-tray-full';
        break;
      }
      default:{  //invoice/12345
        this.invoice_num=this.router.url.replace('/invoice/','');
        this.header_title='Invoice #'+this.invoice_num;
        this.icon_home='home-outline';
        this.icon_checkmark='checkmark';
        this.icon_checkmark_done='checkmark-done';
        this.icon_folder1='file-tray-full-outline';
        this.icon_folder2='file-tray-full-outline';
        break;
      }
    }
   }

  ngOnInit() {}
  async logOut(){
    localStorage.removeItem('username');
    localStorage.removeItem('referrer');
    localStorage.removeItem('isApprover');
    this.router.navigate(['login']);
  }
  
}
