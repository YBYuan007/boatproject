import { LightningElement, wire, api } from 'lwc';
import getBoats from "@salesforce/apex/BoatDataService.getBoats";
import {publish, MessageContext} from 'lightning/messageService'; 
import BOATMC from '@salesforce/messageChannel/Boat_Message__c'; 

const SUCCESS_TITLE = 'Success';
const MESSAGE_SHIP_IT     = 'Ship it!';
const SUCCESS_VARIANT     = 'success';
const ERROR_TITLE   = 'Error';
const ERROR_VARIANT = 'error';

export default class BoatSearchResults extends LightningElement {
  @api boatTypeId; 
  selectedBoatId;
  boats;
  columns=[];

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


}