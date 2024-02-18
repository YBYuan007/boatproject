import { LightningElement, wire, api, track } from 'lwc';
import getBoats from "@salesforce/apex/BoatDataService.getBoats";
import updateBoatList from "@salesforce/apex/BoatDataService.updateBoatList";
import {publish, MessageContext} from 'lightning/messageService'; 
import BOATMC from '@salesforce/messageChannel/Boat_Message__c'; 
import {refreshApex} from '@salesforce/apex';

const SUCCESS_TITLE ='Success';
const MESSAGE_SHIP_IT = 'Ship it!';
const SUCCESS_VARIANT = 'success';
const ERROR_TITLE = 'Error';
const ERROR_VARIANT = 'error';

const columns = [
  { label: 'Name', fieldName: 'Name' },
  { label: 'Length', fieldName: 'Length__c' },
  { label: 'Price', fieldName: 'Price__c' },
  { label: 'Description', fieldName: 'Description__c'}
];

export default class BoatSearchResults extends LightningElement {
  @api selectedBoatId;
  columns=columns;
  @api boatTypeId; 
  @track boats;
  isLoading=true;
  rowOffset = 0;
  draftValues = [];

  @wire(MessageContext)
  messageContext;

  @wire(getBoats, {boatTypeId : "$boatTypeId"})
  wiredBoats({error, data}){
    if(data) {
      console.log('get wired data', data);
      this.boats = data;
    } else if(error) {
      console.log('get wried error', error); 
    }
  };

  // public function that updates the existing boatTypeId property
  // uses notifyLoading
  @api
  searchBoats(boatTypeId) {
    console.log('child boatTypeId: ' , boatTypeId ); 
    this.isLoading=true;
    this.notifyLoading(this.isLoading);
    this.boatTypeId=boatTypeId;
  }
  
  // this public function must refresh the boats asynchronously
  // uses notifyLoading
  @api
  async refresh() {
      this.isLoading = true; 
      notifyLoading(this.isLoading);

      await refreshApex(this.boats); 
      this.isLoading=false; 
      this.notifyLoading(this.isLoading);

  }

  notifyLoading(isLoading) {
    if(isLoading) {
      const event1 = new CustomEvent('loading');
      this.dispatchEvent(event1); 
    } else {
      const event2 = new CustomEvent('doneloading');
      this.dispatchEvent(event2)
    }
  
  }


  // this function must update selectedBoatId and call sendMessageService
  updateSelectedTile(evt) {
    console.log('from parent what i got from tile: ' + evt.detail);
    this.selectedBoatId = evt.detail;
    console.log('this.selectedBoatId: ', this.selectedBoatId );
    this.sendMessageService(this.selectedBoatId); 
  }
  
  // Publishes the selected boat Id on the BoatMC.
  sendMessageService(boatId) { 
    // explicitly pass boatId to the parameter recordId
    console.log('sendMessageService: ',boatId ); 
    const payload = {recordId : boatId} ; 
    publish(this.messageContext, BOATMC, payload);
  }

  handleSave(event) {
    // notify loading
    console.log('event.detail.draftValues; ', event.detail.draftValues);
    this.updatedFields = event.detail.draftValues;
    // Update the records via Apex
    updateBoatList({data: updatedFields})
    .then((result) => {console.log('data received from the backend: ', result);})
    .catch(error => {})
    .finally(() => {});
  }

  
}