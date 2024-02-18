import { LightningElement } from 'lwc';
import { NavigationMixin } from "lightning/navigation";


export default class BoatSearch  extends NavigationMixin(LightningElement)  {
  isloading = false;
  boatTypeId = ''; 

  // Handles loading event
  handleLoading() { 
    console.log('parent - handleloading');
    this.isloading=true; 
  }

  // Handles done loading event
  handleDoneLoading() { 
    console.log('parent - hanle done loading ');
    this.isloading=false;
  }
  
  // Handles search boat event
  // This custom event comes from the form
  searchBoats(event) {
    console.log('what !!!' , event.detail);
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