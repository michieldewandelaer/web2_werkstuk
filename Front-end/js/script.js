'use strict'

$(function () {
    var racecounter = 1;
    getAllDrivers();
    getDriverGrid();
    chooseDriverGrid();
    getCircuits();
    getChampionship()
    getRaceWinner()
    getConstructors()
    getConstructorsUpdate()
    getMyDrivers()
    showStartingGrid()
    getMyRaces()
    showResult()

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
                        <p> ${d.team} - ${d.year}</p>
                        <p hidden id="dfname" value="${d.fname}"> ${d.fname} </p>
                        <p hidden id="dlname" value="${d.lname}"> ${d.lname} </p>
                        <p hidden id="dnumber" value="${d.dnumber}"> ${d.dnumber} </p>
                        <p hidden id="dteam" value="${d.team}"> ${d.team} - </p>
                        <p hidden id="dyear" value="${d.year}"> ${d.year} </p>
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
        $('#yeargrid').on('keyup', function (e) {
            $('.drivergrid').remove();
            let year = $('#yeargrid').val();
            var d = new Date();
            var currentYear = d.getFullYear();
            if (year < 1950 || year > currentYear + 1) {
                $('#validyearG').remove()
                $('#yeargrid').after(`<p id="validyearG" style="color:red"> Year must be between 1950 and ${currentYear + 1} </p>`)
            } else {
                $('#validyearG').remove()
                $.ajax({
                    url: `http://ergast.com/api/f1/${year}/drivers.json`,
                    method: 'GET',
                    dataType: 'json'
                }).done(function (data) {
                    let drivers = [];
                    drivers = data.MRData.DriverTable.Drivers
                    $('.drivergrid').remove();
                    for (let driver of drivers) {
                        if (typeof driver.permanentNumber === "undefined") {
                            $('#DriverGrid').append(`<p class="drivergrid">${driver.givenName} <strong>${driver.familyName}</strong><br></p> `);
                        } else {
                            $('#DriverGrid').append(`<p class="drivergrid">${driver.givenName} <strong>${driver.familyName}</strong> ${driver.permanentNumber}<br></p> `);
                        }

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
        })
    };

    function chooseDriverGrid() {
        $('#chooseGridyear').on('keyup', function (e) {
            $('p').remove();
            let year = $('#chooseGridyear').val();
            var d = new Date();
            var currentYear = d.getFullYear();
            if (year < 1950 || year > currentYear + 1) {
                $('#validyearD').remove()
                $('#chooseGridyear').after(`<p id="validyearD" style="color:red"> Year must be between 1950 and ${currentYear + 1} </p>`)
            } else {
                $('#validyearD').remove()
                $.ajax({
                    url: `http://ergast.com/api/f1/${year}/drivers.json`,
                    method: 'GET',
                    dataType: 'json'
                }).done(function (data) {
                    let drivers = [];
                    drivers = data.MRData.DriverTable.Drivers
                    $('p').remove();
                    for (let driver of drivers) {
                        $('.gridyear').append(`<p>${driver.givenName} <strong>${driver.familyName}</strong> ${driver.permanentNumber}<br></p> `);
                    }
                })
            }
        })
    }

    function getCircuits() {
        $('#yearcircuit').on('keyup', function (e) {
            $('.circuit').remove();
            let year = $('#yearcircuit').val();
            var d = new Date();
            var currentYear = d.getFullYear();
            if (year < 1950 || year > currentYear + 1) {
                $('#validyearCi').remove()
                $('#yearcircuit').after(`<p id="validyearCi" style="color:red"> Year must be between 1950 and ${currentYear + 1} </p>`)
            } else {
                $('#validyearCi').remove()
                $.ajax({
                    url: `http://ergast.com/api/f1/${year}/circuits.json`,
                    method: 'GET',
                    dataType: 'json'
                }).done(function (data) {
                    let circuits = [];
                    circuits = data.MRData.CircuitTable.Circuits
                    $('.circuit').remove();
                    for (let circuit of circuits) {
                        $('#ListOfCircuits').append(`<p class="circuit"> <strong>${circuit.Location.country}</strong> ${circuit.circuitName} </p>`);
                    }
                })
            }

        })

    };

    function getChampionship() {
        $('#yearchampionship').on('keyup', function (e) {
            $('.championship').remove();
            let year = $('#yearchampionship').val();
            var d = new Date();
            var currentYear = d.getFullYear();
            if (year < 1950 || year > currentYear + 1) {
                $('#validyearC').remove()
                $('#yearchampionship').after(`<p id="validyearC" style="color:red"> Year must be between 1950 and ${currentYear} </p>`)
            } else {
                $('#validyearC').remove()
                $.ajax({
                    url: `http://ergast.com/api/f1/${year}/driverstandings.json`,
                    method: 'GET',
                    dataType: 'json'
                }).done(function (data) {
                    let championship = [];
                    championship = data.MRData.StandingsTable.StandingsLists[0].DriverStandings
                    $('.championship').remove();
                    for (let c of championship) {
                        $('#ChampionshipList').append(`<p class="championship"><strong>${c.position}</strong> ${c.Driver.givenName} ${c.Driver.familyName} with ${c.points} points </p>`);
                    }
                })
            }

        })

    };

    function getRaceWinner() {
        $('#yearResult').on('keyup', function (e) {
            $('.results').remove();
            let year = $('#yearResult').val();
            var d = new Date();
            var currentYear = d.getFullYear();
            if (year < 1950 || year > currentYear + 1) {
                $('#validyearR').remove()
                $('#yearResult').after(`<p id="validyearR" style="color:red"> Year must be between 1950 and ${currentYear} </p>`)
            } else {
                $('#validyearR').remove()
                $.ajax({
                    url: `https://ergast.com/api/f1/${year}/results/1.json`,
                    method: 'GET',
                    dataType: 'json'
                }).done(function (data) {
                    let results = [];
                    results = data.MRData.RaceTable.Races
                    $('.results').remove();
                    for (let result of results) {
                        $('#roundResult').append(`<option class="results" value="${result.round}"> ${result.Circuit.Location.country}</option> `);
                        //console.log(result.Results[0].Driver.familyName)
                    }
                    $(document).on('change', '#roundResult', function () {
                        $('.resultp').remove()
                        var selected = $('#roundResult').children("option:selected").val()
                        $.ajax({
                            url: `https://ergast.com/api/f1/${year}/${selected}/results.json`,
                            method: 'GET',
                            dataType: 'json'
                        }).done(function (data) {
                            let results = [];
                            results = data.MRData.RaceTable.Races
                            $('.resultp').remove()
                            for (let result of results[0].Results) {
                                $('#ResultList').append(`<p class="resultp"><strong>${result.position} </strong> ${result.Driver.givenName} ${result.Driver.familyName}</p>`)
                            }


                        })
                    })
                })
            }
        })

    }

    function getConstructors() {
        $('#yearConstructor').on('keyup', function (e) {
            let year = $('#yearConstructor').val();
            $('option').remove()
            var d = new Date();
            var currentYear = d.getFullYear();
            if (year < 1950 || year > currentYear + 1) {
                $('p').remove()
                $('#yearConstructor').after(`<p style="color:red"> Year must be between 1950 and ${currentYear + 1} </p>`)
            } else {
                $('p').remove()
                $.ajax({
                    url: `http://ergast.com/api/f1/${year}/constructors.json`,
                    method: 'GET',
                    dataType: 'json'
                }).done(function (data) {
                    let constructors = [];
                    constructors = data.MRData.ConstructorTable.Constructors
                    $('option').remove()
                    for (let c of constructors) {
                        $('#constructorOption').append(`<option value="${c.name}">${c.name}</option>`)
                    }
                })
            }
        })
    }

    function getConstructorsUpdate() {
        $('#yearConstructorU').on('keyup', function (e) {
            let year = $('#yearConstructorU').val();
            $('option').remove()
            var d = new Date();
            var currentYear = d.getFullYear();
            if (year < 1950 || year > currentYear + 1) {
                $('p').remove()
                $('#yearConstructorU').after(`<p style="color:red"> Year must be between 1950 and ${currentYear + 1} </p>`)
            } else {
                $('p').remove()
                $.ajax({
                    url: `http://ergast.com/api/f1/${year}/constructors.json`,
                    method: 'GET',
                    dataType: 'json'
                }).done(function (data) {
                    let constructors = [];
                    constructors = data.MRData.ConstructorTable.Constructors
                    $('option').remove()
                    for (let c of constructors) {
                        $('#constructorOptionU').append(`<option value="${c.name}">${c.name}</option>`)
                    }
                })
            }
        })
    }



    //CRUD

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

    $(document).on('click', '.card', function (e) {
        $('option').remove()
        e.preventDefault();
        let id = $(this).find('.delDriver').attr('id');
        let fname = $(this).find('#dfname').attr('value')
        let lname = $(this).find('#dlname').attr('value')
        let dnumber = $(this).find('#dnumber').attr('value')
        let year = $(this).find('#dyear').attr('value')
        let team = $(this).find('#dteam').attr('value')

        $('.updatedriver').find('#fnameU').val(fname)
        $('.updatedriver').find('#lnameU').val(lname)
        $('.updatedriver').find('#dnumberU').val(dnumber)
        $('.updatedriver').find('#yearConstructorU').val(year)
        $('.updatedriver').find('#constructorOptionU').append(`<option> ${team} </option>`)

        $('#submitupdate').on('click', function (e) {
            e.preventDefault();

            let driverObject = {
                id: id,
                fname: $('#fnameU').val(),
                lname: $('#lnameU').val(),
                dnumber: $('#dnumberU').val(),
                year: $('#yearConstructorU').val(),
                team: $('#constructorOptionU').val(),
            }
            $.ajax({
                url: 'http://127.0.0.1:3000/api/updateDriver',
                method: 'POST',
                data: driverObject
            }).done(function (data) {
                console.log('updated ');

            })
        })
    })

    //------------ BONUS ------------//
    function getMyDrivers() {

        $.ajax({
            url: 'http://127.0.0.1:3000/api/getAllDrivers',
            method: 'GET',
            dataType: 'json'
        }).done(function (data) {
            for (let d of data) {
                $('#myDrivers').append(`<option value="${d.year}"> ${d.fname} ${d.lname} - ${d.team} ${d.year}</option>`);
            }

        })
    }

    //------------ BONUS ------------//
    function showStartingGrid() {
        $('#myDrivers').change(function (e) {
            let year = $('option:selected').val()
            $('.drivergrid').remove();
            $('input').remove()
            $('p').remove()
            $('br').remove()
            $('.grandprix').remove()
            $.ajax({
                url: `http://ergast.com/api/f1/${year}/drivers.json`,
                method: 'GET',
                dataType: 'json'
            }).done(function (data) {
                let drivers = [];
                drivers = data.MRData.DriverTable.Drivers
                $('.drivergrid').remove();
                for (let driver of drivers) {
                    if (typeof driver.permanentNumber === "undefined") {
                        $('#StartingGrid').append(`<p class="drivergrid">${driver.givenName} <strong>${driver.familyName}</strong><br></p> `);
                    } else {
                        $('#StartingGrid').append(`<p class="drivergrid">${driver.givenName} <strong>${driver.familyName}</strong> ${driver.permanentNumber}<br></p> `);
                    }

                }
            })

            $.ajax({
                url: `http://ergast.com/api/f1/${year}/results.json?limit=10000`,
                method: 'GET',
                dataType: 'json'
            }).done(function (data) {
                let circuits = [];
                circuits = data.MRData.RaceTable.Races
                $('input').remove()
                $('br').remove()
                for (let circuit of circuits) {
                    $('#ChooseCircuit').append(`<input type="radio" name="track" value="${circuit.round}"> <p>${circuit.raceName}</p><br>`)
                }
            })

        })

    }

    //------------ BONUS ------------//
    function getMyRaces() {
        $.ajax({
            url: 'http://127.0.0.1:3000/api/getMyRaces',
            method: 'GET',
            dataType: 'json'
        }).done(function (data) {
            for (let d of data) {
                $('.myraces').append(`<button class="showResult" id="${d._id}"> Race finished on <strong> ${d.raceDate} </strong> &nbsp / &nbsp Raceyear: <strong> ${d.year} </strong> &nbsp / &nbsp Cicruit: <strong> ${d.circuit} </strong> </button>`);
            }

        })
    }

    //------------ BONUS ------------//
    function showResult() {
        $(document).on('click', '.showResult', function (e) {
            $('.praceresults').remove();
            e.preventDefault()
            let id = $(this).attr('id');
            $.ajax({
                url: 'http://127.0.0.1:3000/api/getRaceResult',
                method: 'POST',
                data: {
                    id: id
                }
            }).done(function (data) {
                //console.log(data)
                for (var i = 1; i < Object.keys(data.results).length; i++) {
                    $('.myracesresults').append(`<p class='praceresults' > ${i} &nbsp &nbsp &nbsp${data.results[i].givenName} ${data.results[i].familyName} </p>`)
                }
            })
        })

    }

    //------------ BONUS ------------//
    $('.startrace').on('click', function (e) {
        e.preventDefault();
        $('.presults').remove()
        $('.grandprix').remove()
        let today = new Date();
        let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        let round = $("input[name='track']:checked").val();
        let circuit = $("input[name='track']:checked").next("p").text();
        let year = $('option:selected').val();

        let driver = $('option:selected').text().split(' ')
        let mydriver = {
            Driver: {
                givenName: driver[1],
                familyName: driver[2],
            }
        }

        let raceStandings = {}
        let race = {
            raceDate: date,
            racenumber: racecounter,
            year: year,
            round: round,
            circuit: circuit,
            results: raceStandings

        }

        $.ajax({
            url: `http://ergast.com/api/f1/${year}/${round}/results.json`,
            method: 'GET',
            dataType: 'json'
        }).done(function (data) {
            let results = [];
            results = data.MRData.RaceTable.Races[0].Results;
            racecounter++
            let random = Math.floor(Math.random() * results.length)
            results[random] = mydriver
            let i = 1
            let raceStanding = 1
            $('.onder').append(`<h2 class='grandprix'> Result of the ${circuit}</h2>`)
            for (let result of results) {

                if (result.Driver.givenName == driver[1]) {
                    $('.onder').append(`<p class='presults' align="left" style=" margin: 1% 30%"> <strong> ${i++} &nbsp &nbsp &nbsp &nbsp${result.Driver.givenName} ${result.Driver.familyName} </strong></p>`)
                } else {
                    $('.onder').append(`<p class='presults' align="left" style=" margin: 1% 30%" > ${i++} &nbsp &nbsp &nbsp &nbsp${result.Driver.givenName} ${result.Driver.familyName} </p>`)
                }
                raceStandings[raceStanding] = {
                    "givenName": result.Driver.givenName,
                    "familyName": result.Driver.familyName
                }
                raceStanding++
            }

            let stringofdata = ''
            stringofdata += JSON.stringify(race)
            //console.log(stringofdata)
            $.ajax({
                url: 'http://127.0.0.1:3000/api/myRaces',
                method: 'POST',
                data: {
                    raceData: JSON.stringify(race)
                }
            }).done(function () {
                console.log('inserted');
            })
        })


    })


})