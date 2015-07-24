import $ from 'jquery';


const APIClient = {
    getCompanies() {
        return this._ajax('GET', '/api/companies/');
    },

    _ajax(type, url, data={}) {
        type = type.toUpperCase();
        let params = {
            type: type,
            url: url,
            contentType: 'application/json',
            data: this._csrfSafeMethod(type) ? data : JSON.stringify(data),
        };

        return $.ajax(params);
    },

    _csrfSafeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    },
};


export default APIClient;
