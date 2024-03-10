import { LightningElement, wire } from 'lwc';
import getSimilarBoats from '@salesforce/apex/BoatDataService.getSimilarBoats';

// imports
// import getSimilarBoats
export default class SimilarBoats extends LightningElement {
  // Private
  relatedBoats;
  boatId;
  error;
  
  // public
  get recordId() {
      // returns the boatId
    }
    set recordId(value) {
        // sets the boatId value
        // sets the boatId attribute
    }
  
  // public
  similarBy;
  
  // Wire custom Apex call, using the import named getSimilarBoats
  // Populates the relatedBoats list
  @wire(getSimilarBoats, {boatId : this.boatId, similarBy : this.similarBy})
  similarBoats({ error, data }) {
    if(data){
      console.log('got from backend-data' ,data);
    } else {
      console.log('got from backend-data' ,error);
    } 
   }
  get getTitle() {
    return 'Similar boats by ' + this.similarBy;
  }
  get noBoats() {
    return !(this.relatedBoats && this.relatedBoats.length > 0);
  }
  
  // Navigate to record page
  openBoatDetailPage(event) { }
}
