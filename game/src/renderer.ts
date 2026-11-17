import type { CameraPosition } from "./camera";
import { Loopy } from "./loopy";
import {
  vectorAdd,
  vectorCross,
  vectorLength,
  vectorPerpendicular,
  vectorScale,
  vectorSubtract,
  type Vector3,
} from "./vector";
import { mat4 } from "gl-matrix";

function initShaderProgram(
  gl: WebGLRenderingContext,
  vsSource: string,
  fsSource: string,
) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)!;
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)!;

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
  const shader = gl.createShader(type)!;

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
function setPositionAttribute(gl: WebGLRenderingContext, buffers: Buffers, programInfo: ProgramInfo) {
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

type Buffers = {
  position: WebGLBuffer;
  indices: WebGLBuffer;
  color: WebGLBuffer;
  vertexCount: number;
};

function initBuffers(
  gl: WebGLRenderingContext,
  loopy: Loopy,
  vertexPositions: Vector3[],
): Buffers {
  const vertexArray = [];
  const triangleArray = [];
  const colorArray: number[] = [];

  function pushNColor(color: Vector3, count: number) {
    for (let i = 0; i < count; i++) {
      colorArray.push(...color);
    }
  }

  console.log(loopy.edges);
  for (const edge of loopy.edges) {
    const p1 = vertexPositions[edge[0]];
    const p2 = vertexPositions[edge[1]];

    const d = vectorSubtract(p1, p2);
    const v1 = vectorPerpendicular(d);
    const v2 = vectorCross(v1, d);
    const n1 = vectorScale(v1, 0.1 / vectorLength(v1));
    const n2 = vectorScale(v2, 0.1 / vectorLength(v2));

    const currentBufferSize = vertexArray.length;

    vertexArray.push(
      vectorAdd(p1, n1),
      vectorSubtract(p1, n1),
      vectorAdd(p2, n1),
      vectorSubtract(p2, n1),
      vectorAdd(p1, n2),
      vectorSubtract(p1, n2),
      vectorAdd(p2, n2),
      vectorSubtract(p2, n2),
    );

    pushNColor([0.2, 1.0, 0], 8);

    triangleArray.push(
      currentBufferSize,
      currentBufferSize + 1,
      currentBufferSize + 2,
      currentBufferSize + 1,
      currentBufferSize + 2,
      currentBufferSize + 3,
      currentBufferSize + 4,
      currentBufferSize + 5,
      currentBufferSize + 6,
      currentBufferSize + 5,
      currentBufferSize + 6,
      currentBufferSize + 7,
    );
  }

  for (const face of loopy.faces) {
    const midPointX =
      face.vertices.reduce((acc, i) => acc + vertexPositions[i][0], 0) /
      face.vertices.length;
    const midPointY =
      face.vertices.reduce((acc, i) => acc + vertexPositions[i][1], 0) /
      face.vertices.length;
    const midPointZ =
      face.vertices.reduce((acc, i) => acc + vertexPositions[i][2], 0) /
      face.vertices.length;

    const centre = vertexArray.length;
    vertexArray.push([midPointX, midPointY, midPointZ]);
    vertexArray.push(...face.vertices.map((i) => vertexPositions[i]));

    pushNColor([0.4, 0.4, 0.4], face.vertices.length + 1);

    const n = face.vertices.length;
    for (let i = 0; i < n; i++) {
      triangleArray.push(centre, centre + i + 1, centre + 1 + ((i + 1) % (n)));
    }
  }

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(vertexArray.flat()),
    gl.STATIC_DRAW,
  );

  const indicesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(triangleArray),
    gl.STATIC_DRAW,
  );

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(colorArray),
    gl.STATIC_DRAW,
  );

  console.log("TRIS", triangleArray.length);
  console.log("VERTS", vertexArray.length);

  return {
    position: positionBuffer,
    indices: indicesBuffer,
    color: colorBuffer,
    vertexCount: triangleArray.length,
  };
}

interface ProgramInfo {
  program: WebGLProgram;
  attribLocations: {
    vertexPosition: number;
    vertexColor: number;
  };
  uniformLocations: {
    modelViewMatrix: WebGLUniformLocation;
    projectionMatrix: WebGLUniformLocation;
  };
}

export function render(
  loopy: Loopy,
  vertexPositions: Vector3[],
  canvas: HTMLCanvasElement,
  cameraPosition: CameraPosition,
) {
  // Initialize the GL context
  const gl = canvas.getContext("webgl");

  // Only continue if WebGL is available and working
  if (gl === null) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it.",
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
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;

  // Fragment shader program

  const fsSource = `
    varying lowp vec4 vColor;

    void main(void) {
      gl_FragColor = vColor;
    }
  `;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource)!;

  // Collect all the info needed to use the shader program.
  // Look up which attribute our shader program is using
  // for aVertexPosition and look up uniform locations.
  const programInfo: ProgramInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition")!,
      vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor")!,
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(
        shaderProgram,
        "uProjectionMatrix",
      )!,
      modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix")!,
    },
  };

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  const buffers = initBuffers(gl, loopy, vertexPositions);

  // Draw the scene
  drawScene(gl, programInfo, buffers, cameraPosition);
}

// Tell WebGL how to pull out the colors from the color buffer
// into the vertexColor attribute.
function setColorAttribute(gl: WebGLRenderingContext, buffers: Buffers, programInfo: ProgramInfo) {
  const numComponents = 3;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexColor,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
}

function drawScene(gl: WebGLRenderingContext, programInfo: ProgramInfo, buffers: Buffers, cameraPosition: CameraPosition) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
  gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = (45 * Math.PI) / 180; // in radians
  const aspect = (gl.canvas as HTMLCanvasElement).clientWidth / (gl.canvas as HTMLCanvasElement).clientHeight;
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
    [-0.0, 0.0, -cameraPosition.distance],
  ); // amount to translate

  mat4.rotate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to rotate
    cameraPosition.latitude, // amount to rotate in radians
    [1, 0, 0],
  ); // axis to rotate around (X)

  mat4.rotate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to rotate
    cameraPosition.longitude, // amount to rotate in radians
    [0, 1, 0],
  ); // axis to rotate around (Y)

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  setPositionAttribute(gl, buffers, programInfo);

  setColorAttribute(gl, buffers, programInfo)

  // Tell WebGL which indices to use to index the vertices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

  // Tell WebGL to use our program when drawing
  gl.useProgram(programInfo.program);

  // Set the shader uniforms
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix,
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix,
  );

  {
    const vertexCount = buffers.vertexCount;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }
}
