'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = drawCuboidFromCoords;

var _glMat = require('gl-mat4');

var _glMat2 = _interopRequireDefault(_glMat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var glslify = require('glslify-sync'); // works in client & server
function drawCuboidFromCoords(regl, params) {
  var coords = params.coords,
      height = params.height;


  var position = coords.map(function (x) {
    return [].concat(_toConsumableArray(x), [0]);
  }).concat(coords.map(function (x) {
    return [].concat(_toConsumableArray(x), [height]);
  }));

  // use this one for clean cube wireframe outline
  var cells = [0, 1, 2, 3, 0, 4, 5, 6, 7, 4, 5, 1, 2, 6, 7, 3];

  var normal = position.map(function (p) {
    return 1;
  });

  return regl({
    vert: glslify(__dirname + '/shaders/mesh.vert'),
    frag: glslify(__dirname + '/shaders/mesh.frag'),

    attributes: {
      position: position,
      normal: normal },
    elements: cells,
    uniforms: {
      model: function model(context, props) {
        return props.model || _glMat2.default.identity([]);
      },
      color: regl.prop('color'),
      angle: function angle(_ref) {
        var tick = _ref.tick;
        return 0.01 * tick;
      }
    },
    primitive: 'line strip',
    lineWidth: 3,

    depth: {
      enable: true,
      mask: false,
      func: 'less',
      range: [0, 1]
    },
    cull: {
      enable: true,
      face: 'front'
    }
  });
}