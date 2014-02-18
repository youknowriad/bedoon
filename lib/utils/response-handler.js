module.exports = {

    STATUS_SUCCESS: "success",
    STATUS_ERROR:   "error",

    getResponse: function(data) {
       return {
           status: this.STATUS_SUCCESS,
           data: data
       }
    },

    getErrorResponse: function(code, message) {
        return {
            status: this.STATUS_ERROR,
            code: code,
            message: message
        }
    }

};