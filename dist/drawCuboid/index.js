'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = drawCuboid;

var _glMat = require('gl-mat4');

var _glMat2 = _interopRequireDefault(_glMat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var glslify = require('glslify-sync'); // works in client & server
function drawCuboid(regl, params) {
  var size = params.size;

  var _size = _slicedToArray(size, 3),
      width = _size[0],
      length = _size[1],
      height = _size[2];

  var halfWidth = width * 0.5;
  var halfLength = length * 0.5;
  var halfHeight = height * 0.5;

  var position = [-halfWidth, -halfLength, -halfHeight, halfWidth, -halfLength, -halfHeight, halfWidth, halfLength, -halfHeight, -halfWidth, halfLength, -halfHeight, -halfWidth, -halfLength, halfHeight, halfWidth, -halfLength, halfHeight, halfWidth, halfLength, halfHeight, -halfWidth, halfLength, halfHeight];

  // use this one for clean cube wireframe outline
  var cells = [0, 1, 2, 3, 0, 4, 5, 6, 7, 4, 5, 1, 2, 6, 7, 3];

  var normal = position.map(function (p) {
    return p / size;
  });

  return regl({
    vert: glslify(__dirname + '/../shaders/basic.vert'),
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
    lineWidth: 2,

    depth: {
      enable: true,
      mask: false,
      func: 'less',
      range: [0, 1]
    }
  });
}