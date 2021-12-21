export default function hexToRgb(hex) {
		hex = hex.slice(1, hex.length);

	    var bigint = parseInt(hex, 16);
	    var r = (bigint >> 16) & 255;
	    var g = (bigint >> 8) & 255;
	    var b = bigint & 255;

	    return {r: r/255,g: g/255,b: b/255}
	}