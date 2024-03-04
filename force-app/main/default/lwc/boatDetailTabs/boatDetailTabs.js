import { LightningElement, wire } from "lwc";

import { getRecord, getFieldValue } from "lightning/uiRecordApi";
import BOATMC from '@salesforce/messageChannel/Boat_Message__c'; 
import { MessageContext, subscribe, unsubscribe, APPLICATION_SCOPE } from 'lightning/messageService';
import { NavigationMixin } from 'lightning/navigation';

// import labelDetails for Details
import labelDetails from '@salesforce/label/c.Details';
// import labelReviews for Reviews
import labelReviews from '@salesforce/label/c.Reviews';
// import labelAddReview for Add_Review
import labelAddReview from '@salesforce/label/c.Add_Review';
// import labelFullDetails for Full_Details
import labelFullDetails from '@salesforce/label/c.Full_Details';
// import labelPleaseSelectABoat for Please_select_a_boat
import labelPleaseSelectABoat from '@salesforce/label/c.Please_select_a_boat';

// import BOAT_ID_FIELD for the Boat Id
import BOAT_ID_FIELD from '@salesforce/schema/Boat__c.Id';
// import BOAT_NAME_FIELD for the boat Name
import BOAT_NAME_FIELD from '@salesforce/schema/Boat__c.Name';
const BOAT_FIELDS = [BOAT_ID_FIELD, BOAT_NAME_FIELD];

export default class BoatDetailTabs extends NavigationMixin(LightningElement) {
  boatId;

  label = {
    labelDetails,
    labelReviews,
    labelAddReview,
    labelFullDetails,
    labelPleaseSelectABoat,
  };
  
  @wire(getRecord, {recordId: '$boatId', fields: BOAT_FIELDS}) 
  wiredRecord;

  // Decide when to show or hide the icon
  // returns 'utility:anchor' or null
  get detailsTabIconName() {
    if(this.wiredRecord) {
      console.log('show the anchor? ', this.wiredRecord);
      return "utility:anchor"; 
    } else {
      return null; 
    }
  }
  
  // Utilize getFieldValue to extract the boat name from the record wire
  get boatName() { 
    return getFieldValue(this.wiredRecord.data, BOAT_NAME_FIELD); 
  }
  
  // Private
  subscription = null;
  
  @wire(MessageContext)
  messageContext; 

  // Calls subscribeMC()
  connectedCallback() {
    console.log('connected callback');
    this.subscribeMC();
  }


  // Subscribe to the message channel
  subscribeMC() {
    // local boatId must receive the recordId from the message
    console.log('under the subscribeMC func');
    
    this.subscription=subscribe(
      this.messageContext, 
      BOATMC, 
      (message)=> {
        console.log('subscribed message, detail tab', message);
        this.boatId=message.recordId;
      }
    )

    // what about the recordId gets updated? 
    
  }
  
  // Navigates to record page
  navigateToRecordViewPage() {
    this[NavigationMixin.Navigate]({
      type: 'standard__recordPage',
      attributes: {
          recordId: this.boatId,
          actionName: 'view'
      }
  });
  }
  
  // Navigates back to the review list, and refreshes reviews component
  //set the <lightning-tabset> Reviews tab to active using querySelector()
  // and activeTabValue, and refresh the boatReviews component dynamically.
  handleReviewCreated() { }
}
