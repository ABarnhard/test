/**
 * Copyright 2013 Phil DeJarnett
 * http://www.overzealous.com
 * Licensed under the Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0.html
 */
// Create a module for naturalSorting
angular.module("naturalSort", [])

// The core natural service
.factory("naturalService", function() {
		// the cache prevents re-creating the values every time, at the expense of
		// storing the results forever. Not recommended for highly changing data
		// on long-term applications.
	var natCache = {},
		// amount of extra zeros to padd for sorting
        padding = function(value) {
			return '00000000000000000000'.slice(value.length);
		},
		
		// Fix numbers to be correctly padded
        fixNumbers = function(value) {
	 		// First, look for anything in the form of d.d or d.d.d...
            return value.replace(/(\d+)((\.\d+)+)?/g, function ($0, integer, decimal, $3) {
				// If there's more than 2 sets of numbers...
                if (decimal !== $3) {
                    // treat as a series of integers, like versioning,
                    // rather than a decimal
                    return $0.replace(/(\d+)/g, function ($d) {
                        return padding($d) + $d
                    });
                } else {
					// add a decimal if necessary to ensure decimal sorting
                    decimal = decimal || ".0";
                    return padding(integer) + integer + decimal + padding(decimal);
                }
            });
        },

		// Finally, this function puts it all together.
        natValue = function (value) {
            if(natCache[value]) {
                return natCache[value];
            }
            var newValue = fixNumbers(value);
            return natCache[value] = newValue;
        };

	// The actual object used by this service
	return {
		naturalValue: natValue,
		naturalSort: function(a, b) {
			a = natVale(a);
			b = natValue(b);
			return (a < b) ? -1 : ((a > b) ? 1 : 0)
		}
	};
})

// Attach a function to the rootScope so it can be accessed by "orderBy"
.run(["$rootScope", "naturalService", function($rootScope, naturalService) {
	$rootScope.natural = function (field) {
        return function (item) {
            return naturalService.naturalValue(item[field]);
        }
    };
}]);