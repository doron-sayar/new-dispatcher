import { Component, input, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonInput } from '@ionic/angular';
import {Material} from '../globals';

declare var google; 

@Component({
  selector: 'app-add-ticket',
  templateUrl: './add-ticket.page.html',
  styleUrls: ['./add-ticket.page.scss'],
  
})
export class AddTicketPage implements OnInit {

  private username:string;
  public inputCompanyName:string;
  public inputAddressFrom: string='';
  public inputAddressTo: string='';
  public inputShipping: string='';
  public inputDetails: string='';
  public inputInternalNotes:string='';
  public companyId:string;
  public inputCalledInBy:string;
  public isLogged:boolean;
  public selectType:string='1';
  public selectTruck:string='1';
  public selectDriver:string;
  public selectAssignedTruck:string;
  public selectStop:string='0';
  public selectPairTicket:string='';
  public checkReturn:boolean;
  public isFreight:string='0';
  public strReturn:string;
  public checkDryRun:string;
  public checkLastStop:boolean=false;
  private strLastStop:string;
  public inputMaterial:string;
  public inputNumPallets:string;
  public inputNumReels:string;
  public inputNumLifts:string;
  public inputNumBoxes:string;
  public checkSBundle:string;
  public checkLBundle:string;
  public checkFreight:boolean=false;
  public inputMisc:String;
  public inputMiles:string;
  public  pickDateTime:string;
  private pickDate:string=new Date().toLocaleDateString()
  private pickTime:string=new Date().toLocaleTimeString('en-GB')
  public  deliveryDateTime:string;
  private deliveryDate:string=new Date().toLocaleDateString()
  private deliveryTime:string=new Date().toLocaleTimeString('en-GB')
  public inputDiscount:number;
  public inputCost:number;
  public inputCostClass:string='input-color-black';
  private autoCalcCost:number;
  public strSBundle:string;
  public strLBundle:string;
  public enableCreate:boolean;

  public inputWeight:number=0;

  public itemColorTruck:string='';
  public itemColorDriver:string='';
  public itemColorAssigned:string='';
  public itemColorType:string='';
  public itemColorStop:string='';
  public itemColorPairTicket:string='';
  private pairTicket='';

  public material:Material[]=[];
  

  //public selectTruckInFocus:boolean=false;
  //public selectTypeInFocus:boolean=false;
  //public selectStopInFocus:boolean=false;

  public arrCompanies:any;
  public arrDrivers:any;
  public arrAssignedTrucks:any;
  public arrPairTickets:any;
  private arrWaypoints:any;
  //public arrAddressFrom:any;
  //public arrAddressTo:any;
  
  public isCompanyNameFocus:boolean = false;
  public isAddressFromFocus:boolean = false;
  public isAddressToFocus:boolean = false;
  public results:any[]=[];

  @ViewChild('companyName') ionFirstInput!: IonInput;

  url='https://alpine.pairsite.com/dispatcher-app/create_new_ticket.php';
  constructor(private http: HttpClient, 
              private router:Router,
              private alertController:AlertController,
              private activatedRoute:ActivatedRoute
            ) {}

