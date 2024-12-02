import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as myGlobals from '../globals'

@Component({
  selector: 'app-completed-tickets',
  templateUrl: './accepted-tickets.page.html',
  styleUrls: ['./accepted-tickets.page.scss'],
})
export class AcceptedTicketsPage implements OnInit {
  public jsonData: any;
  public arr_medals:string[]=myGlobals.arr_medals
  constructor(private router: Router,
    private http: HttpClient,
    private alert: AlertController) {

  }
  ionViewDidEnter() {
    this.displayData();
  }
  ngOnInit() {
  }
  displayData() {
    this.http.get('https://alpine.pairsite.com/dispatcher-app/get_accepted_tickets.php').subscribe((data) => {
      console.log(data);
      this.jsonData = data;
      for (let i=0;i<this.jsonData.length;i++){
        if (this.jsonData[i].total==this.jsonData[i].auto_calc_cost){
          this.jsonData[i].cost_color='black'
        }else{
          this.jsonData[i].cost_color='danger'
        }
        if (this.jsonData[i].info_color=='primary'){
          this.jsonData[i].info_color='tertiary'
        }
      }
    })
  }
  showSignature(i: number) {
    const ticket_num = this.jsonData[i].ticket_num;
    const ticket_date = this.jsonData[i].ticket_date;
    const ticket_year = ticket_date.split('-')[0];
    const ticket_month = ticket_date.split('-')[1];
    const imageURL = 'https://alpine.pairsite.com/signatures/'
      + ticket_year + '/'
      + ticket_month + '/'
      + ticket_date + '/'
      + ticket_num + '.jpg';
    console.log(imageURL);
    this.alert.create({
      message: '<img src=' + imageURL + '>'

    }).then(alertEl => alertEl.present());
  }
  confirmTransferTickets() {
    const alert = this.alert.create({
      header: 'Transfer Confirmation',
      message: 'For sure?',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.transferTickets();
          }
        },
        {
          text:'Cancel',
          handler: ()=>{
            //do notin'
          }
        }
      ]
    }).then(thisAlert => {
      thisAlert.present();
    })

  }
  transferTickets(){
    this.http.get('https://alpine.pairsite.com/dispatcher-app/transfer_tickets.php').subscribe((data) => {
      console.log(data);
      this.jsonData = data;
    })
  }
}
