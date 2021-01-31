// MELANIA GOTTARDO - Captcha

$(document).ready(function() {
  $('body').prepend("<h4>Dimostra di non essere un robot</h4>");

  // DEFERRED
  var get_value_slowly = function(){
    var buttonclick = $.Deferred();
    $('#ok').click(function()
    {
      buttonclick.resolve();
    });
    return buttonclick.promise(); // PROMISE
  }

  // AUTENTICAZIONE
  var autenticazione = function(){
    var button = get_value_slowly();
    $.getJSON({
      type:     'GET',
      url:      'http://www.dais.unive.it/~cosmo/esercitazione3/captcha.php?callback=?&getIdentifier', //id
      timeout:   5000,
      dataType: 'json'

    }).then(function(data) {
      return $.getJSON({
        type:     'GET',
        url:      'http://www.dais.unive.it/~cosmo/esercitazione3/captcha.php?callback=?&getImage&id=' + data.id, //immagine
        timeout:   5000,
        dataType: 'json'
      });

    }).then(function(data) {
      $('#captcha').attr("src", 'http://www.dais.unive.it/~cosmo/esercitazione3/' + data.url);
      return button.then(function() {
        return data;
      });

    }).then(function(data) {
      return $.getJSON({
        type:     'GET',
        url:      'http://www.dais.unive.it/~cosmo/esercitazione3/captcha.php?callback=?&sendCode&id=' + data.id + '&code=' + $("#captcha_code").val(),
        timeout:   5000,
        dataType: 'json'
      });

    }).done(function(data) { //finito
      //autenticazione
      if (data.auth) { //corretto
        $('body *').remove();
        $('body').append("<p>Autenticazione riuscita!</p>");
      } else { //errato
        $('#captcha_code').val("");
        autenticazione();
      }

    }).fail(function() { //errore
      $('body *').remove();
      $('body').append("<p>Qualcosa è andato storto :(</p>");
    });
  }

  autenticazione();
});
