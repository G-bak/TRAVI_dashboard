/**
 * Resize function without multiple trigger
 * 
 * Usage:
 * $(window).smartresize(function(){  
 *     // code here
 * });
 */
(function($,sr){
    // debouncing function from John Hann
    // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
    var debounce = function (func, threshold, execAsap) {
      var timeout;

        return function debounced () {
            var obj = this, args = arguments;
            function delayed () {
                if (!execAsap)
                    func.apply(obj, args); 
                timeout = null; 
            }

            if (timeout)
                clearTimeout(timeout);
            else if (execAsap)
                func.apply(obj, args);

            timeout = setTimeout(delayed, threshold || 100); 
        };
    };

    // smartresize 
    jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');
/**
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var CURRENT_URL = window.location.href.split('#')[0].split('?')[0],
    $BODY = $('body'),
    $MENU_TOGGLE = $('#menu_toggle'),
    $SIDEBAR_MENU = $('#sidebar-menu'),
    $SIDEBAR_FOOTER = $('.sidebar-footer'),
    $LEFT_COL = $('.left_col'),
    $RIGHT_COL = $('.right_col'),
    $NAV_MENU = $('.nav_menu'),
    $FOOTER = $('footer');

// Sidebar
function init_sidebar() {
    // TODO: This is some kind of easy fix, maybe we can improve this
    var setContentHeight = function () {
        // reset height
        $RIGHT_COL.css('min-height', $(window).height());

        var bodyHeight = $BODY.outerHeight(),
            footerHeight = $BODY.hasClass('footer_fixed') ? -10 : $FOOTER.height(),
            leftColHeight = $LEFT_COL.eq(1).height() + $SIDEBAR_FOOTER.height(),
            contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;

        // normalize content
        contentHeight -= $NAV_MENU.height() + footerHeight;

        $RIGHT_COL.css('min-height', contentHeight);
    };

    var openUpMenu = function () {
        $SIDEBAR_MENU.find('li').removeClass('active active-sm');
        $SIDEBAR_MENU.find('li ul').slideUp();
    }

    $SIDEBAR_MENU.find('a').on('click', function (ev) {
        var $li = $(this).parent();

        if ($li.is('.active')) {
            $li.removeClass('active active-sm');
            $('ul:first', $li).slideUp(function () {
                setContentHeight();
            });
        } else {
            // prevent closing menu if we are on child menu
            if (!$li.parent().is('.child_menu')) {
                openUpMenu();
            } else {
                if ($BODY.is('nav-sm')) {
                    if (!$li.parent().is('child_menu')) {
                        openUpMenu();
                    }
                }
            }

            $li.addClass('active');

            $('ul:first', $li).slideDown(function () {
                setContentHeight();
            });
        }
    });

    // toggle small or large menu
    $MENU_TOGGLE.on('click', function () {
        if ($BODY.hasClass('nav-md')) {
            $SIDEBAR_MENU.find('li.active ul').hide();
            $SIDEBAR_MENU.find('li.active').addClass('active-sm').removeClass('active');
        } else {
            $SIDEBAR_MENU.find('li.active-sm ul').show();
            $SIDEBAR_MENU.find('li.active-sm').addClass('active').removeClass('active-sm');
        }

        $BODY.toggleClass('nav-md nav-sm');

        setContentHeight();

        $('.dataTable').each(function () { $(this).dataTable().fnDraw(); });
    });

    // check active menu
    $SIDEBAR_MENU.find('a[href="' + CURRENT_URL + '"]').parent('li').addClass('current-page');

    $SIDEBAR_MENU.find('a').filter(function () {
        return this.href == CURRENT_URL;
    }).parent('li').addClass('current-page').parents('ul').slideDown(function () {
        setContentHeight();
    }).parent().addClass('active');

    // recompute content when resizing
    $(window).smartresize(function () {
        setContentHeight();
    });

    setContentHeight();

    // fixed sidebar
    if ($.fn.mCustomScrollbar) {
        $('.menu_fixed').mCustomScrollbar({
            autoHideScrollbar: true,
            theme: 'minimal',
            mouseWheel: { preventDefault: true }
        });
    }
}
// /Sidebar

// Panel toolbox
$(document).ready(function () {
    $('.collapse-link').on('click', function () {
        var $BOX_PANEL = $(this).closest('.x_panel'),
            $ICON = $(this).find('i'),
            $BOX_CONTENT = $BOX_PANEL.find('.x_content');

        // fix for some div with hardcoded fix class
        if ($BOX_PANEL.attr('style')) {
            $BOX_CONTENT.slideToggle(200, function () {
                $BOX_PANEL.removeAttr('style');
            });
        } else {
            $BOX_CONTENT.slideToggle(200);
            $BOX_PANEL.css('height', 'auto');
        }

        $ICON.toggleClass('fa-chevron-up fa-chevron-down');
    });

    $('.close-link').click(function () {
        var $BOX_PANEL = $(this).closest('.x_panel');

        $BOX_PANEL.remove();
    });
});
// /Panel toolbox

// Tooltip
$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip({
        container: 'body'
    });
});
// /Tooltip

// Progressbar
$(document).ready(function () {
    if ($(".progress .progress-bar")[0]) {
        $('.progress .progress-bar').progressbar();
    }
});
// /Progressbar

// Switchery
$(document).ready(function () {
    if ($(".js-switch")[0]) {
        var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
        elems.forEach(function (html) {
            var switchery = new Switchery(html, {
                color: '#26B99A'
            });
        });
    }
});
// /Switchery

// iCheck
$(document).ready(function () {
    if ($("input.flat")[0]) {
        $(document).ready(function () {
            $('input.flat').iCheck({
                checkboxClass: 'icheckbox_flat-green',
                radioClass: 'iradio_flat-green'
            });
        });
    }
});
// /iCheck

// Table
$('table input').on('ifChecked', function () {
    checkState = '';
    $(this).parent().parent().parent().addClass('selected');
    countChecked();
});
$('table input').on('ifUnchecked', function () {
    checkState = '';
    $(this).parent().parent().parent().removeClass('selected');
    countChecked();
});

var checkState = '';

$('.bulk_action input').on('ifChecked', function () {
    checkState = '';
    $(this).parent().parent().parent().addClass('selected');
    countChecked();
});
$('.bulk_action input').on('ifUnchecked', function () {
    checkState = '';
    $(this).parent().parent().parent().removeClass('selected');
    countChecked();
});
$('.bulk_action input#check-all').on('ifChecked', function () {
    checkState = 'all';
    countChecked();
});
$('.bulk_action input#check-all').on('ifUnchecked', function () {
    checkState = 'none';
    countChecked();
});

function countChecked() {
    if (checkState === 'all') {
        $(".bulk_action input[name='table_records']").iCheck('check');
    }
    if (checkState === 'none') {
        $(".bulk_action input[name='table_records']").iCheck('uncheck');
    }

    var checkCount = $(".bulk_action input[name='table_records']:checked").length;

    if (checkCount) {
        $('.column-title').hide();
        $('.bulk-actions').show();
        $('.action-cnt').html(checkCount + ' Records Selected');
    } else {
        $('.column-title').show();
        $('.bulk-actions').hide();
    }
}

// Accordion
$(document).ready(function () {
    $(".expand").on("click", function () {
        $(this).next().slideToggle(200);
        $expand = $(this).find(">:first-child");

        if ($expand.text() == "+") {
            $expand.text("-");
        } else {
            $expand.text("+");
        }
    });
});

// NProgress
if (typeof NProgress != 'undefined') {
    $(document).ready(function () {
        NProgress.start();
    });

    $(window).on('load', function () {
        NProgress.done();
    });
}


//hover and retain popover when on popover content
var originalLeave = $.fn.popover.Constructor.prototype.leave;
$.fn.popover.Constructor.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
        obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type);
    var container, timeout;

    originalLeave.call(this, obj);

    if (obj.currentTarget) {
        container = $(obj.currentTarget).siblings('.popover');
        timeout = self.timeout;
        container.one('mouseenter', function () {
            //We entered the actual popover – call off the dogs
            clearTimeout(timeout);
            //Let's monitor popover content instead
            container.one('mouseleave', function () {
                $.fn.popover.Constructor.prototype.leave.call(self, self);
            });
        });
    }
};

$('body').popover({
    selector: '[data-popover]',
    trigger: 'click hover',
    delay: {
        show: 50,
        hide: 400
    }
});


function gd(year, month, day) {
    return new Date(year, month - 1, day).getTime();
}


function init_flot_chart() {

    if (typeof ($.plot) === 'undefined') { return; }

    console.log('init_flot_chart');
    var randNum = function () {
        return (Math.floor(Math.random() * (1 + 40 - 20))) + 20;
    };

    var arr_data1 = [
        [gd(2012, 1, 1), 17],
        [gd(2012, 1, 2), 74],
        [gd(2012, 1, 3), 6],
        [gd(2012, 1, 4), 39],
        [gd(2012, 1, 5), 20],
        [gd(2012, 1, 6), 85],
        [gd(2012, 1, 7), 7]
    ];

    var arr_data2 = [
        [gd(2012, 1, 1), 82],
        [gd(2012, 1, 2), 23],
        [gd(2012, 1, 3), 66],
        [gd(2012, 1, 4), 9],
        [gd(2012, 1, 5), 119],
        [gd(2012, 1, 6), 6],
        [gd(2012, 1, 7), 9]
    ];

    var arr_data3 = [
        [0, 1],
        [1, 9],
        [2, 6],
        [3, 10],
        [4, 5],
        [5, 17],
        [6, 6],
        [7, 10],
        [8, 7],
        [9, 11],
        [10, 35],
        [11, 9],
        [12, 12],
        [13, 5],
        [14, 3],
        [15, 4],
        [16, 9]
    ];

    var chart_plot_02_data = [];

    var chart_plot_03_data = [
        [0, 1],
        [1, 9],
        [2, 6],
        [3, 10],
        [4, 5],
        [5, 17],
        [6, 6],
        [7, 10],
        [8, 7],
        [9, 11],
        [10, 35],
        [11, 9],
        [12, 12],
        [13, 5],
        [14, 3],
        [15, 4],
        [16, 9]
    ];


    for (var i = 0; i < 30; i++) {
        chart_plot_02_data.push([new Date(Date.today().add(i).days()).getTime(), randNum() + i + i + 10]);
    }


    var chart_plot_01_settings = {
        series: {
            lines: {
                show: false,
                fill: true
            },
            splines: {
                show: true,
                tension: 0.4,
                lineWidth: 1,
                fill: 0.4
            },
            points: {
                radius: 0,
                show: true
            },
            shadowSize: 2
        },
        grid: {
            verticalLines: true,
            hoverable: true,
            clickable: true,
            tickColor: "#d5d5d5",
            borderWidth: 1,
            color: '#fff'
        },
        colors: ["rgba(38, 185, 154, 0.38)", "rgba(3, 88, 106, 0.38)"],
        xaxis: {
            tickColor: "rgba(51, 51, 51, 0.06)",
            mode: "time",
            tickSize: [1, "day"],
            //tickLength: 10,
            axisLabel: "Date",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 10
        },
        yaxis: {
            ticks: 8,
            tickColor: "rgba(51, 51, 51, 0.06)",
        },
        tooltip: false
    }

    var chart_plot_02_settings = {
        grid: {
            show: true,
            aboveData: true,
            color: "#3f3f3f",
            labelMargin: 10,
            axisMargin: 0,
            borderWidth: 0,
            borderColor: null,
            minBorderMargin: 5,
            clickable: true,
            hoverable: true,
            autoHighlight: true,
            mouseActiveRadius: 100
        },
        series: {
            lines: {
                show: true,
                fill: true,
                lineWidth: 2,
                steps: false
            },
            points: {
                show: true,
                radius: 4.5,
                symbol: "circle",
                lineWidth: 3.0
            }
        },
        legend: {
            position: "ne",
            margin: [0, -25],
            noColumns: 0,
            labelBoxBorderColor: null,
            labelFormatter: function (label, series) {
                return label + '&nbsp;&nbsp;';
            },
            width: 40,
            height: 1
        },
        colors: ['#96CA59', '#3F97EB', '#72c380', '#6f7a8a', '#f7cb38', '#5a8022', '#2c7282'],
        shadowSize: 0,
        tooltip: true,
        tooltipOpts: {
            content: "%s: %y.0",
            xDateFormat: "%d/%m",
            shifts: {
                x: -30,
                y: -50
            },
            defaultTheme: false
        },
        yaxis: {
            min: 0
        },
        xaxis: {
            mode: "time",
            minTickSize: [1, "day"],
            timeformat: "%d/%m/%y",
            min: chart_plot_02_data[0][0],
            max: chart_plot_02_data[20][0]
        }
    };

    var chart_plot_03_settings = {
        series: {
            curvedLines: {
                apply: true,
                active: true,
                monotonicFit: true
            }
        },
        colors: ["#26B99A"],
        grid: {
            borderWidth: {
                top: 0,
                right: 0,
                bottom: 1,
                left: 1
            },
            borderColor: {
                bottom: "#7F8790",
                left: "#7F8790"
            }
        }
    };


    if ($("#chart_plot_01").length) {
        console.log('Plot1');

        $.plot($("#chart_plot_01"), [arr_data1, arr_data2], chart_plot_01_settings);
    }


    if ($("#chart_plot_02").length) {
        console.log('Plot2');

        $.plot($("#chart_plot_02"),
            [{
                label: "Email Sent",
                data: chart_plot_02_data,
                lines: {
                    fillColor: "rgba(150, 202, 89, 0.12)"
                },
                points: {
                    fillColor: "#fff"
                }
            }], chart_plot_02_settings);

    }

    if ($("#chart_plot_03").length) {
        console.log('Plot3');


        $.plot($("#chart_plot_03"), [{
            label: "Registrations",
            data: chart_plot_03_data,
            lines: {
                fillColor: "rgba(150, 202, 89, 0.12)"
            },
            points: {
                fillColor: "#fff"
            }
        }], chart_plot_03_settings);

    };

}


/* STARRR */

function init_starrr() {

    if (typeof (starrr) === 'undefined') { return; }
    console.log('init_starrr');

    $(".stars").starrr();

    $('.stars-existing').starrr({
        rating: 4
    });

    $('.stars').on('starrr:change', function (e, value) {
        $('.stars-count').html(value);
    });

    $('.stars-existing').on('starrr:change', function (e, value) {
        $('.stars-count-existing').html(value);
    });

};


function init_JQVmap() {

    //console.log('check init_JQVmap [' + typeof (VectorCanvas) + '][' + typeof (jQuery.fn.vectorMap) + ']' );	

    if (typeof (jQuery.fn.vectorMap) === 'undefined') { return; }

    console.log('init_JQVmap');

    if ($('#world-map-gdp').length) {

        $('#world-map-gdp').vectorMap({
            map: 'world_en',
            backgroundColor: null,
            color: '#ffffff',
            hoverOpacity: 0.7,
            selectedColor: '#666666',
            enableZoom: true,
            showTooltip: true,
            values: sample_data,
            scaleColors: ['#E6F2F0', '#149B7E'],
            normalizeFunction: 'polynomial'
        });

    }

    if ($('#usa_map').length) {

        $('#usa_map').vectorMap({
            map: 'usa_en',
            backgroundColor: null,
            color: '#ffffff',
            hoverOpacity: 0.7,
            selectedColor: '#666666',
            enableZoom: true,
            showTooltip: true,
            values: sample_data,
            scaleColors: ['#E6F2F0', '#149B7E'],
            normalizeFunction: 'polynomial'
        });

    }

};


function init_skycons() {

    if (typeof (Skycons) === 'undefined') { return; }
    console.log('init_skycons');

    var icons = new Skycons({
        "color": "#73879C"
    }),
        list = [
            "clear-day", "clear-night", "partly-cloudy-day",
            "partly-cloudy-night", "cloudy", "rain", "sleet", "snow", "wind",
            "fog"
        ],
        i;

    for (i = list.length; i--;)
        icons.set(list[i], list[i]);

    icons.play();

}


function init_chart_doughnut() {

    if (typeof (Chart) === 'undefined') { return; }

    console.log('init_chart_doughnut');

    if ($('.canvasDoughnut').length) {

        var chart_doughnut_settings = {
            type: 'doughnut',
            tooltipFillColor: "rgba(51, 51, 51, 0.55)",
            data: {
                labels: [
                    "Symbian",
                    "Blackberry",
                    "Other",
                    "Android",
                    "IOS"
                ],
                datasets: [{
                    data: [15, 20, 30, 10, 30],
                    backgroundColor: [
                        "#BDC3C7",
                        "#9B59B6",
                        "#E74C3C",
                        "#26B99A",
                        "#3498DB"
                    ],
                    hoverBackgroundColor: [
                        "#CFD4D8",
                        "#B370CF",
                        "#E95E4F",
                        "#36CAAB",
                        "#49A9EA"
                    ]
                }]
            },
            options: {
                legend: false,
                responsive: false
            }
        }

        $('.canvasDoughnut').each(function () {

            var chart_element = $(this);
            var chart_doughnut = new Chart(chart_element, chart_doughnut_settings);

        });

    }

}

function init_gauge() {

    if (typeof (Gauge) === 'undefined') { return; }

    console.log('init_gauge [' + $('.gauge-chart').length + ']');

    console.log('init_gauge');


    var chart_gauge_settings = {
        lines: 12,
        angle: 0,
        lineWidth: 0.4,
        pointer: {
            length: 0.75,
            strokeWidth: 0.042,
            color: '#1D212A'
        },
        limitMax: 'false',
        colorStart: '#1ABC9C',
        colorStop: '#1ABC9C',
        strokeColor: '#F0F3F3',
        generateGradient: true
    };


    if ($('#chart_gauge_01').length) {

        var chart_gauge_01_elem = document.getElementById('chart_gauge_01');
        var chart_gauge_01 = new Gauge(chart_gauge_01_elem).setOptions(chart_gauge_settings);

    }


    if ($('#gauge-text').length) {

        chart_gauge_01.maxValue = 6000;
        chart_gauge_01.animationSpeed = 32;
        chart_gauge_01.set(3200);
        chart_gauge_01.setTextField(document.getElementById("gauge-text"));

    }

    if ($('#chart_gauge_02').length) {

        var chart_gauge_02_elem = document.getElementById('chart_gauge_02');
        var chart_gauge_02 = new Gauge(chart_gauge_02_elem).setOptions(chart_gauge_settings);

    }


    if ($('#gauge-text2').length) {

        chart_gauge_02.maxValue = 9000;
        chart_gauge_02.animationSpeed = 32;
        chart_gauge_02.set(2400);
        chart_gauge_02.setTextField(document.getElementById("gauge-text2"));

    }


}

/* SPARKLINES */

function init_sparklines() {

    if (typeof (jQuery.fn.sparkline) === 'undefined') { return; }
    console.log('init_sparklines');


    $(".sparkline_one").sparkline([2, 4, 3, 4, 5, 4, 5, 4, 3, 4, 5, 6, 4, 5, 6, 3, 5, 4, 5, 4, 5, 4, 3, 4, 5, 6, 7, 5, 4, 3, 5, 6], {
        type: 'bar',
        height: '125',
        barWidth: 13,
        colorMap: {
            '7': '#a1a1a1'
        },
        barSpacing: 2,
        barColor: '#26B99A'
    });


    $(".sparkline_two").sparkline([2, 4, 3, 4, 5, 4, 5, 4, 3, 4, 5, 6, 7, 5, 4, 3, 5, 6], {
        type: 'bar',
        height: '40',
        barWidth: 9,
        colorMap: {
            '7': '#a1a1a1'
        },
        barSpacing: 2,
        barColor: '#26B99A'
    });


    $(".sparkline_three").sparkline([2, 4, 3, 4, 5, 4, 5, 4, 3, 4, 5, 6, 7, 5, 4, 3, 5, 6], {
        type: 'line',
        width: '200',
        height: '40',
        lineColor: '#26B99A',
        fillColor: 'rgba(223, 223, 223, 0.57)',
        lineWidth: 2,
        spotColor: '#26B99A',
        minSpotColor: '#26B99A'
    });


    $(".sparkline11").sparkline([2, 4, 3, 4, 5, 4, 5, 4, 3, 4, 6, 2, 4, 3, 4, 5, 4, 5, 4, 3], {
        type: 'bar',
        height: '40',
        barWidth: 8,
        colorMap: {
            '7': '#a1a1a1'
        },
        barSpacing: 2,
        barColor: '#26B99A'
    });


    $(".sparkline22").sparkline([2, 4, 3, 4, 7, 5, 4, 3, 5, 6, 2, 4, 3, 4, 5, 4, 5, 4, 3, 4, 6], {
        type: 'line',
        height: '40',
        width: '200',
        lineColor: '#26B99A',
        fillColor: '#ffffff',
        lineWidth: 3,
        spotColor: '#34495E',
        minSpotColor: '#34495E'
    });


    $(".sparkline_bar").sparkline([2, 4, 3, 4, 5, 4, 5, 4, 3, 4, 5, 6, 4, 5, 6, 3, 5], {
        type: 'bar',
        colorMap: {
            '7': '#a1a1a1'
        },
        barColor: '#26B99A'
    });


    $(".sparkline_area").sparkline([5, 6, 7, 9, 9, 5, 3, 2, 2, 4, 6, 7], {
        type: 'line',
        lineColor: '#26B99A',
        fillColor: '#26B99A',
        spotColor: '#4578a0',
        minSpotColor: '#728fb2',
        maxSpotColor: '#6d93c4',
        highlightSpotColor: '#ef5179',
        highlightLineColor: '#8ba8bf',
        spotRadius: 2.5,
        width: 85
    });


    $(".sparkline_line").sparkline([2, 4, 3, 4, 5, 4, 5, 4, 3, 4, 5, 6, 4, 5, 6, 3, 5], {
        type: 'line',
        lineColor: '#26B99A',
        fillColor: '#ffffff',
        width: 85,
        spotColor: '#34495E',
        minSpotColor: '#34495E'
    });


    $(".sparkline_pie").sparkline([1, 1, 2, 1], {
        type: 'pie',
        sliceColors: ['#26B99A', '#ccc', '#75BCDD', '#D66DE2']
    });


    $(".sparkline_discreet").sparkline([4, 6, 7, 7, 4, 3, 2, 1, 4, 4, 2, 4, 3, 7, 8, 9, 7, 6, 4, 3], {
        type: 'discrete',
        barWidth: 3,
        lineColor: '#26B99A',
        width: '85',
    });


};


/* AUTOCOMPLETE */

function init_autocomplete() {

    if (typeof ($.fn.autocomplete) === 'undefined') { return; }
    console.log('init_autocomplete');

    var countries = { AD: "Andorra", A2: "Andorra Test", AE: "United Arab Emirates", AF: "Afghanistan", AG: "Antigua and Barbuda", AI: "Anguilla", AL: "Albania", AM: "Armenia", AN: "Netherlands Antilles", AO: "Angola", AQ: "Antarctica", AR: "Argentina", AS: "American Samoa", AT: "Austria", AU: "Australia", AW: "Aruba", AX: "Åland Islands", AZ: "Azerbaijan", BA: "Bosnia and Herzegovina", BB: "Barbados", BD: "Bangladesh", BE: "Belgium", BF: "Burkina Faso", BG: "Bulgaria", BH: "Bahrain", BI: "Burundi", BJ: "Benin", BL: "Saint Barthélemy", BM: "Bermuda", BN: "Brunei", BO: "Bolivia", BQ: "British Antarctic Territory", BR: "Brazil", BS: "Bahamas", BT: "Bhutan", BV: "Bouvet Island", BW: "Botswana", BY: "Belarus", BZ: "Belize", CA: "Canada", CC: "Cocos [Keeling] Islands", CD: "Congo - Kinshasa", CF: "Central African Republic", CG: "Congo - Brazzaville", CH: "Switzerland", CI: "Côte d’Ivoire", CK: "Cook Islands", CL: "Chile", CM: "Cameroon", CN: "China", CO: "Colombia", CR: "Costa Rica", CS: "Serbia and Montenegro", CT: "Canton and Enderbury Islands", CU: "Cuba", CV: "Cape Verde", CX: "Christmas Island", CY: "Cyprus", CZ: "Czech Republic", DD: "East Germany", DE: "Germany", DJ: "Djibouti", DK: "Denmark", DM: "Dominica", DO: "Dominican Republic", DZ: "Algeria", EC: "Ecuador", EE: "Estonia", EG: "Egypt", EH: "Western Sahara", ER: "Eritrea", ES: "Spain", ET: "Ethiopia", FI: "Finland", FJ: "Fiji", FK: "Falkland Islands", FM: "Micronesia", FO: "Faroe Islands", FQ: "French Southern and Antarctic Territories", FR: "France", FX: "Metropolitan France", GA: "Gabon", GB: "United Kingdom", GD: "Grenada", GE: "Georgia", GF: "French Guiana", GG: "Guernsey", GH: "Ghana", GI: "Gibraltar", GL: "Greenland", GM: "Gambia", GN: "Guinea", GP: "Guadeloupe", GQ: "Equatorial Guinea", GR: "Greece", GS: "South Georgia and the South Sandwich Islands", GT: "Guatemala", GU: "Guam", GW: "Guinea-Bissau", GY: "Guyana", HK: "Hong Kong SAR China", HM: "Heard Island and McDonald Islands", HN: "Honduras", HR: "Croatia", HT: "Haiti", HU: "Hungary", ID: "Indonesia", IE: "Ireland", IL: "Israel", IM: "Isle of Man", IN: "India", IO: "British Indian Ocean Territory", IQ: "Iraq", IR: "Iran", IS: "Iceland", IT: "Italy", JE: "Jersey", JM: "Jamaica", JO: "Jordan", JP: "Japan", JT: "Johnston Island", KE: "Kenya", KG: "Kyrgyzstan", KH: "Cambodia", KI: "Kiribati", KM: "Comoros", KN: "Saint Kitts and Nevis", KP: "North Korea", KR: "South Korea", KW: "Kuwait", KY: "Cayman Islands", KZ: "Kazakhstan", LA: "Laos", LB: "Lebanon", LC: "Saint Lucia", LI: "Liechtenstein", LK: "Sri Lanka", LR: "Liberia", LS: "Lesotho", LT: "Lithuania", LU: "Luxembourg", LV: "Latvia", LY: "Libya", MA: "Morocco", MC: "Monaco", MD: "Moldova", ME: "Montenegro", MF: "Saint Martin", MG: "Madagascar", MH: "Marshall Islands", MI: "Midway Islands", MK: "Macedonia", ML: "Mali", MM: "Myanmar [Burma]", MN: "Mongolia", MO: "Macau SAR China", MP: "Northern Mariana Islands", MQ: "Martinique", MR: "Mauritania", MS: "Montserrat", MT: "Malta", MU: "Mauritius", MV: "Maldives", MW: "Malawi", MX: "Mexico", MY: "Malaysia", MZ: "Mozambique", NA: "Namibia", NC: "New Caledonia", NE: "Niger", NF: "Norfolk Island", NG: "Nigeria", NI: "Nicaragua", NL: "Netherlands", NO: "Norway", NP: "Nepal", NQ: "Dronning Maud Land", NR: "Nauru", NT: "Neutral Zone", NU: "Niue", NZ: "New Zealand", OM: "Oman", PA: "Panama", PC: "Pacific Islands Trust Territory", PE: "Peru", PF: "French Polynesia", PG: "Papua New Guinea", PH: "Philippines", PK: "Pakistan", PL: "Poland", PM: "Saint Pierre and Miquelon", PN: "Pitcairn Islands", PR: "Puerto Rico", PS: "Palestinian Territories", PT: "Portugal", PU: "U.S. Miscellaneous Pacific Islands", PW: "Palau", PY: "Paraguay", PZ: "Panama Canal Zone", QA: "Qatar", RE: "Réunion", RO: "Romania", RS: "Serbia", RU: "Russia", RW: "Rwanda", SA: "Saudi Arabia", SB: "Solomon Islands", SC: "Seychelles", SD: "Sudan", SE: "Sweden", SG: "Singapore", SH: "Saint Helena", SI: "Slovenia", SJ: "Svalbard and Jan Mayen", SK: "Slovakia", SL: "Sierra Leone", SM: "San Marino", SN: "Senegal", SO: "Somalia", SR: "Suriname", ST: "São Tomé and Príncipe", SU: "Union of Soviet Socialist Republics", SV: "El Salvador", SY: "Syria", SZ: "Swaziland", TC: "Turks and Caicos Islands", TD: "Chad", TF: "French Southern Territories", TG: "Togo", TH: "Thailand", TJ: "Tajikistan", TK: "Tokelau", TL: "Timor-Leste", TM: "Turkmenistan", TN: "Tunisia", TO: "Tonga", TR: "Turkey", TT: "Trinidad and Tobago", TV: "Tuvalu", TW: "Taiwan", TZ: "Tanzania", UA: "Ukraine", UG: "Uganda", UM: "U.S. Minor Outlying Islands", US: "United States", UY: "Uruguay", UZ: "Uzbekistan", VA: "Vatican City", VC: "Saint Vincent and the Grenadines", VD: "North Vietnam", VE: "Venezuela", VG: "British Virgin Islands", VI: "U.S. Virgin Islands", VN: "Vietnam", VU: "Vanuatu", WF: "Wallis and Futuna", WK: "Wake Island", WS: "Samoa", YD: "People's Democratic Republic of Yemen", YE: "Yemen", YT: "Mayotte", ZA: "South Africa", ZM: "Zambia", ZW: "Zimbabwe", ZZ: "Unknown or Invalid Region" };

    var countriesArray = $.map(countries, function (value, key) {
        return {
            value: value,
            data: key
        };
    });

    // initialize autocomplete with custom appendTo
    $('#autocomplete-custom-append').autocomplete({
        lookup: countriesArray
    });

};

/* AUTOSIZE */

function init_autosize() {

    if (typeof $.fn.autosize !== 'undefined') {

        autosize($('.resizable_textarea'));

    }

};

/* PARSLEY */

function init_parsley() {

    if (typeof (parsley) === 'undefined') { return; }
    console.log('init_parsley');

    $/*.listen*/('parsley:field:validate', function () {
        validateFront();
    });
    $('#demo-form .btn').on('click', function () {
        $('#demo-form').parsley().validate();
        validateFront();
    });
    var validateFront = function () {
        if (true === $('#demo-form').parsley().isValid()) {
            $('.bs-callout-info').removeClass('hidden');
            $('.bs-callout-warning').addClass('hidden');
        } else {
            $('.bs-callout-info').addClass('hidden');
            $('.bs-callout-warning').removeClass('hidden');
        }
    };

    $/*.listen*/('parsley:field:validate', function () {
        validateFront();
    });
    $('#demo-form2 .btn').on('click', function () {
        $('#demo-form2').parsley().validate();
        validateFront();
    });
    var validateFront = function () {
        if (true === $('#demo-form2').parsley().isValid()) {
            $('.bs-callout-info').removeClass('hidden');
            $('.bs-callout-warning').addClass('hidden');
        } else {
            $('.bs-callout-info').addClass('hidden');
            $('.bs-callout-warning').removeClass('hidden');
        }
    };

    try {
        hljs.initHighlightingOnLoad();
    } catch (err) { }

};


/* INPUTS */

function onAddTag(tag) {
    alert("Added a tag: " + tag);
}

function onRemoveTag(tag) {
    alert("Removed a tag: " + tag);
}

function onChangeTag(input, tag) {
    alert("Changed a tag: " + tag);
}

//tags input
function init_TagsInput() {

    if (typeof $.fn.tagsInput !== 'undefined') {

        $('#tags_1').tagsInput({
            width: 'auto'
        });

    }

};

/* SELECT2 */

function init_select2() {

    if (typeof (select2) === 'undefined') { return; }
    console.log('init_toolbox');

    $(".select2_single").select2({
        placeholder: "Select a state",
        allowClear: true
    });
    $(".select2_group").select2({});
    $(".select2_multiple").select2({
        maximumSelectionLength: 4,
        placeholder: "With Max Selection limit 4",
        allowClear: true
    });

};

/* WYSIWYG EDITOR */

function init_wysiwyg() {

    if (typeof ($.fn.wysiwyg) === 'undefined') { return; }
    console.log('init_wysiwyg');

    function init_ToolbarBootstrapBindings() {
        var fonts = ['Serif', 'Sans', 'Arial', 'Arial Black', 'Courier',
            'Courier New', 'Comic Sans MS', 'Helvetica', 'Impact', 'Lucida Grande', 'Lucida Sans', 'Tahoma', 'Times',
            'Times New Roman', 'Verdana'
        ],
            fontTarget = $('[title=Font]').siblings('.dropdown-menu');
        $.each(fonts, function (idx, fontName) {
            fontTarget.append($('<li><a data-edit="fontName ' + fontName + '" style="font-family:\'' + fontName + '\'">' + fontName + '</a></li>'));
        });
        $('a[title]').tooltip({
            container: 'body'
        });
        $('.dropdown-menu input').click(function () {
            return false;
        })
            .change(function () {
                $(this).parent('.dropdown-menu').siblings('.dropdown-toggle').dropdown('toggle');
            })
            .keydown('esc', function () {
                this.value = '';
                $(this).change();
            });

        $('[data-role=magic-overlay]').each(function () {
            var overlay = $(this),
                target = $(overlay.data('target'));
            overlay.css('opacity', 0).css('position', 'absolute').offset(target.offset()).width(target.outerWidth()).height(target.outerHeight());
        });

        if ("onwebkitspeechchange" in document.createElement("input")) {
            var editorOffset = $('#editor').offset();

            $('.voiceBtn').css('position', 'absolute').offset({
                top: editorOffset.top,
                left: editorOffset.left + $('#editor').innerWidth() - 35
            });
        } else {
            $('.voiceBtn').hide();
        }
    }

    function showErrorAlert(reason, detail) {
        var msg = '';
        if (reason === 'unsupported-file-type') {
            msg = "Unsupported format " + detail;
        } else {
            console.log("error uploading file", reason, detail);
        }
        $('<div class="alert"> <button type="button" class="close" data-dismiss="alert">&times;</button>' +
            '<strong>File upload error</strong> ' + msg + ' </div>').prependTo('#alerts');
    }

    $('.editor-wrapper').each(function () {
        var id = $(this).attr('id');	//editor-one

        $(this).wysiwyg({
            toolbarSelector: '[data-target="#' + id + '"]',
            fileUploadError: showErrorAlert
        });
    });


    window.prettyPrint;
    prettyPrint();

};

/* CROPPER */

function init_cropper() {


    if (typeof ($.fn.cropper) === 'undefined') { return; }
    console.log('init_cropper');

    var $image = $('#image');
    var $download = $('#download');
    var $dataX = $('#dataX');
    var $dataY = $('#dataY');
    var $dataHeight = $('#dataHeight');
    var $dataWidth = $('#dataWidth');
    var $dataRotate = $('#dataRotate');
    var $dataScaleX = $('#dataScaleX');
    var $dataScaleY = $('#dataScaleY');
    var options = {
        aspectRatio: 16 / 9,
        preview: '.img-preview',
        crop: function (e) {
            $dataX.val(Math.round(e.x));
            $dataY.val(Math.round(e.y));
            $dataHeight.val(Math.round(e.height));
            $dataWidth.val(Math.round(e.width));
            $dataRotate.val(e.rotate);
            $dataScaleX.val(e.scaleX);
            $dataScaleY.val(e.scaleY);
        }
    };


    // Tooltip
    $('[data-toggle="tooltip"]').tooltip();


    // Cropper
    $image.on({
        'build.cropper': function (e) {
            console.log(e.type);
        },
        'built.cropper': function (e) {
            console.log(e.type);
        },
        'cropstart.cropper': function (e) {
            console.log(e.type, e.action);
        },
        'cropmove.cropper': function (e) {
            console.log(e.type, e.action);
        },
        'cropend.cropper': function (e) {
            console.log(e.type, e.action);
        },
        'crop.cropper': function (e) {
            console.log(e.type, e.x, e.y, e.width, e.height, e.rotate, e.scaleX, e.scaleY);
        },
        'zoom.cropper': function (e) {
            console.log(e.type, e.ratio);
        }
    }).cropper(options);


    // Buttons
    if (!$.isFunction(document.createElement('canvas').getContext)) {
        $('button[data-method="getCroppedCanvas"]').prop('disabled', true);
    }

    if (typeof document.createElement('cropper').style.transition === 'undefined') {
        $('button[data-method="rotate"]').prop('disabled', true);
        $('button[data-method="scale"]').prop('disabled', true);
    }


    // Download
    if (typeof $download[0].download === 'undefined') {
        $download.addClass('disabled');
    }


    // Options
    $('.docs-toggles').on('change', 'input', function () {
        var $this = $(this);
        var name = $this.attr('name');
        var type = $this.prop('type');
        var cropBoxData;
        var canvasData;

        if (!$image.data('cropper')) {
            return;
        }

        if (type === 'checkbox') {
            options[name] = $this.prop('checked');
            cropBoxData = $image.cropper('getCropBoxData');
            canvasData = $image.cropper('getCanvasData');

            options.built = function () {
                $image.cropper('setCropBoxData', cropBoxData);
                $image.cropper('setCanvasData', canvasData);
            };
        } else if (type === 'radio') {
            options[name] = $this.val();
        }

        $image.cropper('destroy').cropper(options);
    });


    // Methods
    $('.docs-buttons').on('click', '[data-method]', function () {
        var $this = $(this);
        var data = $this.data();
        var $target;
        var result;

        if ($this.prop('disabled') || $this.hasClass('disabled')) {
            return;
        }

        if ($image.data('cropper') && data.method) {
            data = $.extend({}, data); // Clone a new one

            if (typeof data.target !== 'undefined') {
                $target = $(data.target);

                if (typeof data.option === 'undefined') {
                    try {
                        data.option = JSON.parse($target.val());
                    } catch (e) {
                        console.log(e.message);
                    }
                }
            }

            result = $image.cropper(data.method, data.option, data.secondOption);

            switch (data.method) {
                case 'scaleX':
                case 'scaleY':
                    $(this).data('option', -data.option);
                    break;

                case 'getCroppedCanvas':
                    if (result) {

                        // Bootstrap's Modal
                        $('#getCroppedCanvasModal').modal().find('.modal-body').html(result);

                        if (!$download.hasClass('disabled')) {
                            $download.attr('href', result.toDataURL());
                        }
                    }

                    break;
            }

            if ($.isPlainObject(result) && $target) {
                try {
                    $target.val(JSON.stringify(result));
                } catch (e) {
                    console.log(e.message);
                }
            }

        }
    });

    // Keyboard
    $(document.body).on('keydown', function (e) {
        if (!$image.data('cropper') || this.scrollTop > 300) {
            return;
        }

        switch (e.which) {
            case 37:
                e.preventDefault();
                $image.cropper('move', -1, 0);
                break;

            case 38:
                e.preventDefault();
                $image.cropper('move', 0, -1);
                break;

            case 39:
                e.preventDefault();
                $image.cropper('move', 1, 0);
                break;

            case 40:
                e.preventDefault();
                $image.cropper('move', 0, 1);
                break;
        }
    });

    // Import image
    var $inputImage = $('#inputImage');
    var URL = window.URL || window.webkitURL;
    var blobURL;

    if (URL) {
        $inputImage.change(function () {
            var files = this.files;
            var file;

            if (!$image.data('cropper')) {
                return;
            }

            if (files && files.length) {
                file = files[0];

                if (/^image\/\w+$/.test(file.type)) {
                    blobURL = URL.createObjectURL(file);
                    $image.one('built.cropper', function () {

                        // Revoke when load complete
                        URL.revokeObjectURL(blobURL);
                    }).cropper('reset').cropper('replace', blobURL);
                    $inputImage.val('');
                } else {
                    window.alert('Please choose an image file.');
                }
            }
        });
    } else {
        $inputImage.prop('disabled', true).parent().addClass('disabled');
    }


};

/* CROPPER --- end */

/* KNOB */

function init_knob() {

    if (typeof ($.fn.knob) === 'undefined') { return; }
    console.log('init_knob');

    $(".knob").knob({
        change: function (value) {
            //console.log("change : " + value);
        },
        release: function (value) {
            //console.log(this.$.attr('value'));
            console.log("release : " + value);
        },
        cancel: function () {
            console.log("cancel : ", this);
        },
        /*format : function (value) {
         return value + '%';
         },*/
        draw: function () {

            // "tron" case
            if (this.$.data('skin') == 'tron') {

                this.cursorExt = 0.3;

                var a = this.arc(this.cv) // Arc
                    ,
                    pa // Previous arc
                    , r = 1;

                this.g.lineWidth = this.lineWidth;

                if (this.o.displayPrevious) {
                    pa = this.arc(this.v);
                    this.g.beginPath();
                    this.g.strokeStyle = this.pColor;
                    this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, pa.s, pa.e, pa.d);
                    this.g.stroke();
                }

                this.g.beginPath();
                this.g.strokeStyle = r ? this.o.fgColor : this.fgColor;
                this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, a.s, a.e, a.d);
                this.g.stroke();

                this.g.lineWidth = 2;
                this.g.beginPath();
                this.g.strokeStyle = this.o.fgColor;
                this.g.arc(this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
                this.g.stroke();

                return false;
            }
        }

    });

    // Example of infinite knob, iPod click wheel
    var v, up = 0,
        down = 0,
        i = 0,
        $idir = $("div.idir"),
        $ival = $("div.ival"),
        incr = function () {
            i++;
            $idir.show().html("+").fadeOut();
            $ival.html(i);
        },
        decr = function () {
            i--;
            $idir.show().html("-").fadeOut();
            $ival.html(i);
        };
    $("input.infinite").knob({
        min: 0,
        max: 20,
        stopper: false,
        change: function () {
            if (v > this.cv) {
                if (up) {
                    decr();
                    up = 0;
                } else {
                    up = 1;
                    down = 0;
                }
            } else {
                if (v < this.cv) {
                    if (down) {
                        incr();
                        down = 0;
                    } else {
                        down = 1;
                        up = 0;
                    }
                }
            }
            v = this.cv;
        }
    });

};

/* INPUT MASK */

function init_InputMask() {

    if (typeof ($.fn.inputmask) === 'undefined') { return; }
    console.log('init_InputMask');

    $(":input").inputmask();

};

/* COLOR PICKER */

function init_ColorPicker() {

    if (typeof ($.fn.colorpicker) === 'undefined') { return; }
    console.log('init_ColorPicker');

    $('.demo1').colorpicker();
    $('.demo2').colorpicker();

    $('#demo_forceformat').colorpicker({
        format: 'rgba',
        horizontal: true
    });

    $('#demo_forceformat3').colorpicker({
        format: 'rgba',
    });

    $('.demo-auto').colorpicker();

};


/* ION RANGE SLIDER */

function init_IonRangeSlider() {

    if (typeof ($.fn.ionRangeSlider) === 'undefined') { return; }
    console.log('init_IonRangeSlider');

    $("#range_27").ionRangeSlider({
        type: "double",
        min: 1000000,
        max: 2000000,
        grid: true,
        force_edges: true
    });
    $("#range").ionRangeSlider({
        hide_min_max: true,
        keyboard: true,
        min: 0,
        max: 5000,
        from: 1000,
        to: 4000,
        type: 'double',
        step: 1,
        prefix: "$",
        grid: true
    });
    $("#range_25").ionRangeSlider({
        type: "double",
        min: 1000000,
        max: 2000000,
        grid: true
    });
    $("#range_26").ionRangeSlider({
        type: "double",
        min: 0,
        max: 10000,
        step: 500,
        grid: true,
        grid_snap: true
    });
    $("#range_31").ionRangeSlider({
        type: "double",
        min: 0,
        max: 100,
        from: 30,
        to: 70,
        from_fixed: true
    });
    $(".range_min_max").ionRangeSlider({
        type: "double",
        min: 0,
        max: 100,
        from: 30,
        to: 70,
        max_interval: 50
    });
    $(".range_time24").ionRangeSlider({
        min: +moment().subtract(12, "hours").format("X"),
        max: +moment().format("X"),
        from: +moment().subtract(6, "hours").format("X"),
        grid: true,
        force_edges: true,
        prettify: function (num) {
            var m = moment(num, "X");
            return m.format("Do MMMM, HH:mm");
        }
    });

};


/* DATERANGEPICKER */

function init_daterangepicker() {

    if (typeof ($.fn.daterangepicker) === 'undefined') { return; }
    console.log('init_daterangepicker');

    var cb = function (start, end, label) {
        console.log(start.toISOString(), end.toISOString(), label);
        $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    };

    var optionSet1 = {
        startDate: moment().subtract(29, 'days'),
        endDate: moment(),
        minDate: '01/01/2012',
        maxDate: '12/31/2015',
        dateLimit: {
            days: 60
        },
        showDropdowns: true,
        showWeekNumbers: true,
        timePicker: false,
        timePickerIncrement: 1,
        timePicker12Hour: true,
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        opens: 'left',
        buttonClasses: ['btn btn-default'],
        applyClass: 'btn-small btn-primary',
        cancelClass: 'btn-small',
        format: 'MM/DD/YYYY',
        separator: ' to ',
        locale: {
            applyLabel: 'Submit',
            cancelLabel: 'Clear',
            fromLabel: 'From',
            toLabel: 'To',
            customRangeLabel: 'Custom',
            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            firstDay: 1
        }
    };

    $('#reportrange span').html(moment().subtract(29, 'days').format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));
    $('#reportrange').daterangepicker(optionSet1, cb);
    $('#reportrange').on('show.daterangepicker', function () {
        console.log("show event fired");
    });
    $('#reportrange').on('hide.daterangepicker', function () {
        console.log("hide event fired");
    });
    $('#reportrange').on('apply.daterangepicker', function (ev, picker) {
        console.log("apply event fired, start/end dates are " + picker.startDate.format('MMMM D, YYYY') + " to " + picker.endDate.format('MMMM D, YYYY'));
    });
    $('#reportrange').on('cancel.daterangepicker', function (ev, picker) {
        console.log("cancel event fired");
    });
    $('#options1').click(function () {
        $('#reportrange').data('daterangepicker').setOptions(optionSet1, cb);
    });
    $('#options2').click(function () {
        $('#reportrange').data('daterangepicker').setOptions(optionSet2, cb);
    });
    $('#destroy').click(function () {
        $('#reportrange').data('daterangepicker').remove();
    });

}

