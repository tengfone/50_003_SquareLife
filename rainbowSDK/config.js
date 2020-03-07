const options = {
	rainbow: {
		host: "sandbox"
	},
	credentials: {
		login: "dinghao_leo@mymail.sutd.edu.sg", // To replace by your developer credendials
		password: ")7?=hC2hLa(1" // To replace by your developer credentials
	},
	// Application identifier
	application: {
		appID: "f80b16d05add11eabf7e77d14e87b936",
		appSecret:
			"tOgnZXQd5m4691Z10s0Rk1cYGf3aNC0Bv7s9t9AWws2ZIH6P0UA9kRZ9fqm9tCcN"
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
