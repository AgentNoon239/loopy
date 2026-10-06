import type { CameraPosition } from './camera';
import { Loopy } from './loopy'
import { vectorAdd, vectorCross, vectorLength, vectorPerpendicular, vectorScale, vectorSubtract, type Vector3 } from './vector'
import { mat4 } from 'gl-matrix'

function initShaderProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      `Unable to initialize the shader program: ${gl.getProgramInfoLog(
        shaderProgram,
      )}`,
    );
    return null;
  }

  return shaderProgram;
}

function loadShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`,
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

// Tell WebGL how to pull out the positions from the position
// buffer into the vertexPosition attribute.
function setPositionAttribute(gl, buffers, programInfo) {
  const numComponents = 3; // pull out 2 values per iteration
  const type = gl.FLOAT; // the data in the buffer is 32bit floats
  const normalize = false; // don't normalize
  const stride = 0; // how many bytes to get from one set of values to the next
  // 0 = use type and numComponents above
  const offset = 0; // how many bytes inside the buffer to start from
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    numComponents,
    type,
    normalize,
    stride,
    offset,
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

function initBuffers(gl: WebGLRenderingContext, loopy: Loopy, vertexPositions: Vector3[],) {
  const vertexArray = []
  const triangleArray = []
  console.log(loopy.edges)
  for (const edge of loopy.edges) {
    const p1 = vertexPositions[edge[0]]
    const p2 = vertexPositions[edge[1]]

    const d = vectorSubtract(p1, p2)
    const v1 = vectorPerpendicular(d)
    const v2 = vectorCross(v1, d)
    const n1 = vectorScale(v1, 0.1 / vectorLength(v1))
    const n2 = vectorScale(v2, 0.1 / vectorLength(v2))

    const currentBufferSize = vertexArray.length

    // vertexArray.push(
    //   ...vectorAdd(p1, n1),
    //   ...vectorSubtract(p1, n1),
    //   ...vectorAdd(p2, n1),
    //   ...vectorSubtract(p2, n1),
    //   ...vectorAdd(p1, n2),
    //   ...vectorSubtract(p1, n2),
    //   ...vectorAdd(p2, n2),
    //   ...vectorSubtract(p2, n2),
    // )

    // triangleArray.push(
    //   currentBufferSize,
    //   currentBufferSize + 1,
    //   currentBufferSize + 2,
    //   currentBufferSize + 1,
    //   currentBufferSize + 2,
    //   currentBufferSize + 3,
    //   currentBufferSize + 4,
    //   currentBufferSize + 5,
    //   currentBufferSize + 6,
    //   currentBufferSize + 5,
    //   currentBufferSize + 6,
    //   currentBufferSize + 7,
    // )
    //

    vertexArray.push(...p1, ...p2)
    triangleArray.push(currentBufferSize, currentBufferSize + 1)
  }

  // for (const face of loopy.faces) {
  //   const midPointX = face.vertices.reduce((acc, i) => acc + vertexPositions[i][0], 0) / face.vertices.length
  //   const midPointY = face.vertices.reduce((acc, i) => acc + vertexPositions[i][1], 0) / face.vertices.length
  //   const midPointZ = face.vertices.reduce((acc, i) => acc + vertexPositions[i][2], 0) / face.vertices.length

  //   const centre = vertexArray.length
  //   vertexArray.push(midPointX, midPointY, midPointZ)
  //   vertexArray.push(...face.vertices.flatMap(i => vertexPositions[i]))

  //   const n = face.vertices.length
  //   for (let i = 0; i < n; i++) {
  //     triangleArray.push(centre, centre + i, centre + ((i + 1) % n))
  //   }
  // }

  const positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW)

  const indicesBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(triangleArray), gl.STATIC_DRAW)

  return { position: positionBuffer, indices: indicesBuffer, vertexCount: triangleArray.length }
}

export function render(loopy: Loopy, vertexPositions: Vector3[], canvas: HTMLCanvasElement, cameraPosition: CameraPosition) {
  // Initialize the GL context
  const gl = canvas.getContext("webgl");

  // Only continue if WebGL is available and working
  if (gl === null) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }

  // Set clear color to black, fully opaque
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear the color buffer with specified clear color
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Vertex shader program
  const vsSource = `
    attribute vec4 aVertexPosition;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
`;

  const fsSource = `
    void main() {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
  `;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // Collect all the info needed to use the shader program.
  // Look up which attribute our shader program is using
  // for aVertexPosition and look up uniform locations.
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(
        shaderProgram,
        "uProjectionMatrix"
      ),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
    },
  };

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  const buffers = initBuffers(gl, loopy, vertexPositions);

  // Draw the scene
  drawScene(gl, programInfo, buffers, cameraPosition);
}

function drawScene(gl, programInfo, buffers, cameraPosition: CameraPosition) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
  gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = (45 * Math.PI) / 180; // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create();

  // Now move the drawing position a bit to where we want to
  // start drawing the square.
  mat4.translate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to translate
    [-0.0, 0.0, -cameraPosition.distance]
  ); // amount to translate

  mat4.rotate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to rotate
    cameraPosition.longitude, // amount to rotate in radians
    [0, 1, 0]
  ); // axis to rotate around (Y)

  mat4.rotate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to rotate
    cameraPosition.latitude, // amount to rotate in radians
    [1, 0, 0]
  ); // axis to rotate around (X)

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  setPositionAttribute(gl, buffers, programInfo);

  // Tell WebGL which indices to use to index the vertices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

  // Tell WebGL to use our program when drawing
  gl.useProgram(programInfo.program);

  // Set the shader uniforms
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix
  );

  {
    const vertexCount = buffers.vertexCount;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.LINES, vertexCount, type, offset);
  }
}
