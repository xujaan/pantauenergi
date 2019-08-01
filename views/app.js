var urlapi = "http://localhost:3000/api";
var socket = io();
Vue.component('aktifitas', {
    template: '#aktifitas',
    data: function () {
        return {
            hariini: (new Date().toISOString().slice(0, 10).replace('T', ' '), new Date().toISOString().slice(0, 10).replace('T', ' ')).toString(),
            results: null,
            resultsnya: null,
            totaltegangan: null,
            totalarus: null,
            totaldaya: null,
            icontegangan: "",
            iconarus: "",
            icondaya: "",
            harga: "",
            optionspot: ""
        }
    },

    methods: {
        getspot() {
            // getspot menu real
            axios
                .get(urlapi + "/spot")
                .then(response => {
                    // console.log(response)
                    this.results = response.data.data
                    var spots = this.results.map(function (key) {
                        var newobjspot = [];
                        newobjspot = ({
                            'text': key.spot,
                            'value': key.spot
                        });
                        return newobjspot;
                    });
                    this.optionspot = spots;
                });
        },
        biaya() {
            var spott = $('#spotreal').val()
            axios
                .get(urlapi + "/data/log/", {
                    params: {
                        awal: this.hariini + " 00:00:00",
                        akhir: this.hariini + " 23:59:59",
                        spot: spott
                    }
                })
                .then(response => {
                    // console.log(response)
                    this.resultsnya = response.data.data;
                    var datadaya = this.resultsnya.map(function (key) {
                        return key.daya;
                    });
                    var totaldaya = parseFloat(Object.keys(datadaya).reduce((sum, key) => sum + parseFloat(datadaya[key] || 0), 0) / 1000);
                    this.harga = (parseInt(totaldaya * 1500)).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
                });
        },
        // socket
        realtime() {
            var datachart;

            var myChart = new Chart(document.getElementById("myChartC"), {
                type: 'line',
                data: datachart,
                options: {
                    animation: {
                        duration: 0
                    }
                }
            });

            socket.on('data', function (response) {
                console.log(response)
                var i = 0;

                for (var key in response) {
                    data.labels[i] = response[i].waktu;
                    data.datasets[0].data[i] = response[i].tegangan;
                    data.datasets[1].data[i] = response[i].arus;
                    data.datasets[2].data[i] = response[i].daya;
                    i++;
                }

                // Update chart
                myChart.update();
            });

            axios
                .get(urlapi + "/data/real", {
                    params: {
                        spot: $('#spotreal').val()
                    }
                })
                .then(response => {
                    console.log(response)
                    this.results = response.data.data
                    var labels = this.results.map(function (key) {
                        return key.waktu;
                    });
                    var dataarus = this.results.map(function (key) {
                        return key.arus;
                    });
                    var datategangan = this.results.map(function (key) {
                        return key.tegangan;
                    });
                    var datadaya = this.results.map(function (key) {
                        return key.daya;
                    });

                    this.totaltegangan = parseInt(datategangan.reverse().slice(-1)[0]);
                    this.totalarus = parseInt(dataarus.reverse().slice(-1)[0] / 100);
                    this.totaldaya = parseInt(datadaya.reverse().slice(-1)[0] * 10);
                    var plusmintegangan = this.totaltegangan - datategangan.reverse().slice(-2)[0];
                    var plusminarus = this.totalarus - dataarus.reverse().slice(-2)[0];
                    var plusmindaya = this.totaldaya - datadaya.reverse().slice(-2)[0];

                    if (plusmintegangan < 0) {
                        this.icontegangan = "nc-icon nc-minimal-down text-success";
                    } else {
                        this.icontegangan = "nc-icon nc-minimal-up text-danger";
                    }
                    if (plusminarus < 0) {
                        this.iconarus = "nc-icon nc-minimal-down text-success";
                    } else {
                        this.iconarus = "nc-icon nc-minimal-up text-danger";
                    }
                    if (plusmindaya < 0) {
                        this.icondaya = "nc-icon nc-minimal-down text-success";
                    } else {
                        this.icondaya = "nc-icon nc-minimal-up text-danger";
                    }
                    //data
                    data = {
                        labels: labels.reverse(),
                        datasets: [{
                            data: dataarus.reverse(),
                            label: "Arus",
                            borderColor: "#ff8246",
                            backgroundColor: "#ffc2a5",
                            fill: false
                        }, {
                            data: datategangan.reverse(),
                            label: "Tegangan",
                            borderColor: "#6fc2d0",
                            backgroundColor: "#d3f9ff",
                            fill: false
                        }, {
                            data: datadaya.reverse(),
                            label: "Daya",
                            borderColor: "#cece46",
                            backgroundColor: "#ffffa5",
                            fill: true
                        }]
                    }
                });
        }
    },
    mounted() {
        this.getspot()
        this.biaya()
        this.realtime()
        // this.socketreal()
        // setInterval(() => {
        // this.realtime()
        // this.biaya()
        // }, 1000);
    }
});

