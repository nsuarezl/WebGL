// Vertex shader code
const vertexShaderCode = `
  attribute vec4 a_position;
  attribute vec4 a_color;
  uniform int u_mode;
  
  varying vec4 v_color;
  
  void main() {
    gl_Position = a_position;
    v_color = a_color;
    
    if (u_mode == 1) {
      gl_Position.x = (gl_Position.x + 1.0) / 2.0 * gl_PointSize;
      gl_Position.y = (gl_Position.y + 1.0) / 2.0 * gl_PointSize;
    }
  }
`;

// Fragment shader code
const fragmentShaderCode = `
  precision mediump float;
  
  varying vec4 v_color;
  
  void main() {
    gl_FragColor = v_color;
  }
`;

class WebGLObject {
  constructor(gl) {
    this.gl = gl;
    this.mode = 0;
    this.vertices = [
      0, 0.5, 0, 1, 0, 0,
      1, 0.5, 0, 0, 1, 0,
      0.5, 1, 0, 0, 0, 1,
      0.5, 0, 0, 1, 1, 0,
      0, -1, 0, 0, 1, 1,
      -0.5, 0, 0, 1, 0, 1,
    ];
    this.buffer = gl.createBuffer();
    this.shaderProgram = this.createShaderProgram();
    this.a_position = gl.getAttribLocation(this.shaderProgram, 'a_position');
    this.a_color = gl.getAttribLocation(this.shaderProgram, 'a_color');
    this.u_mode = gl.getUniformLocation(this.shaderProgram, 'u_mode');
  }
  
  createShaderProgram() {
    const gl = this.gl;
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderCode);
    gl.compileShader(vertexShader);
    
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderCode);
    gl.compileShader(fragmentShader);
    
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    
    return shaderProgram;
  }
  
  setMode(mode) {
    this.mode = mode;
  }
  
  render() {
    const gl = this.gl;
    gl.useProgram(this.shaderProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
    
    gl.enableVertexAttribArray(this.a_position);
    gl.vertexAttribPointer(this.a_position, 3, gl.FLOAT, false, 24, 0);
    
    gl.enableVertexAttribArray(this.a_color);
    gl.vertexAttribPointer(this.a_color, 3, gl.FLOAT, false, 24, 12);
    
    gl.uniform1i(this.u_mode, this.mode);
    
    switch (this.mode) {
      case 0:
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        break;
      case 1:
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6);
        break;
      case 2:
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 6);
        break;
    }
  }
}

class Main {
  constructor() {
    const canvas = document.getElementById('canvas');
    const gl = canvas.getContext('webgl');
    
    this.glObject = new WebGLObject(gl);
    
    this.initListeners();
  }
  
  initListeners() {
    document.getElementById('triangles').addEventListener('click', () => {
      this.glObject.setMode(0);
      this.render();
    });
    document.getElementById('triangle_strip').addEventListener('click', () => {
      this.glObject.setMode(1);
      this.render();
    });
    document.getElementById('triangle_fan').addEventListener('click', () => {
      this.glObject.setMode(2);
      this.render();
    });
  }
  
  render() {
    const gl = this.gl;
  
  console.log(this.a_position, this.a_color, this.u_mode);
  
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
  
  gl.enableVertexAttribArray(this.a_position);
  gl.vertexAttribPointer(this.a_position, 3, gl.FLOAT, false, 24, 0);
  
  gl.enableVertexAttribArray(this.a_color);
  gl.vertexAttribPointer(this.a_color, 3, gl.FLOAT, false, 24, 12);
  
  gl.uniform1i(this.u_mode, this.mode);
  
  switch (this.mode) {
    case 0:
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      break;
    case 1:
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6);
      break;
    case 2:
      gl.drawArrays(gl.TRIANGLE_FAN, 0, 6);
      break;
  }
  
  console.log(gl.getError());
}
  
}

const main = new Main();

