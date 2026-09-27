"use strict";

var gl;
var points = [];
var NumTimesToSubdivide = 4;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

     divideSquare( -0.9, -0.9, 1.8, NumTimesToSubdivide );

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    var uColorLoc = gl.getUniformLocation( program, "uColor" );
    gl.uniform4f( uColorLoc, 1.0, 0.0, 0.0, 1.0 );

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    document.getElementById( "depth" ).oninput = function( event ) {
        NumTimesToSubdivide = parseInt( event.target.value );
        document.getElementById( "depthValue" ).innerHTML = NumTimesToSubdivide; 

        points = [];
        divideSquare( -0.9, -0.9, 1.8, NumTimesToSubdivide );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
        render();
    };

    document.getElementById( "color" ).oninput = function( event ) {
        var hex = event.target.value;
        var r = parseInt( hex.substr(1, 2), 16 ) / 255;
        var g = parseInt( hex.substr(3, 2), 16 ) / 255;
        var b = parseInt( hex.substr(5, 2), 16 ) / 255;
        gl.uniform4f( uColorLoc, r, g, b, 1.0 );
        render();
    };

    render();
};

function divideSquare( x, y, size, count )
{
    if ( count === 0 ) {
        // 더 안 쪼갠다 → 사각형 하나를 삼각형 2개로 저장
        points.push( vec2(x, y),        vec2(x+size, y),      vec2(x+size, y+size) );
        points.push( vec2(x, y),        vec2(x+size, y+size), vec2(x, y+size) );
        return;
    }

    var s = size / 3;   // 작은 칸 한 변 길이

    for ( var i = 0; i < 3; i++ ) {         // 가로 3칸
        for ( var j = 0; j < 3; j++ ) {     // 세로 3칸
            if ( i === 1 && j === 1 ) continue;   // 가운데 칸은 버린다
            divideSquare( x + i*s, y + j*s, s, count - 1 );
        }
    }
}
function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}
