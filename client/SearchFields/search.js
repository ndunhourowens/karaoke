nameToCollection = function(barName) {
    var root = Meteor.isClient ? window : global;
    return root[barName];
};


Template.search.created = function(){
    var data = this.data; // return barId and name
    this.custName = new ReactiveVar();
};

Template.search.onRendered = function(){
    $('.reactive-table-input').focus();
};

Template.search.helpers({
    settings: function(){
        var collection = nameToCollection(Template.instance().data.collection.name);
        return {
            collection: collection.find({}),
            fields:['ID', 'Title', 'Artist'],
            showNavigation: 'always',
            rowsPerPage: 10,
            showFilter: true,
        };
    },
    songs: function(){
        var collection = nameToCollection(Template.instance().data.collection.name);
        return collection.find({});
    },
    cust: function(){
        var cust = Cust.findOne({},{sort: {date:-1}});
        Template.instance().custName.set(cust.fName);
        return Cust.findOne({},{sort: {date:-1}});
    },
    playlist: function(){
        return Requests.find({barName: Session.get('barName')});
    },

});

Template.search.events({
    'click .reactive-table tbody tr': function(event, template){
        var barName = template.data.collection.name;
        var requestSong = {
            Artist: this.Artist,
            Title: this.Title,
            ID: this.ID,
            barName: barName,
            custName: template.custName.get(),
            date: Date(Date.now()),
        };
        // adding cust req to playList
        var collection = nameToCollection(barName);
        Meteor.call('addToPlaylist', requestSong, function(err, succ){
            if(err){
                console.log('here',err.reason);
            }
            Session.set('reqNum', succ);
            $('.reactive-table-input').trigger('keyup');
        });

        // adding 1 to request_count
        var find = collection.findOne({ID:requestSong.ID});
        if(find, {"request_counter" : { "$exists" : true}}){
            Meteor.call('counter', barName, requestSong);
        }else{
            Meteor.call('insertCounter', barName, requestSong);
        }

        // inform user request has been made
        var modal = Requests.findOne({},{sort:{date:-1}});
        $('.request').css({'display': 'block'});
        $('.msg').text("Your request to sing " + modal.Title + " by " + modal.Artist + " will be played shortly").css({'background': 'red'});
        $('.main').css({'display': 'none'});

    },
    'click .js-close': function(event, template){
        $('.request').css({'display': 'none'});
        $('.main').css({'display': 'inline'});
    }

});
