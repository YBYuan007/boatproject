import { LightningElement , wire} from 'lwc';
import getBoatTypes from '@salesforce/apex/BoatDataService.getBoatTypes'; 

export default class BoatSearchForm extends LightningElement {
  selectedBoatTypeId = '';
  error = undefined;

  searchOptions = []; 
  value="";


  @wire(getBoatTypes)
  boatTypes({data, error}){
    if (data) {
      console.log('getting data: ', data);
      this.searchOptions = data.map((option) =>{
        console.log('option1: ' , option);
                                    console.log('option' , option.Id);
                                    return {label: option.Name, value: option.Id}} );
      this.searchOptions.unshift({ label: 'All Types', value: '' });
      this.error = undefined;
    } else if (error) {
      this.error = error;
      this.searchOptions = undefined;
    }
  };

  handleSearchOptionChange(event) {
    this.selectedBoatTypeId = event.target.value;
    console.log(    'try to pass the id' , this.selectedBoatTypeId ); 
    const searchEvent = new CustomEvent('search', {detail: this.selectedBoatTypeId});
    // dispatch the custom event to the parent component: boatSearch
    this.dispatchEvent(searchEvent);
  }
}