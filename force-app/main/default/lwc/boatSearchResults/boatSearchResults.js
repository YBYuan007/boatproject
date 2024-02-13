import { LightningElement, wire } from 'lwc';
import getBoats from "@salesforce/apex/BoatDataService.getBoats";

export default class BoatSearchResults extends LightningElement {
  boatTypeId

  @wire(getBoats, {boatTypeId : "$boatTypeId"})
  wiredBoatList;


}