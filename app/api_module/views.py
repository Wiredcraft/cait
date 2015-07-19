from flask import Blueprint, jsonify

from .models import Company
from .schemas import CompanySchema, CompanyDetailSchema


mod = Blueprint('api_module', __name__, url_prefix='/api')

@mod.route('/companies/')
def get_companies():
    query = Company.query.all()
    companies = CompanySchema().dump(query, many=True)
    return jsonify(data=companies.data)

@mod.route('/companies/<int:company_id>/')
def get_company_detail(company_id):
    query = Company.query.get_or_404(company_id)
    company = CompanyDetailSchema().dump(query)
    return jsonify(company.data)
