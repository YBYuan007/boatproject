import { LightningElement , api } from "lwc";

import BOAT_REVIEW_OBJECT from '@salesforce/schema/BoatReview__c';
import NAME_FIELD from '@salesforce/schema/BoatReview__c.Name';
import COMMENT_FIELD from '@salesforce/schema/BoatReview__c.Comment__c';

const SUCCESS_TITLE='Review Created!'; 
const SUCCESS_VARIANT='success'; 

// import BOAT_REVIEW_OBJECT from schema - BoatReview__c
export default class BoatAddReviewForm extends LightningElement {
  // Private
  boatId;
  rating;
  boatReviewObject = BOAT_REVIEW_OBJECT;
  nameField        = NAME_FIELD;
  commentField     = COMMENT_FIELD;
  labelSubject = 'Review Subject';
  labelRating  = 'Rating';
  
  // Public Getter and Setter to allow for logic to run on recordId change
  get recordId() { 
    console.log('from boat add review form: getter' , this.boatId);
    return this.boatId;
  }
  set recordId(value) {
    //sets boatId attribute
    //sets boatId assignment
    console.log('from boat add review form: setter' , value);
    this.boatId = value.recordId;
  }
  
  // Gets user rating input from stars component
  handleRatingChanged(event) {
    this.rating = event.detail;
  }
  
  // Custom submission handler to properly set Rating
  // This function must prevent the anchor element from navigating to a URL.
  // form to be submitted: lightning-record-edit-form
  handleSubmit(event) {
    console.log('trying to click submit');
  }
  
  // Shows a toast message once form is submitted successfully
  // Dispatches event when a review is created
  handleSuccess() {
    // TODO: dispatch the custom event and show the success message
    this.handleReset();
  }
  
  // Clears form data upon submission
  // TODO: it must reset each lightning-input-field
  handleReset() { }
}
