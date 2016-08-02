var Vector = function(arr){
    this.array = [];

    if(Array.isArray(arr))
    {
        this.array = arr.slice();;
    }

    if(arr instanceof Vector)
    {
        this.array = arr.array.slice();
    }

    return this;
}

Vector.prototype = {
    get length() {
        var sum = 0;
        for(var i = 0; i < this.array.length; i++)
        {
            sum += this.array[i] * this.array[i];
        }

        return Math.sqrt(sum);
    },

    get sum() {
        return this.array.reduce(function(a,b){return a+b;});
    },
};

Vector.prototype._validate = function(x)
{
    if(x instanceof Vector)
    {
        x = x.array;
    }
    else if(Array.isArray(x))
    {
        if(x.length != this.array.length)
        {
            throw new Error("Arrays must be the same size");
        }
    }
    else if(isNaN(x))
    {
        console.log(x);
        throw new Error("Argument must be an array or numeric");
    }
    else
    {
        var out = [];
        for(var i = 0; i < this.array.length; i++)
        {
            out[i] = x;
        }

        return out;
    }

    return x;
}

Vector.prototype.add = function(x)
{
    x = this._validate(x);

    for(var i = 0; i < x.length; i++)
    {
        this.array[i] += x[i];
    }

    return this;
};
    
Vector.prototype.subtract = function(x)
{
    x = this._validate(x);

    for(var i = 0; i < x.length; i++)
    {
        this.array[i] -= x[i];
    }

    return this;
};

Vector.prototype.preSubtract = function(x)
{
    x = this._validate(x);

    for(var i = 0; i < x.length; i++)
    {
        this.array[i] = x[i] - this.array[i];
    }

    return this;
};

Vector.prototype.multiply = function(x)
{
    x = this._validate(x);

    for(var i = 0; i < x.length; i++)
    {
        this.array[i] *= x[i];
    }

    return this;
};

Vector.prototype.divide = function(x)
{
    x = this._validate(x);

    for(var i = 0; i < x.length; i++)
    {
        this.array[i] /= x[i];
    }

    return this;
};

Vector.prototype.mod = function(x)
{
    x = this._validate(x);

    for(var i = 0; i < x.length; i++)
    {
        this.array[i] = this.array[i] % x[i];
    }
}

Vector.prototype.distanceFrom = function(x)
{
    this.subtract(x);

    var sum = 0;

    for(var i = 0; i < this.array.length; i++)
    {
        sum += this.array[i] * this.array[i];
    }

    this.add(x);

    return Math.sqrt(sum);
};

Vector.prototype.clamp = function(min, max)
{
    for(var i = 0; i < this.array.length; i++)
    {
        this.array[i] = Math.max(min, Math.min(max, this.array[i]));
    }

    return this;
};

Vector.prototype.pow = function(x)
{
    x = this._validate(x);

    for(var i = 0; i < this.array.length; i++)
    {
        this.array[i] = Math.pow(this.array[i], x[i]);
    }
    
    return this;
}

Vector.vec2 = function(x)
{
    if(!isNaN(x))
    {
        return new Vector([x,x]);
    }

    if(x instanceof Vector)
    {
        return new Vector([
            x.array[0] || 0,
            x.array[1] || 0,
        ]);
    }

    if(Array.isArray(x))
    {
        return new Vector([
            x[0] || 0,
            x[1] || 0,
        ]);
    }
}

Vector.vec3 = function(x)
{
    if(!isNaN(x))
    {
        return new Vector([x,x,x]);
    }

    if(x instanceof Vector)
    {
        return new Vector([
            x.array[0] || 0,
            x.array[1] || 0,
            x.array[2] || 0,
        ]);
    }

    if(Array.isArray(x))
    {
        return new Vector([
            x[0] || 0,
            x[1] || 0,
        ]);
    }
}

Vector.vec4 = function(x)
{
    if(!isNaN(x))
    {
        return new Vector([x,x,x,x]);
    }

    if(x instanceof Vector)
    {
        return new Vector([
            x.array[0] || 0,
            x.array[1] || 0,
            x.array[2] || 0,
            x.array[3] || 0,
        ]);
    }

    if(Array.isArray(x))
    {
        return new Vector([
            x[0] || 0,
            x[1] || 0,
            x[2] || 0,
            x[3] || 0,
        ]);
    }
}

Vector.normalize = function(v)
{
    var len = v.length;
    return new Vector([
        v.array[0] / len,
        v.array[1] / len,
        v.array[2] / len
    ]);
}

Vector.dot = function(x, y)
{
    var x1 = new Vector(x);
    x1.multiply(y);
    return x1.sum;
}

Vector.cross = function(x, y)
{
    if(x.array.length != 3 || y.array.length != 3)
    {
        throw new Error("Vector.cross requires arrays of length 3");
    }

    return new Vector([
        x.array[1] * y.array[2] - y.array[1] * x.array[2],
        x.array[2] * y.array[0] - y.array[2] * x.array[0],
        x.array[0] * y.array[1] - y.array[0] * x.array[1]
    ]);
}

Vector.mix = function(x, y, a)
{
    //x * (1 - a) + y * a
    x.multiply(1 - a).add(y.add(a));

    return x;
}

module.exports = Vector;
