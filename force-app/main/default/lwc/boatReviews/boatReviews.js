import { LightningElement, api, track } from 'lwc';
import getAllReviews from '@salesforce/apex/BoatDataService.getAllReviews';

// imports
export default class BoatReviews extends LightningElement {
  // Private
  boatId;
  @track error;
  @track boatReviews;
  isLoading;
  
  // Getter and Setter to allow for logic to run on recordId change
  @api 
  get recordId() { 
    return this.boatId;
  }
 
  set recordId(value) {
    //sets boatId attribute
    this.setAttribute('boatId', value);
    //sets boatId assignment
    this.boatId = value;
    //get reviews associated with boatId
    this.getReviews();
  }
  
  // Getter to determine if there are reviews to display
  get reviewsToShow() { 
    console.log('get: reviewsToShow: ', this.boatReviews);
    console.log('get: reviewsToShow: ', this.boatReviews?.length);
    return this.boatId != null && this.boatId != undefined && this.boatReviews?.length>0;
  }
  
  // Public method to force a refresh of the reviews invoking getReviews
  @api 
  refresh() { 
    console.log('calling child refresh');
    this.getReviews();
  }
  
  // Imperative Apex call to get reviews for given boat
  // returns immediately if boatId is empty or null
  // sets isLoading to true during the process and false when it’s completed
  // Gets all the boatReviews from the result, checking for errors.
  getReviews() { 
    console.log('calling get reviews , imperative apex call');
    console.log('give me boatId!!!' ,this.boatId);
    if(this.boatId){
      console.log('in the reviews, did i get the boatid?: ', this.boatId);
      this.isLoading = true;
      getAllReviews({boatId: this.boatId})
      .then((result)=> {
        console.log(' review result: ' , result); 
        this.boatReviews = result;
        this.isLoading=false;
      }).catch((error)=> {
        console.log('error: ' , error); 
        this.error = error
      })
    } else {
      return;
    }
  }
  
  // Helper method to use NavigationMixin to navigate to a given record on click
  navigateToRecord(event) {  }
}
