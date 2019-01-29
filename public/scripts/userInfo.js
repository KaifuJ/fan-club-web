$("document").ready(function() {
    $("button").click(function(){
        var $files = $("input[type=file]").get(0).files;

        if($files.length){
            var apiUrl = "https://api.imgur.com/3/image";
            var clientId = "8ae2612bf7cb691";

            var settings = {
                async: false,
                crossDomain: true,
                processData: false,
                contentType: false,
                type: 'POST',
                url: apiUrl,
                headers: {
                    Authorization: 'Client-ID ' + clientId,
                    Accept: 'application/json'
                },
                mimeType: 'multipart/form-data'
            };

            var formData = new FormData();
            formData.append("image", $files[0]);
            settings.data = formData;

            var userId = window.location.pathname.substring(7);

            // upload avatar to imgur server
            $.ajax(settings).done(function(res){
                res = JSON.parse(res);

                // add the image to imgur album
                $.ajax({
                    type: "POST",
                    url: "https://api.imgur.com/3/album/uabL4IBX0N5KhGp/add",
                    headers: {
                        Authorization: 'Client-ID ' + clientId,
                        Accept: 'application/json'
                    },
                    data: {
                        deletehashes: [res.data.deletehash]
                    }
                }).done(function(){

                    // send avatar url to my server
                    $.ajax({
                        type: "POST",
                        url: "/users/" + userId + "/avatar",
                        data: {
                            avatarUrl: res.data.link,
                            avatarDeleteHash: res.data.deletehash
                        }
                    }).done(function(){
                        alert("头像上传成功！");
                        location.reload(true);
                    });
                });
            });
        }
    });
});