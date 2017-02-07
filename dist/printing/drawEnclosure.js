'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = drawEnclosure;

var _uscoRenderUtils = require('usco-render-utils');

var _uscoTransformUtils = require('usco-transform-utils');

var _getBrandingSvgGeometry = require('../branding/getBrandingSvgGeometry');

var _getBrandingSvgGeometry2 = _interopRequireDefault(_getBrandingSvgGeometry);

var _colorConversions = require('usco-image-utils/dist/colorConversions');

var _drawPrintableArea = require('usco-render-utils/dist/drawPrintableArea');

var _drawPrintableArea2 = _interopRequireDefault(_drawPrintableArea);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import getBrandingSvg from '../../branding/getBrandingSvg'
// import makeDrawImgPlane from './drawImgPlane'

function drawEnclosure(regl, params) {
  var machine_disallowed_areas = params.machine_disallowed_areas,
      machine_volume = params.machine_volume,
      name = params.name;


  var drawGrid = (0, _uscoRenderUtils.drawGrid)(regl, { size: machine_volume, ticks: 50, centered: true });
  var drawGridDense = (0, _uscoRenderUtils.drawGrid)(regl, { size: machine_volume, ticks: 10, centered: true });
  var gridOffset = (0, _uscoTransformUtils.computeTMatrixFromTransforms)({ pos: [0, 0, 0.1] });
  var gridOffsetD = (0, _uscoTransformUtils.computeTMatrixFromTransforms)({ pos: [0, 0, 0.3] });

  var triSize = { width: 50, height: 20 };
  var drawTri = (0, _uscoRenderUtils.drawTri)(regl, { width: triSize.width, height: triSize.height });
  var triMatrix = (0, _uscoTransformUtils.computeTMatrixFromTransforms)({ pos: [-triSize.width / 2, machine_volume[1] * 0.5, 0.1] });

  var containerSize = [machine_volume[0], machine_volume[1], machine_volume[2]];
  var drawCuboid = (0, _uscoRenderUtils.drawCuboid)(regl, { size: containerSize });
  var containerCuboidMatrix = (0, _uscoTransformUtils.computeTMatrixFromTransforms)({ pos: [0, 0, machine_volume[2] * 0.5] });

  var buildPlaneGeo = {
    positions: [[-1, +1, 0], [+1, +1, 0], [+1, -1, 0], [-1, -1, 0]],
    cells: [[2, 1, 0], [2, 0, 3]]
  };
  var planeReducer = 0.5; // fudge value in order to prevent overlaps with bounds (z fighting)
  var buildPlaneModel = (0, _uscoTransformUtils.computeTMatrixFromTransforms)({ pos: [0, 0, -0.15], sca: [machine_volume[0] * 0.5 - planeReducer, machine_volume[1] * 0.5 - planeReducer, 1] });
  var drawBuildPlane = (0, _uscoRenderUtils.drawStaticMesh)(regl, {
    geometry: buildPlaneGeo,
    extras: {
      cull: {
        enable: true,
        face: 'back'
      }
    }
  });

  // branding
  // const logoTexure = svgStringAsReglTexture(regl, getBrandingSvg(name))
  // const logoPlane = makeDrawImgPlane(regl, {texture: logoTexure})
  // logoTexure.width * logoScale, logoTexure.height * logoScale
  var logoMatrix = (0, _uscoTransformUtils.computeTMatrixFromTransforms)({ pos: [0, -machine_volume[1] * 0.5, 20], sca: [60, 60, 1], rot: [Math.PI / 2, Math.PI, 0] });
  var logoMesh = (0, _getBrandingSvgGeometry2.default)(name);
  if (!logoMesh) console.warn('no logo found for machine called: \'' + name + '\' ');
  var drawLogoMesh = logoMesh ? (0, _uscoRenderUtils.drawStaticMesh)(regl, { geometry: logoMesh }) : function () {};

  // const logoMesh = svgStringAsGeometry(logoImg)
  // const dissalowedVolumes = machine_disallowed_areas
  //  .map((area) => drawCuboidFromCoords(regl, {height: machine_volume[2], coords: area}))

  var drawDrawOutofBoundsPlane = (0, _drawPrintableArea2.default)(regl, { machineParams: params, color: (0, _colorConversions.hexToRgba)('FF660019') });

  return function (_ref) {
    var view = _ref.view,
        camera = _ref.camera,
        outOfBoundsEntities = _ref.outOfBoundsEntities;

    drawGrid({ view: view, camera: camera, color: [0, 0, 0, 0.2], model: gridOffset });
    drawGridDense({ view: view, camera: camera, color: [0, 0, 0, 0.06], model: gridOffsetD });

    // drawTri({view, camera, color: [0, 0, 0, 0.5], model: triMatrix})
    drawBuildPlane({ view: view, camera: camera, color: [1, 1, 1, 1], model: buildPlaneModel });
    drawCuboid({ view: view, camera: camera, color: [0, 0, 0.0, 0.5], model: containerCuboidMatrix });
    // dissalowedVolumes.forEach(x => x({view, camera, color: [1, 0, 0, 1]}))
    // logoPlane({view, camera, color: [0.4, 0.4, 0.4, 1], model: logoMatrix2})
    drawLogoMesh({ view: view, camera: camera, color: [0, 0, 0, 0.5], model: logoMatrix });

    // draw if any entity is out of bounds
    if (outOfBoundsEntities) {
      drawDrawOutofBoundsPlane({ view: view, camera: camera });
    }
  };
}

// import svgStringAsReglTexture from '../../common/utils/image/svgStringAsReglTexture'
// import svgStringAsGeometry from '../../common/utils/geometry/svgStringAsGeometry'