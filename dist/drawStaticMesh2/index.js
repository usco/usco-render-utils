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

  var defaults = {
    dynamicCulling: false,
    geometry: undefined
  };

  var _Object$assign = Object.assign({}, defaults, params),
      geometry = _Object$assign.geometry,
      dynamicCulling = _Object$assign.dynamicCulling;

  // vertex colors or not ?


  var hasIndices = geometry.indices && geometry.indices.length > 0;
  var hasNormals = geometry.normals && geometry.normals.length > 0;
  var hasVertexColors = geometry.colors && geometry.colors.length > 0;
  var cullFace = dynamicCulling ? function (context, props) {
    var isOdd = [props.model[0], props.model[5], props.model[10]].filter(function (x) {
      return x < 0;
    }).length & 1; // count the number of negative components & deterine if that is odd or even
    return isOdd ? 'front' : 'back';
  } : 'front';
  // console.log('has vertex colors', hasVertexColors)

  var vert = hasVertexColors ? glslify(__dirname + '/shaders/mesh-vcolor.vert') : glslify(__dirname + '/shaders/mesh.vert');
  var frag = hasVertexColors ? glslify(__dirname + '/shaders/mesh-vcolor.frag') : glslify(__dirname + '/shaders/mesh.frag');

  // const vert = glslify(__dirname + '/shaders/mesh-vcolor.vert')
  // const frag = glslify(__dirname + '/shaders/mesh-vcolor.frag')

  var commandParams = {
    vert: vert,
    frag: frag,

    uniforms: {
      model: function model(context, props) {
        return props.model || _glMat2.default.identity([]);
      },
      ucolor: prop('color'),
      printableArea: function printableArea(context, props) {
        return props.printableArea || [0, 0];
      }
    },
    attributes: {
      position: buffer(geometry.positions)
      // color: { constant: [1, 0, 0, 1] }
    },
    cull: {
      enable: true,
      face: cullFace
    },
    blend: {
      enable: true,
      func: {
        src: 'src alpha',
        dst: 'one minus src alpha'
      }
    }
  };

  if (geometry.cells) {
    commandParams.elements = geometry.cells;
  } else if (hasIndices) {
    // FIXME: not entirely sure about all this
    var indices = geometry.indices;
    /* let type
    if (indices instanceof Uint32Array && regl.hasExtension('oes_element_index_uint')) {
      type = 'uint32'
    }else if (indices instanceof Uint16Array) {
      type = 'uint16'
    } else {
      type = 'uint8'
    } */

    commandParams.elements = regl.elements({
      // type,
      data: indices
    });
  } else {
    commandParams.count = geometry.positions.length / 3;
  }

  if (hasNormals) {
    commandParams.attributes.normal = buffer(geometry.normals);
  }
  if (hasVertexColors) {
    commandParams.attributes.color = buffer(geometry.colors);
  }

  // Splice in any extra params
  commandParams = Object.assign({}, commandParams, params.extras);
  return regl(commandParams);
}