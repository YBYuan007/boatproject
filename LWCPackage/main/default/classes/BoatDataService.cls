public with sharing class BoatDataService {
    @AuraEnabled(cacheable = true)
    public static  List<BoatType__c> getBoatTypes() {
        List<BoatType__c> boatTypesMap= new  List<BoatType__c> ([SELECT id, name FROM BoatType__c]); 
        return boatTypesMap;
    }

    @AuraEnabled(cacheable = true)
    public static List<Boat__c> getBoats(String boatTypeId) {
        List<Boat__c> selectedBoatList =  new List<Boat__c>();
        if(boatTypeId == '' ) {
            selectedBoatList = [SELECT id, Boat_Image__c, Contact__r.name, Price__c, Length__c, BoatType__r.name, name, Description__c FROM Boat__c]; 
        } else {
            selectedBoatList = [SELECT id, Boat_Image__c, Contact__r.name, Price__c, Length__c, BoatType__r.name, name, Description__c FROM Boat__c WHERE BoatType__c = :boatTypeId];
        }
        return selectedBoatList;
    }

    @AuraEnabled(cacheable=true)
    public static string updateBoatList(Object data){  
        List<Boat__c> boatsForUpdate = (List<Boat__c>) JSON.deserialize(
            JSON.serialize(data),
            List<Boat__c>.class
        );
        update boatsForUpdate;
        return 'Success: boats updated successfully';
    }
    

    // public static List<Boat__c> getSimilarBoats(String boatTypeId) {
    //     List<Boat__c> selectedBoatList = [SELECT id, Boat_Image__c, Contact__r.name, Price__c, 	Length__c, BoatType__r.name,  name FROM 	Boat__c WHERE 	BoatType__c = :boatTypeId];
    //     return selectedBoatList;
    // }


}