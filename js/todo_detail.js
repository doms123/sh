$(function() {

	pageTitleAndLoader("To do's"); 
	offerDetails();
	function offerDetails() {
		var seg_id = getParam("todo_id");

		$.ajax({
			type: 'POST',
			url: ci_base_url+'viewTodo', 
			dataType: "json",
			crossDomain:true, 
			data: {'todoId':seg_id},
			success : function(data) {
				var data = data.result;

				var html = "";
				$.each(data, function(key, value) {
					var newValue = value.split('#');
					html += '<h3>To do Details</h3>';
				 	html += '<p class="mt10"><strong>Todo Title:</strong> <span>'+newValue[2]+'</span></p>';
				 	html += '<p class="mt10 todoContent"><strong>Todo Content:</strong> <span>'+newValue[3]+'</span></p>';
				 	html += '<p class="mt10"><strong>Todo Date:</strong> <span>'+newValue[4]+'</span></p>';	
				 	html += '<div class="tCenter"><a href="#todo.html" class="addNewTodo rad15">Add New</a> <a href="#" class="deleteTodo rad15" data-id="'+newValue[0]+'">Delete</a></div>';
				})
				$(".todoContentDetail").html(html);
			}
		});
	}

	$("body").delegate(".deleteTodo", "click", function() {
		var todoId = $(this).data('id');

		$.ajax({
			type: 'POST',
			url: ci_base_url+'deleteTodo', 
			dataType: "json",
			crossDomain:true, 
			data: {'todoId':todoId},
			beforeSend: function(){
				$(".addNewTodo").attr('disabled', true);
				$(".deleteTodo").attr('disabled', true).html('<i class="fa fa-spinner fa-spin"></i> &nbsp;Deleting');
			},
			success : function(response) {
				$.toast({
				    text: 'Todo record was deleted',
				    allowToastClose: false,
				    showHideTransition: 'fade',
				    position: 'bottom-center',
				    textAlign: 'center',
				    loader: true,
				    stack: false,  
				    afterHidden: function () {
						$(".addNewTodo").attr('disabled', false);
						$(".deleteTodo").attr('disabled', false).html('Delete');
						location.reload();
					}
				});
			}
		});
	});
});