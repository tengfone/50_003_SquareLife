const options = [
	{ text: 'new_support_request {name:"bob", email:"bob@abc.com", type:1}' },
	{
		text:
			'new_support_request {name:"bob", email:"bob@abc.com", type:"GENERAL_ENQUIRY"}'
	},
	{
		text:
			'new_support_request {name:"bob", email:"bob@abc.com", type:1, address:127.0.0.1}'
	},
	{ text: 'wait_for_agent {uuid:"(uuid)"}' },
	{
		text: 'change_support_request_type {uuid:"(uuid)", type:1}'
	},
	{
		text: 'change_support_request_type {uuid:"(uuid)", type:"GENERAL_ENQUIRY"}'
	},
	{
		text: 'close_support_request {uuid:"(uuid)"}'
	},
	{ text: "new_agent {skills:{1:true, 2:true}}" },
	{ text: 'new_agent {skills:{"GENERAL_ENQUIRY":true, "CHECK_BILL":true}}' },
	{ text: 'new_agent {skills:{"GENERAL_ENQUIRY":true}, address:127.0.0.1}' },
	{
		text: 'update_agent_availability {uuid:"(uuid)", available:true}'
	},
	{
		text: 'update_agent_availability {uuid:"(uuid)", available:false}'
	},
	{ text: 'take_support_request {uuid:"(uuid)"}' },
	{ text: 'drop_support_request {uuid:"(uuid)"}' },
	{ text: "ping {}" },
	{ text: "get_support_request_status {}" },
	{
		text: 'check_support_request {uuid:"(uuid)"}'
	},
	{
		text: 'close_support_request {uuid:"(uuid)"}'
	},
	{
		text: 'remove_support_request {uuid:"(uuid)"}'
	},
	{ text: "get_agent_status {}" },
	{ text: 'check_agent {uuid:"(uuid)"}' },
	{
		text: 'activate_agent {uuid:"(uuid)", activate:true}'
	},
	{
		text: 'activate_agent {uuid:"(uuid)", activate:false}'
	},
	{
		text: 'remove_agent {uuid:"(uuid)"}'
	},
	{
		text: "get_queue_status {}"
	},
	{
		text: "get_status_overview {}"
	}
];

export default options;
