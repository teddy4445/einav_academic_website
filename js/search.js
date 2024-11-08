!function(){function e(e){if(null===e||"object"!=typeof e)return e;var t=e.constructor();for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);return t}var t=function(e){var n=new t.Index;return n.pipeline.add(t.trimmer,t.stopWordFilter,t.stemmer),e&&e.call(n,n),n};t.version="0.9.5",lunr=t,t.utils={},t.utils.warn=function(e){return function(t){e.console&&console.warn&&console.warn(t)}}(this),t.utils.toString=function(e){return void 0===e||null===e?"":e.toString()},t.EventEmitter=function(){this.events={}},t.EventEmitter.prototype.addListener=function(){var e=Array.prototype.slice.call(arguments),t=e.pop(),n=e;if("function"!=typeof t)throw new TypeError("last argument must be a function");n.forEach(function(e){this.hasHandler(e)||(this.events[e]=[]),this.events[e].push(t)},this)},t.EventEmitter.prototype.removeListener=function(e,t){if(this.hasHandler(e)){var n=this.events[e].indexOf(t);-1!==n&&(this.events[e].splice(n,1),0==this.events[e].length&&delete this.events[e])}},t.EventEmitter.prototype.emit=function(e){if(this.hasHandler(e)){var t=Array.prototype.slice.call(arguments,1);this.events[e].forEach(function(e){e.apply(void 0,t)},this)}},t.EventEmitter.prototype.hasHandler=function(e){return e in this.events},t.tokenizer=function(e){if(!arguments.length||null===e||void 0===e)return[];if(Array.isArray(e)){var n=e.filter(function(e){return null===e||void 0===e?!1:!0});n=n.map(function(e){return t.utils.toString(e).toLowerCase()});var i=[];return n.forEach(function(e){var n=e.split(t.tokenizer.seperator);i=i.concat(n)},this),i}return e.toString().trim().toLowerCase().split(t.tokenizer.seperator)},t.tokenizer.defaultSeperator=/[\s\-]+/,t.tokenizer.seperator=t.tokenizer.defaultSeperator,t.tokenizer.setSeperator=function(e){null!==e&&void 0!==e&&"object"==typeof e&&(t.tokenizer.seperator=e)},t.tokenizer.resetSeperator=function(){t.tokenizer.seperator=t.tokenizer.defaultSeperator},t.tokenizer.getSeperator=function(){return t.tokenizer.seperator},t.Pipeline=function(){this._queue=[]},t.Pipeline.registeredFunctions={},t.Pipeline.registerFunction=function(e,n){n in t.Pipeline.registeredFunctions&&t.utils.warn("Overwriting existing registered function: "+n),e.label=n,t.Pipeline.registeredFunctions[n]=e},t.Pipeline.getRegisteredFunction=function(e){return e in t.Pipeline.registeredFunctions!=!0?null:t.Pipeline.registeredFunctions[e]},t.Pipeline.warnIfFunctionNotRegistered=function(e){var n=e.label&&e.label in this.registeredFunctions;n||t.utils.warn("Function is not registered with pipeline. This may cause problems when serialising the index.\n",e)},t.Pipeline.load=function(e){var n=new t.Pipeline;return e.forEach(function(e){var i=t.Pipeline.getRegisteredFunction(e);if(!i)throw new Error("Cannot load un-registered function: "+e);n.add(i)}),n},t.Pipeline.prototype.add=function(){var e=Array.prototype.slice.call(arguments);e.forEach(function(e){t.Pipeline.warnIfFunctionNotRegistered(e),this._queue.push(e)},this)},t.Pipeline.prototype.after=function(e,n){t.Pipeline.warnIfFunctionNotRegistered(n);var i=this._queue.indexOf(e);if(-1===i)throw new Error("Cannot find existingFn");this._queue.splice(i+1,0,n)},t.Pipeline.prototype.before=function(e,n){t.Pipeline.warnIfFunctionNotRegistered(n);var i=this._queue.indexOf(e);if(-1===i)throw new Error("Cannot find existingFn");this._queue.splice(i,0,n)},t.Pipeline.prototype.remove=function(e){var t=this._queue.indexOf(e);-1!==t&&this._queue.splice(t,1)},t.Pipeline.prototype.run=function(e){for(var t=[],n=e.length,i=this._queue.length,o=0;n>o;o++){for(var r=e[o],s=0;i>s&&(r=this._queue[s](r,o,e),void 0!==r&&null!==r);s++);void 0!==r&&null!==r&&t.push(r)}return t},t.Pipeline.prototype.reset=function(){this._queue=[]},t.Pipeline.prototype.get=function(){return this._queue},t.Pipeline.prototype.toJSON=function(){return this._queue.map(function(e){return t.Pipeline.warnIfFunctionNotRegistered(e),e.label})},t.Index=function(){this._fields=[],this._ref="id",this.pipeline=new t.Pipeline,this.documentStore=new t.DocumentStore,this.index={},this.eventEmitter=new t.EventEmitter,this._idfCache={},this.on("add","remove","update",function(){this._idfCache={}}.bind(this))},t.Index.prototype.on=function(){var e=Array.prototype.slice.call(arguments);return this.eventEmitter.addListener.apply(this.eventEmitter,e)},t.Index.prototype.off=function(e,t){return this.eventEmitter.removeListener(e,t)},t.Index.load=function(e){e.version!==t.version&&t.utils.warn("version mismatch: current "+t.version+" importing "+e.version);var n=new this;n._fields=e.fields,n._ref=e.ref,n.documentStore=t.DocumentStore.load(e.documentStore),n.pipeline=t.Pipeline.load(e.pipeline),n.index={};for(var i in e.index)n.index[i]=t.InvertedIndex.load(e.index[i]);return n},t.Index.prototype.addField=function(e){return this._fields.push(e),this.index[e]=new t.InvertedIndex,this},t.Index.prototype.setRef=function(e){return this._ref=e,this},t.Index.prototype.saveDocument=function(e){return this.documentStore=new t.DocumentStore(e),this},t.Index.prototype.addDoc=function(e,n){if(e){var n=void 0===n?!0:n,i=e[this._ref];this.documentStore.addDoc(i,e),this._fields.forEach(function(n){var o=this.pipeline.run(t.tokenizer(e[n]));this.documentStore.addFieldLength(i,n,o.length);var r={};o.forEach(function(e){e in r?r[e]+=1:r[e]=1},this);for(var s in r){var u=r[s];u=Math.sqrt(u),this.index[n].addToken(s,{ref:i,tf:u})}},this),n&&this.eventEmitter.emit("add",e,this)}},t.Index.prototype.removeDocByRef=function(e){if(e&&this.documentStore.isDocStored()!==!1&&this.documentStore.hasDoc(e)){var t=this.documentStore.getDoc(e);this.removeDoc(t,!1)}},t.Index.prototype.removeDoc=function(e,n){if(e){var n=void 0===n?!0:n,i=e[this._ref];this.documentStore.hasDoc(i)&&(this.documentStore.removeDoc(i),this._fields.forEach(function(n){var o=this.pipeline.run(t.tokenizer(e[n]));o.forEach(function(e){this.index[n].removeToken(e,i)},this)},this),n&&this.eventEmitter.emit("remove",e,this))}},t.Index.prototype.updateDoc=function(e,t){var t=void 0===t?!0:t;this.removeDocByRef(e[this._ref],!1),this.addDoc(e,!1),t&&this.eventEmitter.emit("update",e,this)},t.Index.prototype.idf=function(e,t){var n="@"+t+"/"+e;if(Object.prototype.hasOwnProperty.call(this._idfCache,n))return this._idfCache[n];var i=this.index[t].getDocFreq(e),o=1+Math.log(this.documentStore.length/(i+1));return this._idfCache[n]=o,o},t.Index.prototype.getFields=function(){return this._fields.slice()},t.Index.prototype.search=function(e,n){if(!e)return[];e="string"==typeof e?{any:e}:JSON.parse(JSON.stringify(e));var i=null;null!=n&&(i=JSON.stringify(n));for(var o=new t.Configuration(i,this.getFields()).get(),r={},s=Object.keys(e),u=0;u<s.length;u++){var a=s[u];r[a]=this.pipeline.run(t.tokenizer(e[a]))}var l={};for(var c in o){var d=r[c]||r.any;if(d){var f=this.fieldSearch(d,c,o),h=o[c].boost;for(var p in f)f[p]=f[p]*h;for(var p in f)p in l?l[p]+=f[p]:l[p]=f[p]}}var v,g=[];for(var p in l)v={ref:p,score:l[p]},this.documentStore.hasDoc(p)&&(v.doc=this.documentStore.getDoc(p)),g.push(v);return g.sort(function(e,t){return t.score-e.score}),g},t.Index.prototype.fieldSearch=function(e,t,n){var i=n[t].bool,o=n[t].expand,r=n[t].boost,s=null,u={};return 0!==r?(e.forEach(function(e){var n=[e];1==o&&(n=this.index[t].expandToken(e));var r={};n.forEach(function(n){var o=this.index[t].getDocs(n),a=this.idf(n,t);if(s&&"AND"==i){var l={};for(var c in s)c in o&&(l[c]=o[c]);o=l}n==e&&this.fieldSearchStats(u,n,o);for(var c in o){var d=this.index[t].getTermFrequency(n,c),f=this.documentStore.getFieldLength(c,t),h=1;0!=f&&(h=1/Math.sqrt(f));var p=1;n!=e&&(p=.15*(1-(n.length-e.length)/n.length));var v=d*a*h*p;c in r?r[c]+=v:r[c]=v}},this),s=this.mergeScores(s,r,i)},this),s=this.coordNorm(s,u,e.length)):void 0},t.Index.prototype.mergeScores=function(e,t,n){if(!e)return t;if("AND"==n){var i={};for(var o in t)o in e&&(i[o]=e[o]+t[o]);return i}for(var o in t)o in e?e[o]+=t[o]:e[o]=t[o];return e},t.Index.prototype.fieldSearchStats=function(e,t,n){for(var i in n)i in e?e[i].push(t):e[i]=[t]},t.Index.prototype.coordNorm=function(e,t,n){for(var i in e)if(i in t){var o=t[i].length;e[i]=e[i]*o/n}return e},t.Index.prototype.toJSON=function(){var e={};return this._fields.forEach(function(t){e[t]=this.index[t].toJSON()},this),{version:t.version,fields:this._fields,ref:this._ref,documentStore:this.documentStore.toJSON(),index:e,pipeline:this.pipeline.toJSON()}},t.Index.prototype.use=function(e){var t=Array.prototype.slice.call(arguments,1);t.unshift(this),e.apply(this,t)},t.DocumentStore=function(e){this._save=null===e||void 0===e?!0:e,this.docs={},this.docInfo={},this.length=0},t.DocumentStore.load=function(e){var t=new this;return t.length=e.length,t.docs=e.docs,t.docInfo=e.docInfo,t._save=e.save,t},t.DocumentStore.prototype.isDocStored=function(){return this._save},t.DocumentStore.prototype.addDoc=function(t,n){this.hasDoc(t)||this.length++,this.docs[t]=this._save===!0?e(n):null},t.DocumentStore.prototype.getDoc=function(e){return this.hasDoc(e)===!1?null:this.docs[e]},t.DocumentStore.prototype.hasDoc=function(e){return e in this.docs},t.DocumentStore.prototype.removeDoc=function(e){this.hasDoc(e)&&(delete this.docs[e],delete this.docInfo[e],this.length--)},t.DocumentStore.prototype.addFieldLength=function(e,t,n){null!==e&&void 0!==e&&0!=this.hasDoc(e)&&(this.docInfo[e]||(this.docInfo[e]={}),this.docInfo[e][t]=n)},t.DocumentStore.prototype.updateFieldLength=function(e,t,n){null!==e&&void 0!==e&&0!=this.hasDoc(e)&&this.addFieldLength(e,t,n)},t.DocumentStore.prototype.getFieldLength=function(e,t){return null===e||void 0===e?0:e in this.docs&&t in this.docInfo[e]?this.docInfo[e][t]:0},t.DocumentStore.prototype.toJSON=function(){return{docs:this.docs,docInfo:this.docInfo,length:this.length,save:this._save}},t.stemmer=function(){var e={ational:"ate",tional:"tion",enci:"ence",anci:"ance",izer:"ize",bli:"ble",alli:"al",entli:"ent",eli:"e",ousli:"ous",ization:"ize",ation:"ate",ator:"ate",alism:"al",iveness:"ive",fulness:"ful",ousness:"ous",aliti:"al",iviti:"ive",biliti:"ble",logi:"log"},t={icate:"ic",ative:"",alize:"al",iciti:"ic",ical:"ic",ful:"",ness:""},n="[^aeiou]",i="[aeiouy]",o=n+"[^aeiouy]*",r=i+"[aeiou]*",s="^("+o+")?"+r+o,u="^("+o+")?"+r+o+"("+r+")?$",a="^("+o+")?"+r+o+r+o,l="^("+o+")?"+i,c=new RegExp(s),d=new RegExp(a),f=new RegExp(u),h=new RegExp(l),p=/^(.+?)(ss|i)es$/,v=/^(.+?)([^s])s$/,g=/^(.+?)eed$/,m=/^(.+?)(ed|ing)$/,y=/.$/,S=/(at|bl|iz)$/,x=new RegExp("([^aeiouylsz])\\1$"),w=new RegExp("^"+o+i+"[^aeiouwxy]$"),I=/^(.+?[^aeiou])y$/,b=/^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/,E=/^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/,D=/^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/,F=/^(.+?)(s|t)(ion)$/,_=/^(.+?)e$/,P=/ll$/,k=new RegExp("^"+o+i+"[^aeiouwxy]$"),z=function(n){var i,o,r,s,u,a,l;if(n.length<3)return n;if(r=n.substr(0,1),"y"==r&&(n=r.toUpperCase()+n.substr(1)),s=p,u=v,s.test(n)?n=n.replace(s,"$1$2"):u.test(n)&&(n=n.replace(u,"$1$2")),s=g,u=m,s.test(n)){var z=s.exec(n);s=c,s.test(z[1])&&(s=y,n=n.replace(s,""))}else if(u.test(n)){var z=u.exec(n);i=z[1],u=h,u.test(i)&&(n=i,u=S,a=x,l=w,u.test(n)?n+="e":a.test(n)?(s=y,n=n.replace(s,"")):l.test(n)&&(n+="e"))}if(s=I,s.test(n)){var z=s.exec(n);i=z[1],n=i+"i"}if(s=b,s.test(n)){var z=s.exec(n);i=z[1],o=z[2],s=c,s.test(i)&&(n=i+e[o])}if(s=E,s.test(n)){var z=s.exec(n);i=z[1],o=z[2],s=c,s.test(i)&&(n=i+t[o])}if(s=D,u=F,s.test(n)){var z=s.exec(n);i=z[1],s=d,s.test(i)&&(n=i)}else if(u.test(n)){var z=u.exec(n);i=z[1]+z[2],u=d,u.test(i)&&(n=i)}if(s=_,s.test(n)){var z=s.exec(n);i=z[1],s=d,u=f,a=k,(s.test(i)||u.test(i)&&!a.test(i))&&(n=i)}return s=P,u=d,s.test(n)&&u.test(n)&&(s=y,n=n.replace(s,"")),"y"==r&&(n=r.toLowerCase()+n.substr(1)),n};return z}(),t.Pipeline.registerFunction(t.stemmer,"stemmer"),t.stopWordFilter=function(e){return e&&t.stopWordFilter.stopWords[e]!==!0?e:void 0},t.clearStopWords=function(){t.stopWordFilter.stopWords={}},t.addStopWords=function(e){null!=e&&Array.isArray(e)!==!1&&e.forEach(function(e){t.stopWordFilter.stopWords[e]=!0},this)},t.resetStopWords=function(){t.stopWordFilter.stopWords=t.defaultStopWords},t.defaultStopWords={"":!0,a:!0,able:!0,about:!0,across:!0,after:!0,all:!0,almost:!0,also:!0,am:!0,among:!0,an:!0,and:!0,any:!0,are:!0,as:!0,at:!0,be:!0,because:!0,been:!0,but:!0,by:!0,can:!0,cannot:!0,could:!0,dear:!0,did:!0,"do":!0,does:!0,either:!0,"else":!0,ever:!0,every:!0,"for":!0,from:!0,get:!0,got:!0,had:!0,has:!0,have:!0,he:!0,her:!0,hers:!0,him:!0,his:!0,how:!0,however:!0,i:!0,"if":!0,"in":!0,into:!0,is:!0,it:!0,its:!0,just:!0,least:!0,let:!0,like:!0,likely:!0,may:!0,me:!0,might:!0,most:!0,must:!0,my:!0,neither:!0,no:!0,nor:!0,not:!0,of:!0,off:!0,often:!0,on:!0,only:!0,or:!0,other:!0,our:!0,own:!0,rather:!0,said:!0,say:!0,says:!0,she:!0,should:!0,since:!0,so:!0,some:!0,than:!0,that:!0,the:!0,their:!0,them:!0,then:!0,there:!0,these:!0,they:!0,"this":!0,tis:!0,to:!0,too:!0,twas:!0,us:!0,wants:!0,was:!0,we:!0,were:!0,what:!0,when:!0,where:!0,which:!0,"while":!0,who:!0,whom:!0,why:!0,will:!0,"with":!0,would:!0,yet:!0,you:!0,your:!0},t.stopWordFilter.stopWords=t.defaultStopWords,t.Pipeline.registerFunction(t.stopWordFilter,"stopWordFilter"),t.trimmer=function(e){if(null===e||void 0===e)throw new Error("token should not be undefined");return e.replace(/^\W+/,"").replace(/\W+$/,"")},t.Pipeline.registerFunction(t.trimmer,"trimmer"),t.InvertedIndex=function(){this.root={docs:{},df:0}},t.InvertedIndex.load=function(e){var t=new this;return t.root=e.root,t},t.InvertedIndex.prototype.addToken=function(e,t,n){for(var n=n||this.root,i=0;i<=e.length-1;){var o=e[i];o in n||(n[o]={docs:{},df:0}),i+=1,n=n[o]}var r=t.ref;n.docs[r]?n.docs[r]={tf:t.tf}:(n.docs[r]={tf:t.tf},n.df+=1)},t.InvertedIndex.prototype.hasToken=function(e){if(!e)return!1;for(var t=this.root,n=0;n<e.length;n++){if(!t[e[n]])return!1;t=t[e[n]]}return!0},t.InvertedIndex.prototype.getNode=function(e){if(!e)return null;for(var t=this.root,n=0;n<e.length;n++){if(!t[e[n]])return null;t=t[e[n]]}return t},t.InvertedIndex.prototype.getDocs=function(e){var t=this.getNode(e);return null==t?{}:t.docs},t.InvertedIndex.prototype.getTermFrequency=function(e,t){var n=this.getNode(e);return null==n?0:t in n.docs?n.docs[t].tf:0},t.InvertedIndex.prototype.getDocFreq=function(e){var t=this.getNode(e);return null==t?0:t.df},t.InvertedIndex.prototype.removeToken=function(e,t){if(e){var n=this.getNode(e);null!=n&&t in n.docs&&(delete n.docs[t],n.df-=1)}},t.InvertedIndex.prototype.expandToken=function(e,t,n){if(null==e||""==e)return[];var t=t||[];if(void 0==n&&(n=this.getNode(e),null==n))return t;n.df>0&&t.push(e);for(var i in n)"docs"!==i&&"df"!==i&&this.expandToken(e+i,t,n[i]);return t},t.InvertedIndex.prototype.toJSON=function(){return{root:this.root}},t.Configuration=function(e,n){var e=e||"";if(void 0==n||null==n)throw new Error("fields should not be null");this.config={};var i;try{i=JSON.parse(e),this.buildUserConfig(i,n)}catch(o){t.utils.warn("user configuration parse failed, will use default configuration"),this.buildDefaultConfig(n)}},t.Configuration.prototype.buildDefaultConfig=function(e){this.reset(),e.forEach(function(e){this.config[e]={boost:1,bool:"OR",expand:!1}},this)},t.Configuration.prototype.buildUserConfig=function(e,n){var i="OR",o=!1;if(this.reset(),"bool"in e&&(i=e.bool||i),"expand"in e&&(o=e.expand||o),"fields"in e)for(var r in e.fields)if(n.indexOf(r)>-1){var s=e.fields[r],u=o;void 0!=s.expand&&(u=s.expand),this.config[r]={boost:s.boost||0===s.boost?s.boost:1,bool:s.bool||i,expand:u}}else t.utils.warn("field name in user configuration not found in index instance fields");else this.addAllFields2UserConfig(i,o,n)},t.Configuration.prototype.addAllFields2UserConfig=function(e,t,n){n.forEach(function(n){this.config[n]={boost:1,bool:e,expand:t}},this)},t.Configuration.prototype.get=function(){return this.config},t.Configuration.prototype.reset=function(){this.config={}},lunr.SortedSet=function(){this.length=0,this.elements=[]},lunr.SortedSet.load=function(e){var t=new this;return t.elements=e,t.length=e.length,t},lunr.SortedSet.prototype.add=function(){var e,t;for(e=0;e<arguments.length;e++)t=arguments[e],~this.indexOf(t)||this.elements.splice(this.locationFor(t),0,t);this.length=this.elements.length},lunr.SortedSet.prototype.toArray=function(){return this.elements.slice()},lunr.SortedSet.prototype.map=function(e,t){return this.elements.map(e,t)},lunr.SortedSet.prototype.forEach=function(e,t){return this.elements.forEach(e,t)},lunr.SortedSet.prototype.indexOf=function(e){for(var t=0,n=this.elements.length,i=n-t,o=t+Math.floor(i/2),r=this.elements[o];i>1;){if(r===e)return o;e>r&&(t=o),r>e&&(n=o),i=n-t,o=t+Math.floor(i/2),r=this.elements[o]}return r===e?o:-1},lunr.SortedSet.prototype.locationFor=function(e){for(var t=0,n=this.elements.length,i=n-t,o=t+Math.floor(i/2),r=this.elements[o];i>1;)e>r&&(t=o),r>e&&(n=o),i=n-t,o=t+Math.floor(i/2),r=this.elements[o];return r>e?o:e>r?o+1:void 0},lunr.SortedSet.prototype.intersect=function(e){for(var t=new lunr.SortedSet,n=0,i=0,o=this.length,r=e.length,s=this.elements,u=e.elements;;){if(n>o-1||i>r-1)break;s[n]!==u[i]?s[n]<u[i]?n++:s[n]>u[i]&&i++:(t.add(s[n]),n++,i++)}return t},lunr.SortedSet.prototype.clone=function(){var e=new lunr.SortedSet;return e.elements=this.toArray(),e.length=e.elements.length,e},lunr.SortedSet.prototype.union=function(e){var t,n,i;this.length>=e.length?(t=this,n=e):(t=e,n=this),i=t.clone();for(var o=0,r=n.toArray();o<r.length;o++)i.add(r[o]);return i},lunr.SortedSet.prototype.toJSON=function(){return this.toArray()},function(e,t){"function"==typeof define&&define.amd?define(t):"object"==typeof exports?module.exports=t():e.elasticlunr=t()}(this,function(){return t})}();

