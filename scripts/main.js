'use strict';

$(document).ready(function() {

  // Cache the DOM
  var $orders = $('#orders');
  var $name = $('#name');
  var $drink = $('#drink');

  var orderTemplate = $('#order-template').html();


  function addOrder(order) {
    $orders.append(Mustache.render(orderTemplate, order));
  }

  $.ajax({
    type: 'GET',
    url: 'http://rest.learncode.academy/api/learncode/orders',
    success: function(orders) {
      // each goes through each item in an array and allows you to run a function based off that item
      // For each item in the array, we're going to run this function
      // run two arguments, i which is the index and the actual item (you can call this whatever you want)
      $.each(orders, function(i, order) {
        addOrder(order);
      });
    },
    error: function() {
      alert('error loading orders');
    }
  });

  $('#add-order').on('click', function(){

    var order = {
      name: $name.val(),
      drink: $drink.val(),
    };

    $.ajax({
      type: 'POST',
      url: 'http://rest.learncode.academy/api/learncode/orders',
      data: order,
      success: function(newOrder){
        addOrder(newOrder);
      },
      error: function() {
        alert('error loading orders');
      }
    });
  });

  // This will listen to any click events on the #orders ul and it'll fire off it it's part of the remove class
  $orders.delegate('.remove', 'click', function() {

    var $li = $(this).closest('li');

    $.ajax({
      type: 'DELETE',
      url: 'http://rest.learncode.academy/api/learncode/orders/' + $(this).attr('data-id'),
      success: function() {
        $li.fadeOut(500, function() {
          $(this).remove();
        });
      }
    });
  });

  $orders.delegate('.editOrder', 'click', function() {
    var $li = $(this).closest('li');

    // Set the input value to the same as the span
    $li.find('input.name').val( $li.find('span.name').html() );
    $li.find('input.drink').val( $li.find('span.drink').html() );
    $li.addClass('edit');
  });

  $orders.delegate('.cancelEdit', 'click', function() {
    $(this).closest('li').removeClass('edit');
  });

$orders.delegate('.saveEdit', 'click', function() {
  var $li = $(this).closest('li');
  var order = {
    name: $li.find('input.name').val(),
    drink: $li.find('input.drink').val()
  };

  $.ajax({
    type: 'PUT',
    url: 'http://rest.learncode.academy/api/learncode/orders/' + $li.attr('data-id'),
    data: order,
    success: function() {
      $li.find('span.name').html(order.name);
      $li.find('span.drink').html(order.drink);
      $li.removeClass('edit');
    },
    error: function() {
      alert('error updating order');
    }
  });

});

});
