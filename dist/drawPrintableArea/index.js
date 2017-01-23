'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeDrawPrintableArea;

var _glMat = require('gl-mat4');

var _glMat2 = _interopRequireDefault(_glMat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var glslify = require('glslify-sync'); // works in client & server
function makeDrawPrintableArea(regl, params) {
  // const {machine_disallowed_areas, machine_volume, name} = params
  var color = params.color,
      machineParams = params.machineParams;


  var printableArea = machineParams.printable_area;
  printableArea[0] -= 60;
  printableArea[1] -= 60;
  var width = machineParams.machine_volume[0];
  var length = machineParams.machine_volume[1];
  var halfLength = length / 2;
  var halfWidth = width / 2;

  var widthAlongLength = (length - printableArea[0]) / 2;
  var widthAlongWidth = (width - printableArea[1]) / 2;

  var zPlane = 1;

  var n0 = [-halfWidth, -halfLength, zPlane];
  var n1 = [-halfWidth + widthAlongWidth, -halfLength + widthAlongLength, zPlane];
  var n2 = [halfWidth, -halfLength, zPlane];
  var n3 = [halfWidth - widthAlongWidth, -halfLength + widthAlongLength, zPlane];
  var n4 = [halfWidth - widthAlongWidth, halfLength - widthAlongLength, zPlane];
  var n5 = [halfWidth, halfLength, zPlane];
  var n6 = [-halfWidth + widthAlongWidth, halfLength - widthAlongLength, zPlane];
  var n7 = [-halfWidth, halfLength, zPlane];

  return regl({
    vert: glslify(__dirname + '/shaders/vertex.vert'),
    frag: glslify(__dirname + '/shaders/fragment.frag'),

    attributes: {
      position: [].concat(n0, n1, n2, n3, n4, n5, n6, n7)
    },
    elements: [0, 1, 2, 1, 3, 2, 2, 3, 4, 2, 5, 4, 4, 6, 5, 5, 7, 6, 7, 0, 6, 1, 0, 7],
    // count: 3,
    primitive: 'triangle strip',
    uniforms: {
      model: function model(context, props) {
        return props.model || _glMat2.default.identity([]);
      },
      color: color },
    cull: {
      enable: true,
      face: 'front'
    },
    blend: {
      enable: true,
      func: {
        src: 'src alpha',
        dst: 'one minus src alpha'
      }
    }
  });
}