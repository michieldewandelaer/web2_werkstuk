'use strict'
$(function () {
    console.log('linked');

    getList();

    getList2019();

    getCircuits2019();

    function getList() {
        $.ajax({
            url: 'http://127.0.0.1:3000/api/getAllDrivers',
            method: 'GET',
            dataType: 'json'
        }).done(function (data) {
            console.log('done mongodb');
            for (let d of data) {
                $('#listOfDriver').append(`<strong>Driver:</strong> ${d.name} ${d.number} <br> `);
            }
        }).fail(function (er1, er2) {
            console.log(er1);
            console.log(er2);
        });
    };

    function getList2019() {
        $.ajax({
            url: 'http://ergast.com/api/f1/2019/drivers.json',
            method: 'GET',
            dataType: 'json'
        }).done(function (data) {
            let drivers = [];
            //console.log(data.MRData.DriverTable.drivers)
            drivers = data.MRData.DriverTable.Drivers
            //console.log(drivers)
            for (let driver of drivers) {
                $('#listOfDriver2019').append(`<strong>Driver:</strong> ${driver.givenName} ${driver.familyName} ${driver.permanentNumber} <br> `);
            }

            //post drivers to backend
            /*
            $.ajax({
                url: 'http://127.0.0.1:3000/api/2019/Drivers',
                method: 'POST',
                dataType: 'json',
                data: JSON.stringify(drivers),
                contentType: "application/json",
                succes: 'drivers send!'
            })*/
            //console.log(drivers);
        }).fail(function (er1, er2) {
            console.log(er1);
            console.log(er2);
        });
    };

    function getCircuits2019() {
        $('#year').on('keypress', function (e) {
            if (e.which == 13) {
                $('p').remove();
                let year = $('#year').val();
                var d = new Date();
                var currentYear = d.getFullYear();
                if (year < 1950 || year > currentYear + 1) {
                    alert(`Geef een jaar tussen 1950 en ${currentYear + 1}`)
                } else {
                    $.ajax({
                        url: `http://ergast.com/api/f1/${year}/circuits.json`,
                        method: 'GET',
                        dataType: 'json'
                    }).done(function (data) {
                        let circuits = [];
                        circuits = data.MRData.CircuitTable.Circuits
                        for (let circuit of circuits) {
                            $('#ListOfCircuits').append(`<p><strong>Circuit:</strong> ${circuit.circuitName} ${circuit.Location.country} </p>`);
                        }
                    })
                }

            }

        })

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