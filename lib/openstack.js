var Pkgcloud = require('pkgcloud');
var config = require('../config/config').settings;

var client = Pkgcloud.providers.openstack.compute.createClient(config.openstack);

exports.getImages = function(callback) {
	client.getImages(function(err, images){
      var list = [];
      if (err) {
        callback(err);
      }
      images.forEach(function(v,i,d){ 
        list.push({_id: v.id, name: v.name});
      });
      callback(undefined,list);
    });
};

// Where object should be {user_id: useridentifier, flavor: flava, image: im};
exports.createVM = function (obj, callback) {
	obj.name = "svmp_user_vm_" + obj.user_id;
	client.createServer(obj, function (err, server) {
    	if(err){
        	console.log("Error: ", err);
        	callback(err);
      	} else {
      		server.setWait({status: server.STATUS.running}, 5000, function (err) {
      			if(err) {
      				callback(err);
      			} else {
              if (server.addresses && server.addresses.private && server.addresses.private.length > 0 )
              {
                  callback(undefined, {id: server.id, ip: server.addresses.private[0]});
              } else {
                callback("Cannot get IP for VM");
              }
      			}
      		});
      	}
    });
};