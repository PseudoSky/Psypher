
function Cipher(cryptico){
  var C={};

  // window.Cipher=C;
  var key,iv,algo;

  C.set_algo = function(name){
    if (C.algo && C.algo.name==name){
      console.log('Same encryption: '+name);
      return -1;
    }
    if(name===undefined || name=="" || (name != "RSA"&&!CryptoJS.hasOwnProperty(name)) ){
      console.log('No algorithm with the name: '+name);
      return -1;
    }
    else if(name == "RSA"){
      C.algo=cryptico;
    }
    else if(CryptoJS.hasOwnProperty(name)){
      C.algo=CryptoJS[name];
    }

    C.algo.name=name;
    // console.log('New algorithm Selected: '+name);
  };

  // Set default algorithm to RSA
  C.set_algo("RSA");


  C.set_key= function(k,bits){
    if(!bits){
      bits=1024;
    }
    if (k !== undefined && k!=="") {
      C.key = k;
      // console.log(C.algo);
      if(C.algo.name=="RSA"){
        // console.log('C',C.algo.generateRSAKey);
        C.key=C.algo.generateRSAKey(k, bits);
        C.algo.private_key=C.key;

        C.algo.public_key=C.algo.publicKeyString(C.algo.private_key);
        C.key=C.algo.public_key;
        // C.algo.piblic_key_id=C.algo.publicKeyID(C.algo.public_key);
        // console.log(C.algo);
      }

    }
    else{
      console.log('Key undefined or blank: '+k);
    }

    // Other version, used in the example
    // C.key = CryptoJS.enc.Utf8.parse(k);
  };

  C.set_iv= function(v){

    C.iv  = CryptoJS.enc.Hex.parse(v);
  };


  // C.$get = [function(){
  //     return {
  //         algo: C.algo,
  //         key: C.key,
  //         iv: C.iv,

  //         set_key: C.set_key,
  //         set_iv: C.set_iv,

  C.encrypt=function(message, k) {
    // console.log("Key: "+k);
    // console.log("Message: "+message);
      if (k !== undefined) {
        C.set_key(k);
      }
      if(C.key ===undefined && C.algo.public_key===undefined){console.log('No keys defined, cant encrypt');}
      k = C.key||C.algo.public_key;

      if(C.algo.name=="RSA"){
        // console.log('Message: '+message,"Key: "+C.algo.public_key, C.algo.encrypt(message, C.algo.publicKeyString(C.algo.private_key) ));
        // console.log(message,C.algo.public_key);
        return C.algo.encrypt(message, C.algo.public_key)['cipher'];
      }else{

        console.log('Message: '+message,"Key: "+key,"IV: "+C.iv);
        return C.algo.encrypt(message, k, {iv: C.iv} ).toString();
      }
  };

  C.decrypt= function(message, k) {
      if (k === undefined) {
          k = C.key||C.algo.private_key;
      }
      if(_.isObject(message) && _.hasKey(message,"C")){
        message=message.C;
      }
      // console.log('Key',C.algo.private_key);

      if(C.algo.name=="RSA"){

        return C.algo.decrypt(message, C.algo.private_key);
      }
      return C.algo.decrypt(message, k, {iv: C.iv}).toString(CryptoJS.enc.Utf8);
  };
  return C;
}
if(typeof module !== "undefined"){
  module.exports=Cipher;
}
if(typeof window !=="undefined" ){
  // console.log('Window Und',root);
  window.Cipher=Cipher(cryptico);
}