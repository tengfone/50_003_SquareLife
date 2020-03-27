const options = {
	rainbow: {
		host: "sandbox"
	},
	credentials: {
		login: "tengfone_phang@mymail.sutd.edu.sg", // To replace by your developer credendials
		password: "t56|zm@=Fq|4" // To replace by your developer credentials
	},
	// Application identifier
	application: {
		appID: "6095e9a0594e11eabf7e77d14e87b936",
		appSecret:
			"NSxjiXUqyxYPdcT2Y4y8Dgje3gfUQCxyTNCoEP81vWrhsobuVGjwCsCpqxIMNQUU"
	},
	// Logs options
	logs: {
		enableConsoleLogs: false,
		enableFileLogs: false,
		color: true,
		level: "debug",
		customLabel: "vincent01",
		"system-dev": {
			internals: false,
			http: false
		},
		file: {
			path: "/var/tmp/rainbowsdk/",
			customFileName: "R-SDK-Node-Sample2",
			level: "debug",
			zippedArchive: false /*,
            maxSize : '10m',
            maxFiles : 10 // */
		}
	},
	// IM options
	im: {
		sendReadReceipt: true
	}
};

module.exports = options;
