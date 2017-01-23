var glslify = require('glslify-sync') // works in client & server
import mat4 from 'gl-mat4'

export default function drawMesh (regl, params = {extras: {}}) {
  const {prop, buffer} = regl
  const {geometry} = params

  // vertex colors or not ?
  const hasIndices = (geometry.indices && geometry.indices.length > 0)
  const hasNormals = (geometry.normals && geometry.normals.length > 0)
  const hasVertexColors = (geometry.colors && geometry.colors.length > 0)
  //console.log('has vertex colors', hasVertexColors)

  const vert = hasVertexColors ? glslify(__dirname + '/shaders/mesh-vcolor.vert') : glslify(__dirname + '/shaders/mesh.vert')
  const frag = hasVertexColors ? glslify(__dirname + '/shaders/mesh-vcolor.frag') : glslify(__dirname + '/shaders/mesh.frag')

  //const vert = glslify(__dirname + '/shaders/mesh-vcolor.vert')
  //const frag = glslify(__dirname + '/shaders/mesh-vcolor.frag')

  let commandParams = {
    vert,
    frag,

    uniforms: {
      model: (context, props) => props.model || mat4.identity([]),
      ucolor: prop('color'),
      printableArea: (context, props) => props.printableArea || [0, 0]
    },
    attributes: {
      position: buffer(geometry.positions),
      //color: { constant: [1, 0, 0, 1] }
    },
    cull: {
      enable: true,
      face: 'back'
    },
    blend: {
      enable: true,
      func: {
        src: 'src alpha',
        dst: 'one minus src alpha'
      }
    }
  }

  if (geometry.cells) {
    commandParams.elements = geometry.cells
  } else if (hasIndices) {
    // FIXME: not entirely sure about all this
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
      // type,
      data: indices
    })
  } else {
    commandParams.count = geometry.positions.length / 3
  }

  if (hasNormals) {
    commandParams.attributes.normal = buffer(geometry.normals)
  }
  if (hasVertexColors) {
    commandParams.attributes.color = buffer(geometry.colors)
  }

  // Splice in any extra params
  commandParams = Object.assign({}, commandParams, params.extras)
  return regl(commandParams)
}