let PARAM_QUERY = "query";
docs = [];
var doc1 = {
    "id": "1",
    "body": "A novel numerical stable algorithm for the computing of any complex squre matrix's exponent with analytical proof",
    "shortBody": "Teddy Lazebnik and Shlomo Yanetz Functional Differential Equations",
    "title": "A stable algorithm for numerical matrix exponent",
    "url": "/publications.html"
};
docs.push(doc1);


var doc2 = {
    "id": "2",
    "body": "Optimal BCG-based immunotherapy treatment protocol for bladder cancer mathematical model that taking into considuration approximation of the geometrical configuration of the human bladder using PDE modelingOptimal BCG-based immunotherapy treatment protocol for bladder cancer mathematical model that taking into considuration approximation of the geometrical configuration of the human bladder using PDE modeling.",
    "shortBody": "Teddy Lazebnik, Shlomo Yanetz, Svetlana Bunimovich-Mendrazitsky, and Niva Aaroni Functional Differential Equations",
    "title": "Treatment of Bladder Cancer Using BCG Immunotherapy: PDE Modeling",
    "url": "/publications.html"
};
docs.push(doc2);


var doc3 = {
    "id": "3",
    "body": "A novel numerical stable algorithm for the computing of any complex squre matrix's exponent with analytical proof including analysis of the performance in Matlab and C implementation.",
    "shortBody": "Teddy Lazebnik and Shlomo Yanetz Functional Differential Equations conference",
    "title": "A highly stable implementation for numerical matrix exponent in Matlab and C",
    "url": "/publications.html"
};
docs.push(doc3);


