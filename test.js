const webp = require('webp-converter');
const testFolder = './public/imagekit/';
const fs = require('fs');

fs.readdir(testFolder, (err, files) => {
    files.forEach(file => {
        // console.log(file);
        filenametype = file.split('.')[1];
        filename = file.split('.')[0];
        if (filenametype == 'png' || filenametype == 'jpg' || filenametype == 'jpeg') {
            console.log(filename);
            const result = webp.cwebp(testFolder + file, testFolder + filename + ".webp", "-q 80");
            result.then((response) => {
                // console.log(response);
            });
        }
    });
    console.log(files[0]);
});