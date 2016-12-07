var HTTP = {
    GET: function (url, headers) {
        var responseData = {};
        console.log("GET: " + url);
        return $.ajax({
            type: 'GET',
            url: url,
            headers: _.isUndefined(headers) ? {} : headers,
            async: true,
            success: function (response, textStatus, request) {
                responseData = response;
            },
            // error: function (x, status, error) {
            //     if(x.statusText == 'error'){
            //         console.log("ERROR")
            //         responseData = 'error'
            //     }
            //
            // }
        })
    },

    POST: function (url, data) {
        var responseData = null;
        console.log("POST " + url);
        $.ajax({
            type: 'POST',
            url: url,
            data: JSON.stringify(data),
            async: false,
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                responseData = response.data;
            },

        });
        return responseData;
    },

    DELETE: function (url, data) {
        var responseData = null;
        console.log("DELETE " + url);
        $.ajax({
            type: 'DELETE',
            url: url,
            data: data,
            async: false,
            success: function (response) {
                responseData = response.data;
            }
        });
        return responseData;
    }
};

module.exports = HTTP;