var doc4 = {
    "id": "4",
    "body": "Optimal BCG-based immunotherapy treatment protocol for bladder cancer mathematical model that taking into considuration approximation of the geometrical configuration of the human bladder using PDE modelingOptimal BCG-based immunotherapy treatment protocol for bladder cancer mathematical model that taking into considuration approximation of the geometrical configuration of the human bladder using PDE modeling.",
    "shortBody": "Teddy Lazebnik, Shlomo Yanetz, and Svetlana Bunimovich-Mendrazitsky Functional Differential Equations conference",
    "title": "PDE Modeling of Bladder Cancer Treatment Using BCG Immunotherapy",
    "url": "/publications.html"
};
docs.push(doc4);


var doc5 = {
    "id": "5",
    "body": "Analysis of the most energy efficieny in 2d quadratic hamiltonian motion and general solution for the 1d and 2d cases.",
    "shortBody": "Teddy Lazebnik and Barry Ginat Technion Press",
    "title": "Energy Efficiency in 2d Quadratic Hamiltonian",
    "url": "/publications.html"
};
docs.push(doc5);


var doc6 = {
    "id": "6",
    "body": "Meta academic search engine using project-based search with explicit user tagging to improve search results.",
    "shortBody": "Teddy Lazebnik, Hana Weitman, and Gal A. Kaminka Bar-Ilan Nanotechnology and Advanced Materials",
    "title": "Rivendell: Project-Based Academic Search Engine",
    "url": "/publications.html"
};
docs.push(doc6);


