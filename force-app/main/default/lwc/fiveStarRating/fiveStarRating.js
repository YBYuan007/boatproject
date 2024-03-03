//import fivestar static resource, call it fivestar
import { LightningElement } from 'lwc';

// import fivestar from '@salesforce/resourceUrl/fivestar';
import {ShowToastEvent} from 'lightning/platformShowToastEvent'; 

// add constants here
const ERROR_TITLE = 'Error loading five-star'; 
const ERROR_VARIANT = 'error' ;
const EDITABLE_CLASS = 'abc'; 
const READ_ONLY_CLASS = 'xyz'; 

export default class FiveStarRating extends LightningElement {
  // //initialize public readOnly and value properties
  // readOnly;
  // value;

  // editedValue;
  // isRendered;

  // // //getter function that returns the correct class depending on if it is readonly
  // // starClass() {}

  // // // Render callback to load the script once the component renders.
  // renderedCallback() {
  //   if (!this.isRendered) {
  //     return;
  //   }
  //   this.loadScript();
  //   this.isRendered = true;
  // }

  // //Method to load the 3rd party script and initialize the rating.
  // //call the initializeRating function after scripts are loaded
  // //display a toast with error message if there is an error loading script
  // loadScript() {
  //   console.log('going through the loadScript function');
  //   try{
  //     this.initializeRating();
  //   } catch(error){ 
  //     const evt = new ShowToastEvent({
  //       title: ERROR_TITLE, 
  //       variant: ERROR_VARIANT,
  //       message: error 
  //     })
  //     this.dispatchEvent(evt);
  //   }; 
     
  // }

  // initializeRating() {
  //   let domEl = this.template.querySelector('ul');
  //   let maxRating = 5;
  //   let self = this;
  //   let callback = function (rating) {
  //     self.editedValue = rating;
  //     self.ratingChanged(rating);
  //   };
  //   this.ratingObj = window.rating(
  //     domEl,
  //     this.value,
  //     maxRating,
  //     callback,
  //     this.readOnly
  //   );
  // }

  // // Method to fire event called ratingchange with the following parameter:
  // // {detail: { rating: CURRENT_RATING }}); when the user selects a rating
  // ratingChanged(rating) {}
}