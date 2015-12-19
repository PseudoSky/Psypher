// var console.log = (...args) => args.forEach( a => console.log(a) );



var Domain = Dexie.defineClass({
    name: String,
    tags: [String]
});

Domain.initialize = () => "&name,tags";

/* This needs to add to the domain table */
Domain.add_new_tag=function(e){
    return {name: window.location.origin, tags:[e.parentNode.tagName+"."+e.classList.join('.')]};
}


/*
var Bob = new User('Bob');
var Alice = new User('Alice');
Bob.send_key(Alice);
Alice.send_key(Bob);
Bob.send_message(Alice, "I wonder if Eve can hear us");
Alice.send_message(Bob, "I hope not, I hate Eve!");
*/

/********************           ********************/
/********************   User    ********************/
/********************           ********************/

function key_const(k){
        console.log('Generating User',k,this,arguments);
        this.pub_key && (this.pub_key=sjcl.ecc.deserialize(this.pub_key));
        this.sec_key && (this.sec_key=sjcl.ecc.deserialize(this.sec_key));
};
function Key(k){
        console.log('Generating User',k,this,arguments);
        this.pub_key && (this.pub_key=sjcl.ecc.deserialize(this.pub_key));
        this.sec_key && (this.sec_key=sjcl.ecc.deserialize(this.sec_key));
}


function User(user){
    console.log('Generating User',this,arguments);
    this.pub_key && (this.pub_key=sjcl.ecc.deserialize(this.pub_key));
    this.sec_key && (this.sec_key=sjcl.ecc.deserialize(this.sec_key));
    console.log(this);
};


User.user_fields=[
    '++uid',
    'username',
    'foreign_key',
    'pub_key',
    'sec_key',
    'is_owner',
    'sessions',
    'date_created'
]

User.table = () => Psypher.db.table('User');
User.schema = () => User.user_fields.join(',');
User.set_owner = () => Psypher.users.filter(_.matches({is_owner:true}))
                                    .limit(1)
                                    .toArray()
                                    .then((c) => (
                                        (c.length>0) ? (Psypher.owner=c[0]) : User.create_owner()
                                    ));

User.create_owner=function(){
    (!Psypher.db.isOpen() && Psypher.store.open())
    Psypher.users.add(User.create({is_owner:true})).then(User.set_owner());
    return true;
}

User.prototype.log = function () {
    console.log(JSON.stringify(this));
}