var doc7 = {
    "id": "7",
    "body": "I am a Ph.D. student in the Tolkien Project, part of the MAVERICK research group at the Computer Science Department , Bar Ilan University ; Supervised by Prof. Gal A. Kaminka and Dr. Chana Weitman. My research focuses on medical and biological nanoparticles (focusing on nanorobotics). Specifically, modeling a curing protocol based on biophysical interactions of targeted drug delivery nanoparticles in the blood. I am also interested in numerical solving and stabilization of ordinary and partial differential equations (ODE, PDE) systems (especially, ones that originate in a biological setup). Sometimes I am publishing some useful (or just fun) things like open code and technical blog posts . I published a few academic papers in journals, conferences, and abstracts. In between, I am teaching several mathematical classes and working with Bc.S. and Mc.S. students on their final project. I completed my B.Sc. (2016) and M.Sc. (2018) in Applied Mathematics at Bar-Ilan University. Medical Nanorobotics - nanoscale in vivo interactions, drug discovery, computing, and compalization.. Biomathematical Modeling - optimal treatment policy, pharmacokinetics, and disease dyanmics.. Computer Simualtion - in vivo PKPD, epedimological, and clinical treatment.",
    "shortBody": "I am a Ph.D. student in the Tolkien Project, part of the MAVERICK research group at the Computer Science Department , Bar Ilan University ; Supervised by Prof. Gal A. Kaminka and Dr. Chana Weitman. My research focuses on medical and biological nanoparticles (focusing on nanorobotics). Specifically, modeling a curing protocol based on biophysical interactions of targeted drug delivery nanoparticles in the blood. I am also interested in numerical solving and stabilization of ordinary and partial differential equations (ODE, PDE) systems (especially, ones that originate in a biological setup). Sometimes I am publishing some useful (or just fun) things like open code and technical blog posts . I published a few academic papers in journals, conferences, and abstracts. In between, I am teaching several mathematical classes and working with Bc.S. and Mc.S. students on their final project. I completed my B.Sc. (2016) and M.Sc. (2018) in Applied Mathematics at Bar-Ilan University.",
    "title": "home page",
    "url": "/"
};
docs.push(doc7);


