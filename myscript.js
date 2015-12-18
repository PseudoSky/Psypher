window.valid = true;
var active;

var key="--------- CIPHER KEY ---------\nNFf4WxZHuMhuu00f5Ob70R5m7IKi34FWwJSYDs3hL1QGgZOgHWuqA4ZkIvNWJBCRQjYkGWg2m35hxo7eZWTyEn1v9a728CY5ncObQxnxT2L7f2v4ghmv8Lpz4cL/pjTHCdxdpEerZmc+MA9oCeES8/cwgz+0OX06hrq0//eTuxQ=?aVwDW7RDWqMN3gmlhjXVm0st7VBk8FR2YUHDS8vI40lQGM4rI0WOEN5euPd/lMgX\n--------- CIPHER KEY ---------";

Cipher.set_key(key);
var transform=function(){
  console.log('Trans',_.stripTags(arguments[1][1]),arguments[1][1]);
  return Cipher.decrypt(arguments[1][1]).plaintext;
};
var discover=function(){

  return User.discover(arguments[1][1]);
};
var Ast={
  message:  {
              pre:"--------- 0101100101 ---------",
              post:"--------- 1010011010 ---------",
              regex:/.*/,
              r:new RegExp("(?:--------- 0101100101 ---------[\n|\<br\>])(.*)(?:\n--------- 1010011010 ---------)", "g"),
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

function Bender(){};

Bender.bend_messages=function(d,syntax){

  // if(!syntax){syntax=Ast.message;}
  // console.log(syntax);
  window.last_bend=bend(d, {
    find: new RegExp("(?:--------- 0101100101 ---------\n)(.*)(?:\n--------- 1010011010 ---------)", "g"),
    wrap:     'fry',
    replace:  transform
    /* Adding a "pipe" option that takes the transformed text
     and sends it to a callback*/
  });
  bend(d, {
    find: new RegExp("(?:--------- EPHEMERAL KEY ElGamal ---------\n)(.*)(?:\n--------- EPHEMERAL KEY ElGamal ---------)", "g"),
    wrap:     'fry-u',
    replace:  discover
    /* Adding a "pipe" option that takes the transformed text
     and sends it to a callback*/
  });
  return window.last_bend;
}
Bender.unbend=function(d,syntax){

  if(window.last_bend){
    window.last_bend.undo();
  }
  // console.log(syntax);

}

function Fry(selectors){
  this.selectors=selectors || [];
}

Fry.add_selectors=function(selectors){
  // this.selectors[domain]=Array.prototype.concat((this.selectors[domain] || []),selectors);
  Psypher.selectors=Array.prototype.concat((Psypher.selectors || []),selectors);
}
Fry.find_messages=function(selectors){
  // console.log('FRY');
  Psypher.frying=true;
  console.log("frying");
  _.each(Psypher.selectors,function(s){
    // console.log('S: ',s);
    _.each($(s),Bender.bend_messages);
  });
  // _.debounce(Fry.find_messages,1000);
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
		  active.value=Psypher.owner.format_key();
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
  		active.value=Psypher.owner.format_key();
  	}else{
		  active.value=Psypher.owner.format_key();
  	}
  }else{
  	active.innerHTML=Psypher.owner.format_key();
  }
 });

