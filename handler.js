const Minio = require("minio");
const Watermark = require("image-watermark")
const Temp = require("temp")
const fs = require("fs")

function watermarkImage(bucket, minioPath, callback) {
	var minioClient = new Minio.Client({
	    endPoint: '192.168.100.128',
	    port: 9000,
	    secure: false, 
	    accessKey: 'MYKEY',
	    secretKey: 'TOPSECRET'
	});

	var tmpFile = Temp.path("img", "f-");
	minioClient.fGetObject(bucket, minioPath, tmpFile, function(err) {
		if(err) {
			return console.log(err);
		} 
		Watermark.embedWatermarkWithCb(tmpFile, { "override-image": "true", text: "Serverless Rocks!"}, function(err) {
			if(err) {
				return console.log("Error: " + err)
			}
			minioClient.fPutObject("watermarked", minioPath, tmpFile, 'image/jpeg', function(err, eId) {
				fs.unlinkSync(tmpFile);
				if(callback) {
					callback(err, eId);
				}
			});
		});
	});
}

module.exports.watermark = (event, context, callback) => {
	  var payload = JSON.parse(event.body);
	  console.log("Body: " + event.body);
	  watermarkImage(payload.Records[0].s3.bucket.name, payload.Records[0].s3.object.key, function(err, eId) {
		  if(err) {
			  return console.log(err);
		  }
		  callback(null, { statusCode: 200, body: "Success"});
	  });
	};