var doc8 = {
    "id": "8",
    "body": "Biomathematics and Nanorobotics",
    "shortBody": "Bar-Ilan University",
    "title": "Teddy Lazebnik PhD. Student at Bar-Ilan University, department of CS.",
    "url": "/research.html"
};
docs.push(doc8);


var doc10 = {
    "id": "10",
    "body": "Sphera is a free open-source website template that will vastly improve the communication between lecturers and students. It will provide lecturers and professors with the tools to easily create a professional personal website that contains their research, courses and personal projects. We will study the user behaivor in personal acadmic websites and how to improve it using machine learning reccomendation system.",
    "shortBody": "Sphera is a free open-source website template that will vastly improve the communication between lecturers and students. It will provide lecturers and professors with the tools to easily create a professional personal website that contains their research, courses and personal projects. We will study",
    "title": " Sphera – A template for personal academic websites",
    "url": "/research.html"
};
docs.push(doc10);


var doc11 = {
    "id": "11",
    "body": "A tempro-spatial mathematical model with computer simulation based in the cloud for pandemic analysis and polices investigation tool",
    "shortBody": "A tempro-spatial mathematical model with computer simulation based in the cloud for pandemic analysis and polices investigation tool",
    "title": "International Crisis Simulator",
    "url": "/research.html"
};
docs.push(doc11);


