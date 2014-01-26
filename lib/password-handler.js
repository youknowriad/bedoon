module.exports = {
    crypt: function(password) {
        return password;
    },

    compare: function(encrypted, password) {
        return this.crypt(password) === encrypted;
    }
};
