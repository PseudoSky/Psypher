
// Global Bind
(function(a){var c={},d=a.prototype.stopCallback;a.prototype.stopCallback=function(e,b,a,f){return this.paused?!0:c[a]||c[f]?!1:d.call(this,e,b,a)};a.prototype.bindGlobal=function(a,b,d){this.bind(a,b,d);if(a instanceof Array)for(b=0;b<a.length;b++)c[a[b]]=!0;else c[a]=!0};a.init()})(Mousetrap);

// Bind Dictionary
(function(b){var c=b.prototype.bind,a;b.prototype.bind=function(){a=arguments;if("string"==typeof a[0]||a[0]instanceof Array)return c.call(this,a[0],a[1],a[2]);for(var b in a[0])a[0].hasOwnProperty(b)&&c.call(this,b,a[0][b],a[1])};b.init()})(Mousetrap);


window.valid = true;
var active;

var key="-------------- CIPHER KEY --------------\nNFf4WxZHuMhuu00f5Ob70R5m7IKi34FWwJSYDs3hL1QGgZOgHWuqA4ZkIvNWJBCRQjYkGWg2m35hxo7eZWTyEn1v9a728CY5ncObQxnxT2L7f2v4ghmv8Lpz4cL/pjTHCdxdpEerZmc+MA9oCeES8/cwgz+0OX06hrq0//eTuxQ=?aVwDW7RDWqMN3gmlhjXVm0st7VBk8FR2YUHDS8vI40lQGM4rI0WOEN5euPd/lMgX\n-------------- END CIPHER KEY --------------";

Cipher.set_key(key);
              var transform=function(){
                return Cipher.decrypt(arguments[1][1]).plaintext;
              };
var Ast={
  message:  {
              pre:"0101100101",
              post:"1010011010",
              regex:/.*/,
              r:new RegExp("(?:0101100101\n)(.*)(?:\n1010011010)", "g"),
              build:function(mess){
                // this.regex = new RegExp("(?:"+this.pre+"\n)(.*)(?:\n"+this.post+")", "g");
                mess.regex=new RegExp("(?:0101100101\n)(.*)(?:\n1010011010)", "g")
                return mess.regex;
              },

              transform:function(){
                return Cipher.decrypt(arguments[1][1]).plaintext;
              }

            }//,
  // key:      {
  //             // pre:"-------------- CIPHER KEY --------------",
  //             // post:"-------------- END CIPHER KEY --------------",

  //             // pipe:function(data){
  //             //   Cipher.add_contact(data);
  //             // }

  //           },
  // session:  {
  //             // pre:"-------------- CIPHER KEY --------------",
  //             // post:"-------------- END CIPHER KEY --------------",
  //             // pipe:function(data){
  //             //   Cipher.add_contact(data);
  //             // }
  //           }
};
Ast.message.build(Ast.message);

function bend_messages(d,syntax){

  if(!syntax){syntax=Ast.message;}
  console.log(syntax);
  bend(d, {
    find: new RegExp("(?:0101100101\n)(.*)(?:\n1010011010)", "g"),
    wrap:     'fry',
    replace:  transform
    /* Adding a "pipe" option that takes the transformed text
     and sends it to a callback*/
  });
}
function fry_messages(selectors){
  // console.log('FRY');
    _.each(selectors,function(s){
      // console.log('S: ',s);
      _.each($(s),bend_messages);
    });
}
// if(active.tagName=="BODY"){ return;}
console.log(document.activeElement.tagName);
console.log('Startingg',document.activeElement,window.valid);
Mousetrap.bindGlobal(['command+e','ctrl+e'], function(e) {

	active=document.activeElement;
	console.log('Encrypting',active.tagName,active.value);
  if(active.tagName=="TEXTAREA"){
  	console.log('Encrypting text with Cipher');
  	if(active.value && active.value!=''){
  		console.log('Encrypting text with Cipher');
  		active.value=prefix+Cipher.encrypt(active.value,key)+postfix;
  	}else{
		  active.value=key;
  	}
  }else{
  	active.innerHTML=Cipher.encrypt(active.innerHTML,key);
  }

});
Mousetrap.bindGlobal(['command+b','ctrl+b'], function(e) {

	active=document.activeElement;
	console.log('Key Exchanging',active.tagName,active.value);
  if(active.tagName=="TEXTAREA"){
  	console.log('Exchanging Cipher Key');
  	if(active.value && active.value!=''){
  		console.log('Exchanging Cipher Key');
  		active.value=key;
  	}else{
		  active.value=key;
  	}
  }else{
  	active.innerHTML=key;
  }
 });

// $('.document').bind("DOMSubtreeModified",_.partial(fry_messages,'.conversation') );
// });
// window.setInterval(binding,1000);

window.setInterval(_.partial(fry_messages,['#webMessengerRecentMessages','.conversation']),1000);