var doc12 = {
    "id": "12",
    "body": "Improvments to the Rivendell search engine. Including collaborative learning. The development done on C# based dot net core 2 ",
    "shortBody": "Improvments to the Rivendell search engine. Including collaborative learning. The development done on C# based dot net core 2 ",
    "title": "Rivendell v.3 with explicit collaborative learning",
    "url": "/research.html"
};
docs.push(doc12);


var doc13 = {
    "id": "13",
    "body": "Prodcution-ready (C# on dot net core 2) search engine.",
    "shortBody": "Prodcution-ready (C# on dot net core 2) search engine.",
    "title": "Property-Value tagging tool as website",
    "url": "/research.html"
};
docs.push(doc13);


var doc14 = {
    "id": "14",
    "body": "Prodcution-ready (C# on dot net core 2 with Angular 8) SaaS providing for taggers an easy to use Property-Value tagging GUI.",
    "shortBody": "Prodcution-ready (C# on dot net core 2 with Angular 8) SaaS providing for taggers an easy to use Property-Value tagging GUI.",
    "title": "Rivendell v.2 with online learning search engine",
    "url": "/research.html"
};
docs.push(doc14);


var doc15 = {
    "id": "15",
    "body": "Online learning is the future. Students should be able to find quality acadmic resources easly which provided by their lecturers.",
    "shortBody": "Online learning is the future. Students should be able to find quality acadmic resources easly which provided by their lecturers.",
    "title": "courses",
    "url": "/teaching.html"
};
docs.push(doc15);


