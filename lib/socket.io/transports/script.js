var Client = require('../client').Client, 
	qs = require('querystring'),
	url = require("url"),
	sys = require('sys');

this.script = Client.extend({	
    options: {
        closeTimeout: 5000,
		duration: 20000
	},
	
    _onConnect: function(request, response){
        var self = this;        
        var data = qs.parse(url.parse(request.url).query).data;
        if (data == null) {
    		this.__super__(request, response);	
    		this._closeTimeout = setTimeout(function() {
    			self._write('');
    		}, this.options.duration);
    		this._payload();
        } else {
            self._onMessage(data);
            response.writeHead(204, {
                'Content-Type': 'text/html',
                'Content-Length': '0',
                //'Cache-Control': 'private, no-cache',
                //'Expires': 'Wed, 17 Sep 1975 21:32:10 GMT',
                //'Pragma': 'no-cache'
            });
            response.end();
        }
	},
	
	_write: function(message){
		if (this._closeTimeout){
		  clearTimeout(this._closeTimeout);
        }

        var jsonp = "__jsonp(" + message + ");";
		this.response.writeHead(200, {
		  'Content-Type': 'text/javascript',
		  'Content-Length': jsonp.length
        });
		this.response.write(jsonp);
		this.response.end();
		this._onClose();
	}
});