  ngOnInit() {

    //possible to remove
    if (!localStorage.getItem('username')){
      this.router.navigate(['login']);
    }else{
      this.username=localStorage.getItem('username')
    }

    this.getDriversList();
    this.getCompaniesList();
    this.getAssignedTrucks();

    this.activatedRoute.paramMap.subscribe(paramMap => {
      
      //next stop
      if (paramMap.has('ticketNum')) {

        const elementCompany = <HTMLInputElement>document.getElementById('input-company-name')
        const elementCalledInBy = <HTMLInputElement>document.getElementById('input-called-in-by')
        const elementOrigin = <HTMLInputElement>document.getElementById('input-address-from')
        const elementType = <HTMLInputElement>document.getElementById('select-type')
        const elementStop = <HTMLInputElement>document.getElementById('select-stop')
        const elementTruck = <HTMLInputElement>document.getElementById('select-truck')
        const elementDriver = <HTMLInputElement>document.getElementById('select-driver')
        const elementAssignedTruck = <HTMLInputElement>document.getElementById('select-assigned-truck')

        this.pairTicket = paramMap.get('ticketNum')
        this.http.get('https://alpine.pairsite.com/dispatcher-app/get_ticket.php?ticket_num=' + this.pairTicket).toPromise().then(result => {
          const ticket = result[0];
          this.inputCompanyName = ticket.company_name;
          elementCompany.value = this.inputCompanyName;
          this.companyId=ticket.company_id;

          this.inputCalledInBy=ticket.called_in_by;
          elementCalledInBy.value = this.inputCalledInBy;
          console.log('called = '+this.inputCalledInBy)

          //this.pickDate=ticket.pick_date;
          //this.pickTime=ticket.pick_time;
          //this.pickDateTime=this.pickDate+'T'+this.pickTime;
          //this.deliveryDate=ticket.delivery_date;
          //this.deliveryTime=ticket.delivery_time;
          //this.deliveryDateTime=this.deliveryDate+'T'+this.deliveryTime;
          this.inputAddressFrom = ticket.address_from;
          elementOrigin.value = this.inputAddressFrom;

        
          //this.inputDetails = ticket.details;
          //this.inputInternalNotes = ticket.internal_notes;
          this.selectStop = (Number(ticket.stop_id)+1).toString();
          console.log('SELECT STOP = '+this.selectStop)
          elementStop.value = this.selectStop; //next stop

          this.http.get('https://alpine.pairsite.com/dispatcher-app/get_ticket_to_pair.php'
            +'?stop_id='+this.selectStop
            +'&company_id='+this.companyId).toPromise().then((data) => {
              this.arrPairTickets = data;
              console.log(this.arrPairTickets)

              if (this.arrPairTickets[0]){
                this.selectPairTicket=this.arrPairTickets[0].ticket_num
                console.log('PAIR TICKET = '+this.selectPairTicket)
              }
            })
          

          this.selectType = ticket.type_id;
          elementType.value=this.selectType

          this.selectTruck = ticket.vehicle_id;
          elementTruck.value = this.selectTruck;

          //make sure list is loaded!
          this.selectDriver = ticket.driver_id;
          elementDriver.value = ticket.driver_id;
          console.log('DRIVER! = '+this.selectDriver)
      
          this.selectAssignedTruck = ticket.assigned_truck_id;
          elementAssignedTruck.value = this.selectAssignedTruck
          console.log('assigned = '+this.selectAssignedTruck)

          //this.checkReturn = ticket.is_return == '1' ? true : false;

          this.inputShipping = ticket.shipping;
          this.inputDetails = ticket.details;
          this.inputInternalNotes = ticket.internal_notes;

          console.log(result)

          this.calcCost();
            
        });
      }else{
        console.log('ticketnum not found!!')
      }
    });
   

    //init first material row
    this.material[0]={
      count:0,
      material:'',
      dimensions:'',
      weight:0,
      total_weight:null
    }

  }

