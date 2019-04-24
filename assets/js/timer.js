
//Variables de configuration
var code;
var duration;
var penality;
var message;
var redTime = 300;
var orangeTime = 900;
var testedCode;
var audioFile = 'bomb.mp3'; /*nom du fichier son déposé dans le dossier sounds*/
var codeFormMessage = 'Quel est le code ?';

//variables fonctionnelles
var isTimerOn = false;
var actualTime;
var timerInterval;
var clockZone = '#clock'
var circle;
var audioElement;

$(document).on('click', '#submit', function(event) {
  event.preventDefault();
  code = $("#timerCode").val();
  duration = $("#timerDuration").val();
  redTime = duration/10;
  orangeTime = duration/4;
  penality = $("#timerPenality").val();
  message = $("#timerMessage").val();

  //initialisation du compteur graphique
  circle = $('.circleCountdown').circleProgress({
    value: 1,
    size: 600,
    animation: false,
    fill: 'green',
    thickness: 50 ,
    startAngle:-45 ,
    reverse: true,
  });
  $("#config").remove();

  //affichage du temps initial
  displayTime(duration,clockZone);

  //initialisation du compteur
  actualTime = duration;

  //Insertion du formulaire d'encodage
  $("#codeForm").html('<div class="input-group mb-3">'+
  '<input type="text" id="codeValidation" class="form-control" placeholder="'+codeFormMessage+'" aria-label="codeZone" aria-describedby="codeValidation">'+
  '<div class="input-group-append">'+
  '<button class="btn btn-primary" type="button" id="codeValidationButton">Valider</button>'+
  '</div></div>')

});

$(document).keydown(function(e){
  console.log(e.keyCode);
  if(e.keyCode==112){
    if(isTimerOn){
      stopTimer();
    }
    else{
      startTimer(actualTime);
    }
  };
  if(e.keyCode==13){
    codeValidation();
  };
});

$(document).on('click', '#codeValidationButton', function(e) {
  e.preventDefault();
  codeValidation();
});

function startTimer(){
  if (!isTimerOn){
    isTimerOn = true;
    timerInterval = setInterval(function(){
      actualTime -= 1;
      displayTimer();
    }, 1000);
  };
};

function displayTime(duration,where){
  var baseDuration= '';
  if(parseInt(duration/60) < 10){
    baseDuration += '0'+parseInt(duration/60);
  }else{
    baseDuration += parseInt(duration/60);
  };
  baseDuration += " : ";
  if(duration % 60 < 10){
    baseDuration += '0'+duration % 60;
  }else{
    baseDuration += duration % 60;
  };
  $(where).html(baseDuration);
};

function codeValidation(){
    testedCode = $("#codeValidation").val();
    if (testedCode == code){
      stopTimer();
      $("#codeForm").html('<div class="alert alert-success" role="alert">'+message+'</div>');
    }
    else{
      if(actualTime > penality){
        actualTime -= penality;
      }
      else{
        actualTime = 0;
      }

    }
    displayTimer();
  };


function stopTimer(){
  isTimerOn = false;
  clearInterval(timerInterval);
};

function displayTimer(){
  if(actualTime < 0){
    stopTimer();
    audioPlay();
  }
  else{
    if(actualTime <= orangeTime ){
      $('.circleCountdown').circleProgress({
        fill:'orange',
      });
      $('#clock').removeClass('green').addClass('orange');
    }
    if(actualTime <= redTime ){
      $('.circleCountdown').circleProgress({
        fill:'red',
      });
      $('#clock').removeClass('green').addClass('red');
    }
    var actualPercent = (actualTime/duration)*1;
    $('.circleCountdown').circleProgress({
      value:actualPercent
    });
    displayTime(actualTime,clockZone);}
}

function audioPlay(){
  var audio = new Audio('assets/sounds/'+ audioFile);
  audio.play();
}
