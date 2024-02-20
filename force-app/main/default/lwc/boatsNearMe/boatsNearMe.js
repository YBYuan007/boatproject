import { LightningElement, wire, api } from 'lwc';
import getBoatsByLocation from '@salesforce/apex/BoatDataService.getBoatsByLocation'; 
import { getLocationService } from 'lightning/mobileCapabilities';

export default class BoatsNearMe extends LightningElement {
  @api boatTypeId;
  userLatitude;
  userLongitude;

  connectedCallback(){
    this.getLocationFromBrowser(); 
  }
  
  getLocationFromBrowser(){
    navigator.geolocation.getCurrentPosition(position => {
      console.log('position: ' , position); 
    })
  } 

  //@wire(getBoatsByLocation, {boatTypeId: this.boatTypeId,  userLatitude, String userLongitude})


}