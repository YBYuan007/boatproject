import { LightningElement, wire, api, track} from 'lwc';
import getBoatsByLocation from '@salesforce/apex/BoatDataService.getBoatsByLocation'; 
import { getLocationService } from 'lightning/mobileCapabilities';
import { ShowToastEvent } from "lightning/platformShowToastEvent";


const LABEL_YOU_ARE_HERE = 'You are here!';
const ICON_STANDARD_USER = 'standard:user';
const ERROR_TITLE = 'Error loading Boats Near Me';
const ERROR_VARIANT = 'error';

export default class BoatsNearMe extends LightningElement {
  @api boatTypeId;
  latitude;
  longitude;
  isRendered; 
  mapMarkers = [];
  isLoading = true;

  // Add the wired method from the Apex Class
  // Name it getBoatsByLocation, and use latitude, longitude and boatTypeId
  // Handle the result and calls createMapMarkers
  @wire(getBoatsByLocation,{boatTypeId: '$boatTypeId', userLatitude: '$latitude', userLongitude: '$longitude'})
  wiredBoatsJSON({error, data}) { 
    if(data) {
      this.createMapMarkers(data);
    } else if (error) {
      const evt = new ShowToastEvent({
        title: ERROR_TITLE,
        message: error,
        variant: ERROR_VARIANT
      });
      this.dispatchEvent(evt);
    }
  }

  renderedCallback() {
    if(!this.isRendered){
      this.getLocationFromBrowser()
    }
    this.isRendered=true;
  }

  getLocationFromBrowser(){
    navigator.geolocation.getCurrentPosition(position => {
      this.latitude = position.coords.latitude; 
      this.longitude = position.coords.longitude; 
    })
  } 


    // Creates the map markers
    createMapMarkers(boatData) {
      const newMarkers = boatData.map(boat => {
        return {
          title: boat.Name,
          location: {
            Latitude: boat.Geolocation__c.latitude,
            Longitude: boat.Geolocation__c.longitude,
          },
          icon: 'standard:location'
        };
      });
      
      newMarkers.unshift({
        title: LABEL_YOU_ARE_HERE,
        location: {
          Latitude: this.latitude,
          Longitude: this.longitude,
        }, 
        icon: ICON_STANDARD_USER
      });

      this.mapMarkers = newMarkers; 
      this.isLoading = false;
    }

}