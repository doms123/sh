$(function() {
	var id = localStorage.getItem("user_id");
	pageTitleAndLoader('Users');
	loadUsers();
	function loadUsers() {
		$.ajax({
			type: 'POST',
			url: ci_base_url+'loadUsers', 
			dataType: "json",
			crossDomain:true, 
			data : {userId: id},
			beforeSend: function() {
				$(".loadUser").html('<tr class="tr height70"><i class="ion-loading-c"></i> &nbsp;Loading . . .</tr>');
			},
			success : function(data) {
				console.log(data);
				var data = data.result;
				var maxLoop = data.length;

				var html = "";
				for(x = 0; x < maxLoop; x++) {
					if(data[x].is_active == 1) {
						html += '<tr class="tr height70" data-userid='+data[x].id+' data-profile='+data[x].id+'>';
					}else {
						html += '<tr class="tr height70" data-userid='+data[x].id+' data-profile="inactive">';
					}
						if(data[x].photo == null || data[x].photo == '') {
							html += '<td><span class="noPhoto">'+data[x].name.charAt(0)+'</span></td>';
						}else {
					  		html += '<td><img src="https://sellinghive.applite.com/ci_upload/w45_'+data[x].photo+'"></td>';
					  	}
					 	html += '<td><h6>'+stripSlashes(data[x].name)+'</h6><p>'+stripSlashes(data[x].email)+'</p><p>Privilege:';
					 	if(data[x].userPriv == 1) {
					 		html += ' Full';
					 	}else {
					 		html += ' Normal';
					 	}
					 	html += '</p></td>';
						html += '<td>'+data[x].createdDate;

						

						if(data[x].is_active == 1) {
							html += '<span class="userStatus">Active</span>';
						}else {
							html += '<span class="userStatus">Inactive</span>';
						}

						html += '</td>';

					html += '</tr>';
				}

				if(maxLoop == 0) {
					html += '<tr class="tr height70">';
						html += '<td class="noRecords">No users yet</td>';
					html += '</tr>';
				}

				$(".loadUser").html(html);

				$('.loadUser tr').longpress(function() {
					$(this).addClass('active');

					setTimeout(function() {
						$("tr").removeClass('active');
					}, 600);

					var userId = $(this).attr("data-userid");
					editUserInfo(userId);
					$("#editUserModal").modal("show").attr("edituserid", userId);
				});
			}
		});
	}

	$(".addUserButton").click(function() {
		$("#addUserModal").modal("show");
	});

	$(".loadUser").on("click", ".tr", function() {
		var profileId = $(this).attr("data-profile");
		if(profileId != "inactive") {
			window.location.href = '#view_profile.html?id='+profileId;
			loadPageUrl(window.location.href);
		}
	});

	$(".addUserForm").submit(function(e) {
		e.preventDefault();
		var userName 		= $(".userName").val();
		var userEmail 		= $(".userEmail").val().replace(/\s/g, '');
		var userPassword 	= $(".userPassword").val().replace(/\s/g, '');
		var userPassConfirm = $(".userPassConfirm").val().replace(/\s/g, '');
		var addedById = id;
		if($('.userPriv').is(":checked")) {
			var userPriv = 1;
		}else {
			var userPriv = 0;
		}
		$.ajax({
			type: 'POST',
			url: ci_base_url+'addUser', 
			dataType: "json",
			crossDomain:true, 
			data : {'userName':userName, 'userEmail':userEmail, 'userPassword':userPassword, 'userPassConfirm':userPassConfirm, 'addedById':addedById, 'userPriv':userPriv},
			beforeSend: function() {
				$(".modal-footer button").attr('disabled', true);
			},
			success : function(data) {
				$(".modal-footer button").attr('disabled', false);
				if(data.success == 1) {
					$.toast({
					    text: data.successMsg,
					    allowToastClose: false,
					    showHideTransition: 'fade',
					    position: 'bottom-center',
					    textAlign: 'center',
					    loader: false,
					    stack: false
					});
					$("#addUserModal").modal("hide");
					loadUsers();
					$(".userName, .userEmail, .userPassword, .userPassConfirm, .userPrivLabel").val('');
				}else {
					$.toast({
					    text: data.errorMsg,
					    allowToastClose: false,
					    showHideTransition: 'fade',
					    position: 'bottom-center',
					    textAlign: 'center',
					    loader: false,
					    stack: false
					});
				}
			}
		});
	});

	function editUserInfo(userId) {
		$.ajax({
			type: 'POST',
			url: ci_base_url+'editUserInfo', 
			dataType: "json",
			crossDomain:true, 
			data : {editUserId: userId},
			success : function(data) {
				var data = data.result;
				$(".editUserName").html(stripSlashes(data.name));

				if(data.userPriv == 1) {
					$('.editUserPriv').prop('checked', true);
				}
			}
		});
	}

	$(".editUserForm").submit(function() {
		var userEditId = $("#editUserModal").attr("edituserid");
		
		if($('.editUserPriv').is(":checked")) {
			var userPriv = 1;
		}else {
			var userPriv = 0;
		}

		$.ajax({
			type: 'POST',
			url: ci_base_url+'saveEditUserInfo', 
			dataType: "json",
			crossDomain:true, 
			data : {userEditId: userEditId, 'userPriv': userPriv},
			success : function(data) {
				if(data.success == 1) {
					$("#editUserModal").modal("hide");
					loadUsers();
					$.toast({
					    text: 'User Privilege was updated',
					    allowToastClose: false,
					    showHideTransition: 'fade',
					    position: 'bottom-center',
					    textAlign: 'center',
					    loader: false,
					    stack: false
					});
				}
			}
		});
		return false;
	});
});
