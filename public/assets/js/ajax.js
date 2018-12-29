//alert("No ajax calls implemented ;)");
$(document).ready(function(){

    //Funktionen für Filter
    $("input[type=submit]",country_filter).click(function(){
        //Eingaben aus Input-Feldern
        var id = $(country_filter_id).val();
        var idrange = $(country_filter_range).val();
        //idrange hat höhere Priorität
        if (idrange != ""){
            //idrange wird aufgesplitet
            var id = idrange.split("-");
            //ajax Aufruf der Funktion
            $.ajax({
                type: "GET",
                dateType: "json",
                url: "http://localhost:3000/items/"+id[0]+"/"+id[1],
                success: function(result){
                    //result wird in Variable geschrieben und in den tbody eingefügt
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
                    //neuladen der Tabelle
                    $('table > tbody').empty();
                    $('table > tbody').append(trHTML);
                }});
        }
        //Funktion für einfachen Filter
        else {if (id != ""){
            //ajax Aufruf der Funktion
            $.ajax({
                type: "GET",
                dateType: "json",
                url: "http://localhost:3000/items/"+ id,
                success: function(result){
                    //result wird in Variable geschrieben und in den tbody eingefügt
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
                    //neuladen der Tabelle
                    $('table > tbody').empty();
                    $('table > tbody').append(trHTML);
                }});
        }}
    });
    //Anzeigen der vollständigen Tabelle
    $("#table_body").ready(function(){
        //ajax Aufruf von /items
        $.ajax({
            type: "GET",
            dateType: "json",
            url: "http://localhost:3000/items",
            success: function(result){
                //result wird in Variable geschrieben und in den tbody eingefügt
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
    //Laden der Properties
    $("#prop_selection").ready(function(){
        //ajax Aufruf um properties zu laden
        $.ajax({
            type: "GET",
            dateType: "json",
            url: "http://localhost:3000/properties",
            success: function (result) {
                //result in Variable geladen und zu html hinzugefügt
                var option = '';
                for(var i = 0; i < result.length; i++){
                    var a = i+1;
                    option += '<option value"'+ a + '">' + result[i]+ '</option>';
                }
                $("#prop_selection").append(option);
            }
        });
    });
    //Funktion für hide
    $("#hide_selected_prop").click(function(){
        var id = $( "#prop_selection" ).val();
        var column = "table ."+id;
        $(column).hide();
    });
    //Funktion für show
    $("#show_selected_prop").click(function(){
        var id = $( "#prop_selection" ).val();
        var column = "table ."+id;
        $(column).show();
    });
    //Funktion zum hinzufügen
    $("input[type=submit]",country_add).click(function(){
        //Inputs
        var _name = $(country_name).val();
        var _rate = $(country_birth).val();
        var _phone = $(country_cellphone).val();
        //Aufruf der ajax Funktion
        $.ajax({
            type: "POST",
            url: "http://localhost:3000/items",
            data: JSON.stringify({
                    name:_name,
                    birth_rate_per_1000:_rate,
                    cell_phones_per_100:_phone
            }),
            contentType: "application/json",
            dataType: 'json',
            success: function (result) {
                //Feedback
                document.getElementById('Well').style.display = 'block';
                document.getElementById('welltext').innerHTML = result;
            },
            error: function(xhr, status, error) {
                //Feedback
                document.getElementById('Danger').style.display = 'block';
                document.getElementById('dangertext').innerHTML = xhr.responseText;
            }
        });
    });
    //Funktion für Löschen
    $("#rm_submit").click(function () {
        //Input
        var id = $(country_delete_id).val();
        //Wenn Input leer, dann letztes Löschen über Ajax Funktion
        if (id == ""){
            $.ajax({
                type: "DELETE",
                url: "http://localhost:3000/items",
                success: function (result) {
                    //Feedback
                    document.getElementById('Well').style.display = 'block';
                    document.getElementById('welltext').innerHTML = result;
                },
                error: function(xhr, status, error) {
                    //Feedback
                    document.getElementById('Danger').style.display = 'block';
                    document.getElementById('dangertext').innerHTML = xhr.responseText;
                }
            });
        }
        //Wenn Input nicht leer, dann Löschen über Ajax Funktion
        else{
            $.ajax({
                type: "DELETE",
                url: "http://localhost:3000/items/"+id,
                success: function (result) {
                    //Feedback
                    document.getElementById('Well').style.display = 'block';
                    document.getElementById('welltext').innerHTML = result;
                },

                error: function(xhr, status, error) {
                    //Feedback
                    document.getElementById('Danger').style.display = 'block';
                    document.getElementById('dangertext').innerHTML = xhr.responseText;
                }
            });
        }
    });
    //Blockieren des Neuladen der Seite
    $("#country_filter").submit(function(e) {
        e.preventDefault();
    });
    //Neuladen der Tabelle nach Löschen
    $("#country_delete").submit(function(e) {
        e.preventDefault();
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
                $('table > tbody').empty();
                $('table > tbody').append(trHTML);
            }});
        
    });
    //Neuladen der Tabelle nach Hinzufügen
    $("#country_add").submit(function(e){
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
                $('table > tbody').empty();
                $('table > tbody').append(trHTML);
            }});
        e.preventDefault();
    })
});
