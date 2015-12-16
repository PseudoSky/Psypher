// Global Bind
(function(a){var c={},d=a.prototype.stopCallback;a.prototype.stopCallback=function(e,b,a,f){return this.paused?!0:c[a]||c[f]?!1:d.call(this,e,b,a)};a.prototype.bindGlobal=function(a,b,d){this.bind(a,b,d);if(a instanceof Array)for(b=0;b<a.length;b++)c[a[b]]=!0;else c[a]=!0};a.init()})(Mousetrap);

// Bind Dictionary
(function(b){var c=b.prototype.bind,a;b.prototype.bind=function(){a=arguments;if("string"==typeof a[0]||a[0]instanceof Array)return c.call(this,a[0],a[1],a[2]);for(var b in a[0])a[0].hasOwnProperty(b)&&c.call(this,b,a[0][b],a[1])};b.init()})(Mousetrap);

// Set.prototype.add_each=function(arr){
// 	console.log(this);
// 	arr.forEach(function(elem){
// 		this.__proto__.add(elem);
// 	});
// };

// _.mixin({
// 	sadd:function(set,elems){
// 		_.spread(set.add)(elems)
// 	}

// });