function init_daterangepicker_right() {

    if (typeof ($.fn.daterangepicker) === 'undefined') { return; }
    console.log('init_daterangepicker_right');

    var cb = function (start, end, label) {
        console.log(start.toISOString(), end.toISOString(), label);
        $('#reportrange_right span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    };

    var optionSet1 = {
        startDate: moment().subtract(29, 'days'),
        endDate: moment(),
        minDate: '01/01/2012',
        maxDate: '12/31/2020',
        dateLimit: {
            days: 60
        },
        showDropdowns: true,
        showWeekNumbers: true,
        timePicker: false,
        timePickerIncrement: 1,
        timePicker12Hour: true,
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        opens: 'right',
        buttonClasses: ['btn btn-default'],
        applyClass: 'btn-small btn-primary',
        cancelClass: 'btn-small',
        format: 'MM/DD/YYYY',
        separator: ' to ',
        locale: {
            applyLabel: 'Submit',
            cancelLabel: 'Clear',
            fromLabel: 'From',
            toLabel: 'To',
            customRangeLabel: 'Custom',
            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            firstDay: 1
        }
    };

    $('#reportrange_right span').html(moment().subtract(29, 'days').format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));

    $('#reportrange_right').daterangepicker(optionSet1, cb);

    $('#reportrange_right').on('show.daterangepicker', function () {
        console.log("show event fired");
    });
    $('#reportrange_right').on('hide.daterangepicker', function () {
        console.log("hide event fired");
    });
    $('#reportrange_right').on('apply.daterangepicker', function (ev, picker) {
        console.log("apply event fired, start/end dates are " + picker.startDate.format('MMMM D, YYYY') + " to " + picker.endDate.format('MMMM D, YYYY'));
    });
    $('#reportrange_right').on('cancel.daterangepicker', function (ev, picker) {
        console.log("cancel event fired");
    });

    $('#options1').click(function () {
        $('#reportrange_right').data('daterangepicker').setOptions(optionSet1, cb);
    });

    $('#options2').click(function () {
        $('#reportrange_right').data('daterangepicker').setOptions(optionSet2, cb);
    });

    $('#destroy').click(function () {
        $('#reportrange_right').data('daterangepicker').remove();
    });

}

function init_daterangepicker_single_call() {

    if (typeof ($.fn.daterangepicker) === 'undefined') { return; }
    console.log('init_daterangepicker_single_call');

    $('#single_cal1').daterangepicker({
        singleDatePicker: true,
        singleClasses: "picker_1"
    }, function (start, end, label) {
        console.log(start.toISOString(), end.toISOString(), label);
    });
    $('#single_cal2').daterangepicker({
        singleDatePicker: true,
        singleClasses: "picker_2"
    }, function (start, end, label) {
        console.log(start.toISOString(), end.toISOString(), label);
    });
    $('#single_cal3').daterangepicker({
        singleDatePicker: true,
        singleClasses: "picker_3"
    }, function (start, end, label) {
        console.log(start.toISOString(), end.toISOString(), label);
    });
    $('#single_cal4').daterangepicker({
        singleDatePicker: true,
        singleClasses: "picker_4"
    }, function (start, end, label) {
        console.log(start.toISOString(), end.toISOString(), label);
    });


}


function init_daterangepicker_reservation() {

    if (typeof ($.fn.daterangepicker) === 'undefined') { return; }
    console.log('init_daterangepicker_reservation');

    $('#reservation').daterangepicker(null, function (start, end, label) {
        console.log(start.toISOString(), end.toISOString(), label);
    });

    $('#reservation-time').daterangepicker({
        timePicker: true,
        timePickerIncrement: 30,
        locale: {
            format: 'MM/DD/YYYY h:mm A'
        }
    });

}

/* SMART WIZARD */

function init_SmartWizard() {

    if (typeof ($.fn.smartWizard) === 'undefined') { return; }
    console.log('init_SmartWizard');

    $('#wizard').smartWizard();

    $('#wizard_verticle').smartWizard({
        transitionEffect: 'slide'
    });

    $('.buttonNext').addClass('btn btn-success');
    $('.buttonPrevious').addClass('btn btn-primary');
    $('.buttonFinish').addClass('btn btn-default');

};


/* VALIDATOR */

function init_validator() {

    if (typeof (validator) === 'undefined') { return; }
    console.log('init_validator');

    // initialize the validator function
    validator.message.date = 'not a real date';

    // validate a field on "blur" event, a 'select' on 'change' event & a '.reuired' classed multifield on 'keyup':
    $('form')
        .on('blur', 'input[required], input.optional, select.required', validator.checkField)
        .on('change', 'select.required', validator.checkField)
        .on('keypress', 'input[required][pattern]', validator.keypress);

    $('.multi.required').on('keyup blur', 'input', function () {
        validator.checkField.apply($(this).siblings().last()[0]);
    });

    $('form').submit(function (e) {
        e.preventDefault();
        var submit = true;

        // evaluate the form using generic validaing
        if (!validator.checkAll($(this))) {
            submit = false;
        }

        if (submit)
            this.submit();

        return false;
    });

};

/* PNotify */

function init_PNotify() {

    if (typeof (PNotify) === 'undefined') { return; }
    console.log('init_PNotify');
};


/* CUSTOM NOTIFICATION */

function init_CustomNotification() {

    console.log('run_customtabs');

    if (typeof (CustomTabs) === 'undefined') { return; }
    console.log('init_CustomTabs');

    var cnt = 10;

    TabbedNotification = function (options) {
        var message = "<div id='ntf" + cnt + "' class='text alert-" + options.type + "' style='display:none'><h2><i class='fa fa-bell'></i> " + options.title +
            "</h2><div class='close'><a href='javascript:;' class='notification_close'><i class='fa fa-close'></i></a></div><p>" + options.text + "</p></div>";

        if (!document.getElementById('custom_notifications')) {
            alert('doesnt exists');
        } else {
            $('#custom_notifications ul.notifications').append("<li><a id='ntlink" + cnt + "' class='alert-" + options.type + "' href='#ntf" + cnt + "'><i class='fa fa-bell animated shake'></i></a></li>");
            $('#custom_notifications #notif-group').append(message);
            cnt++;
            CustomTabs(options);
        }
    };

    CustomTabs = function (options) {
        $('.tabbed_notifications > div').hide();
        $('.tabbed_notifications > div:first-of-type').show();
        $('#custom_notifications').removeClass('dsp_none');
        $('.notifications a').click(function (e) {
            e.preventDefault();
            var $this = $(this),
                tabbed_notifications = '#' + $this.parents('.notifications').data('tabbed_notifications'),
                others = $this.closest('li').siblings().children('a'),
                target = $this.attr('href');
            others.removeClass('active');
            $this.addClass('active');
            $(tabbed_notifications).children('div').hide();
            $(target).show();
        });
    };

    CustomTabs();

    var tabid = idname = '';

    $(document).on('click', '.notification_close', function (e) {
        idname = $(this).parent().parent().attr("id");
        tabid = idname.substr(-2);
        $('#ntf' + tabid).remove();
        $('#ntlink' + tabid).parent().remove();
        $('.notifications a').first().addClass('active');
        $('#notif-group div').first().css('display', 'block');
    });

};

/* EASYPIECHART */

function init_EasyPieChart() {

    if (typeof ($.fn.easyPieChart) === 'undefined') { return; }
    console.log('init_EasyPieChart');

    $('.chart').easyPieChart({
        easing: 'easeOutElastic',
        delay: 3000,
        barColor: '#26B99A',
        trackColor: '#fff',
        scaleColor: false,
        lineWidth: 20,
        trackWidth: 16,
        lineCap: 'butt',
        onStep: function (from, to, percent) {
            $(this.el).find('.percent').text(Math.round(percent));
        }
    });
    var chart = window.chart = $('.chart').data('easyPieChart');
    $('.js_update').on('click', function () {
        chart.update(Math.random() * 200 - 100);
    });

    //hover and retain popover when on popover content
    var originalLeave = $.fn.popover.Constructor.prototype.leave;
    $.fn.popover.Constructor.prototype.leave = function (obj) {
        var self = obj instanceof this.constructor ?
            obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type);
        var container, timeout;

        originalLeave.call(this, obj);

        if (obj.currentTarget) {
            container = $(obj.currentTarget).siblings('.popover');
            timeout = self.timeout;
            container.one('mouseenter', function () {
                //We entered the actual popover – call off the dogs
                clearTimeout(timeout);
                //Let's monitor popover content instead
                container.one('mouseleave', function () {
                    $.fn.popover.Constructor.prototype.leave.call(self, self);
                });
            });
        }
    };

    $('body').popover({
        selector: '[data-popover]',
        trigger: 'click hover',
        delay: {
            show: 50,
            hide: 400
        }
    });

};


