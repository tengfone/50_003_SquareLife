const options = [
  { text: 'new_support_request {name:"bob", email:"bob@abc.com", type:1}' },
  {
    text:
      'new_support_request {name:"bob", email:"bob@abc.com", type:"GENERAL_ENQUIRY"}',
  },
  {
    text:
      'new_support_request {name:"bob", email:"bob@abc.com", type:1, address:127.0.0.1}',
  },
  { text: 'wait_for_agent {uuid:"(uuid)"}' },
  {
    text: 'change_support_request_type {uuid:"(uuid)", type:1}',
  },
  {
    text: 'change_support_request_type {uuid:"(uuid)", type:"GENERAL_ENQUIRY"}',
  },
  {
    text: 'close_support_request {uuid:"(uuid)"}',
  },
  {
    text:
      "new_agent {skills:{1:true, 2:true}, rainbow_id:12345 ,admin_uuid:ee462c1a-ba44-45c5-a4f7-f6eb7099d82a}",
  },
  {
    text:
      'new_agent {skills:{"GENERAL_ENQUIRY":true, "CHECK_BILL":true}, rainbow_id:12345, admin_uuid:ee462c1a-ba44-45c5-a4f7-f6eb7099d82a}',
  },
  {
    text:
      'new_agent {skills:{"GENERAL_ENQUIRY":true}, rainbow_id:12345, admin_uuid:ee462c1a-ba44-45c5-a4f7-f6eb7099d82a}',
  },
  {
    text: 'update_agent_availability {uuid:"(uuid)", available:true}',
  },
  {
    text: "update_agent_availability {rainbow_id:12345, available:true}",
  },
  {
    text: 'update_agent_availability {uuid:"(uuid)", available:false}',
  },
  {
    text: "update_agent_availability {rainbow_id:12345, available:false}",
  },
  { text: 'take_support_request {uuid:"(uuid)"}' },
  { text: "take_support_request {rainbow_id:12345}" },
  { text: 'drop_support_request {uuid:"(uuid)"}' },
  { text: "drop_support_request {rainbow_id:12345}" },
  { text: "ping {}" },
  {
    text:
      "get_support_request_status {admin_uuid:ee462c1a-ba44-45c5-a4f7-f6eb7099d82a}",
  },
  {
    text:
      'check_support_request {uuid:"(uuid)", admin_uuid:ee462c1a-ba44-45c5-a4f7-f6eb7099d82a}',
  },
  {
    text:
      "check_support_request {rainbow_id:12345, admin_uuid:ee462c1a-ba44-45c5-a4f7-f6eb7099d82a}",
  },
  {
    text: 'close_support_request {uuid:"(uuid)"}',
  },
  {
    text:
      'remove_support_request {uuid:"(uuid)", admin_uuid:ee462c1a-ba44-45c5-a4f7-f6eb7099d82a}',
  },
  {
    text: "get_agent_status {admin_uuid:ee462c1a-ba44-45c5-a4f7-f6eb7099d82a}",
  },
  { text: 'check_agent {uuid:"(uuid)"}' },
  { text: "check_agent {rainbow_id:12345}" },
  {
    text:
      'activate_agent {uuid:"(uuid)", activate:true, admin_uuid:ee462c1a-ba44-45c5-a4f7-f6eb7099d82a}',
  },
  {
    text:
      'activate_agent {uuid:"(uuid)", activate:false, admin_uuid:ee462c1a-ba44-45c5-a4f7-f6eb7099d82a}',
  },
  {
    text:
      'remove_agent {uuid:"(uuid)", admin_uuid:ee462c1a-ba44-45c5-a4f7-f6eb7099d82a}',
  },
  {
    text: "get_queue_status {admin_uuid:ee462c1a-ba44-45c5-a4f7-f6eb7099d82a}",
  },
  {
    text:
      "get_status_overview {admin_uuid:ee462c1a-ba44-45c5-a4f7-f6eb7099d82a}",
  },
];

export default options;
