'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = prepareDrawGrid;

var _glMat = require('gl-mat4');

var _glMat2 = _interopRequireDefault(_glMat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var glslify = require('glslify-sync'); // works in client & server
function prepareDrawGrid(regl) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var positions = [];
  var defaults = {
    ticks: 1,
    size: [16, 16],
    infinite: false,
    centered: false,
    lineWidth: 1
  };

  var _Object$assign = Object.assign({}, defaults, params),
      size = _Object$assign.size,
      ticks = _Object$assign.ticks,
      infinite = _Object$assign.infinite,
      centered = _Object$assign.centered,
      lineWidth = _Object$assign.lineWidth;

  var width = size[0];
  var length = size[1];

  if (centered) {
    var halfWidth = width * 0.5;
    var halfLength = length * 0.5;

    var remWidth = halfWidth % ticks;
    var widthStart = -halfWidth + remWidth;
    var widthEnd = -widthStart;

    var remLength = halfLength % ticks;
    var lengthStart = -halfLength + remLength;
    var lengthEnd = -lengthStart;

    var skipEvery = 0;

    for (var i = widthStart, j = 0; i <= widthEnd; i += ticks, j += 1) {
      if (j % skipEvery !== 0) {
        positions.push(lengthStart, i, 0);
        positions.push(lengthEnd, i, 0);
        positions.push(lengthStart, i, 0);
      }
    }
    for (var _i = lengthStart, _j = 0; _i <= lengthEnd; _i += ticks, _j += 1) {
      if (_j % skipEvery !== 0) {
        positions.push(_i, widthStart, 0);
        positions.push(_i, widthEnd, 0);
        positions.push(_i, widthStart, 0);
      }
    }
  } else {
    for (var _i2 = -width * 0.5; _i2 <= width * 0.5; _i2 += ticks) {
      positions.push(-length * 0.5, _i2, 0);
      positions.push(length * 0.5, _i2, 0);
      positions.push(-length * 0.5, _i2, 0);
    }

    for (var _i3 = -length * 0.5; _i3 <= length * 0.5; _i3 += ticks) {
      positions.push(_i3, -width * 0.5, 0);
      positions.push(_i3, width * 0.5, 0);
      positions.push(_i3, -width * 0.5, 0);
    }
  }

  var frag = infinite ? glslify(__dirname + '/shaders/foggy.frag') : glslify(__dirname + '/shaders/grid.frag');

  return regl({
    vert: glslify(__dirname + '/../shaders/basic.vert'),
    frag: frag,

    attributes: {
      position: regl.buffer(positions)
    },
    count: positions.length / 3,
    uniforms: {
      model: function model(context, props) {
        return props.model || _glMat2.default.identity([]);
      },
      view: function view(context, props) {
        return props.view;
      },
      _projection: function _projection(context, props) {
        return _glMat2.default.ortho([], -300, 300, 350, -350, 0.01, 1000);
      },
      color: regl.prop('color'),
      fogColor: function fogColor(context, props) {
        return props.fogColor || [1, 1, 1, 1];
      }
    },
    lineWidth: Math.min(lineWidth, regl.limits.lineWidthDims[1]),
    primitive: 'lines',
    cull: {
      enable: true,
      face: 'front'
    },
    polygonOffset: {
      enable: true,
      offset: {
        factor: 1,
        units: Math.random() * 10
      }
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