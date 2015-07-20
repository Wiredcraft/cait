'use strict';

import $ from 'jquery';


var APIClient = {};

APIClient.getCompanies = function() {
    return this._ajax('GET', '/api/companies/');
};

APIClient.getCompanyDetail = function(companyId) {
    return this._ajax('GET', `/api/companies/${companyId}/`);
};

APIClient._ajax = function(type, url, data={}) {
    type = type.toUpperCase();
    let params = {
        type: type,
        url: url,
        contentType: 'application/json',
        data: csrfSafeMethod(type) ? data : JSON.stringify(data),
    };

    return $.ajax(params);
};


function csrfSafeMethod(method) {
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}


export { APIClient };
