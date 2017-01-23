var glslify = require('glslify-sync') // works in client & server
import mat4 from 'gl-mat4'

export default function makeDrawPrintableArea (regl, params) {
  // const {machine_disallowed_areas, machine_volume, name} = params
  const {color, machineParams} = params

  let printableArea = machineParams.printable_area
  printableArea[0] -= 60
  printableArea[1] -= 60
  let width = machineParams.machine_volume[0]
  let length = machineParams.machine_volume[1]
  let halfLength = length / 2
  let halfWidth = width / 2

  let widthAlongLength = (length - printableArea[0]) / 2
  let widthAlongWidth = (width - printableArea[1]) / 2

  let zPlane = 1

  let n0 = [-halfWidth, -halfLength, zPlane]
  let n1 = [-halfWidth + widthAlongWidth, -halfLength + widthAlongLength, zPlane]
  let n2 = [halfWidth, -halfLength, zPlane]
  let n3 = [halfWidth - widthAlongWidth, -halfLength + widthAlongLength, zPlane]
  let n4 = [halfWidth - widthAlongWidth, halfLength - widthAlongLength, zPlane]
  let n5 = [halfWidth, halfLength, zPlane]
  let n6 = [-halfWidth + widthAlongWidth, halfLength - widthAlongLength, zPlane]
  let n7 = [-halfWidth, halfLength, zPlane]

  return regl({
    vert: glslify(__dirname + '/shaders/vertex.vert'),
    frag: glslify(__dirname + '/shaders/fragment.frag'),

    attributes: {
      position: [
        ...n0, ...n1, ...n2, ...n3, ...n4, ...n5, ...n6, ...n7
      ],
    },
    elements: [
      0, 1, 2,
      1, 3, 2,
      2, 3, 4,
      2, 5, 4,
      4, 6, 5,
      5, 7, 6,
      7, 0, 6,
      1, 0, 7
    ],
    // count: 3,
    primitive: 'triangle strip',
    uniforms: {
      model: (context, props) => props.model || mat4.identity([]),
    color},
    cull: {
      enable: true,
      face: 'front'
    },
    blend: {
      enable: true,
      func: {
        src: 'src alpha',
        dst: 'one minus src alpha'
      }
    }
  })
}
