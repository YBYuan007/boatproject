import { LightningElement } from 'lwc';
import { NavigationMixin } from "lightning/navigation";


export default class BoatSearch  extends NavigationMixin(LightningElement)  {
  isLoaded = false;
  boatTypeId; 

  connectedCallback(){
    this.isLoaded=true; 
  }

  // Handles loading event
  handleLoading() { }

  // Handles done loading event
  handleDoneLoading() { }
  
  // Handles search boat event
  // This custom event comes from the form
  searchBoats(event) {
    console.log('getting the event', event.detail);
    this.boatTypeId = event.detail;
  }


  createNewBoat(){
    console.log('createNewBoat');
    this[NavigationMixin.Navigate]({
      type: "standard__objectPage",
      attributes: {
        objectApiName : 'Boat__c',
        actionName: 'new'
      }
    });
  }

}