Vue.component('datalog', {
    template: '#datalog',

    data: function () {
        return {
            selected: [new Date().toISOString().slice(0, 10).replace('T', ' '), new Date().toISOString().slice(0, 10).replace('T', ' ')],
            options: [{
                    text: 'Hari ini',
                    value: [new Date().toISOString().slice(0, 10).replace('T', ' '), new Date().toISOString().slice(0, 10).replace('T', ' ')]
                },
                {
                    text: 'Minggu ini',
                    value: [this.minggu(new Date()), this.minggu(new Date().setDate(new Date().getDate() + 7))]
                },
                {
                    text: 'Bulan ini',
                    value: [new Date().getFullYear() + "-" + ("0" + parseInt(new Date().getMonth() + 1)).slice(-2) + "-01", new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().slice(0, 10).replace('T',
                        ' ')]
                },
                {
                    text: 'Tahun ini',
                    value: [new Date().getFullYear() + "-01-01", new Date().getFullYear() + "-12-31"]
                },
                {
                    text: 'Lainnya',
                    value: ""
                }
            ],
            optionspot: "",
            results: null,
            hargalistrik: 1500,
            periode: "-",
            total: "-",
            harga: "-"
        }
    },

    methods: {
        formatDate(dates) {
            var date = new Date(dates);
            var monthNames = [
                "Januari", "Februari", "Maret",
                "April", "Mei", "Juni", "Juli",
                "Agustus", "September", "Oktober",
                "November", "Desember"
            ];
            var day = date.getDate();
            var monthIndex = date.getMonth();
            var year = date.getFullYear();
            return day + ' ' + monthNames[monthIndex] + ' ' + year;
        },
        minggu(d) {
            d = new Date(d);
            var day = d.getDay(),
                diff = d.getDate() - day + (day == 0 ? -6 : 1);
            return new Date(d.setDate(diff)).toISOString().slice(0, 10).replace('T', ' ');
        },

        biaya() {
            var datadaya = this.results.map(function (key) {
                return key.daya;
            });
            var totaldaya = parseFloat(Object.keys(datadaya).reduce((sum, key) => sum + parseFloat(datadaya[key] || 0), 0) / 1000);
            this.total = parseInt(totaldaya) + " kWh";
            this.harga = "Rp " + (parseInt(totaldaya * $('#hargalistrik').val())).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
            this.periode = this.formatDate($('#tanggalawal').val()) + " - " + this.formatDate($('#tanggalakhir').val());
        },

        getspot() {
            // getspot menu log
            axios
                .get(urlapi + "/spot")
                .then(response => {
                    // console.log(response)
                    this.results = response.data.data
                    var spots = this.results.map(function (key) {
                        var newobjspot = [];
                        newobjspot = ({
                            'text': key.spot,
                            'value': key.spot
                        });
                        return newobjspot;
                    });
                    this.optionspot = spots;
                });
        },

        log() {
            axios
                .get(urlapi + "/data/log", {
                    params: {
                        awal: $('#tanggalawal').val() + " " + $('#waktuawal').val() + ":00",
                        akhir: $('#tanggalakhir').val() + " " + $('#waktuakhir').val() + ":00",
                        spot: $('#spotval').val(),
                        tampil: $('#tampil').val()
                    }
                })
                .then(response => {
                    // console.log($('#spotval').val())
                    // console.log(response)
                    this.results = response.data.data
                    var labels = this.results.map(function (key) {
                        return key.waktu;
                    });
                    var dataarus = this.results.map(function (key) {
                        return key.arus;
                    });
                    var datategangan = this.results.map(function (key) {
                        return key.tegangan;
                    });
                    var datadaya = this.results.map(function (key) {
                        return key.daya;
                    });

                    $("#bodytable").empty();
                    for (var i = 0; i < response.data.data.length; i++) {
                        var tr = $('<tr/>');
                        $(tr).append("<td>" + this.results[i].wak + "</td>");
                        $(tr).append("<td>" + this.results[i].tegangan + "</td>");
                        $(tr).append("<td>" + this.results[i].arus + "</td>");
                        $(tr).append("<td>" + this.results[i].daya + "</td>");
                        $('#bodytable').append(tr);
                    }


                    new Chart(document.getElementById("line-chart"), {
                        type: 'line',
                        data: {
                            labels: labels.reverse(),
                            datasets: [{
                                data: dataarus.reverse(),
                                label: "Arus",
                                borderColor: "#3e95cd",
                                fill: false
                            }, {
                                data: datategangan.reverse(),
                                label: "Tegangan",
                                borderColor: "#c45850",
                                fill: false
                            }, {
                                data: datadaya.reverse(),
                                label: "Daya",
                                borderColor: "#CCCC00",
                                fill: false
                            }]
                        }
                    });
                });
        }
    },
    mounted() {
        this.log();
        this.getspot();
    }
});

Vue.component('spot', {
    template: '#spot',
    data: function () {
        return {

        }
    }
});

Vue.component('login', {
    template: '#login',
    data: function () {
        return {

        }
    }
});

Vue.component('pengaturan', {
    template: '#pengaturan',
    data: function () {
        return {

        }
    }
});

new Vue({
    el: '#app',
    data: {
        halaman: 'aktifitas',
        login: null
    }
});

function ceklogin() {
    axios
        .get("http://localhost:8000/api/index.php/ceklogin")
        .then(response => {
            this.login = response.data.login
        })
}