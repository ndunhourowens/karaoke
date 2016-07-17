Template.searchFields.created = function(){
};

Template.searchFields.rendered = function(){
};

Template.searchFields.helpers({
    songList: function(){
        return Songs.find({}).fetch();
    },
    find: function(){
        var search = Session.get("search");
        return Songs.find({$or: [{Title: {$eq: search}}, {Artist: {$eq: search}}]});
    }
});

Template.searchFields.events({
    'click .js-searchBtn': function(event, template){
        var searchFor = $('.searchBox').val();
        Session.set('search', searchFor);
        $('.found').css('display','inline');
        $('.available').css('display','none');

    },
    'click .clickable': function(event, template){
        var row = $(this).closest('tr').children('td');
        console.log(row.prevObject.prevObject[0]._id);
    }
});