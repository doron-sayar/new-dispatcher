import { AlertController } from '@ionic/angular';
import { Component, input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

declare var google; 

@Component({
  selector: 'app-edit-ticket',
  templateUrl: './edit-ticket.page.html',
  styleUrls: ['./edit-ticket.page.scss'],
})
export class EditTicketPage implements OnInit {
  private username:string;
  public inputAddressFrom: string;
  public inputAddressTo: string;
  public inputShipping: string;
  public inputDetails: string;
  public inputInternalNotes:string;
  public companyId: string;
  public companies: any;
  public selectedCompanyId: any;
  public isLogged: boolean;
  public selectStop: string;
  public selectType: string;
  public selectDriverId: string;
  public selectAssignedTruck:string;
  public checkReturn: boolean;
  public strReturn: string;
  public checkLastStop: boolean;
  private strLastStop:string;
  public checkFreight:string;
  public isFreight:string;
  public checkDryRun:boolean;
  public strDryRun:string;
  public selectTruck: string;
  public ticketNum: string;
  public companyName: string;
  public calledInBy:string;
  public inputWaitTime: number;
  public inputDiscount:string;
  public inputCost: number;
  private autoCalcCost:number;
  public inputCostClass:string;
  private ticketDate: string;
  private ticketMonth: string;
  private ticketYear: string;
  private ticketDay:string;
  public ticketDroppedTime: string;
  public inputPallets: string;
  public inputReels: string;
  public inputLift: string;
  public inputBoxes: string;
  public checkSBundle: string;
  public checkLBundle: string;
  public inputMisc:string;
  public inputMiles: string;
  public timeDroppedShort:string;
  public issuedBy:string;
  public lastEditBy:string;

  public inputWeight: number;
  public material:any;
  public arrDrivers:any;
  public arrAssignedTrucks:any;
  private arrWaypoints:any;

  public strSBundle: string;
  public strLBundle: string;
  public isAccepted:string;
  public email:string;
  public referrer: string;
  public isApprover:string;
  public signature_url:string;
  public photo_url:string;
  public  pickDateTime:string; //='20-01-2020T20:20:00'
  private pickDate:string;
  private pickTime:string;
  public  deliveryDateTime:string;
  private deliveryDate:string;
  private deliveryTime:string;
  public itemColorTruck:string='';
  public itemColorDriver:string='';
  public itemColorAssigned:string='';
  public itemColorType:string='';
  public itemColorStop:string='';


  private file:File;

  url = 'https://alpine.pairsite.com/dispatcher-app/update_ticket.php';
  constructor(private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alert: AlertController) { }

    ionViewDidEnter(){

      document.getElementById('input-address-from').addEventListener('blur',this.setAddressFrom.bind(this))
      document.getElementById('input-address-to').addEventListener('blur',this.setAddressTo.bind(this))
      document.getElementById('select-truck').addEventListener('focus',this.setTruckBgColor.bind(this))
      document.getElementById('select-truck').addEventListener('blur',this.setTruck.bind(this))
      document.getElementById('select-driver').addEventListener('focus',this.setDriverkBgColor.bind(this))
      document.getElementById('select-driver').addEventListener('change',this.changeAssignedTruck.bind(this))
      document.getElementById('select-driver').addEventListener('blur',this.setDriver.bind(this))
      document.getElementById('select-assigned-truck').addEventListener('focus',this.setAssignedTruckkBgColor.bind(this))
      document.getElementById('select-assigned-truck').addEventListener('blur',this.setAssignedTruck.bind(this))
      document.getElementById('select-type').addEventListener('focus',this.setTypeBgColor.bind(this))
      document.getElementById('select-type').addEventListener('blur',this.setType.bind(this))
      document.getElementById('select-stop').addEventListener('focus',this.setStopBgColor.bind(this))
      document.getElementById('select-stop').addEventListener('blur',this.setStop.bind(this))
      
      //global event listener - calc cost on any blur
      //document.addEventListener('blur',this.calcCost.bind(this))

      //document.addEventListener('click',this.calcTotalWeight.bind(this))


      //autocomplete for addresses
    let input_address_from=document.getElementById('input-address-from');
    let input_address_to=document.getElementById('input-address-to');
    let autocomplete1=new google.maps.places.Autocomplete(input_address_from)
    let autocomplete2=new google.maps.places.Autocomplete(input_address_to)

    autocomplete1.setComponentRestrictions({
      country: ["us"],
    });
    autocomplete2.setComponentRestrictions({
      country: ["us"],
    });
    
    }
  
  ngOnInit() {

    if (localStorage.getItem('username')) {
      this.username=localStorage.getItem('username');
      this.email=localStorage.getItem('email');
      this.referrer=localStorage.getItem('referrer');
      this.isApprover=localStorage.getItem('isApprover');

    } else {
      this.router.navigate(['login']);
    }

    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('ticketNum')) {
        //redirect
        return;
      }
      this.ticketNum = paramMap.get('ticketNum');
    });
 this.getDriversList();
 this.getAssignedTrucks();
 const elementType = <HTMLInputElement>document.getElementById('select-type')
 const elementStop = <HTMLInputElement>document.getElementById('select-stop')
 const elementTruck = <HTMLInputElement>document.getElementById('select-truck')
 const elementDriver = <HTMLInputElement>document.getElementById('select-driver')
 const elementAssignedTruck = <HTMLInputElement>document.getElementById('select-assigned-truck')
 const elementMaterial = <HTMLInputElement>document.getElementById('input-material')
    
 this.http.get('https://alpine.pairsite.com/dispatcher-app/get_ticket.php?ticket_num=' + this.ticketNum).toPromise().then(result => {
      const ticket = result[0];
      this.companyName = ticket.company_name;
      this.issuedBy = ticket.issued_by;
      this.lastEditBy = ticket.last_edit_by;
      this.calledInBy=ticket.called_in_by;
      this.pickDate=ticket.pick_date;
      this.pickTime=ticket.pick_time;
      this.pickDateTime=this.pickDate+'T'+this.pickTime;
      this.deliveryDate=ticket.delivery_date;
      this.deliveryTime=ticket.delivery_time;
      this.deliveryDateTime=this.deliveryDate+'T'+this.deliveryTime;
      console.log(this.deliveryDateTime)
      this.inputAddressFrom = ticket.address_from;
      this.inputAddressTo = ticket.address_to; 
      this.inputShipping = ticket.shipping;
      this.inputDetails = ticket.details;
      this.inputInternalNotes = ticket.internal_notes;
      this.selectStop = ticket.stop_id;
      elementStop.value = this.selectStop
      this.selectType = ticket.type_id;
      elementType.value=this.selectType
      this.selectTruck = ticket.vehicle_id;
      elementTruck.value = this.selectTruck;
      this.selectDriverId = ticket.driver_id;
      elementDriver.value = this.selectDriverId;
      this.selectAssignedTruck = ticket.assigned_truck_id;
      elementAssignedTruck.value = this.selectAssignedTruck
      this.checkReturn = ticket.is_return == '1' ? true : false;
      this.checkDryRun = ticket.is_dry_run == '1'? true:false;
      this.checkLastStop = ticket.is_last_stop == '1'?true:false; 
      this.checkFreight = ticket.is_freight=='1'?'1':null;
      this.inputWaitTime = ticket.wait_time;
      this.inputDiscount = ticket.discount;
      this.inputCost = ticket.total;
      this.autoCalcCost = ticket.auto_calc_cost;
      this.inputCostClass = ticket.input_cost_class;
      this.ticketDate = ticket.ticket_date;
      this.ticketDroppedTime = ticket.time_dropped_short;
      this.inputPallets = ticket.pallets;
      this.inputReels = ticket.reels;
      this.checkLBundle = ticket.l_bundle == '1' ? '1' : null;
      this.checkSBundle = ticket.s_bundle == '1' ? '1' : null;
      this.inputLift = ticket.lift;
      this.inputBoxes = ticket.boxes;
      this.inputMisc=ticket.misc;
      this.inputWeight=ticket.weight;
      this.inputMiles = ticket.miles;
      this.isAccepted=ticket.is_accepted;
      this.ticketYear = this.ticketDate.split('-')[0];
      this.ticketMonth = this.ticketDate.split('-')[1];
      this.ticketDay = this.ticketDate.split('-')[2];
      this.timeDroppedShort = ticket.time_dropped_short;
      this.signature_url = 'https://alpine.pairsite.com/tickets/'
        + this.ticketYear + '/'
        + this.ticketMonth + '/'
        + this.ticketDay + '/'
        + this.ticketNum + '/signature.jpg'

      this.photo_url = 'https://alpine.pairsite.com/tickets/'
      + this.ticketYear + '/'
      + this.ticketMonth + '/'
      + this.ticketDay + '/'
      + this.ticketNum + '/photos/photo1.jpg'

      console.log(result)
        
    });

    this.http.get('https://alpine.pairsite.com/dispatcher-app/get_ticket_material.php?ticket_num=' + this.ticketNum).toPromise().then(result => {
      console.log(result)
      this.material=result;
    
      //this.calcTotalWeight()
    });
    
  }
  getDriversList() {
    //if (localStorage.getItem('drivers_list')){
      this.arrDrivers= JSON.parse(localStorage.getItem('drivers_list'))
      console.log('drivers list already in local storage!')
    /*}else{
      this.http.get('https://alpine.pairsite.com/dispatcher-app/get_drivers_list.php').toPromise().then((data) => {
      this.arrDrivers = data;
      console.log('storing drivers list in local storage')
      localStorage.setItem('drivers_list',JSON.stringify(this.arrDrivers))
    })
    }*/
  }
  getAssignedTrucks() {
    this.arrAssignedTrucks=JSON.parse(localStorage.getItem('assigned_trucks'))
   /* thi0s.http.get('https://alpine.pairsite.com/dispatcher-app/get_assigned_trucks.php').toPromise().then((data) => {
      this.arrAssignedTrucks=data;
      console.log(data)
    })*/
  }
  updateTicket(accepted:number) {
    let mat='';
    for (let i=0;i<this.material.length;i++){
      mat+='&count'+Number(i+1)+'='+this.material[i].count;
      mat+='&material'+Number(i+1)+'='+this.material[i].material;
      mat+='&dim'+Number(i+1)+'='+this.material[i].dimensions;
      mat+='&weight'+Number(i+1)+'='+this.material[i].weight;
      mat+='&total_weight'+Number(i+1)+'='+this.material[i].total_weight;
    }
    console.log(mat);

    var re = /'/g;
    this.strReturn = this.checkReturn ? '1' : '0';
    this.strLastStop = this.checkLastStop?'1':'0';
    this.strDryRun = this.checkDryRun ? '1' : '0';
    this.strSBundle = this.checkSBundle ? '1' : '0';
    this.strLBundle = this.checkLBundle ? '1' : '0';
    this.isFreight = this.checkFreight?'1':'0';
    this.http.get(this.url
      + '?ticket_num=' + this.ticketNum
      + '&last_edit_by='+this.username
      + '&address_from=' + this.inputAddressFrom.replace(re, "\\'")
      + '&address_to=' + this.inputAddressTo.replace(re, "\\'")
      + '&pick_date=' + this.pickDate
      + '&pick_time=' + this.pickTime
      + '&delivery_date=' + this.deliveryDate
      + '&delivery_time=' + this.deliveryTime
      + '&shipping=' + this.inputShipping.replace(re, "\\'")
      + '&details=' + this.inputDetails.replace(re, "\\'")
      + '&internal_notes=' + this.inputInternalNotes.replace(re,"\\'")
      + '&driver_id=' + this.selectDriverId
      + '&assigned_truck_id='+this.selectAssignedTruck
      + '&type_id=' + this.selectType
      + '&vehicle_id=' + this.selectTruck
      + '&stop_id=' + this.selectStop
      + '&last_stop=' + this.strLastStop
      + '&return=' + this.strReturn
      + '&dry_run='+ this.strDryRun
      + '&freight='+ this.isFreight
      + '&wait_time=' + this.inputWaitTime
      + '&discount='+this.inputDiscount
      + '&cost=' + this.inputCost
      + '&auto_calc_cost=' + this.autoCalcCost
      + '&lift=' + this.inputLift
      + '&sBundle=' + this.strSBundle
      + '&lBundle=' + this.strLBundle
      + '&pallets=' + this.inputPallets
      + '&reels=' + this.inputReels
      + '&boxes=' + this.inputBoxes
      + '&misc=' +this.inputMisc
      + '&miles=' + this.inputMiles
      + '&weight=' + this.inputWeight
      + '&accepted='+accepted
      + mat //material statement
      + '&company_id=' + this.selectedCompanyId).toPromise().then(result => {
        console.log(result);
        localStorage.setItem('refresh','1')//make sure home page refreshes
        this.router.navigate([localStorage.getItem('referrer')]);
      });
    

  }
  cancelUpdateTicket() {
    this.router.navigate([localStorage.getItem('referrer')]);
  }
  showSignature() {
    this.ticketYear = this.ticketDate.split('-')[0];
    this.ticketMonth = this.ticketDate.split('-')[1];
    const url = 'https://alpine.pairsite.com/signatures/'
      + this.ticketYear + '/'
      + this.ticketMonth + '/'
      + this.ticketDate + '/'
      + this.ticketNum + '.jpg'
    const alert = this.alert.create({
      message: '<img src=\'' + url + '\'>'

    }).then(alertEl => alertEl.present());
  }
  acceptTicket(){
    this.updateTicket(1);
    this.router.navigate([localStorage.getItem('referrer')]);
  }
  setAddressFrom(){
    const element=<HTMLInputElement>document.getElementById('input-address-from')
    this.inputAddressFrom=element.value;
  }
  setAddressTo(){
    const element=<HTMLInputElement>document.getElementById('input-address-to')
    this.inputAddressTo=element.value;

    let request={
      origin:this.inputAddressFrom,
      destination: this.inputAddressTo,
      travelMode:google.maps.TravelMode.DRIVING,
      unitSystem:google.maps.UnitSystem.IMPERIAL,
      avoidTolls:true
    }
     //dircetions service
     let dircetionsService = new google.maps.DirectionsService();
     let distance;
     dircetionsService.route(request,function(result,status){
      if (status == google.maps.DirectionsStatus.OK){
        console.log(result.routes[0].legs[0].distance.text)
        distance=Math.ceil(result.routes[0].legs[0].distance.text.split(' ')[0]) //remove ' mi' and round up
        const element = <HTMLInputElement>document.getElementById('input-miles')
        element.value = distance
        
      }
     }
    )
    //wait for miles field to be ready
    setTimeout( () => { this.calcCost() }, 500 );
  }
  setTruckBgColor(){
    this.itemColorTruck='light'
  }
  setTruck(){
    const element=<HTMLInputElement>document.getElementById('select-truck')
    this.selectTruck = element.value
    this.itemColorTruck='';

    this.calcCost();
  }
  setDriverkBgColor(){
    this.itemColorDriver='light'
  }
  changeAssignedTruck(){
    let element=<HTMLInputElement>document.getElementById('select-driver')
    const driver_id=element.value
    if (driver_id>'0'){
       this.selectAssignedTruck=this.arrDrivers.find(x => x.id == driver_id).truck_id
       element=<HTMLInputElement>document.getElementById('select-assigned-truck')
       element.value=this.selectAssignedTruck
    }  
  }
  setDriver(){
    let element=<HTMLInputElement>document.getElementById('select-driver')
    this.selectDriverId=element.value;

    this.itemColorDriver='';
    
  }
  setAssignedTruckkBgColor(){
    this.itemColorAssigned='light'
  }
  setAssignedTruck(){
    const element = <HTMLInputElement>document.getElementById('select-assigned-truck')
    this.selectAssignedTruck = element.value
    
    this.itemColorAssigned='';
  }
  setTypeBgColor(){
    this.itemColorType='light';
  }
  setType(){
    const element=<HTMLInputElement>document.getElementById('select-type')
    this.selectType=element.value;
    this.itemColorType='';

    this.calcCost();
  }
  setStopBgColor(){
    this.itemColorStop='light';
  }
  setStop(){
    const element=<HTMLInputElement>document.getElementById('select-stop')
    this.selectStop = element.value
    this.itemColorStop='';
  }
  calcTotalWeight(){
    this.inputWeight=0;
    for (let i=0;i<this.material.length;i++){
      this.material[i].total_weight=this.material[i].count*this.material[i].weight
      this.inputWeight+=Number(this.material[i].total_weight)
    }
    console.log(this.inputWeight)

    this.calcCost();
  }
  onFileChange(ev){
    this.file=ev.target.files[0];
    console.log('NAME = '+this.file.name)
    this.submitForm();
  }
  submitForm(){
     let formData=new FormData();
    formData.append('photo',this.file,this.file.name);

    this.http.post('https://alpine.pairsite.com/dispatcher-app/upload.php',formData,{responseType:'text'}).subscribe(result =>{
      console.log(result)
    })
  }
  addMaterial(){
    this.material[this.material.length]={
      material:'',
      dimensions:'',
      weight:0
    }
   
  }
  removeMaterial(){
    let k=this.material.pop();
  }
  updatePickDateTime(){
    this.pickDate=this.pickDateTime.split('T')[0]
    this.pickTime=this.pickDateTime.split('T')[1]
    console.log('pick date='+this.pickDate)
    console.log('pick time='+this.pickTime)
  }
  updateDeliveryDateTime(){
    this.deliveryDate=this.deliveryDateTime.split('T')[0]
    this.deliveryTime=this.deliveryDateTime.split('T')[1]
    console.log('delivery date='+this.deliveryDate)
    console.log('delivery time='+this.deliveryTime)
  }
  calcCost(){
    console.log('yup')
    if (this.checkDryRun){
      this.checkReturn=false
    }
    const element = <HTMLInputElement>document.getElementById('input-miles')
    const miles = Number(element.value)
    
    const weight=Number(this.inputWeight)
    let rate=0;
    let cost=0;
    
    if (this.selectType=='3'){ //freight
      this.inputCost=90
    }else if(Number(this.selectStop)>0 && !this.checkLastStop){
      switch(this.selectTruck){
        case '1': //pickup truck
          this.inputCost = 30;
          break;
        case '2':
          this.inputCost = 60;
          break;
        case '3':
          this.inputCost = 60;
          break;
        case '4':
          this.inputCost = 80;
          break;
        case '5':
          this.inputCost = 100;
          break;
      }
    }else{
      switch(this.selectTruck){
      case '1': //pickup truck

        //set rate per mile
        if (miles<50){
          rate=2.60
        }else{
          rate=2.90
        }
        //factor in weight
        if (weight<=100){
          cost=rate*miles
        }else{
          cost=rate*miles+(weight-100)*0.02
        }
        
        //minimum is $35
        cost=cost>35?cost:35;

        //return or dry run
        if (this.checkReturn){
          const returnCost=cost/2>35?cost/2:35;
          cost+=returnCost;
        }else if (this.checkDryRun){
          cost=35;
        }

         //add $20 for priority
        if (this.selectType=='2'){
          cost+=20;
        }

        this.inputCost=Math.round(cost*100)/100 //round to 2 decimal places
        break;

      case '2': //box truck
        cost=40+3.75*miles

        cost=cost>69?cost:69; //minimum $69

        //return/dry run
         if (this.checkReturn){
          const returnCost=cost/2>69?cost/2:69;
          cost+=returnCost;
        }else if(this.checkDryRun){
          cost = 69;
        }

         //add $40 for priority
         if (this.selectType=='2'){
          cost+=40;
        }

        this.inputCost=Math.round(cost*100)/100 //round to 2 decimal places
        break;

      case '3': //24' Flatbed, same as box truck
        cost=40+3.75*miles

        cost=cost>69?cost:69; //minimum $69

        //return/dry run
        if (this.checkReturn){
          const returnCost=cost/2>69?cost/2:69;
          cost+=returnCost;
        }else if (this.checkDryRun){
          cost = 69;
        }

         //add $40 for priority
         if (this.selectType=='2'){
          cost+=40;
        }

        this.inputCost=Math.round(cost*100)/100 //round to 2 decimal places
        break;

      case '4': //30' Flatbed
        if (miles<=100){
          cost=465;
        }else{
          cost=60+4.05*miles
        }

        //return/dry run
        if (this.checkReturn){
        const returnCost=cost/2>465?cost/2:465;
        cost+=returnCost;
        }else if(this.checkDryRun){
          cost = 465;
        }

        this.inputCost=Math.round(cost*100)/100 //round to 2 decimal places
        break;

      case '5': //40' Flatbed
        if (miles<=100){
          cost=575;
        }else{
          cost=80+4.95*miles
        }

        //return/dry run
        if (this.checkReturn){
          const returnCost=cost/2>575?cost/2:575;
          cost+=returnCost;
        }else if(this.checkDryRun){
          cost = 575;
        }

        this.inputCost=Math.round(cost*100)/100 //round to 2 decimal places
    }
  }
  this.autoCalcCost=this.inputCost; //store calculated value
  this.inputCostClass='input-color-black'; //set cost color black
  }
  setInputCostOverride(isOverride:boolean){
    if (isOverride==true){
      this.inputCostClass='input-color-red';
    }else{
      this.inputCostClass='input-color-black';
    }
  }
  getFinalMileage(){
    //if last stop
    if(this.checkLastStop){
      this.http.get('https://alpine.pairsite.com/dispatcher-app/get_waypoints.php?ticket_num='+this.ticketNum).toPromise().then((data) => {
      console.log(data)
      this.arrWaypoints=data;

      const waypts=[];
    
      for (let i = 0; i < this.arrWaypoints.length-1; i++) { //last waypoint to be ignored
          waypts.push({
            location: this.arrWaypoints[i].address_to,
            stopover: true,
          });
      }
      console.log(waypts)
      let request={
        origin:this.inputAddressFrom,
        destination: this.inputAddressTo,
        travelMode:google.maps.TravelMode.DRIVING,
        unitSystem:google.maps.UnitSystem.IMPERIAL,
        waypoints:waypts,
        optimizeWaypoints:false,
        avoidTolls:true
      }
       //dircetions service
       let dircetionsService = new google.maps.DirectionsService();
       let distance;
       dircetionsService.route(request,function(result,status){
        if (status == google.maps.DirectionsStatus.OK){
          console.log(result)
          //console.log('thats right BE-ATCH '+ result.routes[0].legs[0].distance.text)
          let miles=0;
          for (let i=0;i<result.routes[0].legs.length;i++){
            miles+=Number(result.routes[0].legs[i].distance.text.split(' ')[0])
          }
          distance=Math.ceil(miles)
          const element = <HTMLInputElement>document.getElementById('input-miles')
          element.value = distance
        }
       })
       //wait for miles field to be ready
       setTimeout( () => { this.calcCost() }, 500 );
    })
  }else{
    this.setAddressTo(); //restore
  }  
}
}