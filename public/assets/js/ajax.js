//alert("No ajax calls implemented ;)");
$(document).ready(function(){

    //$("#add_submit").click(function(){
    $("input[type=submit]",country_filter).click(function(){
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
                            '<td class="id">' + item.id + '</td>' +
                            '<td class="name">' + item.name + '</td>' +
                            '<td class="birth_rate_per_1000">' + item.birth_rate_per_1000 + '</td>' +
                            '<td class="cell_phones_per_100">' + item.cell_phones_per_100 + '</td>' +
                            '<td class="children_per_woman">' + item.children_per_woman + '</td>' +
                            '<td class="electricity_consumption_per_capita">' + item.electricity_consumption_per_capita + '</td>' +
                            '<td class="internet_user_per_100">' + item.internet_user_per_100 + '</td>' +
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
                        '<td class="id">' + result.id + '</td>' +
                        '<td class="name">' + result.name + '</td>' +
                        '<td class="birth_rate_per_1000">' + result.birth_rate_per_1000 + '</td>' +
                        '<td class="cell_phones_per_100">' + result.cell_phones_per_100 + '</td>' +
                        '<td class="children_per_woman">' + result.children_per_woman + '</td>' +
                        '<td class="electricity_consumption_per_capita">' + result.electricity_consumption_per_capita + '</td>' +
                        '<td class="internet_user_per_100">' + result.internet_user_per_100 + '</td>' +
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
                        '<td class="id">' + item.id + '</td>' +
                        '<td class="name">' + item.name + '</td>' +
                        '<td class="birth_rate_per_1000">' + item.birth_rate_per_1000 + '</td>' +
                        '<td class="cell_phones_per_100">' + item.cell_phones_per_100 + '</td>' +
                        '<td class="children_per_woman">' + item.children_per_woman + '</td>' +
                        '<td class="electricity_consumption_per_capita">' + item.electricity_consumption_per_capita + '</td>' +
                        '<td class="internet_user_per_100">' + item.internet_user_per_100 + '</td>' +
                        '</tr>';
                });

                $('table > tbody').append(trHTML);
            }});
    });

    $("#prop_selection").ready(function(){
        $.ajax({
            type: "GET",
            dateType: "array",
            url: "http://localhost:3000/properties",
            success: function (result) {
                var option = '';
                for(var i = 0; i < result.length; i++){
                    var a = i+1;
                    option += '<option value"'+ a + '">' + result[i]+ '</option>';
                }
                $("#prop_selection").append(option);
            }
        });
    });

    $("#hide_selected_prop").click(function(){
        var id = $( "#prop_selection" ).val();
        var column = "table ."+id;
        $(column).hide();
    });

    $("#show_selected_prop").click(function(){
        var id = $( "#prop_selection" ).val();
        var column = "table ."+id;
        $(column).show();
    });

    $("input[type=submit]",country_add).click(function(){
        var name = $(country_name).val();
        var rate = $(country_birth).val();
        var phone = $(country_cellphone).val();

        var country = {
            name:name,
            rate:rate,
            phone:phone
        }
        console.log("country", country);
       /* $.ajax({
            type: "POST",
            url: "http://localhost:3000/items",
            data: country,
            //success: alert("added");
        });*/
    });

    $("#rm_submit").click(function () {
        var id = $(country_delete_id).val();
        if (id == ""){
            $.ajax({
                type: "DELETE",
                url: "http://localhost:3000/items",
                success: function (result) {
                    alert(result);
                }
            });
        }
        else{
            $.ajax({
                type: "DELETE",
                url: "http://localhost:3000/items/"+id,
                success: function (result) {
                    alert(result);
                }
            });
        }
    });

    $("#country_filter").submit(function(e) {
        e.preventDefault();
    });

    $("#country_delete").submit(function(e) {
        e.preventDefault();
    });
});
