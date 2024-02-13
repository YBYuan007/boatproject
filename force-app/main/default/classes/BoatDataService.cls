public with sharing class BoatDataService {
    @AuraEnabled(cacheable = true)
    public static  List<BoatType__c> getBoatTypes() {
        List<BoatType__c> boatTypesMap= new  List<BoatType__c> ([SELECT id, name FROM BoatType__c]); 
        return boatTypesMap;
    }

    @AuraEnabled(cacheable = true)
    public static List<Boat__c> getBoats(String boatTypeId) {
        List<Boat__c> selectedBoatList = [SELECT id, Boat_Image__c, Contact__r.name, Price__c, 	Length__c, BoatType__r.name,  name FROM 	Boat__c WHERE 	BoatType__c = :boatTypeId];
        return selectedBoatList;
    }


}