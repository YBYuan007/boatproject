import { LightningElement, wire, api } from 'lwc';
import getBoats from "@salesforce/apex/BoatDataService.getBoats";
import updateBoatList from "@salesforce/apex/BoatDataService.updateBoatList";
import {publish, MessageContext} from 'lightning/messageService'; 
import BOATMC from '@salesforce/messageChannel/Boat_Message__c'; 

const SUCCESS_TITLE = 'Success';
const MESSAGE_SHIP_IT     = 'Ship it!';
const SUCCESS_VARIANT     = 'success';
const ERROR_TITLE   = 'Error';
const ERROR_VARIANT = 'error';

const columns = [
  { label: 'Name', fieldName: 'Name' },
  { label: 'Length', fieldName: 'Length__c' },
  { label: 'Price', fieldName: 'Price__c' },
  { label: 'Description', fieldName: 'Description__c'}
];

export default class BoatSearchResults extends LightningElement {
  selectedBoatId;
  columns=columns;
  @api boatTypeId = ''; 
  boats;
  isLoading=false;
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
  searchBoats(boatTypeId) { }
  
  // this public function must refresh the boats asynchronously
  // uses notifyLoading
  refresh() { }


  // this function must update selectedBoatId and call sendMessageService
  updateSelectedTile(evt) {
    this.selectedBoatId = evt.detail;
    console.log('this.selectedBoatId: ', this.selectedBoatId );
    sendMessageService(this.selectedBoatId); 
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
    console.log('event.detail.draftValues; ' ,event.detail.draftValues);
    this.updatedFields = event.detail.draftValues;
    // Update the records via Apex
    updateBoatList({data: updatedFields})
    .then((result) => {console.log('data received from the backend: ', result);})
    .catch(error => {})
    .finally(() => {});
  }
  
  notifyLoading(isLoading) { }
}