function init_charts() {

    console.log('run_charts  typeof [' + typeof (Chart) + ']');

    if (typeof (Chart) === 'undefined') { return; }

    console.log('init_charts');


    Chart.defaults.global.legend = {
        enabled: false
    };



    if ($('#canvas_line').length) {

        var canvas_line_00 = new Chart(document.getElementById("canvas_line"), {
            type: 'line',
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [{
                    label: "My First dataset",
                    backgroundColor: "rgba(38, 185, 154, 0.31)",
                    borderColor: "rgba(38, 185, 154, 0.7)",
                    pointBorderColor: "rgba(38, 185, 154, 0.7)",
                    pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointBorderWidth: 1,
                    data: [31, 74, 6, 39, 20, 85, 7]
                }, {
                    label: "My Second dataset",
                    backgroundColor: "rgba(3, 88, 106, 0.3)",
                    borderColor: "rgba(3, 88, 106, 0.70)",
                    pointBorderColor: "rgba(3, 88, 106, 0.70)",
                    pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(151,187,205,1)",
                    pointBorderWidth: 1,
                    data: [82, 23, 66, 9, 99, 4, 2]
                }]
            },
        });

    }


    if ($('#canvas_line1').length) {

        var canvas_line_01 = new Chart(document.getElementById("canvas_line1"), {
            type: 'line',
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [{
                    label: "My First dataset",
                    backgroundColor: "rgba(38, 185, 154, 0.31)",
                    borderColor: "rgba(38, 185, 154, 0.7)",
                    pointBorderColor: "rgba(38, 185, 154, 0.7)",
                    pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointBorderWidth: 1,
                    data: [31, 74, 6, 39, 20, 85, 7]
                }, {
                    label: "My Second dataset",
                    backgroundColor: "rgba(3, 88, 106, 0.3)",
                    borderColor: "rgba(3, 88, 106, 0.70)",
                    pointBorderColor: "rgba(3, 88, 106, 0.70)",
                    pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(151,187,205,1)",
                    pointBorderWidth: 1,
                    data: [82, 23, 66, 9, 99, 4, 2]
                }]
            },
        });

    }


    if ($('#canvas_line2').length) {

        var canvas_line_02 = new Chart(document.getElementById("canvas_line2"), {
            type: 'line',
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [{
                    label: "My First dataset",
                    backgroundColor: "rgba(38, 185, 154, 0.31)",
                    borderColor: "rgba(38, 185, 154, 0.7)",
                    pointBorderColor: "rgba(38, 185, 154, 0.7)",
                    pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointBorderWidth: 1,
                    data: [31, 74, 6, 39, 20, 85, 7]
                }, {
                    label: "My Second dataset",
                    backgroundColor: "rgba(3, 88, 106, 0.3)",
                    borderColor: "rgba(3, 88, 106, 0.70)",
                    pointBorderColor: "rgba(3, 88, 106, 0.70)",
                    pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(151,187,205,1)",
                    pointBorderWidth: 1,
                    data: [82, 23, 66, 9, 99, 4, 2]
                }]
            },
        });

    }


    if ($('#canvas_line3').length) {

        var canvas_line_03 = new Chart(document.getElementById("canvas_line3"), {
            type: 'line',
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [{
                    label: "My First dataset",
                    backgroundColor: "rgba(38, 185, 154, 0.31)",
                    borderColor: "rgba(38, 185, 154, 0.7)",
                    pointBorderColor: "rgba(38, 185, 154, 0.7)",
                    pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointBorderWidth: 1,
                    data: [31, 74, 6, 39, 20, 85, 7]
                }, {
                    label: "My Second dataset",
                    backgroundColor: "rgba(3, 88, 106, 0.3)",
                    borderColor: "rgba(3, 88, 106, 0.70)",
                    pointBorderColor: "rgba(3, 88, 106, 0.70)",
                    pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(151,187,205,1)",
                    pointBorderWidth: 1,
                    data: [82, 23, 66, 9, 99, 4, 2]
                }]
            },
        });

    }


    if ($('#canvas_line4').length) {

        var canvas_line_04 = new Chart(document.getElementById("canvas_line4"), {
            type: 'line',
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [{
                    label: "My First dataset",
                    backgroundColor: "rgba(38, 185, 154, 0.31)",
                    borderColor: "rgba(38, 185, 154, 0.7)",
                    pointBorderColor: "rgba(38, 185, 154, 0.7)",
                    pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointBorderWidth: 1,
                    data: [31, 74, 6, 39, 20, 85, 7]
                }, {
                    label: "My Second dataset",
                    backgroundColor: "rgba(3, 88, 106, 0.3)",
                    borderColor: "rgba(3, 88, 106, 0.70)",
                    pointBorderColor: "rgba(3, 88, 106, 0.70)",
                    pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(151,187,205,1)",
                    pointBorderWidth: 1,
                    data: [82, 23, 66, 9, 99, 4, 2]
                }]
            },
        });

    }


    // Line chart

    if ($('#lineChart').length) {

        var ctx = document.getElementById("lineChart");
        var lineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [{
                    label: "My First dataset",
                    backgroundColor: "rgba(38, 185, 154, 0.31)",
                    borderColor: "rgba(38, 185, 154, 0.7)",
                    pointBorderColor: "rgba(38, 185, 154, 0.7)",
                    pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointBorderWidth: 1,
                    data: [31, 74, 6, 39, 20, 85, 7]
                }, {
                    label: "My Second dataset",
                    backgroundColor: "rgba(3, 88, 106, 0.3)",
                    borderColor: "rgba(3, 88, 106, 0.70)",
                    pointBorderColor: "rgba(3, 88, 106, 0.70)",
                    pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(151,187,205,1)",
                    pointBorderWidth: 1,
                    data: [82, 23, 66, 9, 99, 4, 2]
                }]
            },
        });

    }

    // Bar chart

    if ($('#mybarChart').length) {

        var ctx = document.getElementById("mybarChart");
        var mybarChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [{
                    label: '# of Votes',
                    backgroundColor: "#26B99A",
                    data: [51, 30, 40, 28, 92, 50, 45]
                }, {
                    label: '# of Votes',
                    backgroundColor: "#03586A",
                    data: [41, 56, 25, 48, 72, 34, 12]
                }]
            },

            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });

    }


    // Doughnut chart

    if ($('#canvasDoughnut').length) {

        var ctx = document.getElementById("canvasDoughnut");
        var data = {
            labels: [
                "Dark Grey",
                "Purple Color",
                "Gray Color",
                "Green Color",
                "Blue Color"
            ],
            datasets: [{
                data: [120, 50, 140, 180, 100],
                backgroundColor: [
                    "#455C73",
                    "#9B59B6",
                    "#BDC3C7",
                    "#26B99A",
                    "#3498DB"
                ],
                hoverBackgroundColor: [
                    "#34495E",
                    "#B370CF",
                    "#CFD4D8",
                    "#36CAAB",
                    "#49A9EA"
                ]

            }]
        };

        var canvasDoughnut = new Chart(ctx, {
            type: 'doughnut',
            tooltipFillColor: "rgba(51, 51, 51, 0.55)",
            data: data
        });

    }

    // Radar chart

    if ($('#canvasRadar').length) {

        var ctx = document.getElementById("canvasRadar");
        var data = {
            labels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
            datasets: [{
                label: "My First dataset",
                backgroundColor: "rgba(3, 88, 106, 0.2)",
                borderColor: "rgba(3, 88, 106, 0.80)",
                pointBorderColor: "rgba(3, 88, 106, 0.80)",
                pointBackgroundColor: "rgba(3, 88, 106, 0.80)",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                data: [65, 59, 90, 81, 56, 55, 40]
            }, {
                label: "My Second dataset",
                backgroundColor: "rgba(38, 185, 154, 0.2)",
                borderColor: "rgba(38, 185, 154, 0.85)",
                pointColor: "rgba(38, 185, 154, 0.85)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: [28, 48, 40, 19, 96, 27, 100]
            }]
        };

        var canvasRadar = new Chart(ctx, {
            type: 'radar',
            data: data,
        });

    }


    // Pie chart
    if ($('#pieChart').length) {

        var ctx = document.getElementById("pieChart");
        var data = {
            datasets: [{
                data: [120, 50, 140, 180, 100],
                backgroundColor: [
                    "#455C73",
                    "#9B59B6",
                    "#BDC3C7",
                    "#26B99A",
                    "#3498DB"
                ],
                label: 'My dataset' // for legend
            }],
            labels: [
                "Dark Gray",
                "Purple",
                "Gray",
                "Green",
                "Blue"
            ]
        };

        var pieChart = new Chart(ctx, {
            data: data,
            type: 'pie',
            otpions: {
                legend: false
            }
        });

    }


    // PolarArea chart

    if ($('#polarArea').length) {

        var ctx = document.getElementById("polarArea");
        var data = {
            datasets: [{
                data: [120, 50, 140, 180, 100],
                backgroundColor: [
                    "#455C73",
                    "#9B59B6",
                    "#BDC3C7",
                    "#26B99A",
                    "#3498DB"
                ],
                label: 'My dataset'
            }],
            labels: [
                "Dark Gray",
                "Purple",
                "Gray",
                "Green",
                "Blue"
            ]
        };

        var polarArea = new Chart(ctx, {
            data: data,
            type: 'polarArea',
            options: {
                scale: {
                    ticks: {
                        beginAtZero: true
                    }
                }
            }
        });

    }
}

