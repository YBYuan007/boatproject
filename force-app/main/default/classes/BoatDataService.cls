public with sharing class BoatDataService {

    public static final String LENGTH_TYPE='Length'; 
    public static final String TYPE_TYPE='Type'; 
    public static final String PRICE_TYPE='Price'; 

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
    
    @AuraEnabled
    public static string updateBoatList(Object data){  
        List<Boat__c> boatsForUpdate = (List<Boat__c>) JSON.deserialize(
            JSON.serialize(data),
            List<Boat__c>.class
        );
        update boatsForUpdate;
        return 'Success: boats updated successfully';
    }
    
    @AuraEnabled(cacheable = true)
    public static List<Boat__c> getBoatsByLocation(String boatTypeId, Decimal userLatitude, Decimal userLongitude){
        try {
            system.debug('going through the getBoatsByLocation /' + boatTypeId+ '/' + userLatitude +'/'+ userLongitude);
            String query = 'SELECT ' 
                        + 'Id, Geolocation__c, Name  '
                        + 'FROM Boat__c '; 
            if(String.isNotBlank(boatTypeId)) {
                query += 'WHERE BoatType__c = :boatTypeId '; 
            }
            if(userLatitude != null  && userLongitude != null){
                query += 'ORDER BY DISTANCE(Geolocation__c, GEOLOCATION(:userLatitude, :userLongitude), \'mi\') '; 
            }
            query += 'LIMIT 10'; 
            system.debug('what is query: ' + query); 
            return database.query(query);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static List<BoatReview__c> getAllReviews(String boatId){
        system.debug('going through backend - getAllReviews');
        String query = 'SELECT ' 
                        + 'Name, Comment__c, Rating__c, '
                        + 'Createdby.SmallPhotoUrl, Createdby.Name, CreatedBy.CompanyName, CreatedDate  '
                        + 'FROM BoatReview__c ';
            if(String.isNotBlank(boatId)) {
                query += 'WHERE Boat__c = :boatId '; 
            }
            system.debug('what is query: ' + query); 
        return database.query(query);
    }
    @AuraEnabled(cacheable = true)
    public static List<Boat__c> getSimilarBoats(String boatId, String similarBy) {
        system.debug('going through backend getSimilarBoats');
        List<Boat__c> similarBoats = new List<Boat__c>();
        List<Boat__c> parentBoat = [SELECT Id, Length__c, Price__c, BoatType__c, BoatType__r.Name
                                    FROM Boat__c
                                    WHERE Id = :boatId 
                                    WITH SECURITY_ENFORCED];
        if (parentBoat.isEmpty()) {
            return similarBoats;
        }
        if (similarBy == LENGTH_TYPE) {
            similarBoats = [
                SELECT Id, Contact__r.Name, Name, BoatType__c, BoatType__r.Name, Length__c, Picture__c, Price__c, Year_Built__c
                FROM Boat__c
                WHERE Id != :parentBoat.get(0).Id
                AND (Length__c >= :parentBoat.get(0).Length__c / 1.2)
                AND (Length__c <= :parentBoat.get(0).Length__c * 1.2)
                WITH SECURITY_ENFORCED
                ORDER BY Length__c, Price__c, Year_Built__c
            ];
        }else if (similarBy == PRICE_TYPE) {
            similarBoats = [
                SELECT Id, Contact__r.Name, Name, BoatType__c, BoatType__r.Name, Length__c, Picture__c, Price__c, Year_Built__c
                FROM Boat__c
                WHERE Id != :parentBoat.get(0).Id
                AND (Price__c >= :parentBoat.get(0).Price__c / 1.2)
                AND (Price__c <= :parentBoat.get(0).Price__c * 1.2)
                WITH SECURITY_ENFORCED
                ORDER BY Price__c, Length__c, Year_Built__c
            ];
        } else if (similarBy == TYPE_TYPE) {
            similarBoats = [
                SELECT Id, Contact__r.Name, Name, BoatType__c, BoatType__r.Name, Length__c, Picture__c, Price__c, Year_Built__c
                FROM Boat__c
                WHERE Id != :parentBoat.get(0).Id
                AND (BoatType__c = :parentBoat.get(0).BoatType__c)
                WITH SECURITY_ENFORCED
                ORDER BY Price__c, Length__c, Year_Built__c
            ];
        }
        return similarBoats;
    }


}