Mousetrap.bindGlobal(['command+b','ctrl+b'], function(e) {
  var exists = document.getElementsByClassName("scrubbing-speed-wrapper");
  console.log(exists);
  if(exists.length == 0) {
    active=document.activeElement;
    parent=document.activeElement.parentNode;
    console.log('Inserting Scrubber', active.tagName,active.value);
    var wrapper = active.getBoundingClientRect();

    var plc = document.createElement("div");
    plc.setAttribute("id", "eph-placehold");
    plc.style.width="100%";

    parent.insertBefore(plc,document.activeElement)
    wrapper=document.getElementById('eph-placehold').getBoundingClientRect();
    // document.insertBefore(plhold,active);
    var datepicker = document.createElement("div");
    datepicker.setAttribute("class", "datepicker");

    var contain = document.createElement("div");
    contain.id='ephemeral'
    contain.setAttribute("class", "contain");

    var scrubberWrapper = document.createElement("div");
    scrubberWrapper.setAttribute("class", "scrubbing-speed-wrapper ss-wrapper");



    var time = document.createElement("p");
    time.setAttribute("class", "ss-label");
    time.setAttribute("id", "timeElement");

    var scrubberSlider = document.createElement("div");
    scrubberSlider.setAttribute("class", "scrubbing-speed-slider ss-slider");
    scrubberSlider.setAttribute("data-ss-name", "my-slider");
    scrubberSlider.setAttribute("data-ss-min", "1");
    scrubberSlider.setAttribute("data-ss-max", "120");
    scrubberSlider.setAttribute("data-ss-color-fill", "#961A1A");
    scrubberSlider.setAttribute("data-ss-color-empty", "#666");
    datepicker.style.left=(wrapper.left-10)+"px";
    // datepicker.style.right=(wrapper.right)+"px";
    datepicker.style.top=(wrapper.top)+"px";
    // datepicker.style.width=(wrapper.width)+"px";
    datepicker.style.width=wrapper.width+"px";
    contain.style.padding="20px 10px 10px 10px";

    datepicker.appendChild(contain);
    document.body.appendChild(datepicker);


    contain=document.getElementById('ephemeral');
    header=document.createElement('div');
    header.innerHTML="<div class=\"eph-title center\">Session Options<br><p>Expire in</p></div><br>"
    contain.appendChild(header);
    scrubberSlider.style.width=(contain.getBoundingClientRect().width-20)+"px";
    scrubberWrapper.appendChild(scrubberSlider);
    contain.appendChild(time);
    contain.appendChild(scrubberSlider);
    // console.log('Wrapper, cont',active,parent,wrapper,contain.getBoundingClientRect());


    // datepicker.style.left = (wrapper.left+10)+"px";
    // datepicker.style.top = wrapper.top - 50+"px";
    //active.parentNode.parentNode.insertBefore(datepicker, active.parentNode);

    // document.activeElement.parentNode.insertBefore(datepicker,document.activeElement)

    ScrubbingSpeed.init('my-slider', function(args){

        var day = Math.round(args.current/12);
        var hour = Math.round(args.current%12);
        var today=new Date();
        Psypher.new_session=new Date(today.getFullYear(),today.getMonth(),today.getDate()+day,today.getHours()+hour);
        $('#timeElement').html("<div class=\"left\">"+((day==0) ? "" :(day+ "d "))+"</div><div class=\"right\">"+((hour==0) ? "" :(hour+ "h "))+"</div></div>");
        // console.log(args.min);          //maps to data-ss-min set in DOM
        // console.log(args.current);      //maps to current value between min and max
        // console.log(args.max);          //maps to data-ss-max set in DOM
        // console.log(args.speed);        //returns the speed
        // console.log(args.percentX);     //returns percentX of knob within track
        // console.log(args.percentY);     //returns percentY from origPos.y click/touch
      },
      [{ speed: .5, label: 'Day' }, { speed: .2, label: 'Hour' }]
    );

  }


});

// $('.document').bind("DOMSubtreeModified",_.partial(find_messages,'.conversation') );
// });
// window.setInterval(binding,1000);
// window.fry_inst=new Fry(['#webMessengerRecentMessages','.conversation','pre.paste','push-pages']);
Psypher.selectors=['#webMessengerRecentMessages','.conversation','pre.paste','push-pages'];
Fry.add_selectors(Psypher.selectors);
Fry.add_selectors(['#webMessengerRecentMessages','.conversation','pre.paste','push-pages']);
console.log(Fry.selectors);
_.defer(Fry.find_messages);
window.setInterval(Fry.find_messages,1000);