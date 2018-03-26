function delete_todo(e){
  debugger;
  angular.element('#'+e).fadeOut();
}

  angular.element('.to-do-list input[type=checkbox]').on('click',function(){
    debugger;
    if($(this).prop('checked'))
      $(this).parent().addClass('done-task');
    else
      $(this).parent().removeClass('done-task');
  });
  
  function check_task(elem){
    if(angular.element('#checkbox'+elem).prop('checked'))
      angular.element('#checkbox'+elem).parent().addClass('done-task');
    else
      angular.element('#checkbox'+elem).parent().removeClass('done-task');
  }

  angular.element('.to-do-label input[type=checkbox]').on('click',function(){
    debugger;
    if($(this).prop('checked'))
      $(this).parent().addClass('done-task');
    else
      $(this).parent().removeClass('done-task');
  });

function check_label(elem){
    if(angular.element('#checkbox'+elem).prop('checked'))
      angular.element('#checkbox'+elem).parent().addClass('done-task');
    else
      angular.element('#checkbox'+elem).parent().removeClass('done-task');
  }