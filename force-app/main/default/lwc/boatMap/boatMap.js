import { LightningElement, api, track, wire} from 'lwc';
import { getRecord } from "lightning/uiRecordApi";
import BOATMC from '@salesforce/messageChannel/Boat_Message__c'; 
import { MessageContext, subscribe, unsubscribe, APPLICATION_SCOPE } from 'lightning/messageService';

// Declare the const LONGITUDE_FIELD for the boat's Longitude__s
const LONGITUDE_FIELD = "Boat__c.Geolocation__Longitude__s";
// Declare the const LATITUDE_FIELD for the boat's Latitude
const LATITUDE_FIELD = "Boat__c.Geolocation__Latitude__s";
// Declare the const BOAT_FIELDS as a list of [LONGITUDE_FIELD, LATITUDE_FIELD];
const BOAT_FIELDS = [LONGITUDE_FIELD, LATITUDE_FIELD];


export default class BoatMap extends LightningElement {
 
  // private
  subscription = null;
  boatId;
  error = undefined;
  mapMarkers = [];

  @wire(MessageContext)
    messageContext;

  connectedCallback() {
    this.subscribeMC();
  }

  subscribeMC() {
    // recordId is populated on Record Pages, and this component
    // should not update when this component is on a record page.
    if (this.subscription || this.recordId) {
      return;
    }
    // Subscribe to the message channel to retrieve the recordId and explicitly assign it to boatId.
      this.subscription = subscribe(
          this.messageContext,
          BOATMC,
          (message) => {
            console.log('subscribed message' , message);
            //this.handleMessage(message)
            this.boatId = message.recordId;
            console.log('define the boatId received from the message channel: ' , this.boatId);
          }, 
          { scope: APPLICATION_SCOPE }
      );
  }

  @wire(getRecord, { recordId: '$boatId', fields: BOAT_FIELDS })
  wiredRecord({ error, data }) {
    // Error handling
    if (data) {
      console.log('getting record data: ', data); 
      this.error = undefined;
      const longitude = data.fields.Geolocation__Longitude__s.value;
      const latitude = data.fields.Geolocation__Latitude__s.value;
      this.updateMap(longitude, latitude);
    } else if (error) {
      console.log('did i get an error: ' , error);
      this.error = error;
      this.boatId = undefined;
      this.mapMarkers = [];
    }
  }

  @api
  get recordId() {
    return this.boatId;
  }
  set recordId(value) {
    this.setAttribute('boatId', value);
    this.boatId = value;
  }

  // Creates the map markers array with the current boat's location for the map.
  updateMap(Longitude, Latitude) {
    this.mapMarkers = [{
      location: {
          Latitude: Latitude,
          Longitude: Longitude
      },
   },]
  }

  // Getter method for displaying the map component, or a helper method.
  get showMap() {
    console.log('get show map');
    return this.mapMarkers.length > 0;
  }
}