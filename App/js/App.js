"use strict";
var weatherApp = angular.module("weatherApp", ['ngStorage']);

weatherApp.controller('weatherDisplay', function($scope, $http, $localStorage) {
    $scope.html = 'currentWeather.html';
    $scope.cssclass = 'currentWeather';
    $scope.currenticon = 'currenticon';
    var citys = []




    $scope.addcity = function(city, countryCode) {

        var citys = typeof $localStorage.list === "undefined" ? [] : $localStorage.list;
        $localStorage.list = citys;

        for (var i = 0; i < citys.length; i++) {
            var status;
            if (citys[i].city === city && citys[i].country === countryCode) {
                status = true;
                $scope.favico = "img/fav3.png";
                break;
            } else {
                $scope.favico = "img/fav2.png";
                status = false
            }
        }
        if (status != true) {
            $localStorage.list.push({
                city: city,
                country: countryCode
            });
        } else {
            alert('Город уже в избранном')
        }

        $scope.list = citys;
    }
    $scope.removecity = function(city, countryCode) {

        var citys = typeof $localStorage.list === "undefined" ? [] : $localStorage.list;
        for (var i = 0; i < citys.length; i++) {
            if (citys[i].city === city && citys[i].country === countryCode) {
                $localStorage.list.splice(i, 1);
            }
        }
    }

    $scope.goFav = function() {
        var citys = $localStorage.list;
        $scope.list = citys;
        $scope.html = 'favourites.html';
        $scope.cssclass = 'favourites'
    }

    $http.get('http://ip-api.com/json')
        .then(function(data) {
            $scope.city = data.data.city;
            $scope.countryCode = data.data.countryCode;
            var weatherUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + $scope.city + "&appid=8ef32c93a2d89d144c574602accf60e0";

            var citys = typeof $localStorage.list === "undefined" ? [] : $localStorage.list;
            $localStorage.list = citys;
            for (var i = 0; i < $localStorage.list.length; i++) {
                var status;
                if (citys[i].city === $scope.city && citys[i].country === $scope.countryCode) {
                    status = true;
                    $scope.favico = "img/fav3.png";
                    break;
                } else {
                    $scope.favico = "img/fav2.png";
                    status = false
                }
            }

            $scope.searchCity = function(citysrch) {
                var weatherUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + citysrch + "&appid=8ef32c93a2d89d144c574602accf60e0";
                $scope.searchclass = 'searchnoerror'
                $scope.$emit('LOAD');
                $http.get(weatherUrl)
                    .then(function(data) {
                        $scope.countryCode = data.data.sys.country;
                        $scope.temp = Math.round(data.data.main.temp - 273.15);
                        $scope.weather = data.data.weather[0].main;
                        $scope.cityname = data.data.name;
                        $scope.pressure = data.data.main.pressure;
                        $scope.humidity = data.data.main.humidity;
                        $scope.wind = data.data.wind.speed;
                        $scope.icon = "img/weathericon/" + data.data.weather[0].icon + ".png";
                        $scope.bgimage = "img/" + data.data.weather[0].main + ".gif";
                        $scope.$emit('UNLOAD');
                        var citys = typeof $localStorage.list === "undefined" ? [] : $localStorage.list;
                        $localStorage.list = citys;

                        for (var i = 0; i < $localStorage.list.length; i++) {
                            var status;
                            if (citys[i].city === $scope.cityname && citys[i].country === $scope.countryCode) {
                                status = true;
                                $scope.favico = "img/fav3.png";
                                break;
                            } else {
                                $scope.favico = "img/fav2.png";
                                status = false
                            }
                        }

                    })
                    .catch(function(error) {
                        if (error.data.cod == "404") {
                            $scope.searchclass = 'searcherror'
                        }
                    });



            }
            $scope.weatherMoreInfo = function(cityname, countryCode) {
                $scope.cityname = cityname;
                $scope.html = 'moreWeatherInfo.html';
                $scope.cssclass = 'moreInfo';
                $scope.country = countryCode;
                $scope.$emit('LOAD');
                var weatherUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityname + "," + countryCode + "&appid=8ef32c93a2d89d144c574602accf60e0"
                var weatherTodayUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + cityname + "," + countryCode + "&appid=8ef32c93a2d89d144c574602accf60e0"
                $http.get(weatherTodayUrl)
                    .then(function(data) {
                        $scope.countryCode = data.data.sys.country;
                        $scope.temp = Math.round(data.data.main.temp - 273.15);
                        $scope.pressure = data.data.main.pressure;
                        $scope.humidity = data.data.main.humidity;
                        $scope.wind = data.data.wind.speed;
                        $scope.icon = "img/weathericon/" + data.data.weather[0].icon + ".png";
                        $scope.weather = data.data.weather[0].main;
                        $scope.bgimage = "img/" + data.data.weather[0].main + ".gif";
                    });


                $http.get(weatherUrl)
                    .then(function(data) {
                        var _groupByDate = {};

                        var _items = data.data.list;
                        _items.map(function(v, i) {
                            var dt = +v.dt;
                            var _date = new Date(dt * 1000);
                            var _m = (+_date.getMonth() + 1).toString();
                            var _d = _date.getDate().toString();
                            var _y = _date.getFullYear().toString();
                            var _keyArray = _d + "." + _m;
                            _groupByDate[_keyArray] = typeof _groupByDate[_keyArray] === "undefined" ? [] : _groupByDate[_keyArray];
                            _groupByDate[_keyArray].push(v);

                        });


                        $scope.d1temp = $scope.temp;
                        $scope.d2temp = Math.round(_groupByDate[$scope.d2][_groupByDate[$scope.d2].length / 2].main.temp - 273.15);
                        $scope.d3temp = Math.round(_groupByDate[$scope.d3][_groupByDate[$scope.d3].length / 2].main.temp - 273.15);
                        $scope.d4temp = Math.round(_groupByDate[$scope.d4][_groupByDate[$scope.d4].length / 2].main.temp - 273.15);
                        $scope.d5temp = Math.round(_groupByDate[$scope.d5][_groupByDate[$scope.d5].length / 2].main.temp - 273.15);

                        $scope.d1pressure = $scope.pressure;
                        $scope.d2pressure = _groupByDate[$scope.d2][_groupByDate[$scope.d2].length / 2].main.pressure;
                        $scope.d3pressure = _groupByDate[$scope.d3][_groupByDate[$scope.d3].length / 2].main.pressure;
                        $scope.d4pressure = _groupByDate[$scope.d4][_groupByDate[$scope.d4].length / 2].main.pressure;
                        $scope.d5pressure = _groupByDate[$scope.d5][_groupByDate[$scope.d5].length / 2].main.pressure;

                        $scope.d1humidity = $scope.humidity;
                        $scope.d2humidity = _groupByDate[$scope.d2][_groupByDate[$scope.d2].length / 2].main.humidity;
                        $scope.d3humidity = _groupByDate[$scope.d3][_groupByDate[$scope.d3].length / 2].main.humidity;
                        $scope.d4humidity = _groupByDate[$scope.d4][_groupByDate[$scope.d4].length / 2].main.humidity;
                        $scope.d5humidity = _groupByDate[$scope.d5][_groupByDate[$scope.d5].length / 2].main.humidity;

                        $scope.d1wind = $scope.wind;
                        $scope.d2wind = _groupByDate[$scope.d2][_groupByDate[$scope.d2].length / 2].wind.speed;
                        $scope.d3wind = _groupByDate[$scope.d3][_groupByDate[$scope.d3].length / 2].wind.speed;
                        $scope.d4wind = _groupByDate[$scope.d4][_groupByDate[$scope.d4].length / 2].wind.speed;
                        $scope.d5wind = _groupByDate[$scope.d5][_groupByDate[$scope.d5].length / 2].wind.speed;

                        $scope.d1icon = $scope.icon;
                        $scope.d2icon = "img/weathericon/" + _groupByDate[$scope.d2][_groupByDate[$scope.d2].length / 2].weather[0].icon + ".png";
                        $scope.d3icon = "img/weathericon/" + _groupByDate[$scope.d3][_groupByDate[$scope.d3].length / 2].weather[0].icon + ".png";
                        $scope.d4icon = "img/weathericon/" + _groupByDate[$scope.d4][_groupByDate[$scope.d4].length / 2].weather[0].icon + ".png";
                        $scope.d5icon = "img/weathericon/" + _groupByDate[$scope.d5][_groupByDate[$scope.d5].length / 2].weather[0].icon + ".png";
                    	 $scope.$emit('UNLOAD');
                    })
                $scope.backSimpleDisplay = function(cityname, country) {
                    $scope.html = 'currentWeather.html';
                    $scope.cssclass = 'currentWeather';
                    var citys = typeof $localStorage.list === "undefined" ? [] : $localStorage.list;
                    $localStorage.list = citys;

                    for (var i = 0; i < $localStorage.list.length; i++) {
                        var status;
                        if (citys[i].city === cityname && citys[i].country === countryCode) {
                            status = true;
                            $scope.favico = "img/fav3.png";
                            break;
                        } else {
                            $scope.favico = "img/fav2.png";
                            status = false
                        }
                    }
                }
                Date.prototype.addDays = function(days) {
                    var date = new Date(this.valueOf());
                    date.setDate(date.getDate() + days);
                    return date;
                }
                var date = new Date();
                $scope.d1 = date.addDays(0).getDate() + "." + (+date.addDays(0).getMonth() + 1);
                $scope.d2 = date.addDays(1).getDate() + "." + (+date.addDays(1).getMonth() + 1);
                $scope.d3 = date.addDays(2).getDate() + "." + (+date.addDays(2).getMonth() + 1);
                $scope.d4 = date.addDays(3).getDate() + "." + (+date.addDays(3).getMonth() + 1);
                $scope.d5 = date.addDays(4).getDate() + "." + (+date.addDays(4).getMonth() + 1);
                var days = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
                $scope.d3n = days[date.addDays(2).getDay()]
                $scope.d4n = days[date.addDays(3).getDay()]
                $scope.d5n = days[date.addDays(4).getDay()]
            }
            $http.get(weatherUrl)
                .then(function(data) {
                    $scope.temp = Math.round(data.data.main.temp - 273.15);
                    $scope.pressure = data.data.main.pressure;
                    $scope.humidity = data.data.main.humidity;
                    $scope.wind = data.data.wind.speed;
                    $scope.weather = data.data.weather[0].main;
                    $scope.cityname = data.data.name;
                    $scope.icon = "img/weathericon/" + data.data.weather[0].icon + ".png";
                    $scope.countryCode = data.data.sys.country;
                    $scope.bgimage = "img/" + data.data.weather[0].main + ".gif";
					$scope.$emit('UNLOAD');             	      
                });
                $scope.$on('LOAD',function() {
						$scope.loading=true;
						$scope.currshow = false;
					});
					$scope.$on('UNLOAD',function() {
						$scope.loading=false;
						$scope.currshow = true;
					}); 
        });

    var citys = typeof $localStorage.list === "undefined" ? [] : $localStorage.list;
    $localStorage.list = citys;
    for (var i = 0; i < $localStorage.list.length; i++) {
        var status;
        if (citys[i].city === $scope.cityname && citys[i].country === $scope.countryCode) {
            status = true;
            $scope.favico = "img/fav2.png";
            break;
        } else {
            $scope.favico = "img/fav3.png";
            status = false
        }
    }

    $scope.addremove = function(cityname, countryCode) {
        if ($scope.favico == 'img/fav3.png') {
            $scope.removecity(cityname, countryCode);
            $scope.favico = 'img/fav2.png';
        } else {
            $scope.addcity(cityname, countryCode);
            $scope.favico = 'img/fav3.png';
        }
    }
})