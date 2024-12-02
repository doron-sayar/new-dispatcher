import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as myGlobals from '../globals'

@Component({
  selector: 'app-completed-tickets',
  templateUrl: './completed-tickets.page.html',
  styleUrls: ['./completed-tickets.page.scss'],
})
export class CompletedTicketsPage implements OnInit {
  public jsonData: any;
  public drivers: any;
  private id: any;
  public userEmail: string;
  public material:string[];
  private i:number;
  public costColor:string[];
  public arr_medals:any=myGlobals.arr_medals;

  constructor(
    private http: HttpClient,
    private alertCtrl: AlertController,
    //public modalCtrl: ModalController,
  ) {
    this.material=[]; //must init
   }

  ngOnInit() {
    this.displayData();
    this.getDriversList();
  }

  getDriversList() {
    this.http.get('https://alpine.pairsite.com/dispatcher-app/get_drivers_list.php').toPromise().then((data) => {
      this.drivers = data;
      //console.log(this.drivers);
    })
  }
  displayData() {
    this.http.get('https://alpine.pairsite.com/dispatcher-app/get_completed_tickets.php').subscribe((data) => {
      //console.log(data);
      this.jsonData = data;
      for (let i=0;i<this.jsonData.length;i++){
        if (this.jsonData[i].total==this.jsonData[i].auto_calc_cost){
          this.jsonData[i].cost_color='black'
        }else{
          this.jsonData[i].cost_color='danger'
        }
        if (this.jsonData[i].info_color=='primary'){
          this.jsonData[i].info_color='secondary'
        }
      }
      console.log(this.jsonData)
     /* for (this.i=0;this.i<this.jsonData.length;this.i++){
        this.material[this.i]=''; //init string
        
        //pallets
        if (this.jsonData[this.i].pallets>0){
          this.material[this.i]+=this.jsonData[this.i].pallets+' Pallet'
          if (this.jsonData[this.i].pallets>1){
            this.material[this.i]+='s'
          }
        }
        //reels
        if (this.jsonData[this.i].reels>0){
          if (this.material[this.i]>''){
            this.material[this.i]+=', '
          }
          this.material[this.i]+=this.jsonData[this.i].reels+' Reel'
          if (this.jsonData[this.i].reels>1){
            this.material[this.i]+='s'
          }
        }
        //lifts
        if (this.jsonData[this.i].lifts>0){
          if (this.material[this.i]>''){
            this.material[this.i]+=', '
          }
          this.material[this.i]+=this.jsonData[this.i].lifts+' Lift'
          if (this.jsonData[this.i].lifts>1){
            this.material[this.i]+='s'
          }
        }
        //boxes
        if (this.jsonData[this.i].boxes>0){
          if (this.material[this.i]>''){
            this.material[this.i]+=', '
          }
          this.material[this.i]+=this.jsonData[this.i].boxes+' Box'
          if (this.jsonData[this.i].boxes>1){
            this.material[this.i]+='es'
          }
        }
        //large bundle
        if (this.jsonData[this.i].l_bundle>0){
          if (this.material[this.i]>''){
            this.material[this.i]+=', '
          }
          this.material[this.i]+='L. Bundle'
        }
        //small bundle
        if (this.jsonData[this.i].s_bundle>0){
          if (this.material[this.i]>''){
            this.material[this.i]+=', '
          }
          this.material[this.i]+='S. Bundle'
        }
        //misc
        if (this.jsonData[this.i].misc>''){
          if (this.material[this.i]>''){
            this.material[this.i]+=', '
          }
          this.material[this.i]+=this.jsonData[this.i].misc
        }
        
      }*/
    })
  }
  async showInfo(i: number) {
    console.log(this.jsonData[i].ticket_id);
    await this.alertCtrl.create({
      header: 'Ticket #' + this.jsonData[i].ticket_id,
      message: '<TABLE>' +
        '<TR><TD>From:<TD><B>' + this.jsonData[i].address_from + '</B></TD></TR>' +
        '<TR><TD>To:<TD><B>' + this.jsonData[i].address_to + '</B></TD></TR>' +
        '<TR><TD>Shipping:<TD><B>' + this.jsonData[i].shipping + '</B></TD></TR>' +
        '</TABLE>' +
        '<BR><B>' +
        this.jsonData[i].details +
        '</BR>'


    }).then(res => res.present());
  }

  assignDriver(ticket_id: number) {
    console.log(ticket_id);
    let selectedDriverId = <HTMLInputElement>document.getElementById('select-driver-' + ticket_id);
    console.log(selectedDriverId.value);
    this.http.get('https://alpine.pairsite.com/dispatcher-app/assign_driver.php'
      + '?ticket_id=' + ticket_id
      + '&driver_id=' + selectedDriverId.value).subscribe((data) => {
        this.jsonData = data;
      });
  }
  setArrivedToPickTime(ticket_id) {
    this.http.get('https://alpine.pairsite.com/dispatcher-app/set_arrived_to_pick_time.php'
      + '?ticket_id=' + ticket_id).subscribe((data) => {
        this.jsonData = data;
      });
  }
  setPickedTime(ticket_id) {
    this.http.get('https://alpine.pairsite.com/dispatcher-app/set_picked_time.php'
      + '?ticket_id=' + ticket_id).subscribe((data) => {
        this.jsonData = data;
      });
  }
  setArrivedToDropTime(ticket_id) {
    this.http.get('https://alpine.pairsite.com/dispatcher-app/set_arrived_to_drop_time.php'
      + '?ticket_id=' + ticket_id).subscribe((data) => {
        this.jsonData = data;
      });
  }
  setDroppedTime(ticket_id) {
    this.http.get('https://alpine.pairsite.com/dispatcher-app/set_dropped_time.php'
      + '?ticket_id=' + ticket_id).subscribe((data) => {
        this.jsonData = data;
      });
  }
  disableRefresh(){
    console.log ('disabling refresh');
  }
  closeTicket(ticket_id){
    console.log(ticket_id)
    this.http.get('https://alpine.pairsite.com/dispatcher-app/complete_ticket.php?ticket_id='+ticket_id).toPromise().then((data) => {
      this.jsonData = data;
    })
  }
}
