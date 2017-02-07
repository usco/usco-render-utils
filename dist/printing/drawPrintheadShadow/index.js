'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = drawPrintheadShadow;

var _glMat = require('gl-mat4');

var _glMat2 = _interopRequireDefault(_glMat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var glslify = require('glslify-sync'); // works in client & server
function drawPrintheadShadow(regl, params) {
  var width = params.width,
      length = params.length;

  var halfWidth = width * 0.5;
  var halfLength = length * 0.5;

  return regl({
    vert: glslify(__dirname + '/shaders/vertex.vert'),
    frag: glslify(__dirname + '/shaders/fragment.frag'),

    attributes: {
      position: [-halfWidth, -halfLength, 0, halfWidth, -halfLength, 0, halfWidth, halfLength, 0, -halfWidth, halfLength, 0],
      normal: [0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1]
    },
    elements: [0, 1, 3, 3, 1, 2],
    // count: 4,
    uniforms: {
      model: function model(context, props) {
        return props.model || _glMat2.default.identity([]);
      },
      color: regl.prop('color')
    },
    cull: {
      enable: true,
      face: 'back'
    },
    polygonOffset: {
      enable: true,
      offset: {
        factor: 1,
        units: Math.random() * 10
      }
    }
  });
}