var doc16 = {
    "id": "16",
    "body": "The purpose of the Advanced Programming course (1,2) is to prepare you for the industry. In particular, the course is structured so that at the end of Advanced Programming 1 you can start looking for a job in a serious way, and you will have the first part of the project with the help of which you can demonstrate to the employer your experience and abilities.",
    "shortBody": "An introduction to programming concepts in C++ and how they are related to what you know from C and Java Advanced topics in C++ programming",
    "title": "Advanced Programming 1 89210",
    "url": "/course-page.html?course_id=89210"
};
docs.push(doc16);


var doc17 = {
    "id": "17",
    "body": "In recent years there has been a major breakthrough in the field of artificial neural networks, especially in deep neural networks (namely, networks with many layers). Deep learning is the term coined for the training of such networks, which have shown superiority over other machine learning algorithms in many applications. Nowadays, deep neural networks provide the best performance in tasks such as, voice recognition, object detection, image classification and content suggestion. These networks gradually take over standard machine learning algorithms and we are at the heart of a new generation, where voice recognition and image recognition are based on them fully. In this course we will explain the mathematics at the core of neural networks models, and provide practical tools for using them. The course focuses mainly on image processing and, consequently, on convolutional neural networks.",
    "shortBody": "An introduction to computer vision concepts, review of ML methods and first steps in DL CNN, code, model development pipeline Students projects",
    "title": "Deep Leanring 21319",
    "url": "/course-page.html?course_id=21319"
};
docs.push(doc17);


var doc18 = {
    "id": "18",
    "body": "This page is made for students of this course. Please feel free to email me any suggestion on how to improve this page for you.",
    "shortBody": "Numerical methods for Interpolation Numerical methods differentiation and integration",
    "title": "Numerical Analysis 88376",
    "url": "/course-page.html?course_id=88376"
};
docs.push(doc18);


