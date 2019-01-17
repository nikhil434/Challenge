import { Component, Input } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {UtilityService} from "./app.service";

type appDataType = {
  body: string
  title: string
  category: string
  keywords: string
  isFavourite: boolean
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @Input('ngModel') seatchString: string = 'takeout';
  title = 'challenge';
  isSearchPending: boolean;
  totalData: appDataType[];
  searchString: string;
  favourites:appDataType[];
  selectedFavourites: appDataType[];
  searchResult: appDataType[];
  decodeEntities = this.utilityService.decodeEntities;

  constructor(private httpClient: HttpClient, private utilityService: UtilityService) { }

  ngOnInit() {
    this.getAllData();
    this.getFavourites();
  }

  searchButtonClicked = () => {
    if(this.totalData && this.totalData.length && this.searchString){
      this.searchResult = this.totalData.filter( item => {
        const shouldShow = item.body.indexOf(this.searchString)> -1 || item.title.indexOf(this.searchString)> -1;
        return shouldShow;
      })
      this.isSearchPending = false;
    } else if(this.searchString){
      this.isSearchPending = true;
    } else{
      this.searchResult = [];
    }
  }

  changeFavourites = (item) => {
    if(item.isFavourite) {
      this.utilityService.removeFavourite(item.title);
      const itemIndex = this.selectedFavourites.indexOf(item);
      this.selectedFavourites.splice(itemIndex, 1);
    } else {
      this.utilityService.addFavourite(item.title);
      this.selectedFavourites.push(item)
    }
    item.isFavourite = !item.isFavourite;
    this.selectedFavourites = this.totalData.filter( item => item.isFavourite);
  }

  getFavourites = () => {
    this.favourites = this.utilityService.getFavourites();
  }

  getAllData = () => {
    this.httpClient
    .get<any[]>("https://secure.toronto.ca/cc_sr_v1/data/swm_waste_wizard_APR?limit=1000").subscribe((result) => {
      this.totalData = result.map( item => {
        item.isFavourite = this.favourites.indexOf(item.title) > -1;
        return item;
      });
      this.selectedFavourites = this.totalData.filter( item => item.isFavourite);
      if(this.isSearchPending){
        this.searchResult = this.totalData.filter( item => {
          const shouldShow = item.body.indexOf(this.searchString)> -1 || item.title.indexOf(this.searchString)> -1;
          return shouldShow;
        })
        this.isSearchPending = false;
      }
    })
  }

}
