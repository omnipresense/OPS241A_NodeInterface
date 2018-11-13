
var dataSet = [];
var unscaledDataSet = [];


function initSocketIO() {
  iosocket = io.connect();
  iosocket.on('onconnection', function(value) {
    sensorValue = value; // receive start  value from server
    initVelocity();
    iosocket.emit('Query', 'B');

    // receive changed values from server
    iosocket.on('updateData', function(receivedData) {
      // defensive programming alert:
      if (receivedData[0] == "\r")  // when the firmware had a '/n/r' defect, this came thru 
        receivedData = receivedData.substr(1); // so trim it
      if (receivedData[0] == "\n")  // honestly, I think this should never be received by this code.
        receivedData = receivedData.substr(1); // but trim it too.  

      if (receivedData[0] != "{") {  // so long as it's not JSON, it's speed.  Show it.
        $("#velocity").html( ""+receivedData);
        //animation code tbd
      } else {
        $("#jsonraw").html( ""+receivedData);
        var data = JSON.parse(receivedData);
        if (data.PowerMode != undefined) {
          $("#PowerModeOut").html("Current Power Mode is "+data.PowerMode);
        }
        if (data.IdleWaitTime != undefined) {
          $("#IdleWaitOut").html("IdleWaitTime is "+data.IdleWaitTime);
        }
        if ((data.RequiredMinSpeed != undefined) && (data.RequiredMaxSpeed != undefined)) {
          $("#SpeedFilterOut").html("Speed Filter is minimum:"+data.RequiredMinSpeed+" maximum:"+data.RequiredMaxSpeed);
        }
        if ((data.SquelchMin != undefined) && (data.SquelchMax != undefined)) {
          $("#SquelchOut").html("Magnitude Filter is minimum:"+data.SquelchMin+" maximum:"+data.SquelchMax);
        }
        if (data.RequiredDirection != undefined) {
          $("#DirectionFilterOut").html("Direction Filter is "+data.RequiredDirection);
        }
        if (data.SamplingRate != undefined) {
          $("#SamplingRateOut").html("Sampling Rate is "+data.SamplingRate);
        }
        if (data.Units != undefined) {
          $("#UnitsOut").html("Units is "+data.Units);
        }
        if (data.Format != undefined) {
          $("#FormatOut").html("Number of Floating point Digits is "+data.digits);
        }
        if (data.Clock != undefined) {
          $("#ClockOut").html("Clock is "+data.Clock);
        }
        if (data.Version != undefined) {
          $("#VersionOut").html("Version is "+data.Version);
        }
        // future: else if data.Other  .. process other server results here.
      } // end else .. so it's JSON
    });
  });
}

function initVelocity() {
  $("#velocity").html("tbd");
  // anything for the graphical version (bar, needle)
}
window.onload = function() {
  initSocketIO();
};

