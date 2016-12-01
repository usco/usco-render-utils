'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = prepareRender;

var _wrapperScope = require('./wrapperScope');

var _wrapperScope2 = _interopRequireDefault(_wrapperScope);

var _drawPrintheadShadow = require('./drawPrintheadShadow');

var _drawPrintheadShadow2 = _interopRequireDefault(_drawPrintheadShadow);

var _computeTMatrixFromTransforms = require('../../common/utils/computeTMatrixFromTransforms');

var _computeTMatrixFromTransforms2 = _interopRequireDefault(_computeTMatrixFromTransforms);

var _index = require('./drawGrid/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function prepareRender(regl, params) {
  var wrapperScope = (0, _wrapperScope2.default)(regl);
  var tick = 0;

  // infine grid, always there
  // infinite grid
  var gridSize = [1220, 1200]; // size of 'infinite grid'
  var drawInfiniGrid = (0, _index2.default)(regl, { size: gridSize, ticks: 10, infinite: true });
  var infiniGridOffset = (0, _computeTMatrixFromTransforms2.default)({ pos: [0, 0, -1.8] });

  var command = function command(props) {
    var entities = props.entities,
        machine = props.machine,
        camera = props.camera,
        view = props.view,
        background = props.background,
        outOfBoundsColor = props.outOfBoundsColor;


    wrapperScope(props, function (context) {
      regl.clear({
        color: background,
        depth: 1
      });
      drawInfiniGrid({ view: view, camera: camera, color: [0, 0, 0, 0.1], fogColor: background, model: infiniGridOffset });

      entities.map(function (entity) {
        //use this for colors that change outside build area
        //const color = entity.visuals.color
        //const printableArea = machine ? machine.params.printable_area : [0, 0]
        //this one for single color for outside bounds
        var color = entity.bounds.outOfBounds ? outOfBoundsColor : entity.visuals.color;
        var printableArea = undefined;

        entity.visuals.draw({ view: view, camera: camera, color: color, model: entity.modelMat, printableArea: printableArea });
      });

      if (machine) {
        machine.draw({ view: view, camera: camera });
      }

      /*entities.map(function (entity) {
        const {pos} = entity.transforms
        const offset = pos[2]-entity.bounds.size[2]*0.5
        const model = _model({pos: [pos[0], pos[1], -0.1]})
        const headSize = [100,60]
        const width = entity.bounds.size[0]+headSize[0]
        const length = entity.bounds.size[1]+headSize[1]
         return makeDrawPrintheadShadow(regl, {width,length})({view, camera, model, color: [0.1, 0.1, 0.1, 0.15]})
      })*/
    });
  };

  return function render(data) {
    command(data);
    // boilerplate etc
    tick += 0.01;
    // for stats, resizing etc
    // regl.poll()
  };
}