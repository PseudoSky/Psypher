var window={};
var navigator={appName:""};
var CryptoJS=require("../../lib/cryptojs.min.js");
var cryptico=require("../../lib/cryptico.js").cryptico;
var Cipher=require("../../cipher.js")(cryptico);
console.log(Cipher);

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
            }
        };