/* COMPOSE */

function init_compose() {

    if (typeof ($.fn.slideToggle) === 'undefined') { return; }
    console.log('init_compose');

    $('#compose, .compose-close').click(function () {
        $('.compose').slideToggle();
    });

};

/* CALENDAR */

function init_calendar() {

    if (typeof ($.fn.fullCalendar) === 'undefined') { return; }
    console.log('init_calendar');

    var date = new Date(),
        d = date.getDate(),
        m = date.getMonth(),
        y = date.getFullYear(),
        started,
        categoryClass;

    var calendar = $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay,listMonth'
        },
        selectable: true,
        selectHelper: true,
        select: function (start, end, allDay) {
            $('#fc_create').click();

            started = start;
            ended = end;

            $(".antosubmit").on("click", function () {
                var title = $("#title").val();
                if (end) {
                    ended = end;
                }

                categoryClass = $("#event_type").val();

                if (title) {
                    calendar.fullCalendar('renderEvent', {
                        title: title,
                        start: started,
                        end: end,
                        allDay: allDay
                    },
                        true // make the event "stick"
                    );
                }

                $('#title').val('');

                calendar.fullCalendar('unselect');

                $('.antoclose').click();

                return false;
            });
        },
        eventClick: function (calEvent, jsEvent, view) {
            $('#fc_edit').click();
            $('#title2').val(calEvent.title);

            categoryClass = $("#event_type").val();

            $(".antosubmit2").on("click", function () {
                calEvent.title = $("#title2").val();

                calendar.fullCalendar('updateEvent', calEvent);
                $('.antoclose2').click();
            });

            calendar.fullCalendar('unselect');
        },
        editable: true,
        events: [{
            title: 'All Day Event',
            start: new Date(y, m, 1)
        }, {
            title: 'Long Event',
            start: new Date(y, m, d - 5),
            end: new Date(y, m, d - 2)
        }, {
            title: 'Meeting',
            start: new Date(y, m, d, 10, 30),
            allDay: false
        }, {
            title: 'Lunch',
            start: new Date(y, m, d + 14, 12, 0),
            end: new Date(y, m, d, 14, 0),
            allDay: false
        }, {
            title: 'Birthday Party',
            start: new Date(y, m, d + 1, 19, 0),
            end: new Date(y, m, d + 1, 22, 30),
            allDay: false
        }, {
            title: 'Click for Google',
            start: new Date(y, m, 28),
            end: new Date(y, m, 29),
            url: 'http://google.com/'
        }]
    });

};

/* DATA TABLES */

function init_DataTables() {

    console.log('run_datatables');

    if (typeof ($.fn.DataTable) === 'undefined') { return; }
    console.log('init_DataTables');

    var handleDataTableButtons = function () {
        if ($("#datatable-buttons").length) {
            $("#datatable-buttons").DataTable({
                dom: "Blfrtip",
                buttons: [
                    {
                        extend: "copy",
                        className: "btn-sm"
                    },
                    {
                        extend: "csv",
                        className: "btn-sm"
                    },
                    {
                        extend: "excel",
                        className: "btn-sm"
                    },
                    {
                        extend: "pdfHtml5",
                        className: "btn-sm"
                    },
                    {
                        extend: "print",
                        className: "btn-sm"
                    },
                ],
                responsive: true
            });
        }
    };

    TableManageButtons = function () {
        "use strict";
        return {
            init: function () {
                handleDataTableButtons();
            }
        };
    }();

    $('#datatable').dataTable();

    $('#datatable-keytable').DataTable({
        keys: true
    });

    $('#datatable-responsive').DataTable({
        ordering: false
    });

    $('#datatable-scroller').DataTable({
        ajax: "js/datatables/json/scroller-demo.json",
        deferRender: true,
        scrollY: 380,
        scrollCollapse: true,
        scroller: true
    });

    $('#datatable-fixed-header').DataTable({
        fixedHeader: true
    });

    var $datatable = $('#datatable-checkbox');

    $datatable.dataTable({
        'order': [[1, 'asc']],
        'columnDefs': [
            { orderable: false, targets: [0] }
        ]
    });
    $datatable.on('draw.dt', function () {
        $('checkbox input').iCheck({
            checkboxClass: 'icheckbox_flat-green'
        });
    });

    TableManageButtons.init();

};

/* CHART - MORRIS  */

function init_morris_charts() {

    if (typeof (Morris) === 'undefined') { return; }
    console.log('init_morris_charts');

    if ($('#graph_bar').length) {

        Morris.Bar({
            element: 'graph_bar',
            data: [
                { device: 'iPhone 4', geekbench: 380 },
                { device: 'iPhone 4S', geekbench: 655 },
                { device: 'iPhone 3GS', geekbench: 275 },
                { device: 'iPhone 5', geekbench: 1571 },
                { device: 'iPhone 5S', geekbench: 655 },
                { device: 'iPhone 6', geekbench: 2154 },
                { device: 'iPhone 6 Plus', geekbench: 1144 },
                { device: 'iPhone 6S', geekbench: 2371 },
                { device: 'iPhone 6S Plus', geekbench: 1471 },
                { device: 'Other', geekbench: 1371 }
            ],
            xkey: 'device',
            ykeys: ['geekbench'],
            labels: ['Geekbench'],
            barRatio: 0.4,
            barColors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
            xLabelAngle: 35,
            hideHover: 'auto',
            resize: true
        });

    }

        if ($('#graph_bar2').length) {

        Morris.Bar({
            element: 'graph_bar2',
            data: [
                { device: 'iPhone 4', geekbench: 380 },
                { device: 'iPhone 4S', geekbench: 655 },
                { device: 'iPhone 3GS', geekbench: 275 },
                { device: 'iPhone 5', geekbench: 1571 },
                { device: 'iPhone 5S', geekbench: 655 },
                { device: 'iPhone 6', geekbench: 2154 },
                { device: 'iPhone 6 Plus', geekbench: 1144 },
                { device: 'iPhone 6S', geekbench: 2371 },
                { device: 'iPhone 6S Plus', geekbench: 1471 },
                { device: 'Other', geekbench: 1371 }
            ],
            xkey: 'device',
            ykeys: ['geekbench'],
            labels: ['Geekbench'],
            barRatio: 0.4,
            barColors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
            xLabelAngle: 35,
            hideHover: 'auto',
            resize: true
        });

    }

            if ($('#graph_bar3').length) {

        Morris.Bar({
            element: 'graph_bar3',
            data: [
                { device: 'iPhone 4', geekbench: 380 },
                { device: 'iPhone 4S', geekbench: 655 },
                { device: 'iPhone 3GS', geekbench: 275 },
                { device: 'iPhone 5', geekbench: 1571 },
                { device: 'iPhone 5S', geekbench: 655 },
                { device: 'iPhone 6', geekbench: 2154 },
                { device: 'iPhone 6 Plus', geekbench: 1144 },
                { device: 'iPhone 6S', geekbench: 2371 },
                { device: 'iPhone 6S Plus', geekbench: 1471 },
                { device: 'Other', geekbench: 1371 }
            ],
            xkey: 'device',
            ykeys: ['geekbench'],
            labels: ['Geekbench'],
            barRatio: 0.4,
            barColors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
            xLabelAngle: 35,
            hideHover: 'auto',
            resize: true
        });

    }

    if ($('#graph_bar_group').length) {

        Morris.Bar({
            element: 'graph_bar_group',
            data: [
                { "period": "2016-10-01", "licensed": 807, "sorned": 660 },
                { "period": "2016-09-30", "licensed": 1251, "sorned": 729 },
                { "period": "2016-09-29", "licensed": 1769, "sorned": 1018 },
                { "period": "2016-09-20", "licensed": 2246, "sorned": 1461 },
                { "period": "2016-09-19", "licensed": 2657, "sorned": 1967 },
                { "period": "2016-09-18", "licensed": 3148, "sorned": 2627 },
                { "period": "2016-09-17", "licensed": 3471, "sorned": 3740 },
                { "period": "2016-09-16", "licensed": 2871, "sorned": 2216 },
                { "period": "2016-09-15", "licensed": 2401, "sorned": 1656 },
                { "period": "2016-09-10", "licensed": 2115, "sorned": 1022 }
            ],
            xkey: 'period',
            barColors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
            ykeys: ['licensed', 'sorned'],
            labels: ['Licensed', 'SORN'],
            hideHover: 'auto',
            xLabelAngle: 60,
            resize: true
        });

    }

    if ($('#graphx').length) {

        Morris.Bar({
            element: 'graphx',
            data: [
                { x: '2015 Q1', y: 2, z: 3, a: 4 },
                { x: '2015 Q2', y: 3, z: 5, a: 6 },
                { x: '2015 Q3', y: 4, z: 3, a: 2 },
                { x: '2015 Q4', y: 2, z: 4, a: 5 }
            ],
            xkey: 'x',
            ykeys: ['y', 'z', 'a'],
            barColors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
            hideHover: 'auto',
            labels: ['Y', 'Z', 'A'],
            resize: true
        }).on('click', function (i, row) {
            console.log(i, row);
        });

    }

    if ($('#graph_area').length) {

        Morris.Area({
            element: 'graph_area',
            data: [
                { period: '2014 Q1', iphone: 2666, ipad: null, itouch: 2647 },
                { period: '2014 Q2', iphone: 2778, ipad: 2294, itouch: 2441 },
                { period: '2014 Q3', iphone: 4912, ipad: 1969, itouch: 2501 },
                { period: '2014 Q4', iphone: 3767, ipad: 3597, itouch: 5689 },
                { period: '2015 Q1', iphone: 6810, ipad: 1914, itouch: 2293 },
                { period: '2015 Q2', iphone: 5670, ipad: 4293, itouch: 1881 },
                { period: '2015 Q3', iphone: 4820, ipad: 3795, itouch: 1588 },
                { period: '2015 Q4', iphone: 15073, ipad: 5967, itouch: 5175 },
                { period: '2016 Q1', iphone: 10687, ipad: 4460, itouch: 2028 },
                { period: '2016 Q2', iphone: 8432, ipad: 5713, itouch: 1791 }
            ],
            xkey: 'period',
            ykeys: ['iphone', 'ipad', 'itouch'],
            lineColors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
            labels: ['iPhone', 'iPad', 'iPod Touch'],
            pointSize: 2,
            hideHover: 'auto',
            resize: true
        });

    }

    if ($('#graph_donut').length) {

        Morris.Donut({
            element: 'graph_donut',
            data: [
                { label: 'Jam', value: 25 },
                { label: 'Frosted', value: 40 },
                { label: 'Custard', value: 25 },
                { label: 'Sugar', value: 10 }
            ],
            colors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
            formatter: function (y) {
                return y + "%";
            },
            resize: true
        });

    }

    if ($('#graph_line').length) {

        Morris.Line({
            element: 'graph_line',
            xkey: 'year',
            ykeys: ['value'],
            labels: ['Value'],
            hideHover: 'auto',
            lineColors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
            data: [
                { year: '2012', value: 20 },
                { year: '2013', value: 10 },
                { year: '2014', value: 5 },
                { year: '2015', value: 5 },
                { year: '2016', value: 20 }
            ],
            resize: true
        });

        $MENU_TOGGLE.on('click', function () {
            $(window).resize();
        });

    }

};



/* ECHRTS */


