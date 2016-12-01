'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = drawTri;

var _glMat = require('gl-mat4');

var _glMat2 = _interopRequireDefault(_glMat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var glslify = require('glslify-sync'); // works in client & server
function drawTri(regl, params) {
  var width = params.width,
      height = params.height;

  return regl({
    vert: glslify(__dirname + '/../shaders/basic.vert'),
    frag: glslify(__dirname + '/../shaders/basic.frag'),

    attributes: {
      position: [width / 2, height, 0, 0, 0, 0, width, 0, 0]
    },
    count: 3,
    uniforms: {
      model: function model(context, props) {
        return props.model || _glMat2.default.identity([]);
      },
      color: regl.prop('color')
    },
    cull: {
      enable: false,
      face: 'back'
    }
  });
}