User.prototype.serialize = function(username,key_pair){
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

User.create = function(opts){
    var user = {};
    var keys = sjcl.ecc.elGamal.generateKeys(521,10);
    user.pub_key = keys.pub.serialize();
    user.sec_key = keys.sec.serialize();
    user.username="Snow";
    user.date_created = new Date();
    user.foreign_key=_.uniqueId('psyfa');
    _.extend(user,opts);
    console.log("Create",user,keys);
    console.log('Extended',user);
    return user;
}

/* Publicly Transfer The Users DH public key to the recipient */
User.send_key = function(current_user, user_recipient){
  user_recipient.add_key(this.keys.pub, this.username);
}

/* Recieve the sender's DH public key and store it */
User.add_key = function(current_user, key,username){
  this.session_keys[username] = key;
}

/*
  Computes the DH shared key from User's sec (secret key)
  and the recipientes pre shared pub key
*/
User.shared_key = function(current_user, user_contact){
  return this.keys.sec.dh(this.session_keys[username])
}

/* Assume the user has the recipients username & key */
User.send_message = function(current_user, user_recipient, clear_text){
  var shared_key = this.shared_key(user_recipient.username);

  /* Encrypt the clear_text message using the shared session key */
  return sjcl.encrypt(shared_key, clear_text);
}

/*
   Gets the user's shared key using their username
   Decrypts the text using that key
*/
User.read_message = function(current_user, user_sender, plain_text){
  var shared_key = this.shared_key(username)

  return sjcl.decrypt(shared_key,plain_text);
}
User.prototype.format_key=function(key){
    key=_.extend(this.pub_key, {username:this.username});
    _.isArray(this.sessions) && (key=_.extend(key,{expires_on:this.sessions[0].expires_on}));
    return "--------- EPHEMERAL KEY ElGamal ---------\n"+JSON.stringify(key)+"\n--------- EPHEMERAL KEY ElGamal ---------";
}


User.prototype.send_key = function(){
  // user_recipient.add_key(this.keys.pub, this.username);
  return this.format_key();
}

User.discover = function(text){
    try{
        text=JSON.parse(text);
    }catch(d){
        alert("Key Parsing Failed");
    }
    if(_.has(text,'username')){
        // this.add_key(text);
        console.log('Couldnt add key',text);
    };
    return "Discovered Session Key For User: "+text.username;
  // this.session_keys[username] = key;
}

/* Recieve the sender's DH public key and store it */
User.prototype.discover = function(text){
    try{
        text=JSON.parse(text);
    }catch(d){
        alert("Key Parsing Failed");
    }
    if(_.has(text,'username')){
        this.add_key(text);
    };
    return "Discovered Session Key For User: "+text.username;
  // this.session_keys[username] = key;
}

/* Recieve the sender's DH public key and store it */
User.prototype.add_key = function(key){
    if(!_.isArray(this.sessions))this.sessions=[];
    this.sessions.push(Session.new(key));
}

/* Recieve the sender's DH public key and store it */
User.prototype.add_session = function(opts){
    if(!_.isArray(this.sessions))this.sessions=[];
    this.sessions.push(Session.new({expires_on:opts}));
}

/*
  Computes the DH shared key from User's sec (secret key)
  and the recipientes pre shared pub key
*/
User.prototype.shared_key = function(){
  return this.pub_key;
  // return this.keys.sec.dh(this.session_keys[username])
}



/* Assume the user has the recipients username & key */
// User.prototype.send_message = function(clear_text){
//   // var shared_key = this.shared_key();
//     try{
//         text=JSON.parse(clear_text);
//         console.log('not json',text);
//         return "Expired Session";
//     }catch(d){
//         console.log('not json');
//         return "Expired Session";
//     // alert("Key Parsing Failed");
//     }
//   var shared_key = this.pub_key;

//   /* Encrypt the clear_text message using the shared session key */
//   return sjcl.encrypt(shared_key, clear_text);
// }

/*
   Gets the user's shared key using their username
   Decrypts the text using that key
*/
User.prototype.read_message = function(plain_text, username){
  // var shared_key = this.shared_key(username);
  var shared_key=this.pub_key;
  return sjcl.decrypt(shared_key,plain_text);
}


User.remove_where = function(user_filter){
    Psypher.users.filter(_.matches(user_filter))
        .delete()
        .then(function (deleteCount) {
            console.log( "Deleted " + deleteCount + " objects");
        });
}


if(typeof module !== "undefined"){
  module.exports=User;
}
if(typeof window !=="undefined" ){
  // console.log('Window Und',root);
  window.User=User;
}




var Session={
    session_fields:[
        '++id',
        'uid',
        'username',
        '[uid+username]',
        'pub_key',
        'date_created',
        'expires_on'
    ],

    table: function(){
        return Psypher.db.table('Session');
    },

    build: function(opts){
        this.session_id   = _.uniqueId();
        this.date_created = new Date();
        opts && opts.exp_date && (this.expires_on = new Date(exp_date));
        this.uid = (opts && opts.uid) || _.uniqueId('session');
        return this;
    },
    new: function(opts){
        // this.session_id   = _.uniqueId();
        this.date_created = new Date();
        opts && opts.expires_on && (this.expires_on=opts.expires_on);
        // opts && opts.expires_on && (this.expires_on = new Date(opts.expires_on));
        this.uid = (opts && opts.uid) || _.uniqueId('session');
        return this;
    },

    serialize: function(obj_from_db){
    }

}
Session.initialize= function(){
    return Session.session_fields.join(',');
}

Session.user = function(){return Psypher.db.User.where({uid:this.uid})}





// var u_c = Dexie.defineClass({   id:Number,
//                                 username:String,
//                                 foreign_key: String,
//                                 pub_key:Object,
//                                 sec_key:Object,
//                                 is_owner:Boolean,
//                                 sessions:[Session],
//                                 date_created:Date
//                             });



/********************           ********************/
/********************   Store   ********************/
/********************           ********************/
function Store(){
    this.attempts=0;

    var check_tables = function(){
        Psypher.db.open().then(function(){

            // this.table_count=Psypher.db.tables.length;
            // Psypher.db.close().then(function(){
            console.log('Tblc',this.table_count);
            return (this.table_count<2);
            // });
        })
    }
    this.schema={
                "Session":Session.initialize(),
                "User":User.schema(),
                "Domain":Domain.initialize()
            };
};

/* Still needs testing for automatic db drop */
Store.v=4;

Store.schema={
                "Session":Session.initialize(),
                "User":User.schema(),
                "Domain":Domain.initialize()
            };

Store.prototype.close = function(cb){
    console.log('Closing DB');
    if(Psypher.db.isOpen()){
        Psypher.db.close().then(cb).catch(
            function (error) {
                console.log('Error during database close',error);
            });
    }
    else (console.log('No database open, friviless close() op') && cb());

}

Store.setup = function(){
    if(this.attempts>2)throw "DB Setup Not Functioning Properly";
    var self=this;
    console.log('Psypher Setup Start');

    /* If db is in existence delete it*/
    _.has(Psypher,'db') && Psypher.db.delete();

    Psypher.db=new Dexie("Psypher");
    try{
        Psypher.db.version(Store.v).stores(Store.schema)
    }catch(e){
        this.attempts+=1;
        return Store.setup()
    }


    Psypher.db.open().then(function(){
        console.log('Database Successfully Opened');
        Psypher.store.initialize();
    }).catch(function (error) {
        console.log('Database failed in setup on open',error);
    });


    this.attempts+=1;

}

Store.prototype.initialize = function(){

    console.log('Initializing');
    if(!Psypher.db._allTables['User']) return this.close(Store.setup);
    else console.log("User Table Exists");
    Psypher.users=Psypher.db.User;
    Psypher.sessions=Psypher.db.Session;

    Psypher.users.mapToClass( User ,{
                                    id:Number,
                                    username:String,
                                    pub_key:Key,//sjcl.ecc.elGamal.publicKey,
                                    sec_key:Key,//sjcl.ecc.elGamal.secretKey,
                                    is_owner:Boolean,
                                    sessions:[Session],
                                    date_created:Date
                                });

    /* Confirm that at least the owner exists */
    User.set_owner() || User.create_owner();
    _.defer(Fry.find_messages);
    console.log('Successfully Initialized');

}





Store.prototype.open=function(){
    var self=this;

    Psypher.db=new Dexie("Psypher");
    Psypher.db.on("versionchange", function(event) {
        Store.setup()
        // Psypher.db.delete();
        // Psypher.db=new Dexie("Psypher");
        // Psypher.db.version(Store.v).stores(Store.schema);
        if (!confirm ("Another page tries to upgrade the database to version " + event.newVersion +
                      ". Accept?")) {
            return false;
        }
    })
    try{
        Psypher.db.version(Store.v).stores(Store.schema)
    }catch (error) {
        Store.setup();
    };

    Dexie.Promise.on('error', function(err) {
        // Log to console or show en error indicator somewhere in your GUI...
        console.log("Uncaught error: " , err);
        Psypher.db.delete();
    });

    Dexie.exists("Psypher").then(function(exists) {

        // Psypher.db.version(Store.v).stores(Store.schema);
        Psypher.db.on('blocked', function () {
            debugger; // Make sure you get notified if database is blocked!
        });

        (exists) ? Psypher.db.open().then(self.initialize).catch(Store.setup) : Store.setup();

    }).catch(function (error) {
        Store.setup(1);
        console.error("Oops, an error occurred when trying to check database existance");
    });
    console.log('Opened Database Successfully');
}






Psypher.store = new Store();
Psypher.store.open();
// Store.initialize();
// window.setInterval(Fry.find_messages,1000);