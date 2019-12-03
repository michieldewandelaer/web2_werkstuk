'use strict'
$(function () {
    console.log('linked');

    getAllDrivers();
    getDriverGrid();
    getCircuits();
    getChampionship()
    getConstructors()

    function getAllDrivers() {
        $.ajax({
            url: 'http://127.0.0.1:3000/api/getAllDrivers',
            method: 'GET',
            dataType: 'json'
        }).done(function (data) {
            console.log('done mongodb');
            for (let d of data) {
                $('.grid-drivers').append(`
                <div class="card">
                    <span class="delDriver" id="${d._id}" >&times;</span>
                    <img src="img/McLaren-logo.png">
                    <div class="caption">
                        <h1> ${d.fname} ${d.lname} </h1>
                        <p> ${d.team} - ${d.year} </p>
                    </div>
                </div>
                `);
            }
        }).fail(function (er1, er2) {
            console.log(er1);
            console.log(er2);
        });
    };

    function getDriverGrid() {
        $('#yeargrid').on('keypress', function (e) {
            if (e.which == 13) {
                $('.drivergrid').remove();
                let year = $('#yeargrid').val();
                var d = new Date();
                var currentYear = d.getFullYear();
                if (year < 1950 || year > currentYear + 1) {
                    alert(`Give a year between 1950 and ${currentYear + 1}`)
                } else {
                    $.ajax({
                        url: `http://ergast.com/api/f1/${year}/drivers.json`,
                        method: 'GET',
                        dataType: 'json'
                    }).done(function (data) {
                        let drivers = [];
                        //console.log(data.MRData.DriverTable.drivers)
                        drivers = data.MRData.DriverTable.Drivers
                        //console.log(drivers)
                        for (let driver of drivers) {
                            $('#DriverGrid').append(`<p class="drivergrid"><strong>Driver:</strong> ${driver.givenName} ${driver.familyName} ${driver.permanentNumber}<br></p> `);
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
                }
            }
        })
    };

    function getCircuits() {
        $('#yearcircuit').on('keypress', function (e) {
            if (e.which == 13) {
                $('.circuit').remove();
                let year = $('#yearcircuit').val();
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
                            $('#ListOfCircuits').append(`<p class="circuit"><strong>Circuit:</strong> ${circuit.circuitName} ${circuit.Location.country} </p>`);
                        }
                    })
                }

            }

        })

    };

    function getChampionship() {
        $('#yearchampionship').on('keypress', function (e) {
            if (e.which == 13) {
                $('.championship').remove();
                let year = $('#yearchampionship').val();
                var d = new Date();
                var currentYear = d.getFullYear();
                if (year < 1950 || year > currentYear + 1) {
                    alert(`Geef een jaar tussen 1950 en ${currentYear + 1}`)
                } else {
                    $.ajax({
                        url: `http://ergast.com/api/f1/${year}/driverstandings.json`,
                        method: 'GET',
                        dataType: 'json'
                    }).done(function (data) {
                        let championship = [];
                        championship = data.MRData.StandingsTable.StandingsLists[0].DriverStandings
                        for (let c of championship) {
                            $('#ChampionshipList').append(`<p class="championship"><strong>${c.position}</strong> ${c.Driver.givenName} ${c.Driver.familyName} ${c.points} points </p>`);
                        }
                    })
                }

            }

        })

    };

    function getConstructors() {
        $('#yearConstructor').on('keyup', function (e) {
            let year = $('#yearConstructor').val();
            $('option').remove()
            var d = new Date();
            var currentYear = d.getFullYear();
            if (year < 1950 || year > currentYear + 1) {
                //alert(`Geef een jaar tussen 1950 en ${currentYear + 1}`)
            } else {
                $.ajax({
                    url: `http://ergast.com/api/f1/${year}/constructors.json`,
                    method: 'GET',
                    dataType: 'json'
                }).done(function (data) {
                    let constructors = [];
                    constructors = data.MRData.ConstructorTable.Constructors
                    console.log(constructors)
                    for (let c of constructors) {
                        $('#constructorOption').append(`<option value="${c.name}">${c.name}</option>`)
                    }
                })
            }
        })
    }

    $('#submit').on('click', function (e) {
        e.preventDefault();

        let driverObject = {
            fname: $('#fname').val(),
            lname: $('#lname').val(),
            dnumber: $('#dnumber').val(),
            year: $('#yearConstructor').val(),
            team: $('#constructorOption').val(),
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

    $(document).on('click', '.delDriver', function (e) {
        e.preventDefault();
        let id = $(this).attr('id');
        $.ajax({
            url: 'http://127.0.0.1:3000/api/deleteDriver',
            method: 'DELETE',
            data: {
                id: id
            }
        }).done(function (data) {
            console.log('deleted')
            location.reload()

        }).fail(function (er1, er2) {
            console.log(er1);
            console.log(er2);
        });

    })
})