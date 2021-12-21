const p5 = require('p5js-node');
const fs = require('fs');
const path = require('path');
const target_iterations = 10;

new p5((p)=>{
  p.target_iterations = target_iterations;
  p.iteration = 0;
  p.setup = function() {
    p.createCanvas(1024, 1024);
  };

  p.draw = function() {

    p.striped_background();
    p.shape();
    p.ornaments();
  
    fs.promises.writeFile(path.join(__dirname, '..', 'generated', 'test-' + p.iteration + '.png'), p.canvas.toBuffer('image/png'))

    p.iteration = p.iteration + 1;
    if (p.iteration >= p.target_iterations) {
      p.remove();
    }

  };

  p.striped_background = (colour='#cccc00', angle=0, thickness=2) => {
    p.background(colour);
  };
  p.shape = (colour='#cccc00', angle=0, thickness=2) => {
    p.fill(255);
    p.rect(10, 10, 50, 50);
  };
  p.ornaments = (colour='#cccc00', angle=0, thickness=2) => {
    p.fill(0);
    p.text(p.iteration, 30, 30);
  };

})
