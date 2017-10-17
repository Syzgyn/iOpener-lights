// https://www.shadertoy.com/view/4dl3zn

var colorUtils = require(appRoot + 'libs/color_utils');
var util = require('util');
var Pattern = require(patternRoot + 'pattern');

var Bubbles = function()
{
	Bubbles.super_.call(this);
    this.enabled = false;

    this.x_range = this.appConfig.coordBounds[0].max;
    this.y_range = this.appConfig.coordBounds[1].max;

    this.hue = Math.random();
    this.speed = 10;
    this.decay = 1;
    this.offset = 0.0;

	this.web_settings = {
		name: "Bubbles",
    }
}

util.inherits(Bubbles, Pattern);

Bubbles.prototype.update = function()
{
	this.offset += (this.speed / 100.0);
}

Bubbles.prototype._smoothstep = function(x, y, a)
{
    var t = colorUtils.clamp((a - x) / (y - x), 0.0, 1.0);
    //console.log(x, y, a, t)
    return t * t * (3.0 - 2.0 * t);
}

Bubbles.prototype.shader = function(coords, led_num, tent_coords)
{
	var x = coords.point[0] + tent_coords.point[0];
	var y = coords.point[1] + tent_coords.point[1];
	var z = coords.point[2] + tent_coords.point[2];

    color = [0,0,0];

    for(var i = 0; i < 40; i++)
    {
        var pha = Math.sin(i * 546.13 + 1.0) * 0.5 + 0.5;
        var siz = Math.pow(Math.sin(i * 651.74 + 5.0) *  0.5 + 0.5, 4.0);
        var pox = Math.sin(i * 321.55 + 4.1) * 2.0;

        var rad = 0.1 + 0.5 * siz;
        var pos = [pox, -1.0 - rad + (2.0 + 2.0 * rad) * (pha + 0.1 * this.offset * (0.2 + 0.8 * siz) % 1.0)];
        var dis = Math.sqrt(Math.pow(x - pos[0], 2) + Math.pow(z - pos[1], 2));

        if(Math.random() > 0.5)
        {
            var col = [0.94, 0.3, 0.0];
        }
        else
        {
            var col = [0.1, 0.4, 0.8];
        }

        var f = dis / rad;
        f = [Math.sqrt(colorUtils.clamp(1.0 - f[0] * f[0], 0, 1)), Math.sqrt(colorUtils.clamp(1.0 - f[1] * f[1], 0, 1))];
        color = [
            color[0] + col[2] * (1.0 - this._smoothstep(rad * 0.95, rad, dis)) * f,
            color[1] + col[1] * (1.0 - this._smoothstep(rad * 0.95, rad, dis)) * f,
            color[2] + col[0] * (1.0 - this._smoothstep(rad * 0.95, rad, dis)) * f
        ];

        //console.log(this._smoothstep(rad * 0.95, rad, dis));


        return [
            color[0] * 255.0 % 255,
            color[1] * 255.0 % 255,
            color[2] * 255.0 % 255
        ];

    }
/*
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = -1.0 + 2.0*fragCoord.xy / iResolution.xy;
    uv.x *=  iResolution.x / iResolution.y;

    // background    
    vec3 color = vec3(0.8 + 0.2*uv.y);

    // bubbles  
    for( int i=0; i<40; i++ )
    {
        // bubble seeds
        float pha =      sin(float(i)*546.13+1.0)*0.5 + 0.5;
        float siz = pow( sin(float(i)*651.74+5.0)*0.5 + 0.5, 4.0 );
        float pox =      sin(float(i)*321.55+4.1) * iResolution.x / iResolution.y;

        // buble size, position and color
        float rad = 0.1 + 0.5*siz;
        vec2  pos = vec2( pox, -1.0-rad + (2.0+2.0*rad)*mod(pha+0.1*iTime*(0.2+0.8*siz),1.0));
        float dis = length( uv - pos );
        vec3  col = mix( vec3(0.94,0.3,0.0), vec3(0.1,0.4,0.8), 0.5+0.5*sin(float(i)*1.2+1.9));
        //    col+= 8.0*smoothstep( rad*0.95, rad, dis );
        
        // render
        float f = length(uv-pos)/rad;
        f = sqrt(clamp(1.0-f*f,0.0,1.0));
        color -= col.zyx *(1.0-smoothstep( rad*0.95, rad, dis )) * f;
    }

    // vigneting    
    color *= sqrt(1.5-0.5*length(uv));

    fragColor = vec4(color,1.0);
}
*/
}

module.exports = Bubbles;
