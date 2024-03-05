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
    
    @AuraEnabled(cacheable = true)
    public static List<Boat__c> getBoatsByLocation(String boatTypeId, String userLatitude, String userLongitude){
        try {
            system.debug('going through the getBoatsByLocation /' + boatTypeId+ '/' + userLatitude +'/'+ userLongitude);
            String query = 'SELECT ' 
                        + 'Id, Geolocation__c, Name  '
                        + 'FROM Boat__c '; 
            if(String.isNotBlank(boatTypeId)) {
                query += 'WHERE BoatType__c = :boatTypeId '; 
            }
            if(String.isNotBlank(userLatitude) && String.isNotBlank(userLongitude)){
                Decimal la = decimal.valueOf(userLatitude);
                Decimal lo = decimal.valueOf(userLongitude);
                query += 'ORDER BY DISTANCE(Geolocation__c, GEOLOCATION(:la, :lo), \'mi\') '; 
            }
            query += 'LIMIT 10'; 
            system.debug('what is query: ' + query); 
            return database.query(query);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled(cacheable = true)
    public static List<BoatReview__c> getAllReviews(String boatId){
        String query = 'SELECT ' 
                        + 'Comment__c, Rating__c ';
            if(String.isNotBlank(boatId)) {
                query += 'WHERE Boat__c = :boatId '; 
            }
            system.debug('what is query: ' + query); 
            return database.query(query);
    }



    // public static List<Boat__c> getSimilarBoats(String boatTypeId) {
    //     List<Boat__c> selectedBoatList = [SELECT id, Boat_Image__c, Contact__r.name, Price__c, 	Length__c, BoatType__r.name,  name FROM 	Boat__c WHERE 	BoatType__c = :boatTypeId];
    //     return selectedBoatList;
    // }

}