var doc19 = {
    "id": "19",
    "body": "This page is made for students of this course. Please feel free to email me any suggestion on how to improve this page for you.",
    "shortBody": "Numerical methods for Interpolation ",
    "title": "Introduction to Linear Mathematical Optimization 88369",
    "url": "/course-page.html?course_id=88369"
};
docs.push(doc19);


var doc20 = {
    "id": "20",
    "body": "This page is made for students of this course. Please feel free to email me any suggestion on how to improve this page for you.",
    "shortBody": "Concepts of numerical analysis and ideas from function theory - main slides Methods to calculate several good propertices of Matrices Methods to extrapolate and interpolate data, FFT, numerical integration and differentiation",
    "title": "Tools for Numerical Analysis  83214",
    "url": "/course-page.html?course_id=83214"
};
docs.push(doc20);

var index = elasticlunr(function () {
    this.addField('title');
    this.addField('body');
    // this.addField('fixed_query');
    this.setRef('id');
});

for (var i = 0; i < docs.length; i++)
{
	index.addDoc(docs[i]);	
}

function searchPage()
{
	// get input from the user
	var queryInput = document.getElementById("search_input").value;
	query = queryInput.toLowerCase().trim();
	var queryInputMobile = document.getElementById("search_input_mobile").value;
	queryMobile = queryInputMobile.toLowerCase().trim();
	
	// search from mobile view, get the text from there and continue
	if (query == "" && queryMobile != "")
	{
		query = queryMobile;
	}
	
	// if empty, show alert and end process
	if (query == "")
	{
		showSearchAlert("Please enter a query in order to search in the website");
		return false;
	}
	
	var results = index.search(query, {
			fields: {
				title: {boost: 2},
				body: {boost: 1}
			}
		});
		
	// if 1 answer - go to this link
	if (results.length == 0)
	{	
		showSearchAlert("We were not able to find any result in the website for your query");
		return false;
	}
	else if (results.length == 1)
	{		
		window.open(docs[parseInt(results[0]["ref"])-1]["url"]);
		return false;
	}
	else // if more then 1 answer - go to the search page and load there again the answers
	{
		window.open("/search.html?" + PARAM_QUERY + "=" + encodeURIComponent(query));
	}
}

function update_search_results()
{
	// load query
	var query = decodeURI(GetParamsLoad(PARAM_QUERY));
	// if not query - forward to the 404 page
	if (query == null)
	{
		window.location.replace("404.html");
	}
	// if we have query
	var results = index.search(query, {
			fields: {
				title: {boost: 2},
				body: {boost: 1}
			}
		});
	// TODO: make sure the results are ordered from best score to worst
	
	// we can assume results >= 1 and show them
	document.getElementById("query").innerHTML = query;
	var resultListHtml = "";
	var scores_norm = 0;
	for (var i = 0; i < results.length; i++)
	{
		scores_norm += parseFloat(results[i]["score"]);
	}
	for (var i = 0; i < results.length; i++)
	{
		var thisDoc = docs[parseInt(results[i]["ref"])-1];
		resultListHtml += buildSearchResultAnswer(i, thisDoc["title"], parseFloat(results[i]["score"]) / scores_norm, thisDoc["shortBody"], thisDoc["url"]);
	}
	
	// set the data in the page
	document.getElementById("search-results").innerHTML = resultListHtml;
}

function GetParamsLoad(param_name) 
{
   return (window.location.search.match(new RegExp('[?&]' + param_name + '=([^&]+)')) || [, null])[1];
}

function buildSearchResultAnswer(index, title, score, short_body, url)
{
	var label = url.replace("/", "").split(".")[0].toUpperCase();
	return '<div class="academic-papers-panel"><div class="personal-row-col col-reverse-mobile w-100 align-space-between"><h3>'	+ title + '</h3></div><h4>' + short_body + '</h4><p class="search-date">Fitting ' + Math.round(score * 100) + '% to query</p><div class="personal-row space-between-search align-items-center mobile-row-breaker"><div class="search-parms-row"><span class="search-label">' + label + '</span></div><a href="' + url + '" class="secondary-btn">See this page</a></div></div>';
}

// show an alert as a result of searching something in the search field
function showSearchAlert(alertText)
{
	// log events
	console.log("Write search alert with the text: " + alertText);	
	// show alert
	var alertDiv = document.getElementById("search-close-btn").parentElement;
	document.getElementById("search-alert").innerHTML = alertText;
	alertDiv.style.opacity = "1";
	setTimeout(function(){ alertDiv.style.opacity = "0"; }, 2500);
}

/* add event for 'ENTER' hit in field search */

var desktopInput = document.getElementById("search_input");
desktopInput.onkeyup = function(e)
{
    if(e.keyCode == 13)
	{
       searchPage();
    }
}
var mobileInput = document.getElementById("search_input_mobile");
mobileInput.onkeyup = function(e)
{
    if(e.keyCode == 13)
	{
       searchPage();
    }
}

/* end - add event for 'ENTER' hit in field search */