var db=new Dexie("Psypher");



db.version(1).stores({sessions: "++id,foreign_key,pub_key"});
db.open();
db.sessions.add({foreign_key:Bob.username,pubkey:Bob.keys.pub.serialize()})


/*
var Bob = new User('Bob');
var Alice = new User('Alice');
Bob.send_key(Alice);
Alice.send_key(Bob);
Bob.send_message(Alice, "I wonder if Eve can hear us");
Alice.send_message(Bob, "I hope not, I hate Eve!");
*/

function User(){
	this.serialize = function(username,key_pair)
	  this.username = username;

	  /* If no existing keys generate them */
	  if(!key_pair){
	    this.keys = sjcl.ecc.elGamal.generateKeys(521,10);
	  }else{
	    this.keys = key_pair
	  }

	  /* Stores Username -> Pub Key */
	  this.session_keys = {};

  }
  /* Publicly Transfer The Users DH public key to the recipient */
  this.send_key = function(current_user, user_recipient){
    user_recipient.add_key(this.keys.pub, this.username);
  }

  /* Recieve the sender's DH public key and store it */
  this.add_key = function(current_user, key,username){
    this.session_keys[username] = key;
  }

  /*
    Computes the DH shared key from User's sec (secret key)
    and the recipientes pre shared pub key
  */
  this.shared_key = function(current_user, user_contact){
    return this.keys.sec.dh(this.session_keys[username])
  }

  /* Assume the user has the recipients username & key */
  this.send_message = function(current_user, user_recipient, clear_text){
    var shared_key = this.shared_key(user_recipient.username);

    /* Encrypt the clear_text message using the shared session key */
    return sjcl.encrypt(shared_key, clear_text);
  }

  /*
     Gets the user's shared key using their username
     Decrypts the text using that key
  */
  this.read_message = function(current_user, user_sender, plain_text){
    var shared_key = this.shared_key(username)
    return sjcl.decrypt(shared_key,plain_text);
  }
}

User.prototype.send_key = function(user_recipient){
  user_recipient.add_key(this.keys.pub, this.username);
}

/* Recieve the sender's DH public key and store it */
User.prototype.add_key = function(key,username){
  this.session_keys[username] = key;
}

/*
  Computes the DH shared key from User's sec (secret key)
  and the recipientes pre shared pub key
*/
User.prototype.shared_key = function(username){
  return this.keys.sec.dh(this.session_keys[username])
}

/* Assume the user has the recipients username & key */
User.prototype.send_message = function(user_recipient, clear_text){
  var shared_key = this.shared_key(user_recipient.username);

  /* Encrypt the clear_text message using the shared session key */
  return sjcl.encrypt(shared_key, clear_text);
}

/*
   Gets the user's shared key using their username
   Decrypts the text using that key
*/
User.prototype.read_message = function(plain_text, username){
  var shared_key = this.shared_key(username)
  return sjcl.decrypt(shared_key,plain_text);
}

if(typeof module !== "undefined"){
  module.exports=User;
}
if(typeof window !=="undefined" ){
  // console.log('Window Und',root);
  window.User=User;
}




function Session(){
	var session_fields=['++id','user_id','foreign_key','[user_id+foreign_key]','pub_key','date_created','duration']
	this.initialize = function(db){

		db.version(1).stores({sessions: session_fields.join(',')});
		db.open();
	}
	this.build = function(opts){
		this.session_id   = _.uniqueId();
		this.date_created = Date.today();
		this.duration = new Date(exp_date);
		this.user_id = user_id;
	}

	this.serialize = function(obj_from_db){

	}
}

Session.prototype.user = function(){return User.find({user_id:this.user_id})}