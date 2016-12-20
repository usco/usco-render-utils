var glslify = require('glslify-sync') // works in client & server
import mat4 from 'gl-mat4'

export default function drawMesh (regl, params = {extras: {}}) {
  const {prop, buffer} = regl
  const {geometry} = params
  let commandParams = {
    vert: glslify(__dirname + '/shaders/mesh.vert'),
    frag: glslify(__dirname + '/shaders/mesh.frag'),

    uniforms: {
      model: (context, props) => props.model || mat4.identity([]),
      color: prop('color'),
      printableArea: (context, props) => props.printableArea || [0, 0]
    },
    attributes: {
      position: buffer(geometry.positions)
    },
    cull: {
      enable: true,
      face: 'back'
    }
  }

  if (geometry.cells) {
    commandParams.elements = geometry.cells
  } else if (geometry.indices) {
    //FIXME: not entirely sure about all this
    const indices = geometry.indices
    /*let type
    if (indices instanceof Uint32Array && regl.hasExtension('oes_element_index_uint')) {
      type = 'uint32'
    }else if (indices instanceof Uint16Array) {
      type = 'uint16'
    } else {
      type = 'uint8'
    }*/

    commandParams.elements = regl.elements({
      //type,
      data: indices
    })
  } else {
    commandParams.count = geometry.positions.length / 3
  }

  if (geometry.normals) {
    commandParams.attributes.normal = buffer(geometry.normals)
  }
  // Splice in any extra params
  commandParams = Object.assign({}, commandParams, params.extras)
  return regl(commandParams)
}
