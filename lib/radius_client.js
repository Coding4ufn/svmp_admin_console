
var radius = require('radius')
	, dgram = require('dgram');

// Default timeout if connection fails (milliseconds)
var DEFAULT_TIMEOUT=5000;

/**
 * Create a new client.
 * config: {}
 */
var RadiusClient = exports.RadiusClient = function(config) {
	this.config = config;
	this.client = dgram.createSocket('udp4');
	this._clientTimeoutId = undefined;
}

/**
 * Authenticate the user
 * provide a callback function in the format: function (err, result)
 */
RadiusClient.prototype.authenticate = function(username, passwd, secureId, callback) {
	var that = this;
	
	var packet = {
		code: "Access-Request",
		secret: this.config.secret,
		identifier: 0,
		attributes: [
			["NAS-IP-Address", that.config.nas_ip],
			['User-Name', username],
			['User-Password', passwd]
		]
	}

	var encoded = radius.encode(packet);
	// Handle incoming data 
	this.client.on('message', function(msg, rinfo) {
		if( that._clientTimeoutId ) {
			clearTimeout(that._clientTimeoutId);
		}

		var response = radius.decode({packet: msg, secret: that.config.secret});
		switch (response.code) {
			case "Access-Accept":
				callback(undefined, "ok");
				that.client.close();
				break;
			case "Access-Reject":
				callback(undefined, "reject");
				that.client.close();
				break;
			default:
				callback("");
				that.client.close();
		}
	});

	// Handle errors
	this.client.on('error', function(err) {
		callback(err);
		that.client.close();
	});

	// Send the packet
	this.client.send(encoded, 0, encoded.length, this.config.port, this.config.ip, function(err,b) {
		if(err) {
			that.client.close();
		}
		if( !that._clientTimeoutId ) {
			that._clientTimeoutId = setTimeout(function(){
				callback("Timeout trying to connect to host");
				that.client.close();
			}, DEFAULT_TIMEOUT);
		}

	});

}