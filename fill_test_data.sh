set -e

dfx canister call IcpAccelerator_backend register_hub_organizer_candid \
  '(record {
  full_name= "John Doe";
  email= "john.doe@example.com";
  contact_number= "1234567890";
  profile_picture= null;
  hub_name= "John'"'"'s Hub";
  hub_location= "1234 Main St; Anytown; USA";
  hub_description= "A place for learning and innovation.";
  website_url= "wah";
  privacy_policy_consent= true;
  communication_consent= true;
  id_professional_document_upload= null
  })'
