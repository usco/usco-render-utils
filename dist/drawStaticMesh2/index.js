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
    vert: glslify(__dirname + '/shaders/mesh.vert'),
    frag: glslify(__dirname + '/shaders/mesh.frag'),

    uniforms: {
      model: function model(context, props) {
        return props.model || _glMat2.default.identity([]);
      },
      color: prop('color'),
      printableArea: function printableArea(context, props) {
        return props.printableArea || [0, 0];
      }
    },
    attributes: {
      position: buffer(geometry.positions)
    },
    cull: {
      enable: true,
      face: 'back'
    }
  };
  if (geometry.cells) {
    commandParams.elements = geometry.cells;
  } else {
    commandParams.count = geometry.positions.length / 3;
  }

  if (geometry.normals) {
    commandParams.attributes.normal = buffer(geometry.normals);
  }
  // Splice in any extra params
  commandParams = Object.assign({}, commandParams, params.extras);
  return regl(commandParams);
}