$(document).ready(function() {
  initVelocity();

  $('#power_qry_btn').click(function() {
    iosocket.emit('PowerMode', "?");
  });
  $('#power_active_btn').click(function() {
    iosocket.emit('PowerMode', "A");
  });
  $('#power_idle_btn').click(function() {
    iosocket.emit('PowerMode', "I");
  });
  $('#power_pulse_btn').click(function() {
    iosocket.emit('PowerMode', "P");
  });
  $('#power_max_btn').click(function() {
    iosocket.emit('PowerMode', "X");
  });
  $('#power_mid_btn').click(function() {
    iosocket.emit('PowerMode', "D");
  });
  $('#power_min_btn').click(function() {
    iosocket.emit('PowerMode', "N");
  });
  $('#power_0_btn').click(function() {
    iosocket.emit('PowerMode', "0");
  });
  $('#power_1_btn').click(function() {
    iosocket.emit('PowerMode', "1");
  });
  $('#power_2_btn').click(function() {
    iosocket.emit('PowerMode', "2");
  });
  $('#power_3_btn').click(function() {
    iosocket.emit('PowerMode', "3");
  });
  $('#power_4_btn').click(function() {
    iosocket.emit('PowerMode', "4");
  });
  $('#power_5_btn').click(function() {
    iosocket.emit('PowerMode', "5");
  });
  $('#power_6_btn').click(function() {
    iosocket.emit('PowerMode', "6");
  });
  $('#power_7_btn').click(function() {
    iosocket.emit('PowerMode', "7");
  });

  $('#idlewait_qry_btn').click(function() {
    iosocket.emit('IdleWait', "?");
  });
  $('#idlewait_0_btn').click(function() {
    iosocket.emit('IdleWait', "0");
  });
  $('#idlewait_I_btn').click(function() {
    iosocket.emit('IdleWait', "I");
  });
  $('#idlewait_V_btn').click(function() {
    iosocket.emit('IdleWait', "V");
  });
  $('#idlewait_X_btn').click(function() {
    iosocket.emit('IdleWait', "X");
  });
  $('#idlewait_L_btn').click(function() {
    iosocket.emit('IdleWait', "L");
  });
  $('#idlewait_C_btn').click(function() {
    iosocket.emit('IdleWait', "C");
  });
  $('#idlewait_2_btn').click(function() {
    iosocket.emit('IdleWait', "2");
  });
  $('#idlewait_D_btn').click(function() {
    iosocket.emit('IdleWait', "D");
  });
  $('#idlewait_M_btn').click(function() {
    iosocket.emit('IdleWait', "M");
  });
  $('#idlewait_send_btn').click(function() {
    var userEntry = "=";
    userEntry += $('#idlewait_entry').val() + "\n";
    iosocket.emit('IdleWait', userEntry);
  });

  $('#speed_filter_qry_btn').click(function() {
    iosocket.emit('SpeedFilter', "?");
  });
  $('#min_speed_filter_send_btn').click(function() {
    var userEntry = ">";
    userEntry += $('#min_speed_filter_entry').val() + "\n";
    iosocket.emit('SpeedFilter', userEntry);
  });
  $('#max_speed_filter_send_btn').click(function() {
    var userEntry = "<";
    userEntry += $('#max_speed_filter_entry').val() + "\n";
    iosocket.emit('SpeedFilter', userEntry);
  });

  $('#squelch_qry_btn').click(function() {
    iosocket.emit('Squelch', "?");
  });
  $('#min_squelch_send_btn').click(function() {
    var userEntry = ">";
    userEntry += $('#min_squelch_entry').val() + "\n";
    iosocket.emit('Squelch', userEntry);
  });
  $('#max_squelch_send_btn').click(function() {
    var userEntry = "<";
    userEntry += $('#max_squelch_entry').val() + "\n";
    iosocket.emit('Squelch', userEntry);
  });

  $('#direction_filter_qry_btn').click(function() {
    iosocket.emit('DirectionFilter', "?");
  });
  $('#direction_towards_btn').click(function() {
    iosocket.emit('DirectionFilter', "+");
  });
  $('#direction_away_btn').click(function() {
    iosocket.emit('DirectionFilter', "-");
  });
  $('#direction_both_btn').click(function() {
    iosocket.emit('DirectionFilter', "|");
  });

  $('#sample_qry_btn').click(function() {
    iosocket.emit('SampleRate', "?");
  });
  $('#sample_I_btn').click(function() {
    iosocket.emit('SampleRate', "I");
  });
  $('#sample_V_btn').click(function() {
    iosocket.emit('SampleRate', "V");
  });
  $('#sample_X_btn').click(function() {
    iosocket.emit('SampleRate', "X");
  });
  $('#sample_2_btn').click(function() {
    iosocket.emit('SampleRate', "2");
  });
  $('#sample_L_btn').click(function() {
    iosocket.emit('SampleRate', "L");
  });
  $('#sample_C_btn').click(function() {
    iosocket.emit('SampleRate', "C");
  });

  $('#format_qry_btn').click(function() {
    iosocket.emit('Format', "?");
  });
  $('#format_0_btn').click(function() {
    iosocket.emit('Format', "0");
  });
  $('#format_1_btn').click(function() {
    iosocket.emit('Format', "1");
  });
  $('#format_2_btn').click(function() {
    iosocket.emit('Format', "2");
  });
  $('#format_3_btn').click(function() {
    iosocket.emit('Format', "3");
  });
  $('#format_4_btn').click(function() {
    iosocket.emit('Format', "4");
  });

  $('#units_qry_btn').click(function() {
    iosocket.emit('Units', "?");
  });
  $('#mps_btn').click(function() {
    iosocket.emit('Units', "M");
    iosocket.emit('Format', "1");
  });
  $('#ftps_btn').click(function() {
    iosocket.emit('Units', "F");
    iosocket.emit('Format', "1");
  });
  $('#cmps_btn').click(function() {
    iosocket.emit('Units', "C");
    iosocket.emit('Format', "0");
  });
  $('#mph_btn').click(function() {
    iosocket.emit('Units', "S");
    iosocket.emit('Format', "1");
  });
  $('#kmph_btn').click(function() {
    iosocket.emit('Units', "K");
    iosocket.emit('Format', "1");
  });

  $('#format_qry_btn').click(function() {
    iosocket.emit('Format', "?");
  });
  $('#fmt0_btn').click(function() {
    iosocket.emit('Format', "0");
  });
  $('#fmt1_btn').click(function() {
    iosocket.emit('Format', "1");
  });
  $('#fmt2_btn').click(function() {
    iosocket.emit('Format', "2");
  });
  $('#fmt3_btn').click(function() {
    iosocket.emit('Format', "3");
  });

  $('#clock_qry_btn').click(function() {
    iosocket.emit('Clock', "?");
  });
  $('#clock_fill_with_unixt_btn').click(function() {
    $('#clock_entry').val(""+Math.round(Date.now()/1000));
  });
  $('#clock_send_btn').click(function() {
    var clockEntry = "=";
    clockEntry += $('#clock_entry').val() + "\n";
    iosocket.emit('Clock', clockEntry);
  });

  $('#version_qry_btn').click(function() {
    iosocket.emit('Query', "V");
  });

// LED
  $('#DR').click(function() {
    iosocket.emit('Debug', "R");
  });
  $('#Dr').click(function() {
    iosocket.emit('Debug', "r");
  });
  $('#DY').click(function() {
    iosocket.emit('Debug', "Y");
  });
  $('#Dy').click(function() {
    iosocket.emit('Debug', "y");
  });
  $('#DG').click(function() {
    iosocket.emit('Debug', "G");
  });
  $('#Dg').click(function() {
    iosocket.emit('Debug', "g");
  });
  $('#rgb').click(function() {
    iosocket.emit('LEDTest', "0");
  });
  $('#Rgb').click(function() {
    iosocket.emit('LEDTest', "1");
  });
  $('#rGb').click(function() {
    iosocket.emit('LEDTest', "2");
  });
  $('#RGb').click(function() {
    iosocket.emit('LEDTest', "3");
  });
  $('#rgB').click(function() {
    iosocket.emit('LEDTest', "4");
  });
  $('#RgB').click(function() {
    iosocket.emit('LEDTest', "5");
  });
  $('#rGB').click(function() {
    iosocket.emit('LEDTest', "6");
  });
  $('#RGB').click(function() {
    iosocket.emit('LEDTest', "7");
  });

});



