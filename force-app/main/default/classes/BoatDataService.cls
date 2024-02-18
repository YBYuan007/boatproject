public with sharing class BoatDataService {
    @AuraEnabled(cacheable = true)
    public static  List<BoatType__c> getBoatTypes() {
        List<BoatType__c> boatTypesMap= new  List<BoatType__c> ([SELECT id, name FROM BoatType__c]); 
        return boatTypesMap;
    }
    
    @AuraEnabled(cacheable = true)
    public static List<Boat__c> getBoats(String boatTypeId) {
        system.debug('going through backend: ' + boatTypeId);
        String query = 'SELECT ' 
                        + 'id, Boat_Image__c, Contact__r.name, Price__c, Length__c, Picture__c, '
                        + 'BoatType__r.name, name, Description__c '
                        + 'FROM Boat__c'; 
        if(String.isNotBlank(boatTypeId)) {
            query += ' WHERE BoatType__c = :boatTypeId ';
        }
        system.debug('what is query: ' + query); 
        return database.query(query);
        // return new List<Boat__c>();
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
    
    // @AuraEnabled
    // public static string getBoatsByLocation(String boatTypeId, String latitude, String longitude){
    //     try {
            
    //     } catch (Exception e) {
    //         throw new AuraHandledException(e.getMessage());
    //     }
    // }

    // public static List<Boat__c> getSimilarBoats(String boatTypeId) {
    //     List<Boat__c> selectedBoatList = [SELECT id, Boat_Image__c, Contact__r.name, Price__c, 	Length__c, BoatType__r.name,  name FROM 	Boat__c WHERE 	BoatType__c = :boatTypeId];
    //     return selectedBoatList;
    // }


}