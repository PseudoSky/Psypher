var Cipher={};
window.Cipher=Cipher;
var key,iv,algo;

Cipher.set_algo = function(name){
  if (Cipher.algo && Cipher.algo.name==name){
    console.log('Same encryption: '+name);
    return -1;
  }
  if(name===undefined || name=="" || (name != "RSA"&&!CryptoJS.hasOwnProperty(name)) ){
    console.log('No algorithm with the name: '+name);
    return -1;
  }
  else if(name == "RSA"){
    Cipher.algo=cryptico;
  }
  else if(CryptoJS.hasOwnProperty(name)){
    Cipher.algo=CryptoJS[name];
  }

  Cipher.algo.name=name;
  console.log('New algorithm Selected: '+name);
};

// Set default algorithm to RSA
Cipher.set_algo("RSA");


Cipher.set_key= function(k,bits){
  if(!bits){
    bits=1024;
  }
  if (k !== undefined && k!=="") {
    Cipher.key = k;
    console.log(Cipher.algo);
    if(Cipher.algo.name=="RSA"){
      Cipher.key=Cipher.algo.generateRSAKey(k, bits);
      Cipher.algo.private_key=Cipher.key;

      Cipher.algo.public_key=Cipher.algo.publicKeyString(Cipher.algo.private_key);
      Cipher.key=Cipher.algo.public_key;
      // Cipher.algo.piblic_key_id=Cipher.algo.publicKeyID(Cipher.algo.public_key);
      console.log(Cipher.algo);
    }

  }
  else{
    console.log('Key undefined or blank: '+k);
  }

  // Other version, used in the example
  // Cipher.key = CryptoJS.enc.Utf8.parse(k);
};

Cipher.set_iv= function(v){

  Cipher.iv  = CryptoJS.enc.Hex.parse(v);
};


// Cipher.$get = [function(){
//     return {
//         algo: Cipher.algo,
//         key: Cipher.key,
//         iv: Cipher.iv,

//         set_key: Cipher.set_key,
//         set_iv: Cipher.set_iv,

Cipher.encrypt=function(message, k) {
  console.log("Key: "+k);
  console.log("Message: "+message);
    if (k !== undefined) {
      Cipher.set_key(k);
    }
    if(Cipher.key ===undefined && Cipher.algo.public_key===undefined){console.log('No keys defined, cant encrypt');}
    k = Cipher.key||Cipher.algo.public_key;

    if(Cipher.algo.name=="RSA"){
      // console.log('Message: '+message,"Key: "+Cipher.algo.public_key, Cipher.algo.encrypt(message, Cipher.algo.publicKeyString(Cipher.algo.private_key) ));
      console.log(message,Cipher.algo.public_key);
      return Cipher.algo.encrypt(message, Cipher.algo.public_key)['cipher'];
    }else{

      console.log('Message: '+message,"Key: "+key,"IV: "+Cipher.iv);
      return Cipher.algo.encrypt(message, k, {iv: Cipher.iv} ).toString();
    }
};

Cipher.decrypt= function(message, k) {
    if (k === undefined) {
        k = Cipher.key||Cipher.algo.private_key;
    }
    if(_.isObject(message) && _.hasKey(message,"cipher")){
      message=message.cipher;
    }
    console.log('Key',Cipher.algo.private_key);

    if(Cipher.algo.name=="RSA"){

      return Cipher.algo.decrypt(message, Cipher.algo.private_key);
    }
    return Cipher.algo.decrypt(message, k, {iv: Cipher.iv}).toString(CryptoJS.enc.Utf8);
};