  ionViewDidEnter() {
    document.getElementById('input-company-name').focus();
    document.getElementById('input-company-name').addEventListener('blur',this.setCompanyId.bind(this))
    document.getElementById('input-called-in-by').addEventListener('blur',this.setCalledInBy.bind(this))
    document.getElementById('input-address-from').addEventListener('blur',this.setAddressFrom.bind(this))
    document.getElementById('input-address-to').addEventListener('blur',this.setAddressTo.bind(this))

    //select fields
    document.getElementById('select-truck').addEventListener('focus',this.setSelectTruckInFocus.bind(this))
    document.getElementById('select-truck').addEventListener('blur',this.setTruck.bind(this))
    document.getElementById('select-driver').addEventListener('focus',this.setSelectDriverInFocus.bind(this))
    document.getElementById('select-driver').addEventListener('change',this.changeAssignedTruck.bind(this))
    document.getElementById('select-driver').addEventListener('blur',this.setDriver.bind(this))
    document.getElementById('select-assigned-truck').addEventListener('focus',this.setSelectAssignedTruckInFocus.bind(this))
    document.getElementById('select-assigned-truck').addEventListener('blur',this.setAssignedTruck.bind(this))
    document.getElementById('select-type').addEventListener('focus',this.setSelectTypeInFocus.bind(this))
    document.getElementById('select-type').addEventListener('blur',this.setType.bind(this))
    document.getElementById('select-stop').addEventListener('focus',this.setSelectStopInFocus.bind(this))
    document.getElementById('select-stop').addEventListener('blur',this.setStop.bind(this))
    document.getElementById('select-pair-ticket').addEventListener('focus',this.setSelecPairTicketInFocus.bind(this))
    document.getElementById('select-pair-ticket').addEventListener('blur',this.setPairTicket.bind(this))
  
    //document.getElementById('input-material').addEventListener('blur',this.scanMaterialInput.bind(this))

    
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
    const pick_element=<HTMLInputElement>document.getElementById('pick-datetime')
    this.pickDateTime=pick_element.value
    this.pickDate=this.pickDate.split('/')[2]+'-'
                      +this.pickDate.split('/')[0]+'-'
                       +this.pickDate.split('/')[1]

    const element=<HTMLInputElement>document.getElementById('delivery-datetime')
    this.deliveryDateTime=element.value
    this.deliveryDate=this.deliveryDate.split('/')[2]+'-'
                      +this.deliveryDate.split('/')[0]+'-'
                      +this.deliveryDate.split('/')[1]

    console.log('pick date='+this.pickDate)
    console.log('pick time='+this.pickTime)
    console.log('delivery date='+this.deliveryDate)
    console.log('delivery time='+this.deliveryTime)
    
  }

