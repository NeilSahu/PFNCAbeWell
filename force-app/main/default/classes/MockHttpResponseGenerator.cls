//Test.setMock(HttpCalloutMock.class,new MockHttpResponseGenerator());
global class MockHttpResponseGenerator implements HttpCalloutMock {
    global HTTPResponse respond(HTTPRequest req) {
        if(req.getEndPoint()=='callout:Zoom_api/v2/users/me/meetings'){//ZoomIntegrationClass.createClassroomMeetingOnZoom
            HttpResponse res = new HttpResponse();
        	res.setHeader('Content-Type', 'application/json');
        	res.setBody('{"agenda":"My Meeting","default_password":false,"duration":60,"password":"123456","pre_schedule":false,"recurrence":{"end_date_time":"2022-04-02T15:59:00Z","end_times":7,"monthly_day":1,"monthly_week":1,"monthly_week_day":1,"repeat_interval":1,"type":1,"weekly_days":"1"},"schedule_for":"jchill@example.com","settings":{"additional_data_center_regions":["TY"],"allow_multiple_devices":true,"alternative_hosts":"jchill@example.com;thill@example.com","alternative_hosts_email_notification":true,"approval_type":2,"approved_or_denied_countries_or_regions":{"approved_list":["CX"],"denied_list":["CA"],"enable":true,"method":"approve"},"audio":"telephony","authentication_domains":"example.com","authentication_exception":[{"email":"jchill@example.com","name":"Jill Chill"}],"authentication_option":"signIn_D8cJuqWVQ623CI4Q8yQK0Q","auto_recording":"cloud","breakout_room":{"enable":true,"rooms":[{"name":"room1","participants":["jchill@example.com"]}]},"calendar_type":1,"close_registration":false,"contact_email":"jchill@example.com","contact_name":"Jill Chill","email_notification":true,"encryption_type":"enhanced_encryption","focus_mode":true,"global_dial_in_countries":["US"],"host_video":true,"jbh_time":0,"join_before_host":false,"language_interpretation":{"enable":true,"interpreters":[{"email":"interpreter@example.com","languages":"US,FR"}]},"meeting_authentication":true,"meeting_invitees":[{"email":"jchill@example.com"}],"mute_upon_entry":false,"participant_video":false,"private_meeting":false,"registrants_confirmation_email":true,"registrants_email_notification":true,"registration_type":1,"show_share_button":true,"use_pmi":false,"waiting_room":false,"watermark":false,"host_save_video_order":true,"alternative_host_update_polls":true},"start_time":"2022-03-25T07:32:55Z","template_id":"Dv4YdINdTk+Z5RToadh5ug==","timezone":"America/Los_Angeles","topic":"My Meeting","tracking_fields":[{"field":"field1","value":"value1"}],"type":2}');
        	res.setStatusCode(200);
        	return res;
        }
        
        else if(req.getEndPoint()=='callout:Zoom_api/v2/users'){//ZoomIntegrationClass.createZoomUser
            HttpResponse res = new HttpResponse();
        	res.setHeader('Content-Type', 'application/json');
            res.setBody('{"email": "jchill@example.com","first_name": "Jill","id": "KDcuGIm1QgePTO8WbOqwIQ","last_name": "Chill","type": 1}');
        	res.setStatusCode(200);
        	return res;
        }
        else if(req.getEndPoint()=='callout:Quickbooks/v3/company/4620816365259308610/deposit?minorversion=65'){
            HttpResponse res = new HttpResponse();
        	res.setHeader('Content-Type', 'application/json');
            res.setBody('{"Deposit":{"Id":"depositId"}}');
        	res.setStatusCode(200);
        	return res;
        }
        else if(req.getEndPoint()=='callout:Quickbooks/v3/company/4620816365259308610/customer?minorversion=65'){
            HttpResponse res = new HttpResponse();
        	res.setHeader('Content-Type', 'application/json');
            res.setBody('{"Customer":{ "Id": "Customer Id", "DisplayName": "DisplayName", "PrimaryEmailAddr": { "Address": "Address" } } }');
        	res.setStatusCode(200);
        	return res;
        }
        else if(req.getEndpoint() == 'https://zoom.us/oauth/token'){
            HttpResponse res = new HttpResponse();
        	res.setHeader('Content-Type', 'application/json');
            res.setBody('{"access_token":"eyJhbGciOiJIUzUxMiIsInYiOiIyLjAiLCJraWQiOiI8S0lEPiJ9.eyJ2ZXIiOiI2IiwiY2xpZW50SWQiOiI8Q2xpZW50X0lEPiIsImNvZGUiOiI8Q29kZT4iLCJpc3MiOiJ1cm46em9vbTpjb25uZWN0OmNsaWVudGlkOjxDbGllbnRfSUQ-IiwiYXV0aGVudGljYXRpb25JZCI6IjxBdXRoZW50aWNhdGlvbl9JRD4iLCJ1c2VySWQiOiI8VXNlcl9JRD4iLCJncm91cE51bWJlciI6MCwiYXVkIjoiaHR0cHM6Ly9vYXV0aC56b29tLnVzIiwiYWNjb3VudElkIjoiPEFjY291bnRfSUQ-IiwibmJmIjoxNTgwMTQ3Mzk0LCJleHAiOjE1ODAxNTA5OTQsInRva2VuVHlwZSI6ImFjY2Vzc190b2tlbiIsImlhdCI6MTU4MDE0NzM5NCwianRpIjoiPEpUST4iLCJ0b2xlcmFuY2VJZCI6MjZ9.5c58p0PflZJdlz4Y7PgMIVCrQpHDnbM565iCKlrtajZ5HHmy00P5FCcoMwHb9LxjsUgbJ7653EfdeX5NEm6RoA","token_type":"bearer","refresh_token":"eyJhbGciOiJIUzUxMiIsInYiOiIyLjAiLCJraWQiOiI8S0lEPiJ9.eyJ2ZXIiOiI2IiwiY2xpZW50SWQiOiI8Q2xpZW50X0lEPiIsImNvZGUiOiI8Q29kZT4iLCJpc3MiOiJ1cm46em9vbTpjb25uZWN0OmNsaWVudGlkOjxDbGllbnRfSUQ-IiwiYXV0aGVudGljYXRpb25JZCI6IjxBdXRoZW50aWNhdGlvbl9JRD4iLCJ1c2VySWQiOiI8VXNlcl9JRD4iLCJncm91cE51bWJlciI6MCwiYXVkIjoiaHR0cHM6Ly9vYXV0aC56b29tLnVzIiwiYWNjb3VudElkIjoiPEFjY291bnRfSUQ-IiwibmJmIjoxNTgwMTQ3Mzk0LCJleHAiOjIwNTMxODczOTQsInRva2VuVHlwZSI6InJlZnJlc2hfdG9rZW4iLCJpYXQiOjE1ODAxNDczOTQsImp0aSI6IjxKVEk-IiwidG9sZXJhbmNlSWQiOjI2fQ.DwuqOzywRrQO2a6yp0K_6V-hR_i_mOB62flkr0_NfFdYsSqahIRRGk1GlUTQnFzHd896XDKf_FnSSvoJg_tzuQ","expires_in":3599,"scope":"user:read"}');
        	res.setStatusCode(200);
        	return res;
        }else if(req.getEndpoint() == 'https://zoom.us/oauth/authorize'){
            HttpResponse res = new HttpResponse();
        	res.setHeader('Content-Type', 'application/json');
            res.setBody('{"ics":"123456"}');
        	res.setStatusCode(200);
            return res;
        }
        else if(req.getEndpoint() == 'https://api.vimeo.com/oauth/authorize?response_type=code&client_id=b4a64e2f8134e6d4e0302726947baf360695c421&redirect_uri=https://parkinsonfoundationofthenationalca--pfncadna--c.sandbox.vf.force.com/apex/VimeoIntegrationRediractURI&state=public&scope=public'){
             HttpResponse res = new HttpResponse();
                res.setHeader('Content-Type', 'application/json'); 
            res.setStatusCode(200);
            res.setBody('{ "uri": "/videos/798522333", "name": "Tim Social Video Unedited", "description": null, "type": "video", "link": "https://vimeo.com/798522333/91b0887075", "player_embed_url": "https://player.vimeo.com/video/798522333?h=91b0887075", "duration": 1652, "width": 1280, "language": null, "height": 720}');
	        return res;
        }
        else if(req.getEndpoint().contains('https://api.vimeo.com/videos/')){
             HttpResponse res = new HttpResponse();
                res.setHeader('Content-Type', 'application/json');
            res.setStatusCode(200);
            	res.setBody('{ "uri": "/videos/798522333", "name": "Tim Social Video Unedited", "description": null, "type": "video", "link": "https://vimeo.com/798522333/91b0887075", "player_embed_url": "https://player.vimeo.com/video/798522333?h=91b0887075", "duration": 1652, "width": 1280, "language": null, "height": 720}');
	        return res;
        }
        else if(req.getEndpoint().contains('/services/data/v52.0/connect/notifications')){
             HttpResponse res = new HttpResponse();
                res.setHeader('Content-Type', 'application/json'); 
            res.setStatusCode(200);
            	res.setBody('{ "uri": "/videos/798522333", "name": "Tim Social Video Unedited", "description": null, "type": "video", "link": "https://vimeo.com/798522333/91b0887075", "player_embed_url": "https://player.vimeo.com/video/798522333?h=91b0887075", "duration": 1652, "width": 1280, "language": null, "height": 720}');
	        return res;
        }
        else if(req.getEndpoint().contains('/services/data/v51.0/connect/notifications')){
             HttpResponse res = new HttpResponse();
                res.setHeader('Content-Type', 'application/json'); 
            res.setStatusCode(200);
            	res.setBody('{ "uri": "/videos/798522333", "name": "Tim Social Video Unedited", "description": null, "type": "video", "link": "https://vimeo.com/798522333/91b0887075", "player_embed_url": "https://player.vimeo.com/video/798522333?h=91b0887075", "duration": 1652, "width": 1280, "language": null, "height": 720}');
	        return res;
        }
        else if(req.getEndpoint() == 'callout:user_update_credential/services/apexrest/bwps_update_user_profile/'){
            HttpResponse res = new HttpResponse();
        	res.setHeader('Content-Type', 'application/json');
            res.setBody('{"ics":"123456"}');
        	res.setStatusCode(200);
            return res;
        }
        Return new HttpResponse();
    }
         
}