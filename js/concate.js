(function() {
    window.ConcatenateBlobs = function(blobs, type, callback) {
        var buffers = [];

        var index = 0;

        function readAsArrayBuffer() {
            if (!blobs[index]) {
                return concatenateBuffers();
            }
            var reader = new FileReader();
            reader.onload = function(event) {
                buffers.push(event.target.result);
                index++;
                readAsArrayBuffer();
            };
            reader.readAsArrayBuffer(blobs[index]);
        }

        readAsArrayBuffer();

        function concatenateBuffers() {
            var byteLength = 0;
            buffers.forEach(function(buffer) {
                byteLength += buffer.byteLength;
                console.log(byteLength);
            });
            
            var tmp = new Uint8Array(byteLength);
            
            var lastOffset = 0;
            buffers.forEach(function(buffer) {
                // BYTES_PER_ELEMENT == 2 for Uint16Array
                var reusableByteLength = buffer.byteLength;
                //console.log(reusableByteLength);
                if (reusableByteLength % 2 != 0) {
                    buffer = buffer.slice(0, reusableByteLength - 1);
                    //console.log(buffer);
                }
                tmp.set(new Uint8Array(buffer), lastOffset);
                lastOffset += reusableByteLength;
            });
            console.log(tmp.buffer);

            /*var blob = new Blob([tmp.buffer], {
                type: type
            });*/
            callback(tmp.buffer);
        }
    };

})();


