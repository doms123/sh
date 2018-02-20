$(document).ready(function() {
	var id = localStorage.getItem("user_id");
	pageTitleAndLoader("To do's");
	loadTodo();

	function loadTodo() {
		$.ajax({
			type: 'POST',
			url: ci_base_url+'viewAllTodo', 
			dataType: "json",
			crossDomain:true, 
			data: {'userid':id},
			beforeSend: function(){
				$("#todoBody").html('<tr><td class="loadingTodo" style="text-align: left;"><i class="ion-loading-a"></i> &nbsp;Loading . . .</td></tr>');
			},
			success : function(data) {
				var data = data.result;
				var maxLoop = data.length;
				if(maxLoop > 0) {
					var html = '';
					for(x = 0; x < maxLoop; x++) {
						if(data[x].is_read == 0) {
							if(msgType != 3) {
								html += '<tr class="tr unread" data-todoid='+data[x].todo_id+' data-receiver='+data[x].todo_userid+'>';
							}else {
								html += '<tr class="tr" data-todoid='+data[x].todo_id+' data-receiver='+data[x].todo_userid+'>';
							}
						}else {
							html += '<tr class="tr" data-todoid='+data[x].todo_id+' data-receiver='+data[x].todo_userid+'>';
						}

							if(data[x].photo == null || data[x].photo == '') {
								html += '<td><span class="noPhoto">'+data[x].name.charAt(0)+'</span></td>';
							}else {
						  		html += '<td><img src="https://sellinghive.applite.com/ci_upload/w45_'+data[x].photo+'"></td>';
						  	}
							html += '<td>';
								html += '<p class="mb2"><span class="color-green fsize13">$'+numberWithCommas(data[x].offerAmount)+'</span> for</p>';
								html += '<p class="fwB mb2 taskName">'+data[x].offerName+'</p>';
								html += '<p>Date created: '+data[x].dateAdded+'</p>';
							html += '</td>';

							if(data[x].offereeAccepted == 1 && data[x].offererAccepted == 1) {
								html += '<td><span>Completed</span></td>';
							}else {
								if(data[x].offereeAccepted == 1) {
									html += '<td><input type="checkbox" id="complete" checked class="checkBtn" data-id="'+data[x].todo_id+'"><label for="complete">&nbsp;</label></td>';
								}else {
									html += '<td><input type="checkbox" id="complete" class="checkBtn" data-id="'+data[x].todo_id+'"><label for="complete">&nbsp;</label></td>';
								}
							}
						html += '</tr>';
					}
				}else {
					html += '<tr><td class="noTodo">No Todo\'s yet.</td></tr>';
				}

				$("#todoBody").html(html);
	
			}
		});
	}

	$("body").on("click", ".checkBtn", function() {
		var status = $(this).prop('checked');
		var todoId = $(this).attr('data-id');
		var todoName = $(this).parents('tr').find(".taskName").html();
		$("#completeModal, #removeCompleteModal").attr('data-id', todoId);
		$(".taskName").html(todoName);
		if(status == true) {
			$("#completeModal").modal("show");
		}else {
			$("#removeCompleteModal").modal("show");
		}
	})

	$("#completeModal .cancelBtn").click(function() {
		var todoId = $("#completeModal").attr('data-id');
		$("tr[data-todoid='"+todoId+"']").find("#complete").prop('checked', false);
	})

	$("#removeCompleteModal .cancelBtn").click(function() {
		var todoId = $("#removeCompleteModal").attr('data-id');
		$("tr[data-todoid='"+todoId+"']").find("#complete").prop('checked', true);
	})

	$(".completeBtn").click(function() {
		var todoId = $("#completeModal").attr('data-id');
		$.ajax({
			type: 'POST',
			url: ci_base_url+'completeTodo', 
			dataType: "json",
			crossDomain:true, 
			data: {'userid':id, 'todoId': todoId},
			success : function(data) {
				if(data.success == 1) {
					$("#completeModal").modal('hide');	
					$.toast({
					    text: 'Todo task completed',
					    allowToastClose: false,
					    showHideTransition: 'fade',
					    position: 'bottom-center',
					    textAlign: 'center',
					    loader: false,
					    stack: false
					});

					loadTodo();
				}
			}
		});
	});

	$(".removeCompleteBtn").click(function() {
		var todoId = $("#removeCompleteModal").attr('data-id');
		console.log(todoId);
		$.ajax({
			type: 'POST',
			url: ci_base_url+'removeCompleteTodo', 
			dataType: "json",
			crossDomain:true, 
			data: {'userid':id, 'todoId': todoId},
			success : function(data) {
				if(data.success == 1) {
					$("#removeCompleteModal").modal('hide');	
					$.toast({
					    text: 'Todo task updated',
					    allowToastClose: false,
					    showHideTransition: 'fade',
					    position: 'bottom-center',
					    textAlign: 'center',
					    loader: false,
					    stack: false
					});

					loadTodo();
				}
			}
		});
	});
});
