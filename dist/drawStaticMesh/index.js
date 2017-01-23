'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = drawMesh;

var _glMat = require('gl-mat4');

var _glMat2 = _interopRequireDefault(_glMat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var glslify = require('glslify-sync'); // works in client & server
function drawMesh(regl) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { extras: {} };
  var prop = regl.prop,
      buffer = regl.buffer;
  var geometry = params.geometry;

  var commandParams = {
    vert: glslify(__dirname + '/../shaders/basic.vert'),
    frag: glslify(__dirname + '/../shaders/basic.frag'),

    uniforms: {
      model: function model(context, props) {
        return props.model || _glMat2.default.identity([]);
      },
      color: prop('color')
    },
    attributes: {
      position: buffer(geometry.positions)
    },
    elements: geometry.cells,
    cull: {
      enable: false,
      face: 'front'
    },
    blend: {
      enable: true,
      func: {
        src: 'src alpha',
        dst: 'one minus src alpha'
      }
    }
  };

  // Splice in any extra params
  commandParams = Object.assign({}, commandParams, params.extras);
  return regl(commandParams);
}