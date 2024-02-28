public class zoomIntegrationUpdateHandler implements Queueable {
    
    private String refreshToken;
    private String accessToken;
    
    public zoomIntegrationUpdateHandler(String refToken, String accToken){
        this.refreshToken = refToken;
        this.accessToken = accToken;
    }
    
    public void execute(QueueableContext qc){
        //update scList2;
        Metadata.CustomMetadata customMetadata = new Metadata.CustomMetadata();
        customMetadata.fullName = 'ZoomDetails.ZoomDetails';
        customMetadata.label = 'ZoomDetails';
       	Metadata.CustomMetadataValue accTokenMdt = new Metadata.CustomMetadataValue();
       	accTokenMdt.field = 'AccessToken__c';
       	accTokenMdt.value = accessToken;
       	customMetadata.values.add(accTokenMdt);
        Metadata.CustomMetadataValue refTokenMdt = new Metadata.CustomMetadataValue();
        refTokenMdt.field = 'RefreshToken__c';
       	refTokenMdt.value = refreshToken;
       	customMetadata.values.add(refTokenMdt);
        Metadata.DeployContainer mdContainer = new Metadata.DeployContainer();
        mdContainer.addMetadata(customMetadata);
        metadataInsertUpdate callback = new metadataInsertUpdate();
        if(!Test.isRunningTest()){
        Id jobId = Metadata.Operations.enqueueDeployment(mdContainer, callback);
            }
        
    }

}