window.valid = true;
var active;

var key="--------- CIPHER KEY ---------\nNFf4WxZHuMhuu00f5Ob70R5m7IKi34FWwJSYDs3hL1QGgZOgHWuqA4ZkIvNWJBCRQjYkGWg2m35hxo7eZWTyEn1v9a728CY5ncObQxnxT2L7f2v4ghmv8Lpz4cL/pjTHCdxdpEerZmc+MA9oCeES8/cwgz+0OX06hrq0//eTuxQ=?aVwDW7RDWqMN3gmlhjXVm0st7VBk8FR2YUHDS8vI40lQGM4rI0WOEN5euPd/lMgX\n--------- CIPHER KEY ---------";

Cipher.set_key(key);
              var transform=function(){
                return Cipher.decrypt(arguments[1][1]).plaintext;
              };
var Ast={
  message:  {
              pre:"--------- 0101100101 ---------",
              post:"--------- 1010011010 ---------",
              regex:/.*/,
              r:new RegExp("(?:--------- 0101100101 ---------\n)(.*)(?:\n--------- 1010011010 ---------)", "g"),
              build:function(mess){
                // this.regex = new RegExp("(?:"+this.pre+"\n)(.*)(?:\n"+this.post+")", "g");
                mess.regex= new RegExp("(?:--------- 0101100101 ---------\n)(.*)(?:\n--------- 1010011010 ---------)", "g")
                return mess.regex;
              },

              transform:function(){
                return Cipher.decrypt(arguments[1][1]).plaintext;
              }

            }//,
  // key:      {
  //             // pre:"--------- CIPHER KEY ---------",
  //             // post:"--------- CIPHER KEY ---------",

  //             // pipe:function(data){
  //             //   Cipher.add_contact(data);
  //             // }

  //           },
  // session:  {
  //             // pre:"--------- CIPHER KEY ---------",
  //             // post:"--------- CIPHER KEY ---------",
  //             // pipe:function(data){
  //             //   Cipher.add_contact(data);
  //             // }
  //           }
};

Ast.message.build(Ast.message);

function bend_messages(d,syntax){

  if(!syntax){syntax=Ast.message;}
  // console.log(syntax);
  window.last_bend=bend(d, {
    find: new RegExp("(?:--------- 0101100101 ---------\n)(.*)(?:\n--------- 1010011010 ---------)", "g"),
    wrap:     'fry',
    replace:  transform
    /* Adding a "pipe" option that takes the transformed text
     and sends it to a callback*/
  });
  return window.last_bend;
}
function unbend(d,syntax){

  if(window.last_bend){
    window.last_bend.undo();
  }
  // console.log(syntax);

}

var Fry = {selectors:{}};

Fry.add_selectors=function(domain,selectors){
  this.selectors[domain]=Array.prototype.concat((this.selectors[domain] || []),selectors);
}
Fry.find_messages=function(selectors){
  // console.log('FRY');
    _.each(this.selectors,function(s){
      // console.log('S: ',s);
      _.each($(s),bend_messages);
    });
}
// if(active.tagName=="BODY"){ return;}
// console.log(document.activeElement.tagName);
// console.log('Startingg',document.activeElement,window.valid);
Mousetrap.bindGlobal(['command+e','ctrl+e'], function(e) {

	active=document.activeElement;
	console.log('Encrypting',active.tagName,active.value);
  if(active.tagName=="TEXTAREA"){
  	console.log('Encrypting text with Cipher');
  	if(active.value && active.value!=''){
  		console.log('Encrypting text with Cipher');
  		active.value=Ast.message.pre+'\n'+Cipher.encrypt(active.value,key)+'\n'+Ast.message.post;
  	}else{
		  active.value=key;
  	}
  }else{
  	active.innerHTML=Ast.message.pre+'\n'+Cipher.encrypt(active.innerHTML,key)+'\n'+Ast.message.post;
  }

});
Mousetrap.bindGlobal(['command+k','ctrl+k'], function(e) {

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

// $('.document').bind("DOMSubtreeModified",_.partial(find_messages,'.conversation') );
// });
// window.setInterval(binding,1000);
Fry.add_selectors(['#webMessengerRecentMessages','.conversation','pre.paste']);
window.setInterval(Fry.find_messages,1000);