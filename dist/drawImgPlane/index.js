'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeDrawImgPlane;

var _glMat = require('gl-mat4');

var _glMat2 = _interopRequireDefault(_glMat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var glslify = require('glslify-sync'); // works in client & server
function makeDrawImgPlane(regl, params) {
  // const {width, height} = params
  var texture = params.texture;

  return regl({
    vert: glslify(__dirname + '/shaders/vert.vert'),
    frag: glslify(__dirname + '/shaders/frag.frag'),

    attributes: {
      position: [[-1, +1, 0], [+1, +1, 0], [+1, -1, 0], [-1, -1, 0]],
      uv: [[0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0]]
    },
    elements: [[2, 1, 0], [2, 0, 3]],
    uniforms: {
      model: function model(context, props) {
        return props.model || _glMat2.default.identity([]);
      },
      color: function color(context, props) {
        return props.color || [0, 0, 0, 1];
      },
      texture: texture },
    cull: {
      enable: false,
      face: 'back'
    },
    blend: {
      enable: true,
      func: {
        srcRGB: 'src alpha',
        srcAlpha: 1,
        dstRGB: 'one minus src alpha',
        dstAlpha: 1
      },
      equation: {
        rgb: 'add',
        alpha: 'add'
      },
      color: [0, 1, 0, 1]
    }
  });
}