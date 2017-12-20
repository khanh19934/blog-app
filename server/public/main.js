$(document).ready(function(){
    $(".nav-pills a").click(function(){
        $(this).tab('show');
    });
    $("#deletedAccount").click(function(){
        
    	$.ajax({
    		url:"/deleteuser",
    		type:"DELETE",
    		success:function(){

    		}
    	});
    });
    $('#deleteBlogPost').click(function(){
         var blogDeleteUrl = $(this).data("value");
         $.ajax({
            url:blogDeleteUrl,
            type:"DELETE",
            success:function(){

            }
         });
    });
    $('#likes').click(function(){
        var likeUrl = $(this).data("value");
        $.ajax({
            url:likeUrl,
            type:"POST",
            success:function(){}
        })
    });
    $('#dislikes').click(function(){
        var likeUrl = $(this).data("value");
        $.ajax({
            url:likeUrl,
            type:"POST",
            success:function(){}
        })
    });
});