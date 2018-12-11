//alert("No ajax calls implemented ;)");
$(document).ready(function(){

    $("#add_submit").click(function(){
        var id = $(country_filter_id).val();
        var idrange = $(country_filter_range).val();
        if (idrange != ""){

            var id = idrange.split("-");
            $.ajax({
                type: "GET",
                dateType: "json",
                url: "http://localhost:3000/items/"+id[0]+"/"+id[1],
                success: function(result){

                    var trHTML = '';
                    $.each(result, function (i, item) {
                        trHTML += '<tr>' +
                            '<td>' + item.id + '</td>' +
                            '<td>' + item.name + '</td>' +
                            '<td>' + item.birth_rate_per_1000 + '</td>' +
                            '<td>' + item.cell_phones_per_100 + '</td>' +
                            '<td>' + item.children_per_woman + '</td>' +
                            '<td>' + item.electricity_consumption_per_capita + '</td>' +
                            '<td>' + item.internet_user_per_100 + '</td>' +
                            '</tr>';
                    });
                    $('table > tbody').empty();
                    $('table > tbody').append(trHTML);
                }});
        }
        else {if (id != ""){
            $.ajax({
                type: "GET",
                dateType: "json",
                url: "http://localhost:3000/items/"+ id,
                success: function(result){

                    var trHTML = '';
                    trHTML += '<tr>' +
                        '<td>' + result.id + '</td>' +
                        '<td>' + result.name + '</td>' +
                        '<td>' + result.birth_rate_per_1000 + '</td>' +
                        '<td>' + result.cell_phones_per_100 + '</td>' +
                        '<td>' + result.children_per_woman + '</td>' +
                        '<td>' + result.electricity_consumption_per_capita + '</td>' +
                        '<td>' + result.internet_user_per_100 + '</td>' +
                        '</tr>';
                    $('table > tbody').empty();
                    $('table > tbody').append(trHTML);
                }});
        }}
    });

    $("#table_body").ready(function(){
        $.ajax({
            type: "GET",
            dateType: "json",
            url: "http://localhost:3000/items",
            success: function(result){

                var trHTML = '';
                $.each(result, function (i, item) {
                    trHTML += '<tr>' +
                        '<td>' + item.id + '</td>' +
                        '<td>' + item.name + '</td>' +
                        '<td>' + item.birth_rate_per_1000 + '</td>' +
                        '<td>' + item.cell_phones_per_100 + '</td>' +
                        '<td>' + item.children_per_woman + '</td>' +
                        '<td>' + item.electricity_consumption_per_capita + '</td>' +
                        '<td>' + item.internet_user_per_100 + '</td>' +
                        '</tr>';
                });

                $('table > tbody').append(trHTML);
            }});
    });

    $("#country_filter").submit(function(e) {
        e.preventDefault();
    });
});
