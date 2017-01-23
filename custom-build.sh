#!/bin/bash
yum install -y ImageMagick
if ! npm install minio@3.0.0 temp image-watermark
 then
	echo "npm returned an error. If this happened on an incremental install, it's probably benign and caused by a Docker bug."
	exit 0
fi
