console.log('start');

(function($){
  $(function() {
    console.log('main');
    var socket = io();
    socket.on('connect', function(data) {
      console.log('connect');
      var userName;
      var userConfirm;
      do {
        console.log('reconnect');
        userName = prompt('Please enter your user name');
        userConfirm = confirm('Click "ok" to confirm your username: ' + userName);
        if (userConfirm) {
          socket.emit('join', userName);
        }
      } while (!userConfirm);
    });
    //Form submit
    $('form').submit(function() {
      console.log('submit')
      socket.emit('chat', $('#message').val());
      $('#message').val('');
      return false;
    });
    //Display chats
    socket.on('chat', function(message) {
      console.log('chat');
      $('#chat-body').append($('<li>').text(message));
      $('html, body').animate({
        scrollTop: $(document).height()
      });
    });
    //Display users that join
    socket.on('join', function(data) {
      console.log('join');
      $('#chat-body').append($('<li>').text(data));
      $('html, body').animate({
        scrollTop: $(document).height()
      });
    });
  });
})(jQuery);