function init_echarts() {

    if (typeof (echarts) === 'undefined') { return; }
    console.log('init_echarts');


    var theme = {
        color: [
            '#26B99A', '#34495E', '#BDC3C7', '#3498DB',
            '#9B59B6', '#8abb6f', '#759c6a', '#bfd3b7'
        ],

        title: {
            itemGap: 8,
            textStyle: {
                fontWeight: 'normal',
                color: '#408829'
            }
        },

        dataRange: {
            color: ['#1f610a', '#97b58d']
        },

        toolbox: {
            color: ['#408829', '#408829', '#408829', '#408829']
        },

        tooltip: {
            backgroundColor: 'rgba(0,0,0,0.5)',
            axisPointer: {
                type: 'line',
                lineStyle: {
                    color: '#408829',
                    type: 'dashed'
                },
                crossStyle: {
                    color: '#408829'
                },
                shadowStyle: {
                    color: 'rgba(200,200,200,0.3)'
                }
            }
        },

        dataZoom: {
            dataBackgroundColor: '#eee',
            fillerColor: 'rgba(64,136,41,0.2)',
            handleColor: '#408829'
        },
        grid: {
            borderWidth: 0
        },

        categoryAxis: {
            axisLine: {
                lineStyle: {
                    color: '#408829'
                }
            },
            splitLine: {
                lineStyle: {
                    color: ['#eee']
                }
            }
        },

        valueAxis: {
            axisLine: {
                lineStyle: {
                    color: '#408829'
                }
            },
            splitArea: {
                show: true,
                areaStyle: {
                    color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
                }
            },
            splitLine: {
                lineStyle: {
                    color: ['#eee']
                }
            }
        },
        timeline: {
            lineStyle: {
                color: '#408829'
            },
            controlStyle: {
                normal: { color: '#408829' },
                emphasis: { color: '#408829' }
            }
        },

        k: {
            itemStyle: {
                normal: {
                    color: '#68a54a',
                    color0: '#a9cba2',
                    lineStyle: {
                        width: 1,
                        color: '#408829',
                        color0: '#86b379'
                    }
                }
            }
        },
        map: {
            itemStyle: {
                normal: {
                    areaStyle: {
                        color: '#ddd'
                    },
                    label: {
                        textStyle: {
                            color: '#c12e34'
                        }
                    }
                },
                emphasis: {
                    areaStyle: {
                        color: '#99d2dd'
                    },
                    label: {
                        textStyle: {
                            color: '#c12e34'
                        }
                    }
                }
            }
        },
        force: {
            itemStyle: {
                normal: {
                    linkStyle: {
                        strokeColor: '#408829'
                    }
                }
            }
        },
        chord: {
            padding: 4,
            itemStyle: {
                normal: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                },
                emphasis: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                }
            }
        },
        gauge: {
            startAngle: 225,
            endAngle: -45,
            axisLine: {
                show: true,
                lineStyle: {
                    color: [[0.2, '#86b379'], [0.8, '#68a54a'], [1, '#408829']],
                    width: 8
                }
            },
            axisTick: {
                splitNumber: 10,
                length: 12,
                lineStyle: {
                    color: 'auto'
                }
            },
            axisLabel: {
                textStyle: {
                    color: 'auto'
                }
            },
            splitLine: {
                length: 18,
                lineStyle: {
                    color: 'auto'
                }
            },
            pointer: {
                length: '90%',
                color: 'auto'
            },
            title: {
                textStyle: {
                    color: '#333'
                }
            },
            detail: {
                textStyle: {
                    color: 'auto'
                }
            }
        },
        textStyle: {
            fontFamily: 'Arial, Verdana, sans-serif'
        }
    };


    //echart Bar

    if ($('#mainb').length) {

        var echartBar = echarts.init(document.getElementById('mainb'), theme);

        echartBar.setOption({
            title: {
                text: 'Grouped Bar Chart',
                subtext: '그룹형 막대그래프'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['장바구니', '구매']
            },
            toolbox: {
                show: false
            },
            calculable: false,
            xAxis: [{
                type: 'category',
                data: ['TB-DX5R20J', 'TB-DX5T20E', 'TB-DX5I10JS', 'TST-TX5R90RP', 'TST-TX5R50RP', 'TST-TX5R00RP', 'ALB-R14690', 'ALB-R14650', 'ALB-R14600', 'ALB-DT100S'],
                axisLabel: {
                    rotate: 45,          // 45도 기울이기
                    interval: 0,         // 모든 라벨 표시
                    margin: 10,          // 바닥과 간격
                    fontSize: 12         // 폰트 크기 조절
                }
            }],
            grid: {
                bottom: 80  // 👈 글자가 안 짤릴 만큼 넉넉히 확보
            },
            yAxis: [{
                type: 'value'
            }],
            series: [{
                name: '장바구니',
                type: 'bar',
                data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0],
                markPoint: {
                    data: [{
                        type: 'max',
                        name: '???'
                    }, {
                        type: 'min',
                        name: '???'
                    }]
                },
                markLine: {
                    data: [{
                        type: 'average',
                        name: '???'
                    }]
                }
            }, {
                name: '구매',
                type: 'bar',
                data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8],
                markPoint: {
                    data: [{
                        name: '',
                        value: 182.2,
                        xAxis: 7,
                        yAxis: 183,
                    }, {
                        name: '구매',
                        value: 2.3,
                        xAxis: 11,
                        yAxis: 3
                    }]
                },
                markLine: {
                    data: [{
                        type: 'average',
                        name: '???'
                    }]
                }
            }]
        });

    }

    if ($('#mainb2').length) {

        var echartBar = echarts.init(document.getElementById('mainb2'), theme);

        echartBar.setOption({
            title: {
                text: 'Grouped Bar Chart',
                subtext: '그룹형 막대그래프'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['비회원', '회원']
            },
            toolbox: {
                show: false
            },
            calculable: false,
            xAxis: [{
                type: 'category',
                data: ['2025.04.13 ~ 2025.05.13'],
            }],
            yAxis: [{
                type: 'value',
                name: '체류 시간 (분)',
                nameLocation: 'middle',
                nameGap: 50,
                axisLabel: {
                    formatter: '{value}분'
                }
            }],
            series: [{
                name: '비회원',
                type: 'bar',
                data: [76.7],
                markLine: {
                    data: [{
                        type: 'max',
                        name: ''
                    }]
                }
            }, {
                name: '회원',
                type: 'bar',
                data: [40.7],
                markLine: {
                    data: [{
                        type: 'max',
                        name: ''
                    }]
                }
            }]
        });

    }

    if ($('#mainb3').length) {

        var echartBar = echarts.init(document.getElementById('mainb3'), theme);

        echartBar.setOption({
            title: {
                text: 'Grouped Bar Chart',
                subtext: '그룹형 막대그래프'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['비회원', '회원']
            },
            toolbox: {
                show: false
            },
            calculable: false,
            xAxis: [{
                type: 'category',
                data: ['회원가입', '장바구니', '로그인', '이벤트 프로모션', '전자제품 카테고리', '주문 내역', 'ALB-R14650', '결제 시도', '고객센터 FAQ', 'TST-TX5R00RP'],
                axisLabel: {
                    rotate: 45,          // 45도 기울이기
                    interval: 0,         // 모든 라벨 표시
                    margin: 10,          // 바닥과 간격
                    fontSize: 12         // 폰트 크기 조절
                }
            }],
            grid: {
                bottom: 80  // 👈 글자가 안 짤릴 만큼 넉넉히 확보
            },
            yAxis: [{
                type: 'value',
                scale: true,
                name: '이탈 횟수 (건)',
                nameLocation: 'middle',
                nameGap: 60,
                axisLabel: {
                    formatter: '{value}건'
                }
            }],
            series: [{
                name: '비회원',
                type: 'bar',
                data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0],
                markPoint: {
                    data: [{
                        type: 'max',
                        name: '최고 이탈 횟수(건)'
                    }, {
                        type: 'min',
                        name: '최저 이탈 횟수(건)'
                    }]
                },
                markLine: {
                    data: [{
                        type: 'average',
                        name: '평균 이탈 횟수(건)'
                    }]
                }
            }, {
                name: '회원',
                type: 'bar',
                data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8],
                markPoint: {
                    data: [{
                        type: 'max',
                        name: '최고 이탈 횟수(건)'
                    }, {
                        type: 'min',
                        name: '최저 이탈 횟수(건)'
                    }]
                },
                markLine: {
                    data: [{
                        type: 'average',
                        name: '평균 이탈 횟수(건)'
                    }]
                }
            }]
        });

    }

    //echart Radar

    if ($('#echart_sonar').length) {

        var echartRadar = echarts.init(document.getElementById('echart_sonar'), theme);

        echartRadar.setOption({
            title: {
                text: 'Budget vs spending',
                subtext: 'Subtitle'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                x: 'right',
                y: 'bottom',
                data: ['Allocated Budget', 'Actual Spending']
            },
            toolbox: {
                show: true,
                feature: {
                    restore: {
                        show: true,
                        title: "Restore"
                    },
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            polar: [{
                indicator: [{
                    text: 'Sales',
                    max: 6000
                }, {
                    text: 'Administration',
                    max: 16000
                }, {
                    text: 'Information Techology',
                    max: 30000
                }, {
                    text: 'Customer Support',
                    max: 38000
                }, {
                    text: 'Development',
                    max: 52000
                }, {
                    text: 'Marketing',
                    max: 25000
                }]
            }],
            calculable: true,
            series: [{
                name: 'Budget vs spending',
                type: 'radar',
                data: [{
                    value: [4300, 10000, 28000, 35000, 50000, 19000],
                    name: 'Allocated Budget'
                }, {
                    value: [5000, 14000, 28000, 31000, 42000, 21000],
                    name: 'Actual Spending'
                }]
            }]
        });

    }

    //echart Funnel

    if ($('#echart_pyramid').length) {
        var echartFunnel = echarts.init(document.getElementById('echart_pyramid'), theme);

        const funnelData = [
            { value: 6560, name: '방문자' },
            { value: 5100, name: '상세 진입' },
            { value: 4120, name: '장바구니 담기' },
            { value: 3490, name: '결제 시도' },
            { value: 2540, name: '구매 완료' }
        ];

        const maxValue = funnelData[0].value;  // 방문자 기준

        echartFunnel.setOption({
            title: {
                text: 'Funnel Chart',
                subtext: '퍼널 그래프'
            },
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    const percent = ((params.value / maxValue) * 100).toFixed(1);
                    return `${params.name}<br/>총 수: ${params.value.toLocaleString()}명<br/>전환률: ${percent}%`;
                }
            },
            toolbox: {
                show: true,
                feature: {
                    restore: { show: true, title: "Restore" },
                    saveAsImage: { show: true, title: "Save Image" }
                }
            },
            legend: {
                data: ['방문자', '상세 진입', '장바구니 담기', '결제 시도', '구매 완료'],
                orient: 'vertical',
                x: 'left',
                y: 'bottom'
            },
            calculable: true,
            series: [{
                name: '전환 퍼널',
                type: 'funnel',
                width: '40%',
                sort: 'descending',
                data: funnelData
            }]
        });
    }

    if ($('#echart_pyramid2').length) {
        var echartFunnel = echarts.init(document.getElementById('echart_pyramid2'), theme);

        const funnelData = [
            { value: 43100, name: '방문자' },
            { value: 34900, name: '상세 진입' },
            { value: 26800, name: '장바구니 담기' },
            { value: 18400, name: '결제 시도' },
            { value: 11600, name: '구매 완료' }
        ];

        const maxValue = funnelData[0].value;  // 방문자 기준

        echartFunnel.setOption({
            title: {
                text: 'Funnel Chart',
                subtext: '퍼널 그래프'
            },
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    const percent = ((params.value / maxValue) * 100).toFixed(1);
                    return `${params.name}<br/>총 수: ${params.value.toLocaleString()}명<br/>전환률: ${percent}%`;
                }
            },
            toolbox: {
                show: true,
                feature: {
                    restore: { show: true, title: "Restore" },
                    saveAsImage: { show: true, title: "Save Image" }
                }
            },
            legend: {
                data: ['방문자', '상세 진입', '장바구니 담기', '결제 시도', '구매 완료'],
                orient: 'vertical',
                x: 'left',
                y: 'bottom'
            },
            calculable: true,
            series: [{
                name: '전환 퍼널',
                type: 'funnel',
                width: '40%',
                sort: 'descending',
                data: funnelData
            }]
        });
    }

    if ($('#echart_pyramid3').length) {
        var echartFunnel = echarts.init(document.getElementById('echart_pyramid3'), theme);

        const funnelData = [
            { value: 198000, name: '방문자' },
            { value: 157000, name: '상세 진입' },
            { value: 125000, name: '장바구니 담기' },
            { value: 96000, name: '결제 시도' },
            { value: 62000, name: '구매 완료' }
        ];

        const maxValue = funnelData[0].value;  // 방문자 기준
        
        echartFunnel.setOption({
            title: {
                text: 'Funnel Chart',
                subtext: '퍼널 그래프'
            },
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    const percent = ((params.value / maxValue) * 100).toFixed(1);
                    return `${params.name}<br/>총 수: ${params.value.toLocaleString()}명<br/>전환률: ${percent}%`;
                }
            },
            toolbox: {
                show: true,
                feature: {
                    restore: { show: true, title: "Restore" },
                    saveAsImage: { show: true, title: "Save Image" }
                }
            },
            legend: {
                data: ['방문자', '상세 진입', '장바구니 담기', '결제 시도', '구매 완료'],
                orient: 'vertical',
                x: 'left',
                y: 'bottom'
            },
            calculable: true,
            series: [{
                name: '전환 퍼널',
                type: 'funnel',
                width: '40%',
                sort: 'descending',
                data: funnelData
            }]
        });
    }

    //echart Gauge

    if ($('#echart_gauge').length) {

        var echartGauge = echarts.init(document.getElementById('echart_gauge'), theme);

        echartGauge.setOption({
            tooltip: {
                formatter: "{a} <br/>{b} : {c}%"
            },
            toolbox: {
                show: true,
                feature: {
                    restore: {
                        show: true,
                        title: "Restore"
                    },
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            series: [{
                name: 'Performance',
                type: 'gauge',
                center: ['50%', '50%'],
                startAngle: 140,
                endAngle: -140,
                min: 0,
                max: 100,
                precision: 0,
                splitNumber: 10,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: [
                            [0.2, 'lightgreen'],
                            [0.4, 'orange'],
                            [0.8, 'skyblue'],
                            [1, '#ff4500']
                        ],
                        width: 30
                    }
                },
                axisTick: {
                    show: true,
                    splitNumber: 5,
                    length: 8,
                    lineStyle: {
                        color: '#eee',
                        width: 1,
                        type: 'solid'
                    }
                },
                axisLabel: {
                    show: true,
                    formatter: function (v) {
                        switch (v + '') {
                            case '10':
                                return 'a';
                            case '30':
                                return 'b';
                            case '60':
                                return 'c';
                            case '90':
                                return 'd';
                            default:
                                return '';
                        }
                    },
                    textStyle: {
                        color: '#333'
                    }
                },
                splitLine: {
                    show: true,
                    length: 30,
                    lineStyle: {
                        color: '#eee',
                        width: 2,
                        type: 'solid'
                    }
                },
                pointer: {
                    length: '80%',
                    width: 8,
                    color: 'auto'
                },
                title: {
                    show: true,
                    offsetCenter: ['-65%', -10],
                    textStyle: {
                        color: '#333',
                        fontSize: 15
                    }
                },
                detail: {
                    show: true,
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderWidth: 0,
                    borderColor: '#ccc',
                    width: 100,
                    height: 40,
                    offsetCenter: ['-60%', 10],
                    formatter: '{value}%',
                    textStyle: {
                        color: 'auto',
                        fontSize: 30
                    }
                },
                data: [{
                    value: 50,
                    name: 'Performance'
                }]
            }]
        });

    }

    // 요일 계산 함수
    function getWeekdayLabel(monthDayStr) {
        const now = new Date();
        const year = now.getFullYear();  // 현재 연도 기준
        const dateObj = new Date(`${year}/${monthDayStr}`);
        const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
        const day = weekdays[dateObj.getDay()];
        return `${monthDayStr} (${day})`;
    }

    //echart Line

    if ($('#echart_line').length) {

        var echartLine = echarts.init(document.getElementById('echart_line'), theme);

        // 날짜 배열
        const rawDates = ['5/11', '5/12', '5/13', '5/14', '5/15', '5/16', '5/17'];

        // 요일 포함된 x축 레이블 생성
        const xAxisWithWeekday = rawDates.map(getWeekdayLabel);

        echartLine.setOption({
            title: {
                text: "Area Line(Bar) Chart",
                subtext: "누적 영역형(막대) 선그래프"
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                x: 220,
                y: 30,
                data: ['총 매출액']
            },
            toolbox: {
                show: true,
                feature: {
                    magicType: {
                        show: true,
                        title: {
                            line: 'Line',
                            bar: 'Bar'
                        },
                        type: ['bar', 'line']  // ✅ bar를 맨 앞에
                    },
                    restore: {
                        show: true,
                        title: "Restore"
                    },
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            calculable: true,
            xAxis: [{
                type: 'category',
                boundaryGap: true,
                data: xAxisWithWeekday  // 요일 포함된 라벨 사용
            }],
            yAxis: [{
                type: 'value'
            }],
            series: [{
                name: '총 매출액',
                type: 'bar',  // ✅ 기본을 bar로 설정
                data: [1530000, 780000, 2680000, 3580000, 1150000, 1750000, 530000]
            }]
        });

    }

    if ($('#echart_line2').length) {

        var echartLine = echarts.init(document.getElementById('echart_line2'), theme);

        echartLine.setOption({
            title: {
                text: "Area Line(Bar) Chart",
                subtext: "누적 영역형(막대) 선그래프"
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                x: 220,
                y: 30,
                data: ['총 매출액']
            },
            toolbox: {
                show: true,
                feature: {
                    magicType: {
                        show: true,
                        title: {
                            line: 'Line',
                            bar: 'Bar'
                        },
                        type: ['bar', 'line']
                    },
                    restore: {
                        show: true,
                        title: "Restore"
                    },
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            calculable: true,
            xAxis: [{
                type: 'category',
                boundaryGap: true,
                data: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월' ]
            }],
            yAxis: [{
                type: 'value'
            }],
            series: [{
                name: '총 매출액',
                type: 'bar',
                data: [4200000, 4600000, 5800000, 6100000, 3300000, 2900000, 5300000, 5700000, 6800000, 7200000, 7700000, 8800000]
            }]
        });

    }

    if ($('#echart_line3').length) {

        var echartLine = echarts.init(document.getElementById('echart_line3'), theme);

        echartLine.setOption({
            title: {
                text: "Area Line(Bar) Chart",
                subtext: "누적 영역형(막대) 선그래프"
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                x: 120,
                y: 30,
                data: ['총 매출액']
            },
            toolbox: {
                show: true,
                feature: {
                    magicType: {
                        show: true,
                        title: {
                            line: 'Line',
                            bar: 'Bar'
                        },
                        type: ['bar', 'line']  // ✅ bar를 맨 앞에
                    },
                    restore: {
                        show: true,
                        title: "Restore"
                    },
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            calculable: true,
            xAxis: [{
                type: 'category',
                boundaryGap: true,
                data: ['1분기', '2분기', '3분기', '4분기']
            }],
            yAxis: [{
                type: 'value'
            }],
            series: [{
                name: '총 매출액',
                type: 'bar',
                data: [1530000, 780000, 2680000, 3580000]
            }]
        });

    }

    if ($('#echart_line4').length) {

        var echartLine = echarts.init(document.getElementById('echart_line4'), theme);

        echartLine.setOption({
            title: {
                text: "Area Line(Bar) Chart",
                subtext: "누적 영역형(막대) 선그래프"
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                x: 120,
                y: 30,
                data: ['총 매출액']
            },
            toolbox: {
                show: true,
                feature: {
                    magicType: {
                        show: true,
                        title: {
                            line: 'Line',
                            bar: 'Bar'
                        },
                        type: ['bar', 'line']  // ✅ bar를 맨 앞에
                    },
                    restore: {
                        show: true,
                        title: "Restore"
                    },
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            calculable: true,
            xAxis: [{
                type: 'category',
                boundaryGap: true,
                data: ['2024년', '2025년']
            }],
            yAxis: [{
                type: 'value'
            }],
            series: [{
                name: '총 매출액',
                type: 'bar',
                data: [55300000, 28000000]
            }]
        });

    }

    if ($('#echart_line5').length) {

        var echartLine = echarts.init(document.getElementById('echart_line5'), theme);

        echartLine.setOption({
            title: {
                text: "Area Line(Bar) Chart",
                subtext: "누적 영역형(막대) 선그래프"
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                x: 220,
                y: 30,
                data: ['총 매출액']
            },
            toolbox: {
                show: true,
                feature: {
                    magicType: {
                        show: true,
                        title: {
                            line: 'Line',
                            bar: 'Bar'
                        },
                        type: ['bar', 'line']  // ✅ bar를 맨 앞에
                    },
                    restore: {
                        show: true,
                        title: "Restore"
                    },
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            calculable: true,
            xAxis: [{
                type: 'category',
                boundaryGap: true,
                data: ['TB-DX5R20J', 'TB-DX5T20E', 'TB-DX5I10JS', 'TB-DX5I10E', 'ALB-5580T', 'ALB-5600', 'ALB-R3600', 'ALB-3600', 'ST-1300S', 'ST-870'],
                axisLabel: {
                    rotate: 45,          // 45도 기울이기
                    interval: 0,         // 모든 라벨 표시
                    margin: 10,          // 바닥과 간격
                    fontSize: 12         // 폰트 크기 조절
                }
            }],
            grid: {
                bottom: 80
            },
            yAxis: [{
                type: 'value'
                
            }],
            series: [{
                name: '총 매출액',
                type: 'bar',  // ✅ 기본을 bar로 설정
                data: [1530000, 780000, 2680000, 3580000, 1150000, 1750000, 530000]
            }]
        });

    }

    if ($('#echart_line6').length) {

        var echartLine = echarts.init(document.getElementById('echart_line6'), theme);

        echartLine.setOption({
            title: {
                text: "Area Line(Bar) Chart",
                subtext: "누적 영역형(막대) 선그래프"
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                x: 220,
                y: 30,
                data: ['총 매출액']
            },
            toolbox: {
                show: true,
                feature: {
                    magicType: {
                        show: true,
                        title: {
                            line: 'Line',
                            bar: 'Bar'
                        },
                        type: ['bar', 'line']  // ✅ bar를 맨 앞에
                    },
                    restore: {
                        show: true,
                        title: "Restore"
                    },
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            calculable: true,
            xAxis: [{
                type: 'category',
                boundaryGap: true,
                data: ['TST-TX5R90RP', 'TST-TX5R50RP', 'TST-TX5R00RP', 'TST-TX5R90RS', 'TST-TX5R50RS', 'TST-TX5R00RS', 'ALB-R14690', 'ALB-R14650', 'ALB-R14600'],
                axisLabel: {
                    rotate: 45,          // 45도 기울이기
                    interval: 0,         // 모든 라벨 표시
                    margin: 10,          // 바닥과 간격
                    fontSize: 12         // 폰트 크기 조절
                }
            }],
            grid: {
                bottom: 80
            },
            yAxis: [{
                type: 'value'
                
            }],
            series: [{
                name: '총 매출액',
                type: 'bar',  // ✅ 기본을 bar로 설정
                data: [2680000, 1530000, 530000, 3580000, 780000, 1750000, 1150000]
            }]
        });

    }

    if ($('#echart_line7').length) {

        var echartLine = echarts.init(document.getElementById('echart_line7'), theme);

        echartLine.setOption({
            title: {
                text: "Area Line(Bar) Chart",
                subtext: "누적 영역형(막대) 선그래프"
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                x: 220,
                y: 30,
                data: ['총 매출액']
            },
            toolbox: {
                show: true,
                feature: {
                    magicType: {
                        show: true,
                        title: {
                            line: 'Line',
                            bar: 'Bar'
                        },
                        type: ['bar', 'line']  // ✅ bar를 맨 앞에
                    },
                    restore: {
                        show: true,
                        title: "Restore"
                    },
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            calculable: true,
            xAxis: [{
                type: 'category',
                boundaryGap: true,
                data: ['ALB-DT100S', 'ALB-DT100R'],
                axisLabel: {
                    rotate: 45,          // 45도 기울이기
                    interval: 0,         // 모든 라벨 표시
                    margin: 10,          // 바닥과 간격
                    fontSize: 12         // 폰트 크기 조절
                }
            }],
            grid: {
                bottom: 80
            },
            yAxis: [{
                type: 'value'
                
            }],
            series: [{
                name: '총 매출액',
                type: 'bar',  // ✅ 기본을 bar로 설정
                data: [2680000, 1530000]
            }]
        });

    }

    if ($('#echart_line8').length) {

        var echartLine = echarts.init(document.getElementById('echart_line8'), theme);

        echartLine.setOption({
            title: {
                text: "Area Line(Bar) Chart",
                subtext: "누적 영역형(막대) 선그래프"
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                x: 220,
                y: 30,
                data: ['총 매출액']
            },
            toolbox: {
                show: true,
                feature: {
                    magicType: {
                        show: true,
                        title: {
                            line: 'Line',
                            bar: 'Bar'
                        },
                        type: ['bar', 'line']  // ✅ bar를 맨 앞에
                    },
                    restore: {
                        show: true,
                        title: "Restore"
                    },
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            calculable: true,
            xAxis: [{
                type: 'category',
                boundaryGap: true,
                data: ['ALC-S04630', 'ALC-S05600', 'ALC-P04630', 'ALC-P06600'],
                axisLabel: {
                    rotate: 45,          // 45도 기울이기
                    interval: 0,         // 모든 라벨 표시
                    margin: 10,          // 바닥과 간격
                    fontSize: 12         // 폰트 크기 조절
                }
            }],
            grid: {
                bottom: 80
            },
            yAxis: [{
                type: 'value'
                
            }],
            series: [{
                name: '총 매출액',
                type: 'bar',  // ✅ 기본을 bar로 설정
                data: [1530000, 530000, 780000, 1750000]
            }]
        });

    }

    if ($("#echart_line9").length) {
        var echartLine = echarts.init(document.getElementById("echart_line9"), theme);

        echartLine.setOption({
            title: {
                text: "Area Line(Bar) Chart",
                subtext: "누적 영역형(막대) 선그래프"
            },
            tooltip: {
                trigger: "axis"
            },
            legend: {
                x: 170,
                y: 30,
                data: ["목표 매출액", "달성 매출액"]
            },
            toolbox: {
                show: true,
                feature: {
                    magicType: {
                        show: true,
                        title: {
                            line: "Line",
                            bar: "Bar",
                            stack: "Stack",
                            tiled: "Tiled"
                        },
                        type: ["line", "bar", "stack", "tiled"]
                    },
                    restore: {
                        show: true,
                        title: "Restore"
                    },
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            calculable: true,
            xAxis: [{
                type: "category",
                boundaryGap: false,
                data: ["2023년", "2024년", "2025년", "2026년"]
            }],
            yAxis: [{
                type: "value"
            }],
            series: [
                {
                    name: "목표 매출액",
                    type: "line",
                    smooth: true,
                    itemStyle: {
                        normal: {
                            areaStyle: {
                                type: "default"
                            }
                        }
                    },
                    data: [50000000, 40000000, 50000000, 55000000]
                },
                {
                    name: "달성 매출액",
                    type: "line",
                    smooth: true,
                    itemStyle: {
                        normal: {
                            areaStyle: {
                                type: "default"
                            }
                        }
                    },
                    data: [37500000, 55000000, 27500000, 0]
                },
            ]
        });
    }

    if ($("#echart_line10").length) {
        var echartLine = echarts.init(document.getElementById("echart_line10"), theme);

        echartLine.setOption({
            title: {
                text: "Area Line(Bar) Chart",
                subtext: "누적 영역형(막대) 선그래프"
            },
            tooltip: {
                trigger: "axis"
            },
            legend: {
                x: 170,
                y: 30,
                data: ["방문자", "상세 진입", "장바구니", "결제 시도", "구매 완료"]
            },
            toolbox: {
                show: true,
                feature: {
                    magicType: {
                        show: true,
                        title: {
                            line: "Line",
                            bar: "Bar",
                            stack: "Stack",
                            tiled: "Tiled"
                        },
                        type: ["line", "bar", "stack", "tiled"]
                    },
                    restore: {
                        show: true,
                        title: "Restore"
                    },
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            calculable: true,
            xAxis: [{
                type: "category",
                boundaryGap: false,
                data: ["5/11", "5/12", "5/13", "5/14", "5/15", "5/16", "5/17"]
            }],
            yAxis: [{
                type: "value"
            }],
            series: [
                {
                    name: "방문자",
                    type: "line",
                    smooth: true,
                    itemStyle: { normal: { areaStyle: { type: "default" } } },
                    data: [850, 920, 980, 870, 940, 990, 1010]
                },
                {
                    name: "상세 진입",
                    type: "line",
                    smooth: true,
                    itemStyle: { normal: { areaStyle: { type: "default" } } },
                    data: [500, 800, 600, 650, 800, 900, 850] // 5/13: 상세 진입률 낮음
                },
                {
                    name: "장바구니",
                    type: "line",
                    smooth: true,
                    itemStyle: { normal: { areaStyle: { type: "default" } } },
                    data: [300, 720, 500, 280, 720, 850, 750] // 5/14: 상세 진입 대비 장바구니 이탈
                },
                {
                    name: "결제 시도",
                    type: "line",
                    smooth: true,
                    itemStyle: { normal: { areaStyle: { type: "default" } } },
                    data: [250, 680, 300, 260, 600, 820, 580] // 5/13: 장바구니 대비 결제 시도 저조
                },
                {
                    name: "구매 완료",
                    type: "line",
                    smooth: true,
                    itemStyle: { normal: { areaStyle: { type: "default" } } },
                    data: [200, 400, 120, 230, 500, 790, 300] // 5/12, 5/13: 구매 완료율 저조
                }
            ]
        });
    }

    if ($("#echart_line11").length) {
        var echartLine = echarts.init(document.getElementById("echart_line11"), theme);

        echartLine.setOption({
            title: {
                text: "Area Line(Bar) Chart",
                subtext: "누적 영역형(막대) 선그래프"
            },
            tooltip: {
                trigger: "axis"
            },
            legend: {
                x: 170,
                y: 30,
                data: ["방문자", "상세 진입", "장바구니", "결제 시도", "구매 완료"]
            },
            toolbox: {
                show: true,
                feature: {
                    magicType: {
                        show: true,
                        title: {
                            line: "Line",
                            bar: "Bar",
                            stack: "Stack",
                            tiled: "Tiled"
                        },
                        type: ["line", "bar", "stack", "tiled"]
                    },
                    restore: {
                        show: true,
                        title: "Restore"
                    },
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            calculable: true,
            xAxis: [{
                type: "category",
                boundaryGap: false,
                data: ["2025-01", "2025-02", "2025-03", "2025-04", "2025-05"]
            }],
            yAxis: [{
                type: "value"
            }],
            series: [
                {
                    name: "방문자",
                    type: "line",
                    smooth: true,
                    itemStyle: { normal: { areaStyle: { type: "default" } } },
                    data: [28000, 46000, 29000, 51000, 34000]
                },
                {
                    name: "상세 진입",
                    type: "line",
                    smooth: true,
                    itemStyle: { normal: { areaStyle: { type: "default" } } },
                    data: [19000, 35000, 20000, 33000, 29500]
                },
                {
                    name: "장바구니",
                    type: "line",
                    smooth: true,
                    itemStyle: { normal: { areaStyle: { type: "default" } } },
                    data: [15000, 19000, 15000, 29000, 21000]
                },
                {
                    name: "결제 시도",
                    type: "line",
                    smooth: true,
                    itemStyle: { normal: { areaStyle: { type: "default" } } },
                    data: [12500, 14000, 10000, 18000, 16200]
                },
                {
                    name: "구매 완료",
                    type: "line",
                    smooth: true,
                    itemStyle: { normal: { areaStyle: { type: "default" } } },
                    data: [8300, 9200, 2500, 8700, 14800]
                }
            ]
        });
    }

    if ($("#echart_line12").length) {
        var echartLine = echarts.init(document.getElementById("echart_line12"), theme);

        echartLine.setOption({
            title: {
                text: "Area Line(Bar) Chart",
                subtext: "누적 영역형(막대) 선그래프"
            },
            tooltip: {
                trigger: "axis"
            },
            legend: {
                x: 170,
                y: 30,
                data: ["방문자", "상세 진입", "장바구니", "결제 시도", "구매 완료"]
            },
            toolbox: {
                show: true,
                feature: {
                    magicType: {
                        show: true,
                        title: {
                            line: "Line",
                            bar: "Bar",
                            stack: "Stack",
                            tiled: "Tiled"
                        },
                        type: ["line", "bar", "stack", "tiled"]
                    },
                    restore: { show: true, title: "Restore" },
                    saveAsImage: { show: true, title: "Save Image" }
                }
            },
            calculable: true,
            xAxis: [{
                type: "category",
                boundaryGap: false,
                data: ["2021", "2022", "2023", "2024", "2025"]
            }],
            yAxis: [{
                type: "value"
            }],
            series: [
                {
                    name: "방문자",
                    type: "line",
                    smooth: true,
                    itemStyle: { normal: { areaStyle: { type: "default" } } },
                    data: [310000, 380000, 250000, 460000, 198000]
                },
                {
                    name: "상세 진입",
                    type: "line",
                    smooth: true,
                    itemStyle: { normal: { areaStyle: { type: "default" } } },
                    data: [240000, 290000, 160000, 345000, 145000]
                },
                {
                    name: "장바구니",
                    type: "line",
                    smooth: true,
                    itemStyle: { normal: { areaStyle: { type: "default" } } },
                    data: [180000, 210000, 120000, 210000, 128000]
                },
                {
                    name: "결제 시도",
                    type: "line",
                    smooth: true,
                    itemStyle: { normal: { areaStyle: { type: "default" } } },
                    data: [130000, 145000, 90000, 120000, 96000]
                },
                {
                    name: "구매 완료",
                    type: "line",
                    smooth: true,
                    itemStyle: { normal: { areaStyle: { type: "default" } } },
                    data: [78000, 102000, 52000, 98000, 65000]
                }
            ]
        });
    }

    //echart Scatter

    function convertTimestampToMinutesAndLabel(ms) {
        const timeInDay = ms % 86400000; // 하루 기준 시간만 추출
        const totalMinutes = Math.floor(timeInDay / 60000); // 전체 분
        const hours = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
        const minutes = String(totalMinutes % 60).padStart(2, '0');
        const timeLabel = `${hours}:${minutes}`; // "HH:mm"

        return {
            minutes: totalMinutes, // 수치용
            label: timeLabel       // 문자 표시용
        };
    }

    if ($('#echart_scatter').length) {

        var echartScatter = echarts.init(document.getElementById('echart_scatter'), theme);

        echartScatter.setOption({
            title: {
                text: 'Scatter Graph',
                subtext: '산점 그래프'
            },
            tooltip: {
                trigger: 'axis',
                showDelay: 0,
                axisPointer: {
                    type: 'cross',
                    lineStyle: {
                        type: 'dashed',
                        width: 1
                    }
                }
            },
            legend: {
                data: ['데스크탑', '모바일']
            },
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            xAxis: [{
                type: 'value',
                scale: true,
                axisLabel: {
                    formatter: function (value) {
                        const date = new Date(value);
                        const month = date.getMonth() + 1;
                        const day = date.getDate();
                        const hour = String(date.getHours()).padStart(2, '0');
                        const minute = String(date.getMinutes()).padStart(2, '0');
                        return `${month}/${day} ${hour}:${minute}`;  // 예: 5/12 08:45
                    }
                }
            }],
            yAxis: [{
                type: 'value',
                scale: true,
                axisLabel: {
                    formatter: '{value}'
                }
            }],
            series: [{
                name: '데스크탑',
                type: 'scatter',
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        const dateObj = new Date(params.value[0]);
                        const month = dateObj.getMonth() + 1;
                        const day = dateObj.getDate();
                        const hour = String(dateObj.getHours()).padStart(2, '0');
                        const minute = String(dateObj.getMinutes()).padStart(2, '0');
                        const time = params.value[1];

                        return `${params.seriesName}<br/>날짜: ${month}/${day} ${hour}:${minute}<br/>체류시간: ${time}분`;
                    }
                },
                data: [
                    [1746489600000, 3.7],
                    [1746495771000, 6.73],
                    [1746501942000, 2.95],
                    [1746508114000, 11.96],
                    [1746514285000, 8.27],
                    [1746520457000, 8.51],
                    [1746526628000, 7.27],
                    [1746532800000, 5.01],
                    [1746538971000, 10.6],
                    [1746545142000, 7.18],
                    [1746551314000, 11.13],
                    [1746557485000, 3.63],
                    [1746563657000, 6.67],
                    [1746569828000, 10.58],
                    [1746576000000, 5.81],
                    [1746582171000, 4.29],
                    [1746588342000, 7.53],
                    [1746594514000, 5.27],
                    [1746600685000, 8.43],
                    [1746606857000, 6.34],
                    [1746613028000, 2.56],
                    [1746619200000, 3.05],
                    [1746625371000, 7.88],
                    [1746631542000, 6.33],
                    [1746637714000, 4.72],
                    [1746643885000, 2.62],
                    [1746650057000, 4.03],
                    [1746656228000, 5.23],
                    [1746662400000, 10.45],
                    [1746668571000, 5.74],
                    [1746674742000, 8.03],
                    [1746680914000, 9.59],
                    [1746687085000, 2.4],
                    [1746693257000, 6.71],
                    [1746699428000, 3.31],
                    [1746705600000, 3.15],
                    [1746711771000, 2.63],
                    [1746717942000, 2.9],
                    [1746724114000, 10.77],
                    [1746730285000, 7.03],
                    [1746736457000, 5.61],
                    [1746742628000, 9.26],
                    [1746748800000, 2.01],
                    [1746754971000, 7.12],
                    [1746761142000, 5.31],
                    [1746767314000, 3.8],
                    [1746773485000, 7.43],
                    [1746779657000, 5.48],
                    [1746785828000, 9.16],
                    [1746792000000, 4.63],
                    [1746798171000, 4.03],
                    [1746804342000, 5.24],
                    [1746810514000, 4.23],
                    [1746816685000, 10.79],
                    [1746822857000, 7.22],
                    [1746829028000, 8.8],
                    [1746835200000, 7.2],
                    [1746841371000, 5.17],
                    [1746847542000, 9.12],
                    [1746853714000, 8.27],
                    [1746859885000, 7.14],
                    [1746866057000, 7.76],
                    [1746872228000, 9.97],
                    [1746878400000, 10.67],
                    [1746884571000, 2.85],
                    [1746890742000, 6.98],
                    [1746896914000, 2.76],
                    [1746903085000, 8.82],
                    [1746909257000, 10.42],
                    [1746915428000, 7.54],
                    [1746921600000, 8.07],
                    [1746927360000, 8.9],
                    [1746933120000, 3.43],
                    [1746938880000, 10.24],
                    [1746944640000, 9.61],
                    [1746950400000, 5.1],
                    [1746956160000, 8.93],
                    [1746961920000, 2.8],
                    [1746967680000, 4.16],
                    [1746973440000, 5.0],
                    [1746979200000, 2.27],
                    [1746984960000, 3.44],
                    [1746990720000, 9.91],
                    [1746996480000, 9.0],
                    [1747002240000, 10.99],
                    [1747008000000, 5.21],
                    [1747013760000, 4.07],
                    [1747019520000, 11.78],
                    [1747025280000, 11.01],
                    [1747031040000, 11.72],
                    [1747036800000, 5.91],
                    [1747042560000, 10.47],
                    [1747048320000, 11.35],
                    [1747054080000, 5.7],
                    [1747059840000, 2.24],
                    [1747065600000, 2.87],
                    [1747071360000, 6.21],
                    [1747077120000, 8.29],
                    [1747082880000, 6.15],
                    [1747088640000, 10.92]
                    ],
                markPoint: {
                    data: [{
                        type: 'max',
                        name: 'Max'
                    }, {
                        type: 'min',
                        name: 'Min'
                    }]
                },
                markLine: {
                    data: [{
                        type: 'average',
                        name: 'Mean'
                    }]
                }
            }, {
                name: '모바일',
                type: 'scatter',
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        const dateObj = new Date(params.value[0]);
                        const month = dateObj.getMonth() + 1;
                        const day = dateObj.getDate();
                        const hour = String(dateObj.getHours()).padStart(2, '0');
                        const minute = String(dateObj.getMinutes()).padStart(2, '0');
                        const time = params.value[1];

                        return `${params.seriesName}<br/>날짜: ${month}/${day} ${hour}:${minute}<br/>체류시간: ${time}분`;
                    }
                },
                data: [
                    [1746489600000, 12.3],
                    [1746495648000, 12.16],
                    [1746501696000, 13.81],
                    [1746507744000, 14.38],
                    [1746513792000, 9.56],
                    [1746519840000, 10.23],
                    [1746525888000, 11.13],
                    [1746531936000, 12.1],
                    [1746537984000, 8.02],
                    [1746544032000, 10.04],
                    [1746550080000, 7.9],
                    [1746556128000, 9.36],
                    [1746562176000, 13.44],
                    [1746568224000, 7.84],
                    [1746574272000, 11.38],
                    [1746580320000, 11.77],
                    [1746586368000, 14.13],
                    [1746592416000, 10.38],
                    [1746598464000, 10.8],
                    [1746604512000, 7.2],
                    [1746610560000, 12.59],
                    [1746616608000, 14.19],
                    [1746622656000, 9.49],
                    [1746628704000, 8.29],
                    [1746634752000, 11.09],
                    [1746640800000, 7.22],
                    [1746646848000, 8.33],
                    [1746652896000, 9.59],
                    [1746658944000, 13.34],
                    [1746664992000, 8.86],
                    [1746671040000, 12.43],
                    [1746677088000, 12.97],
                    [1746683136000, 9.32],
                    [1746689184000, 12.75],
                    [1746695232000, 9.1],
                    [1746701280000, 7.41],
                    [1746707328000, 14.1],
                    [1746713376000, 11.23],
                    [1746719424000, 8.48],
                    [1746725472000, 11.16],
                    [1746731520000, 9.33],
                    [1746737568000, 8.12],
                    [1746743616000, 12.79],
                    [1746749664000, 8.68],
                    [1746755712000, 9.61],
                    [1746761760000, 13.87],
                    [1746767808000, 13.66],
                    [1746773856000, 10.17],
                    [1746779904000, 11.92],
                    [1746785952000, 14.28],
                    [1746792000000, 8.27],
                    [1746798048000, 10.1],
                    [1746804096000, 10.31],
                    [1746810144000, 12.19],
                    [1746816192000, 10.01],
                    [1746822240000, 12.47],
                    [1746828288000, 10.83],
                    [1746834336000, 7.3],
                    [1746840384000, 9.17],
                    [1746846432000, 7.16],
                    [1746852480000, 11.98],
                    [1746858528000, 10.52],
                    [1746864576000, 11.08],
                    [1746870624000, 12.32],
                    [1746876672000, 11.35],
                    [1746882720000, 13.61],
                    [1746888768000, 12.94],
                    [1746894816000, 14.24],
                    [1746900864000, 9.09],
                    [1746906912000, 9.18],
                    [1746912960000, 8.42],
                    [1746919008000, 9.01],
                    [1746925056000, 8.5],
                    [1746931104000, 7.48],
                    [1746937152000, 12.15],
                    [1746943200000, 9.25],
                    [1746949248000, 9.66],
                    [1746955296000, 7.2],
                    [1746961344000, 9.41],
                    [1746967392000, 14.49],
                    [1746973440000, 11.46],
                    [1746979488000, 11.34],
                    [1746985536000, 11.24],
                    [1746991584000, 8.0],
                    [1746997632000, 11.48],
                    [1747003680000, 9.52],
                    [1747009728000, 12.23],
                    [1747015776000, 8.88],
                    [1747021824000, 9.88],
                    [1747027872000, 12.82],
                    [1747033920000, 11.75],
                    [1747039968000, 8.02],
                    [1747046016000, 8.74],
                    [1747052064000, 13.6],
                    [1747058112000, 13.36],
                    [1747064160000, 8.74],
                    [1747070208000, 12.82],
                    [1747076256000, 13.82],
                    [1747082304000, 10.73],
                    [1747088352000, 8.59]
                    ],
                markPoint: {
                    data: [{
                        type: 'max',
                        name: 'Max'
                    }, {
                        type: 'min',
                        name: 'Min'
                    }]
                },
                markLine: {
                    data: [{
                        type: 'average',
                        name: 'Mean'
                    }]
                }
            }]
        });

    }
    
    if ($('#echart_scatter2').length) {

        var echartScatter = echarts.init(document.getElementById('echart_scatter2'), theme);

        echartScatter.setOption({
            title: {
                text: 'Scatter Graph',
                subtext: '산점 그래프'
            },
            tooltip: {
                trigger: 'axis',
                showDelay: 0,
                axisPointer: {
                    type: 'cross',
                    lineStyle: {
                        type: 'dashed',
                        width: 1
                    }
                }
            },
            legend: {
                data: ['비회원', '회원']
            },
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            xAxis: [{
                type: 'value',
                min: 0,
                max: 1440, // 24시 = 1440분
                scale: true,
                axisLabel: {
                    formatter: function (value) {
                        const hours = Math.floor(value / 60);
                        const minutes = Math.floor(value % 60);
                        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
                    }
                }
            }],
            yAxis: [{
                type: 'value',
                scale: true,
                name: '체류 시간 (분)',
                nameLocation: 'middle',
                nameGap: 50,
                axisLabel: {
                    formatter: '{value}분'
                }
            }],
            series: [{
                name: '비회원',
                type: 'scatter',
                tooltip: {
                trigger: 'item',
                    formatter: function (params) {
                    const totalMin = params.value[0];
                    const h = String(Math.floor(totalMin / 60)).padStart(2, '0');
                    const m = String(totalMin % 60).padStart(2, '0');
                    return `${params.seriesName}<br/>시간: ${h}:${m}<br/>체류시간: ${params.value[1]}분`;
                    }
                },
                data: [
                        [1309, 5.23], [209, 12.0], [178, 6.9], [191, 4.06], [54, 7.42],
                        [1234, 6.78], [1108, 7.76], [873, 6.32], [115, 4.5], [629, 6.11],
                        [444, 6.52], [763, 6.72], [435, 9.13], [706, 4.17], [1166, 6.43],
                        [13, 4.78], [1104, 7.24], [556, 5.96], [941, 9.94], [1088, 3.99],
                        [574, 6.66], [1390, 5.95], [1282, 6.91], [79, 5.69], [404, 5.71],
                        [843, 8.29], [894, 4.77], [1107, 7.7], [847, 7.35], [78, 6.63],
                        [889, 4.99], [1335, 6.3], [1138, 7.13], [42, 6.56], [1314, 6.69],
                        [1415, 5.59], [967, 3.37], [609, 4.37], [1305, 4.62], [365, 3.65],
                        [1274, 7.3], [659, 5.55], [1250, 5.79], [1218, 6.94], [1200, 3.61],
                        [232, 7.61], [956, 7.6], [1052, 3.98], [366, 4.49], [674, 6.75],
                        [442, 7.49], [1316, 7.91], [1097, 7.26], [1184, 5.63], [1145, 9.52],
                        [775, 7.1], [257, 6.0], [259, 5.9], [605, 6.44], [276, 5.63],
                        [79, 7.73], [300, 5.33], [1182, 9.19], [864, 5.13], [490, 5.71],
                        [862, 8.42], [927, 5.53], [292, 7.49], [680, 8.17], [1259, 9.27],
                        [1059, 9.29], [125, 6.33], [232, 5.78], [61, 6.68], [819, 6.23],
                        [884, 9.17], [926, 6.28], [1127, 9.05], [20, 6.94], [368, 3.66],
                        [1004, 6.15], [535, 4.33], [447, 7.42], [229, 5.81], [582, 5.62],
                        [1312, 7.57], [69, 6.81], [1135, 6.44], [142, 6.89], [396, 6.6],
                        [73, 5.67], [329, 6.14], [1174, 8.31], [858, 3.96], [605, 5.85],
                        [264, 6.92], [630, 7.15], [1358, 5.25], [75, 6.35], [1342, 8.64],
                        [49, 4.93], [174, 6.62], [42, 5.23]
                    ],
                markPoint: {
                    data: [{
                        type: 'max',
                        name: '최고 체류 시간(분)'
                    }, {
                        type: 'min',
                        name: '최저 체류 시간(분)'
                    }]
                },
                markLine: {
                    data: [{ type: 'average', name: '평균 체류 시간(분)' }],
                }
            }, {
                name: '회원',
                type: 'scatter',
                tooltip: {
                trigger: 'item',
                    formatter: function (params) {
                    const totalMin = params.value[0];
                    const h = String(Math.floor(totalMin / 60)).padStart(2, '0');
                    const m = String(totalMin % 60).padStart(2, '0');
                    return `${params.seriesName}<br/>시간: ${h}:${m}<br/>체류시간: ${params.value[1]}분`;
                    }
                },
                data: [
                        [827, 7.98], [471, 5.41], [514, 10.67], [1434, 11.15], [1002, 5.29],
                        [1349, 7.35], [97, 7.56], [1186, 11.06], [1085, 9.62], [1173, 7.64],
                        [916, 7.61], [1323, 10.89], [1042, 7.49], [675, 8.28], [1167, 6.12],
                        [923, 10.45], [275, 10.06], [1077, 8.5], [969, 8.7], [620, 7.17],
                        [1296, 8.66], [582, 11.63], [1259, 8.18], [1185, 6.25], [1312, 9.84],
                        [1331, 7.67], [897, 11.16], [1021, 11.6], [332, 8.62], [1294, 10.43],
                        [1162, 6.71], [942, 9.26], [7, 7.78], [850, 9.46], [1365, 9.18],
                        [1397, 7.6], [1226, 7.91], [1201, 9.84], [700, 6.52], [647, 10.79],
                        [1187, 6.19], [611, 8.04], [1368, 8.43], [763, 8.38], [1404, 8.88],
                        [1078, 9.4], [1224, 10.08], [921, 9.86], [249, 12.31], [1151, 10.99],
                        [1205, 8.47], [889, 7.17], [999, 6.53], [1236, 11.02], [1273, 9.97],
                        [592, 11.6], [1221, 9.99], [223, 9.81], [960, 10.47], [728, 9.07],
                        [43, 10.83], [284, 10.15], [201, 7.61], [18, 7.25], [1425, 10.4],
                        [1307, 10.03], [1133, 6.94], [1096, 11.19], [638, 10.04], [1094, 10.57],
                        [220, 8.68], [351, 9.32], [504, 9.34], [598, 8.85], [1011, 11.21],
                        [238, 10.3], [37, 8.07], [196, 12.16], [865, 7.63], [803, 8.7],
                        [1101, 9.64], [1108, 9.59], [1214, 9.59], [1424, 8.41], [1314, 12.47],
                        [1181, 11.45], [711, 8.68], [520, 11.15], [879, 10.33], [1356, 12.31],
                        [315, 8.66], [888, 10.91], [492, 6.57], [1213, 11.61], [290, 8.74],
                        [767, 8.57], [52, 7.34], [267, 11.25], [332, 8.97], [1298, 8.44],
                        [393, 8.81], [258, 7.27], [1076, 9.2]
                    ],
                markPoint: {
                    data: [{
                        type: 'max',
                        name: '최고 체류 시간(분)'
                    }, {
                        type: 'min',
                        name: '최저 체류 시간(분)'
                    }]
                },
                markLine: {
                    data: [{ type: 'average', name: '평균 체류 시간(분)' }],
                }
            }]
        });

    }

    //echart Bar Horizontal

    if ($('#echart_bar_horizontal').length) {

        var echartBar = echarts.init(document.getElementById('echart_bar_horizontal'), theme);

        echartBar.setOption({
            title: {
                text: 'Bar Graph',
                subtext: 'Graph subtitle'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                x: 100,
                data: ['2015', '2016']
            },
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            calculable: true,
            xAxis: [{
                type: 'value',
                boundaryGap: [0, 0.01]
            }],
            yAxis: [{
                type: 'category',
                data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
            }],
            series: [{
                name: '2015',
                type: 'bar',
                data: [18203, 23489, 29034, 104970, 131744, 630230]
            }, {
                name: '2016',
                type: 'bar',
                data: [19325, 23438, 31000, 121594, 134141, 681807]
            }]
        });

    }

    //echart Pie Collapse

    if ($('#echart_pie2').length) {

        var echartPieCollapse = echarts.init(document.getElementById('echart_pie2'), theme);

        echartPieCollapse.setOption({
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                x: 'center',
                y: 'bottom',
                data: ['한여름 무더위 타파', '풍성한 한가위', '연말연시 홀리데이', '밸런타인데이 스페셜', '새봄맞이 특가전']
            },
            toolbox: {
                show: true,
                feature: {
                    magicType: {
                        show: true,
                        type: ['pie', 'funnel']
                    },
                    restore: {
                        show: true,
                        title: "Restore"
                    },
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            calculable: true,
            series: [{
                name: '2025년도',
                type: 'pie',
                radius: [25, 90],
                center: ['50%', 170],
                roseType: 'area',
                x: '50%',
                max: 40,
                sort: 'ascending',
                data: [{
                    value: 10,
                    name: '한여름 무더위 타파'
                }, {
                    value: 5,
                    name: '풍성한 한가위'
                }, {
                    value: 15,
                    name: '연말연시 홀리데이'
                }, {
                    value: 25,
                    name: '밸런타인데이 스페셜'
                }, {
                    value: 20,
                    name: '새봄맞이 특가전'
                }]
            }]
        });

    }

    //echart Donut

    if ($('#echart_donut').length) {

        var echartDonut = echarts.init(document.getElementById('echart_donut'), theme);

        echartDonut.setOption({
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            calculable: true,
            legend: {
                x: 'center',
                y: 'bottom',
                data: ['커피머신', '일체형 비데', '디지털 양변기', '제빙기', '비데']
            },
            toolbox: {
                show: true,
                feature: {
                    magicType: {
                        show: true,
                        type: ['pie', 'funnel'],
                        option: {
                            funnel: {
                                x: '25%',
                                width: '50%',
                                funnelAlign: 'center',
                                max: 1548
                            }
                        }
                    },
                    restore: {
                        show: true,
                        title: "Restore"
                    },
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            series: [{
                name: 'Access to the resource',
                type: 'pie',
                radius: ['35%', '55%'],
                itemStyle: {
                    normal: {
                        label: {
                            show: true
                        },
                        labelLine: {
                            show: true
                        }
                    },
                    emphasis: {
                        label: {
                            show: true,
                            position: 'center',
                            textStyle: {
                                fontSize: '14',
                                fontWeight: 'normal'
                            }
                        }
                    }
                },
                data: [{
                    value: 335,
                    name: '커피머신'
                }, {
                    value: 310,
                    name: '일체형 비데'
                }, {
                    value: 234,
                    name: '디지털 양변기'
                }, {
                    value: 135,
                    name: '제빙기'
                }, {
                    value: 1548,
                    name: '비데'
                }]
            }]
        });

    }

    //echart Pie

        //echart Donut

    if ($('#echart_donut2').length) {

        var echartDonut = echarts.init(document.getElementById('echart_donut2'), theme);

        echartDonut.setOption({
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            calculable: true,
            legend: {
                x: 'center',
                y: 'bottom',
                data: ['커피머신', '일체형 비데', '디지털 양변기', '제빙기', '비데']
            },
            toolbox: {
                show: true,
                feature: {
                    magicType: {
                        show: true,
                        type: ['pie', 'funnel'],
                        option: {
                            funnel: {
                                x: '25%',
                                width: '50%',
                                funnelAlign: 'center',
                                max: 1548
                            }
                        }
                    },
                    restore: {
                        show: true,
                        title: "Restore"
                    },
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            series: [{
                name: 'Access to the resource',
                type: 'pie',
                radius: ['35%', '55%'],
                itemStyle: {
                    normal: {
                        label: {
                            show: true
                        },
                        labelLine: {
                            show: true
                        }
                    },
                    emphasis: {
                        label: {
                            show: true,
                            position: 'center',
                            textStyle: {
                                fontSize: '14',
                                fontWeight: 'normal'
                            }
                        }
                    }
                },
                data: [{
                    value: 335,
                    name: '커피머신'
                }, {
                    value: 310,
                    name: '일체형 비데'
                }, {
                    value: 234,
                    name: '디지털 양변기'
                }, {
                    value: 135,
                    name: '제빙기'
                }, {
                    value: 1548,
                    name: '비데'
                }]
            }]
        });

    }

    if ($('#echart_donut3').length) {

        var echartDonut = echarts.init(document.getElementById('echart_donut3'), theme);

        echartDonut.setOption({
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    const name = params.name;
                    const value = params.value.toLocaleString();  // 콤마 포함 숫자
                    const percent = params.percent;
                    return `이벤트: ${name}<br/>총 매출액: ₩${value} (${percent}%)`;
                }
            },
            calculable: true,
            legend: {
                x: 'center',
                y: 'bottom',
                data: ['한여름 무더위 타파', '연말연시 홀리데이', '풍성한 한가위', '밸런타인데이 스페셜', '새봄맞이 특가전']
            },
            toolbox: {
                show: true,
                feature: {
                    magicType: {
                        show: true,
                        type: ['pie', 'funnel'],
                        option: {
                            funnel: {
                                x: '25%',
                                width: '50%',
                                funnelAlign: 'center',
                                max: 1548
                            }
                        }
                    },
                    restore: {
                        show: true,
                        title: "Restore"
                    },
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            series: [{
                name: '2025년도',
                type: 'pie',
                radius: ['35%', '55%'],
                itemStyle: {
                    normal: {
                        label: {
                            show: true
                        },
                        labelLine: {
                            show: true
                        }
                    },
                    emphasis: {
                        label: {
                            show: true,
                            position: 'center',
                            textStyle: {
                                fontSize: '14',
                                fontWeight: 'normal'
                            }
                        }
                    }
                },
                data: [{
                    value: 25000000,
                    name: '한여름 무더위 타파'
                }, {
                    value: 11750000,
                    name: '풍성한 한가위'
                }, {
                    value: 5850000,
                    name: '연말연시 홀리데이'
                }, {
                    value: 1350000,
                    name: '밸런타인데이 스페셜'
                }, {
                    value: 53900000,
                    name: '새봄맞이 특가전'
                }]
            }]
        });

    }

    //echart Pie

    if ($('#echart_pie').length) {

        var echartPie = echarts.init(document.getElementById('echart_pie'), theme);

        echartPie.setOption({
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    const event = params.name;
                    const product = params.data.customData;
                    const value = params.value;
                    const percent = params.percent;

                    return `이벤트: ${event}<br/><b>${product}</b><br/>조회수: ${value} (${percent}%)`;
                }
            },
            legend: {
                x: 'center',
                y: 'bottom',
                data: ['한여름 무더위 타파', '풍성한 한가위', '연말연시 홀리데이', '밸런타인데이 스페셜', '새봄맞이 특가전']
            },
            toolbox: {
                show: true,
                feature: {
                    magicType: {
                        show: true,
                        type: ['pie', 'funnel'],
                        option: {
                            funnel: {
                                x: '25%',
                                width: '50%',
                                funnelAlign: 'left',
                                max: 1548
                            }
                        }
                    },
                    restore: {
                        show: true,
                        title: "Restore"
                    },
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            calculable: true,
            series: [{
                name: '2025년도',
                type: 'pie',
                radius: '55%',
                center: ['50%', '48%'],
                data: [
                    {
                        value: 335,
                        name: '한여름 무더위 타파',
                        customData: 'TB-DX5R20J'
                    },
                    {
                        value: 310,
                        name: '풍성한 한가위',
                        customData: 'TST-TX5R50RP'
                    },
                    {
                        value: 234,
                        name: '연말연시 홀리데이',
                        customData: 'ALB-R14600'
                    },
                    {
                        value: 135,
                        name: '밸런타인데이 스페셜',
                        customData: 'TB-DX5T20E'
                    },
                    {
                        value: 1548,
                        name: '새봄맞이 특가전',
                        customData: 'TB-DX5I10JS'
                    }
                ]
            }]
        });

        var dataStyle = {
            normal: {
                label: {
                    show: false
                },
                labelLine: {
                    show: false
                }
            }
        };

        var placeHolderStyle = {
            normal: {
                color: 'rgba(0,0,0,0)',
                label: {
                    show: false
                },
                labelLine: {
                    show: false
                }
            },
            emphasis: {
                color: 'rgba(0,0,0,0)'
            }
        };

    }

    //echart Mini Pie

    if ($('#echart_mini_pie').length) {

        var echartMiniPie = echarts.init(document.getElementById('echart_mini_pie'), theme);

        echartMiniPie.setOption({
            title: {
                text: 'Chart #2',
                subtext: 'From ExcelHome',
                sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
                x: 'center',
                y: 'center',
                itemGap: 20,
                textStyle: {
                    color: 'rgba(30,144,255,0.8)',
                    fontFamily: '微软雅黑',
                    fontSize: 35,
                    fontWeight: 'bolder'
                }
            },
            tooltip: {
                show: true,
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 170,
                y: 45,
                itemGap: 12,
                data: ['68%Something #1', '29%Something #2', '3%Something #3'],
            },
            toolbox: {
                show: true,
                feature: {
                    mark: {
                        show: true
                    },
                    dataView: {
                        show: true,
                        title: "Text View",
                        lang: [
                            "Text View",
                            "Close",
                            "Refresh",
                        ],
                        readOnly: false
                    },
                    restore: {
                        show: true,
                        title: "Restore"
                    },
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            series: [{
                name: '1',
                type: 'pie',
                clockWise: false,
                radius: [105, 130],
                itemStyle: dataStyle,
                data: [{
                    value: 68,
                    name: '68%Something #1'
                }, {
                    value: 32,
                    name: 'invisible',
                    itemStyle: placeHolderStyle
                }]
            }, {
                name: '2',
                type: 'pie',
                clockWise: false,
                radius: [80, 105],
                itemStyle: dataStyle,
                data: [{
                    value: 29,
                    name: '29%Something #2'
                }, {
                    value: 71,
                    name: 'invisible',
                    itemStyle: placeHolderStyle
                }]
            }, {
                name: '3',
                type: 'pie',
                clockWise: false,
                radius: [25, 80],
                itemStyle: dataStyle,
                data: [{
                    value: 3,
                    name: '3%Something #3'
                }, {
                    value: 97,
                    name: 'invisible',
                    itemStyle: placeHolderStyle
                }]
            }]
        });

    }

    //echart Map

    if ($('#echart_world_map').length) {

        var echartMap = echarts.init(document.getElementById('echart_world_map'), theme);


        echartMap.setOption({
            title: {
                text: 'World Population (2010)',
                subtext: 'from United Nations, Total population, both sexes combined, as of 1 July (thousands)',
                x: 'center',
                y: 'top'
            },
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    var value = (params.value + '').split('.');
                    value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,') + '.' + value[1];
                    return params.seriesName + '<br/>' + params.name + ' : ' + value;
                }
            },
            toolbox: {
                show: true,
                orient: 'vertical',
                x: 'right',
                y: 'center',
                feature: {
                    mark: {
                        show: true
                    },
                    dataView: {
                        show: true,
                        title: "Text View",
                        lang: [
                            "Text View",
                            "Close",
                            "Refresh",
                        ],
                        readOnly: false
                    },
                    restore: {
                        show: true,
                        title: "Restore"
                    },
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            dataRange: {
                min: 0,
                max: 1000000,
                text: ['High', 'Low'],
                realtime: false,
                calculable: true,
                color: ['#087E65', '#26B99A', '#CBEAE3']
            },
            series: [{
                name: 'World Population (2010)',
                type: 'map',
                mapType: 'world',
                roam: false,
                mapLocation: {
                    y: 60
                },
                itemStyle: {
                    emphasis: {
                        label: {
                            show: true
                        }
                    }
                },
                data: [{
                    name: 'Afghanistan',
                    value: 28397.812
                }, {
                    name: 'Angola',
                    value: 19549.124
                }, {
                    name: 'Albania',
                    value: 3150.143
                }, {
                    name: 'United Arab Emirates',
                    value: 8441.537
                }, {
                    name: 'Argentina',
                    value: 40374.224
                }, {
                    name: 'Armenia',
                    value: 2963.496
                }, {
                    name: 'French Southern and Antarctic Lands',
                    value: 268.065
                }, {
                    name: 'Australia',
                    value: 22404.488
                }, {
                    name: 'Austria',
                    value: 8401.924
                }, {
                    name: 'Azerbaijan',
                    value: 9094.718
                }, {
                    name: 'Burundi',
                    value: 9232.753
                }, {
                    name: 'Belgium',
                    value: 10941.288
                }, {
                    name: 'Benin',
                    value: 9509.798
                }, {
                    name: 'Burkina Faso',
                    value: 15540.284
                }, {
                    name: 'Bangladesh',
                    value: 151125.475
                }, {
                    name: 'Bulgaria',
                    value: 7389.175
                }, {
                    name: 'The Bahamas',
                    value: 66402.316
                }, {
                    name: 'Bosnia and Herzegovina',
                    value: 3845.929
                }, {
                    name: 'Belarus',
                    value: 9491.07
                }, {
                    name: 'Belize',
                    value: 308.595
                }, {
                    name: 'Bermuda',
                    value: 64.951
                }, {
                    name: 'Bolivia',
                    value: 716.939
                }, {
                    name: 'Brazil',
                    value: 195210.154
                }, {
                    name: 'Brunei',
                    value: 27.223
                }, {
                    name: 'Bhutan',
                    value: 716.939
                }, {
                    name: 'Botswana',
                    value: 1969.341
                }, {
                    name: 'Central African Republic',
                    value: 4349.921
                }, {
                    name: 'Canada',
                    value: 34126.24
                }, {
                    name: 'Switzerland',
                    value: 7830.534
                }, {
                    name: 'Chile',
                    value: 17150.76
                }, {
                    name: 'China',
                    value: 1359821.465
                }, {
                    name: 'Ivory Coast',
                    value: 60508.978
                }, {
                    name: 'Cameroon',
                    value: 20624.343
                }, {
                    name: 'Democratic Republic of the Congo',
                    value: 62191.161
                }, {
                    name: 'Republic of the Congo',
                    value: 3573.024
                }, {
                    name: 'Colombia',
                    value: 46444.798
                }, {
                    name: 'Costa Rica',
                    value: 4669.685
                }, {
                    name: 'Cuba',
                    value: 11281.768
                }, {
                    name: 'Northern Cyprus',
                    value: 1.468
                }, {
                    name: 'Cyprus',
                    value: 1103.685
                }, {
                    name: 'Czech Republic',
                    value: 10553.701
                }, {
                    name: 'Germany',
                    value: 83017.404
                }, {
                    name: 'Djibouti',
                    value: 834.036
                }, {
                    name: 'Denmark',
                    value: 5550.959
                }, {
                    name: 'Dominican Republic',
                    value: 10016.797
                }, {
                    name: 'Algeria',
                    value: 37062.82
                }, {
                    name: 'Ecuador',
                    value: 15001.072
                }, {
                    name: 'Egypt',
                    value: 78075.705
                }, {
                    name: 'Eritrea',
                    value: 5741.159
                }, {
                    name: 'Spain',
                    value: 46182.038
                }, {
                    name: 'Estonia',
                    value: 1298.533
                }, {
                    name: 'Ethiopia',
                    value: 87095.281
                }, {
                    name: 'Finland',
                    value: 5367.693
                }, {
                    name: 'Fiji',
                    value: 860.559
                }, {
                    name: 'Falkland Islands',
                    value: 49.581
                }, {
                    name: 'France',
                    value: 63230.866
                }, {
                    name: 'Gabon',
                    value: 1556.222
                }, {
                    name: 'United Kingdom',
                    value: 62066.35
                }, {
                    name: 'Georgia',
                    value: 4388.674
                }, {
                    name: 'Ghana',
                    value: 24262.901
                }, {
                    name: 'Guinea',
                    value: 10876.033
                }, {
                    name: 'Gambia',
                    value: 1680.64
                }, {
                    name: 'Guinea Bissau',
                    value: 10876.033
                }, {
                    name: 'Equatorial Guinea',
                    value: 696.167
                }, {
                    name: 'Greece',
                    value: 11109.999
                }, {
                    name: 'Greenland',
                    value: 56.546
                }, {
                    name: 'Guatemala',
                    value: 14341.576
                }, {
                    name: 'French Guiana',
                    value: 231.169
                }, {
                    name: 'Guyana',
                    value: 786.126
                }, {
                    name: 'Honduras',
                    value: 7621.204
                }, {
                    name: 'Croatia',
                    value: 4338.027
                }, {
                    name: 'Haiti',
                    value: 9896.4
                }, {
                    name: 'Hungary',
                    value: 10014.633
                }, {
                    name: 'Indonesia',
                    value: 240676.485
                }, {
                    name: 'India',
                    value: 1205624.648
                }, {
                    name: 'Ireland',
                    value: 4467.561
                }, {
                    name: 'Iran',
                    value: 240676.485
                }, {
                    name: 'Iraq',
                    value: 30962.38
                }, {
                    name: 'Iceland',
                    value: 318.042
                }, {
                    name: 'Israel',
                    value: 7420.368
                }, {
                    name: 'Italy',
                    value: 60508.978
                }, {
                    name: 'Jamaica',
                    value: 2741.485
                }, {
                    name: 'Jordan',
                    value: 6454.554
                }, {
                    name: 'Japan',
                    value: 127352.833
                }, {
                    name: 'Kazakhstan',
                    value: 15921.127
                }, {
                    name: 'Kenya',
                    value: 40909.194
                }, {
                    name: 'Kyrgyzstan',
                    value: 5334.223
                }, {
                    name: 'Cambodia',
                    value: 14364.931
                }, {
                    name: 'South Korea',
                    value: 51452.352
                }, {
                    name: 'Kosovo',
                    value: 97.743
                }, {
                    name: 'Kuwait',
                    value: 2991.58
                }, {
                    name: 'Laos',
                    value: 6395.713
                }, {
                    name: 'Lebanon',
                    value: 4341.092
                }, {
                    name: 'Liberia',
                    value: 3957.99
                }, {
                    name: 'Libya',
                    value: 6040.612
                }, {
                    name: 'Sri Lanka',
                    value: 20758.779
                }, {
                    name: 'Lesotho',
                    value: 2008.921
                }, {
                    name: 'Lithuania',
                    value: 3068.457
                }, {
                    name: 'Luxembourg',
                    value: 507.885
                }, {
                    name: 'Latvia',
                    value: 2090.519
                }, {
                    name: 'Morocco',
                    value: 31642.36
                }, {
                    name: 'Moldova',
                    value: 103.619
                }, {
                    name: 'Madagascar',
                    value: 21079.532
                }, {
                    name: 'Mexico',
                    value: 117886.404
                }, {
                    name: 'Macedonia',
                    value: 507.885
                }, {
                    name: 'Mali',
                    value: 13985.961
                }, {
                    name: 'Myanmar',
                    value: 51931.231
                }, {
                    name: 'Montenegro',
                    value: 620.078
                }, {
                    name: 'Mongolia',
                    value: 2712.738
                }, {
                    name: 'Mozambique',
                    value: 23967.265
                }, {
                    name: 'Mauritania',
                    value: 3609.42
                }, {
                    name: 'Malawi',
                    value: 15013.694
                }, {
                    name: 'Malaysia',
                    value: 28275.835
                }, {
                    name: 'Namibia',
                    value: 2178.967
                }, {
                    name: 'New Caledonia',
                    value: 246.379
                }, {
                    name: 'Niger',
                    value: 15893.746
                }, {
                    name: 'Nigeria',
                    value: 159707.78
                }, {
                    name: 'Nicaragua',
                    value: 5822.209
                }, {
                    name: 'Netherlands',
                    value: 16615.243
                }, {
                    name: 'Norway',
                    value: 4891.251
                }, {
                    name: 'Nepal',
                    value: 26846.016
                }, {
                    name: 'New Zealand',
                    value: 4368.136
                }, {
                    name: 'Oman',
                    value: 2802.768
                }, {
                    name: 'Pakistan',
                    value: 173149.306
                }, {
                    name: 'Panama',
                    value: 3678.128
                }, {
                    name: 'Peru',
                    value: 29262.83
                }, {
                    name: 'Philippines',
                    value: 93444.322
                }, {
                    name: 'Papua New Guinea',
                    value: 6858.945
                }, {
                    name: 'Poland',
                    value: 38198.754
                }, {
                    name: 'Puerto Rico',
                    value: 3709.671
                }, {
                    name: 'North Korea',
                    value: 1.468
                }, {
                    name: 'Portugal',
                    value: 10589.792
                }, {
                    name: 'Paraguay',
                    value: 6459.721
                }, {
                    name: 'Qatar',
                    value: 1749.713
                }, {
                    name: 'Romania',
                    value: 21861.476
                }, {
                    name: 'Russia',
                    value: 21861.476
                }, {
                    name: 'Rwanda',
                    value: 10836.732
                }, {
                    name: 'Western Sahara',
                    value: 514.648
                }, {
                    name: 'Saudi Arabia',
                    value: 27258.387
                }, {
                    name: 'Sudan',
                    value: 35652.002
                }, {
                    name: 'South Sudan',
                    value: 9940.929
                }, {
                    name: 'Senegal',
                    value: 12950.564
                }, {
                    name: 'Solomon Islands',
                    value: 526.447
                }, {
                    name: 'Sierra Leone',
                    value: 5751.976
                }, {
                    name: 'El Salvador',
                    value: 6218.195
                }, {
                    name: 'Somaliland',
                    value: 9636.173
                }, {
                    name: 'Somalia',
                    value: 9636.173
                }, {
                    name: 'Republic of Serbia',
                    value: 3573.024
                }, {
                    name: 'Suriname',
                    value: 524.96
                }, {
                    name: 'Slovakia',
                    value: 5433.437
                }, {
                    name: 'Slovenia',
                    value: 2054.232
                }, {
                    name: 'Sweden',
                    value: 9382.297
                }, {
                    name: 'Swaziland',
                    value: 1193.148
                }, {
                    name: 'Syria',
                    value: 7830.534
                }, {
                    name: 'Chad',
                    value: 11720.781
                }, {
                    name: 'Togo',
                    value: 6306.014
                }, {
                    name: 'Thailand',
                    value: 66402.316
                }, {
                    name: 'Tajikistan',
                    value: 7627.326
                }, {
                    name: 'Turkmenistan',
                    value: 5041.995
                }, {
                    name: 'East Timor',
                    value: 10016.797
                }, {
                    name: 'Trinidad and Tobago',
                    value: 1328.095
                }, {
                    name: 'Tunisia',
                    value: 10631.83
                }, {
                    name: 'Turkey',
                    value: 72137.546
                }, {
                    name: 'United Republic of Tanzania',
                    value: 44973.33
                }, {
                    name: 'Uganda',
                    value: 33987.213
                }, {
                    name: 'Ukraine',
                    value: 46050.22
                }, {
                    name: 'Uruguay',
                    value: 3371.982
                }, {
                    name: 'United States of America',
                    value: 312247.116
                }, {
                    name: 'Uzbekistan',
                    value: 27769.27
                }, {
                    name: 'Venezuela',
                    value: 236.299
                }, {
                    name: 'Vietnam',
                    value: 89047.397
                }, {
                    name: 'Vanuatu',
                    value: 236.299
                }, {
                    name: 'West Bank',
                    value: 13.565
                }, {
                    name: 'Yemen',
                    value: 22763.008
                }, {
                    name: 'South Africa',
                    value: 51452.352
                }, {
                    name: 'Zambia',
                    value: 13216.985
                }, {
                    name: 'Zimbabwe',
                    value: 13076.978
                }]
            }]
        });

    }

}


$(document).ready(function () {

    init_sparklines();
    init_flot_chart();
    init_sidebar();
    init_wysiwyg();
    init_InputMask();
    init_JQVmap();
    init_cropper();
    init_knob();
    init_IonRangeSlider();
    init_ColorPicker();
    init_TagsInput();
    init_parsley();
    init_daterangepicker();
    init_daterangepicker_right();
    init_daterangepicker_single_call();
    init_daterangepicker_reservation();
    init_SmartWizard();
    init_EasyPieChart();
    init_charts();
    init_echarts();
    init_morris_charts();
    init_skycons();
    init_select2();
    init_validator();
    init_DataTables();
    init_chart_doughnut();
    init_gauge();
    init_PNotify();
    init_starrr();
    init_calendar();
    init_compose();
    init_CustomNotification();
    init_autosize();
    init_autocomplete();

});	