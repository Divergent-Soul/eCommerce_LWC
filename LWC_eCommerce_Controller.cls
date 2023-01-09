public with sharing class LWC_eCommerce_Controller {

    @AuraEnabled(Cacheable=true)
    public static List<LWC_ECommerce_Site__mdt> getAllItems(){
        return [SELECT Id, imgURL__c, itemName__c, itemDescription__c, Amount__c FROM LWC_ECommerce_Site__mdt];
    }

    @AuraEnabled
    public static void OTPSender(String email, String otp){
        List<string> emails = new List<string>{email};
        String PlainBody = 'OTP for the transaction is '+otp;
        SingleEmailUtility.email(emails, 'contact.us.rcp@gmail.com', 'eCommerce', 'OTP for payment', '', PlainBody);
    }

}