  validateTicket(){
    //validate multi stop
    if (Number(this.selectStop)>1){
      if (this.selectPairTicket==''){
        this.presentMultiStopAlert('Need to pair multiport with ticket');
        return;
      }else{
        const new_ticket=this.selectPairTicket.split('.')[0]+'.'+this.selectStop;
        console.log('new ticket = '+new_ticket)
        this.http.get('https://alpine.pairsite.com/dispatcher-app/check_ticket_exists.php?ticket_num='+new_ticket).subscribe(data=>{
          console.log(data)
          if (data[0]){ //ticket already exists
            this.presentMultiStopAlert('Ticket '+new_ticket+' already exists!')
          }else{
            this.createNewTicket();
          }
        })
      }
    }else{
      this.createNewTicket();
    }
  }
  createNewTicket() {
    var re=/'/g;
    this.strReturn=this.checkReturn?'1':'0';
    this.strSBundle=this.checkSBundle?'1':'0';
    this.strLBundle=this.checkLBundle?'1':'0';
    this.strLastStop = this.checkLastStop?'1':'0';
    console.log(this.deliveryDateTime)
    //this.deliveryDate=arrDateTime[0];
    //this.deliveryTime=arrDateTime[1];

    //motherfucking bitches
    let element = <HTMLInputElement>document.getElementById('input-miles')
    this.inputMiles = element.value

    //motherfucking bitches
    element=<HTMLInputElement>document.getElementById('input-called-in-by')
    this.inputCalledInBy=element.value

    let material_args='';
    for (let i=0;i<this.material.length;i++){
      material_args+='&count'+Number(i+1)+'='+this.material[i].count;
      material_args+='&material'+Number(i+1)+'='+this.material[i].material;
      material_args+='&dim'+Number(i+1)+'='+this.material[i].dimensions;
      material_args+='&weight'+Number(i+1)+'='+this.material[i].weight;
      material_args+='&total_weight'+Number(i+1)+'='+this.material[i].total_weight;
    }
    console.log(material_args);

    this.http.get(this.url
      +'?company_id='+this.companyId
      +'&username='+this.username
      +'&called_in_by='+this.inputCalledInBy
      +'&address_from='+this.inputAddressFrom.replace(re,"\\'")
      +'&address_to='+this.inputAddressTo.replace(re,"\\'")
      +'&driver_id='+this.selectDriver
      +'&assigned_truck_id='+this.selectAssignedTruck
      +'&shipping='+this.inputShipping.replace(re,"\\'")
      +'&pick_date='+this.pickDate
      +'&pick_time='+this.pickTime
      +'&delivery_date='+this.deliveryDate
      +'&delivery_time='+this.deliveryTime
      +'&details='+this.inputDetails.replace(re,"\\'")
      +'&internal_notes='+this.inputInternalNotes.replace(re,"\\'")
      +'&type_id='+this.selectType
      +'&vehicle_id='+this.selectTruck
      +'&stop_id='+this.selectStop
      +'&last_stop='+this.strLastStop
      +'&pair_ticket='+this.selectPairTicket
      +'&return='+this.strReturn
      +'&dry_run=' //empty
      +'&lift='+this.inputNumLifts
      +'&boxes='+this.inputNumBoxes
      +'&sBundle='+this.strSBundle
      +'&lBundle='+this.strLBundle
      +'&misc='+this.inputMisc
      +'&pallets='+this.inputNumPallets
      +'&reels='+this.inputNumReels
      //+'&material1='+this.inputMaterial1
      //+'&material2='+this.inputMaterial2
      //+'&material3='+this.inputMaterial3
      //+'&dim1='+this.inputDim1
      //+'&dim2='+this.inputDim2
      //+'&dim3='+this.inputDim3
      //+'&weight1='+this.inputWeight1
      //+'&weight2='+this.inputWeight2
      //+'&weight3='+this.inputWeight3
      +'&miles='+this.inputMiles
      +'&weight='+this.inputWeight
      +'&discount='+this.inputDiscount
      +'&cost='+this.inputCost
      +'&auto_calc_cost='+this.autoCalcCost
      +'&freight='+this.isFreight
      +material_args
     ).toPromise().then(result => {
      console.log(result);
      this.router.navigate(['home']);
    });
  }
  async presentMultiStopAlert(message) {
    const alert = await this.alertController.create({
      header: 'Warning',
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }
  cancelNewTicket(){
    this.router.navigate(['home']);
  }
  getCompaniesList() {
    this.http.get('https://alpine.pairsite.com/dispatcher-app/get_companies_list.php').toPromise().then((data) => {
      this.arrCompanies=data;
    })
  }
  /*
  getFromAddressList(){
    console.log('comapnyID='+this.companyId);
    this.http.get('https://alpine.pairsite.com/dispatcher-app/get_from_address_list.php').toPromise().then(data => {
      this.arrAddressFrom=data;
      console.log(this.arrAddressFrom)
    })
  }
  getToAddressList(){
    this.http.get('https://alpine.pairsite.com/dispatcher-app/get_to_address_list.php').toPromise().then(data => {
      this.arrAddressTo=data;
      console.log(this.arrAddressTo)
    })
  }
  isDoron(e1){
    return e1==235;
  }
    */
  getDriversList(){
    this.http.get('https://alpine.pairsite.com/dispatcher-app/get_drivers_list.php').toPromise().then((data) => {
      this.arrDrivers=data;
      localStorage.setItem('drivers_list',JSON.stringify(this.arrDrivers))
    })
  }
  getAssignedTrucks(){
    this.http.get('https://alpine.pairsite.com/dispatcher-app/get_assigned_trucks.php').toPromise().then((data) => {
      this.arrAssignedTrucks=data;
      localStorage.setItem('assigned_trucks',JSON.stringify(this.arrAssignedTrucks)) //local store
    })
  }
  setCompanyId(){
    var companyName = (<HTMLInputElement>document.getElementById('input-company-name')).value;
    if(this.arrCompanies.find(x => x.CompanyName == companyName)){
      this.companyId = this.arrCompanies.find(x => x.CompanyName == companyName).id;
      console.log('ID = '+this.companyId)
    }else{
      this.companyId=null;
    }
   
    //this.getFromAddressList(); //for next field
  }
  setCalledInBy(){
    const element=<HTMLInputElement>document.getElementById('input-called-in-by')
    this.inputCalledInBy=element.value
  }
  setAddressFrom(){
    const element=<HTMLInputElement>document.getElementById('input-address-from')
    element.value=this.convertToTitleCase(element.value)
    this.inputAddressFrom=element.value;

    //this.getToAddressList(); //for next field
  }
  setAddressTo(){
    const element=<HTMLInputElement>document.getElementById('input-address-to')
    element.value=this.convertToTitleCase(element.value)
    this.inputAddressTo=element.value;

    let request={
      origin:this.inputAddressFrom,
      destination: this.inputAddressTo,
      travelMode:google.maps.TravelMode.DRIVING,
      unitSystem:google.maps.UnitSystem.IMPERIAL,
      /*waypoints:[
                  {location:this.inputAddressTo,
                    stopover:true
                  },
                  {location:'78735',
                    stopover:true
                  }
                ],
      optimizeWaypoints:false,*/
      avoidTolls:true
    }
     //dircetions service
     let dircetionsService = new google.maps.DirectionsService();
     let distance;
     dircetionsService.route(request,function(result,status){
      if (status == google.maps.DirectionsStatus.OK){
        console.log(result)
        //console.log('thats right BE-ATCH '+ result.routes[0].legs[0].distance.text)
        distance=Math.ceil(Number(result.routes[0].legs[0].distance.text.split(' ')[0]))  //remove ' mi' and round up
        const element = <HTMLInputElement>document.getElementById('input-miles')
        element.value = distance
      }
     })
     //wait for miles field to be ready
     setTimeout( () => { this.calcCost() }, 500 );
     
     
  }
  setTruck(){
    const element=<HTMLInputElement>document.getElementById('select-truck')
    this.selectTruck=element.value;

    this.itemColorTruck='';

    this.calcCost();
  }
  setDriver(){
    const element=<HTMLInputElement>document.getElementById('select-driver')
    this.selectDriver=element.value;
    console.log('DRIVER ID='+this.selectDriver)

    this.itemColorDriver='';
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
  setAssignedTruck(){
    const element=<HTMLInputElement>document.getElementById('select-assigned-truck')
    this.selectAssignedTruck=element.value

    this.itemColorAssigned='';
  }
  setType(){
    const element=<HTMLInputElement>document.getElementById('select-type')
    this.selectType=element.value

    this.itemColorType='';

    this.calcCost();
  }
  setStop(){
    const element=<HTMLInputElement>document.getElementById('select-stop')
    this.selectStop=element.value

    this.itemColorStop='';
    
    this.http.get('https://alpine.pairsite.com/dispatcher-app/get_ticket_to_pair.php'
                  +'?stop_id='+this.selectStop
                  +'&company_id='+this.companyId).toPromise().then((data) => {
      this.arrPairTickets = data;
      console.log(this.arrPairTickets)
      
      if (this.arrPairTickets[0]){
        this.selectPairTicket=this.arrPairTickets[0].ticket_num
        console.log('PAIR TICKET = '+this.selectPairTicket)
      }
    })
    this.calcCost();
  }
  setSelecPairTicketInFocus(){
    this.itemColorPairTicket='light';
  }
  setPairTicket(){
    const element=<HTMLInputElement>document.getElementById('select-pair-ticket')
    this.selectPairTicket=element.value

    this.itemColorPairTicket='';
  }
  scanMaterialInput(){
    const element=<HTMLInputElement>document.getElementById('input-material')
    this.inputMaterial=element.value
    console.log('MATERIAL = '+this.inputMaterial)
    let count='';
    
    //init numbers
    this.inputNumPallets='0';
    this.inputNumReels='0';
    this.inputNumLifts='0';
    this.inputNumBoxes='0';
    this.inputMaterial.split(' ').forEach(item =>{
      //trim
      item=item.replace(';','');
      item=item.replace(',','');
      //scan for pallets, reels, Lifts, boxes 
      if ((item.toLowerCase()=='pallet') || (item.toLowerCase()=='pallets')){
        console.log('found '+count.toString()+' pallets')
        this.inputNumPallets=count;
      }else if ((item.toLowerCase()=='reel') || (item.toLowerCase()=='reels')){
        console.log('found '+count.toString()+' reels')
        this.inputNumReels=count;
      }else if ((item.toLowerCase()=='lift') || (item.toLowerCase()=='lifts')){
        console.log('found '+count.toString()+' lifts')
        this.inputNumLifts=count;
      }else if ((item.toLowerCase()=='box') || (item.toLowerCase()=='boxes')){
        console.log('found '+count.toString()+' boxes')
        this.inputNumBoxes=count;
      }
      count=item;
    })
    if (
      this.inputNumPallets>'0' || 
      this.inputNumReels>'0' ||
      this.inputNumLifts>'0' ||
      this.inputNumBoxes>'0'
    )
    this.presentAlert();
  }
  async presentAlert() {
    let material='';
    if (this.inputNumPallets>'0'){
      material+=this.inputNumPallets+' pallet(s), ';
    }
    if (this.inputNumReels>'0'){
      material+=this.inputNumReels+' reel(s), ';
    }
    if (this.inputNumLifts>'0'){
      material+=this.inputNumLifts+' lift(s), ';
    }
    if (this.inputNumBoxes>'0'){
      material+=this.inputNumBoxes+' box(es), ';
    }
    const alert = await this.alertController.create({
      header: 'Note',
      message: 'Found '+material,
      buttons: ['OK'],
      mode:'ios'
    });

    await alert.present();
  }
  convertToTitleCase(str) {
    if (!str) {
        return ""
    }
    return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
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
  setSelectTruckInFocus(){
    this.itemColorTruck='light';
  }
  setSelectDriverInFocus(){
    this.itemColorDriver='light';
  }
  setSelectAssignedTruckInFocus(){
    this.itemColorAssigned='light';
  }
  setSelectTypeInFocus(){
    this.itemColorType='light';
  }
  setSelectStopInFocus(){
    this.itemColorStop='light';
  }
  addMaterial(){
    this.material[this.material.length]={
      count:0,
      material:'',
      dimensions:'',
      weight:0,
      total_weight:null
    }
   
  }
  removeMaterial(){
    let k=this.material.pop();
  }
  setFreight(){
    this.isFreight=this.checkFreight?'1':'0';
    console.log(this.isFreight)
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
  populate(){
    const companyName = <HTMLInputElement>document.getElementById('input-company-name');
    companyName.value='Alpine Test Company'
    this.companyId='1511';

    let element = <HTMLInputElement>document.getElementById('input-called-in-by')
    element.value = 'John Deere'

    element = <HTMLInputElement>document.getElementById('input-address-from')
    element.value = '9204 Brown Lane, Austin, Tx, Usa'
    this.inputAddressFrom = element.value

    element = <HTMLInputElement>document.getElementById('input-address-to')
    element.value = '100 Congress Avenue, Austin, Tx, Usa'
    this.inputAddressTo = element.value

    this.inputMiles='9'

  }
  calcCost(){
    
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

        //return
        if (this.checkReturn){
          const returnCost=cost/2>35?cost/2:35;
          cost+=returnCost;
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

        //return
         if (this.checkReturn){
          const returnCost=cost/2>69?cost/2:69;
          cost+=returnCost;
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

        //return
        if (this.checkReturn){
          const returnCost=cost/2>69?cost/2:69;
          cost+=returnCost;
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

        //return
        if (this.checkReturn){
        const returnCost=cost/2>465?cost/2:465;
        cost+=returnCost;
        }

        this.inputCost=Math.round(cost*100)/100 //round to 2 decimal places
        break;

      case '5': //40' Flatbed
        if (miles<=100){
          cost=575;
        }else{
          cost=80+4.95*miles
        }

        //return
        if (this.checkReturn){
        const returnCost=cost/2>575?cost/2:575;
        cost+=returnCost;
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
      this.http.get('https://alpine.pairsite.com/dispatcher-app/get_waypoints.php?ticket_num='+this.pairTicket).toPromise().then((data) => {
      console.log(data)
      this.arrWaypoints=data;

      const waypts=[];
    
      for (let i = 0; i < this.arrWaypoints.length; i++) {
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