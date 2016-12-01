'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = wrapperScope;

var _glMat = require('gl-mat4');

var _glMat2 = _interopRequireDefault(_glMat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function wrapperScope(regl) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var fbo = params.fbo;


  var commandParams = {
    cull: {
      enable: true
    },
    context: {
      lightDir: [0.39, 0.87, 0.29]
    },
    uniforms: {
      lightDir: function lightDir(context) {
        return context.lightDir;
      },
      lightView: function lightView(context) {
        return _glMat2.default.lookAt([], context.lightDir, [0.0, 0.0, 0.0], [0.0, 0.0, 1.0]);
      },
      lightProjection: _glMat2.default.ortho([], -25, 25, -20, 20, -25, 25),
      lightColor: [1, 0.8, 0],

      ambientLightAmount: 0.8,
      diffuseLightAmount: 0.9,
      view: function view(context, props) {
        return props.view;
      },
      projection: function projection(context, props) {
        return props.camera.projection;
      },
      camNear: function camNear(context, props) {
        return props.camera.near;
      },
      camFar: function camFar(context, props) {
        return props.camera.far;
      }
    },
    framebuffer: fbo
  };

  commandParams = Object.assign({}, commandParams, params.extras);
  return regl(commandParams);
}