'use strict'
$(function () {
    console.log('linked');

    getList();

    function getList() {
        $.ajax({
            url: 'http://127.0.0.1:3000/api/getAllDrivers',
            method: 'GET',
            dataType: 'json'
        }).done(function (data) {
            console.log('done');
            for (let d of data) {
                $('#listOfDriver').append(`<strong>Driver:</strong> ${d.name} ${d.number} <br> `);
            }
        }).fail(function (er1, er2) {
            console.log(er1);
            console.log(er2);
        });
    };

    $('form').submit(function (e) {
        e.preventDefault();

        let driverObject = {
            name: $('#drivername').val(),
            number: $('#drivernumber').val(),
        }
        $.ajax({
            url: 'http://127.0.0.1:3000/api/insertDriver',
            method: 'POST',
            data: driverObject
        }).done(function (data) {
            console.log('inserted');


        }).fail(function (er1, er2) {
            console.log(er1);
            console.log(er2);
        });
    })
})