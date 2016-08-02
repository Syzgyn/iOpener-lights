module.exports = {
    _validate: function(a)
    {
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
        }

        var length = false;

        for(var i = 0; i < args.length; i++)
        {
            if(!Array.isArray(args[i]))
            {
                throw new Error("Argument must be an array");
            }

            if(!length)
            {
                length = args[i].length;
            }
            else if(args[i].length != length)
            {
                throw new Error("Arrays must be the same size");
            }
        }
    },
    add: function(x, y)
    {
        this._validate([x, y]);

        var output = [];
        for(var i = 0; i < x.length; i++)
        {
            output[i] = x[i] + y[i];
        }

        return output;
    },

    
    sub: function(x, y)
    {
        this._validate([x, y]);

        var output = [];
        for(var i = 0; i < x.length; i++)
        {
            output[i] = x[i] - y[i];
        }

        return output;
    },


    multiply: function(x, y)
    {
        this._validate([x, y]);

        var output = [];
        for(var i = 0; i < x.length; i++)
        {
            output[i] = x[i] * y[i];
        }

        return output;
    },

    divide: function(x, y)
    {
        this._validate([x, y]);

        var output = [];
        for(var i = 0; i < x.length; i++)
        {
            output[i] = x[i] / y[i];
        }

        return output;
    },

    distance: function(x, y)
    {
        this._validate([x, y]);

        var step = this.sub(y, x);
        var sum = 0;

        for(var i = 0; i < step.length; i++)
        {
            sum += step[i] * step[i];
        }

        return Math.sqrt(sum);
    }
};
