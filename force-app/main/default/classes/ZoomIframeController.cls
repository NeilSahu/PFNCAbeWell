public class ZoomIframeController {
	@AuraEnabled
    public static String generateSignature(String sdkKey, String sdkSecret,String role, String meetingNumber){
        // String sdkKey, String sdkSecret,String role,
        String jwt = '';
        JSONGenerator header = JSON.createGenerator(false);
        header.writeStartObject();
        header.writeStringField('alg', 'HS256');
        header.writeStringField('typ', 'JWT');
        header.writeEndObject();
        String encodedHeader = EncodingUtil.base64Encode(Blob.valueOf(header.getAsString()));
        Long rightNow = (dateTime.now().getTime()/1000)+1;
        Long exp= rightNow + 60 * 60 * 2;
        JSONGenerator body = JSON.createGenerator(false);
        body.writeStartObject();
        body.writeStringField('sdkKey', sdkKey);
        body.writeStringField('mn', meetingNumber);
        body.writeStringField('role', role);
        body.writeStringField('iat', String.valueOf(rightNow));
        body.writeStringField('exp', String.valueOf(exp));
        body.writeStringField('appKey', sdkKey);
        body.writeStringField('tokenExp', String.valueOf(exp));
        /*
            const oPayload = {
            sdkKey: sdkKey,
            mn: meetingNumber,
            role: role,
            iat: iat,
            exp: exp,
            appKey: sdkKey, // required if using signature for Native SDK
            tokenExp: iat + 60 * 60 * 2 // required if using signature for Native SDK
          }
         */
        body.writeEndObject();
        System.debug(body.getAsString());
        jwt = encodedHeader + '.' + EncodingUtil.base64Encode(Blob.valueOf(body.getAsString()));
        Blob signature = Crypto.generateMac('hmacSHA256',Blob.valueof(jwt),Blob.valueOf(sdkSecret));
        jwt += '.' + EncodingUtil.base64Encode(signature);
        return jwt;
    }
}