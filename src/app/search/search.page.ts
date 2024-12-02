import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  public text:string;
  public showDropDown:boolean = false;
  public length:number;
  constructor() { }

  ngOnInit() {
  }
  public data = [
    'Amsterdam',
    'Buenos Aires',
    'Cairo',
    'Geneva',
    'Hong Kong',
    'Istanbul',
    'London',
    'Madrid',
    'New York',
    'Panama City',
  ];
  public results = [...this.data];

  handleInput(event) {
    const query = event.target.value.toLowerCase();
    this.results = this.data.filter((d) => d.toLowerCase().indexOf(query) > -1);
    length=this.results.length;
    console.log(this.results.length)
  }
  setText(){
    if (this.results.length==1){
       this.text=this.results[0];
    }
    this.showDropDown=false;
  }
}
