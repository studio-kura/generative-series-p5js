const p5 = require('p5js-node');
const fs = require('fs');
const path = require('path');

// Choose the canvas dimensions, image filename and number of iterations
const imageWidth = 1024;
const imageHeight = 1024;
const targetIterations = 100;
const filename = "generative-series-";

new p5((p)=>{
  p.setup = function() {
    // Find the settings on the constants above, or use defaults
    p.settings();
    // Create the canvas we will be painting on
    p.createCanvas(p.imageWidth, p.imageHeight);
  };

  p.draw = function() {
    // Calculate the serial number of each image
    // (it's just the iteration number with trailing zeros)
    p.serialNumber = (p.iteration.toString()).padStart(p.iterationPadLength, '0');

    // Each layer is painted by one of the funcions below
    p.layer1();
    p.layer2();
    p.layer3();

    // Save the image we painted on this iteration as a PNG file
    p.saveImage();  

    // Move on to the next iteration, and quit the sketch when done
    p.iteration = p.iteration + 1;
    if (p.iteration >= p.targetIterations) {
      p.remove();
    }
  };

  // Utility function that returns a random color
  // - `mode` can be any of the indices of constant object `modes`
  // - `vividity` can be false or any value between 0 and 255 we will be maxing to
  p.randomColor = (mode='any', vividity=false) => {
    const modes = {
      any: 0,
      light: 1,
      dark: 2,
      middle: 3,
    };
    const random256 = [
      () => Math.floor((Math.random()) * 256), //any
      () => Math.floor((Math.random()) * 64) + 192, //light
      () => Math.floor((Math.random()) * 64), //dark
      () => Math.floor((Math.random()) * 128) + 64, //middle
    ];
    let newColor = [
      random256[modes[mode]]().toString(16).padStart(2, '0'), //R
      random256[modes[mode]]().toString(16).padStart(2, '0'), //G
      random256[modes[mode]]().toString(16).padStart(2, '0'), //B
    ];
    if(vividity !== false) {
      if (vividity === true) vividity = 255;
      const index = Math.floor(Math.random() * 3);
      newColor[index] = (255 - vividity).toString(16).padStart(2, '0');
      newColor[(index + 1) % 3] = vividity.toString(16).padStart(2, '0');
    }
    return '#' + newColor[0] + newColor[1] + newColor[2];
  };

  p.settings = () => {
    // Take the filename string from above or use the default one
    if (typeof(filename) == "string" && filename.length > 0) {
      p.filename = filename;
    } else {
      p.filename = "generative-series-";
    }

    // Take the number of iterations from above or use the default one
    if (typeof(targetIterations) == "number" && targetIterations > 0) {
      p.targetIterations = targetIterations;
    } else {
      p.targetIterations = 10;
    }
    // Find the maximum number of digits for the leading zeros on the filename
    p.iterationPadLength = ((p.targetIterations - 1).toString()).length;

    // First iteration
    p.iteration = 0;

    // Take the image width from above or use the default one
    if (typeof(imageWidth) == "number" && imageWidth > 0) {
      p.imageWidth = imageWidth;
    } else {
      p.imageWidth = 512;
    }
    // Take the image height from above or use the default one
    if (typeof(imageHeight) == "number" && imageHeight > 0) {
      p.imageHeight = imageHeight;
    } else {
      p.imageHeight = 512;
    }
  };
  p.saveImage = () => {
    // console.log(p.iterationPadLength)
    // console.log(p.filename + p.iteration.toString().padStart(p.iterationPadLength, '0'));
    const imageFilename = p.filename + p.serialNumber + '.png';
    fs.promises.writeFile(path.join(__dirname, '..', 'generated', imageFilename), p.canvas.toBuffer('image/png'))
  };

  // The layer functions below are called on each iteration to generate the image
  // The aim of this project is for most of the artist's work to happen here
  p.layer1 = (lineThickness=4, fillColorMode='middle', lineColourMode='dark') => {
    p.background(p.randomColor(fillColorMode));
    p.stroke(p.randomColor(lineColourMode));
    p.strokeWeight(lineThickness);
    for(let i = 0; i < p.imageWidth; i+=lineThickness*2) {
      p.line(i, 0, i, p.imageHeight);
    }
  };
  p.layer2 = (lineThickness=4, fillColorMode='light', lineColourMode='dark') => {
    p.strokeWeight(lineThickness);
    p.stroke(p.randomColor(lineColourMode));
    p.fill(p.randomColor(fillColorMode, vividity=192));
    let diameter = p.imageWidth * 0.8;
    if (diameter > p.imageHeight * 0.8) diameter = p.imageHeight * 0.8;
    p.ellipse(p.imageWidth/2, p.imageHeight/2, diameter, diameter);
  };
  p.layer3 = (lineThickness=4, fillColor=0, lineColour=255) => {
    p.strokeWeight(lineThickness);
    p.stroke(lineColour);
    p.fill(fillColor);
    p.text(p.serialNumber, 30, 30);
  };

})
