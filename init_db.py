import os
import csv
import json

from app import db
from app.api_module.models import Company, EmissionReport, ReductionTarget, Milestone


DATA_PATH = 'seed_data/'


def init_db():
    """Erase database, seed it with mock data."""
    db.drop_all()
    db.create_all()
    seed_companies()
    seed_emission_reports()
    seed_reduction_targets()
    seed_milestones()


def seed_companies():
    with open(os.path.join(DATA_PATH, 'companies.csv')) as csv_file:
        fields = ['name', 'revenue', 'country', 'sector']
        reader = csv.DictReader(csv_file, fields)
        next(reader)  # skip header

        for row in reader:
            company = Company(
                name=row['name'].strip(),
                revenue=float(row['revenue']),
                country=row['country'].strip(),
                sector=row['sector'].strip(),
            )
            db.session.add(company)

    db.session.commit()


def seed_emission_reports():
    with open(os.path.join(DATA_PATH, 'emissions.csv')) as csv_file:
        fields = ['company', 'year', 'emissions', 'revenue']
        reader = csv.DictReader(csv_file, fields)
        next(reader)

        for row in reader:
            emission_report = EmissionReport(
                company=try_get_company(row['company']),
                year=int(row['year']),
                emissions=float(row['emissions']),
                revenue=float(row['revenue']),
            )
            db.session.add(emission_report)

    db.session.commit()


def seed_reduction_targets():
    with open(os.path.join(DATA_PATH, 'target.csv')) as csv_file:
        fields = ['company', 'size', 'base_year', 'final_year']
        reader = csv.DictReader(csv_file, fields)
        next(reader)

        for row in reader:
            reduction_target = ReductionTarget(
                company=try_get_company(row['company']),
                size=float(row['size']),
                base_year=int(row['base_year']),
                final_year=int(row['final_year']),
            )
            db.session.add(reduction_target)

    db.session.commit()


def seed_milestones():
    for company_row in json.load(open(DATA_PATH + 'milestones.json')):
        company = company_row['company'].strip()
        reduction_target = ReductionTarget.query.join(Company).filter(
            Company.name==company).first()

        if not reduction_target:
            raise ValueError('cannot find company "%s"' % company)
        reduction_target.science_based_method = company_row['method'].strip()

        for milestone_row in company_row['milestones']:
            milestone = Milestone(
                reduction_target=reduction_target,
                year=int(milestone_row['year']),
                size=float(milestone_row['size']),
            )
            db.session.add(milestone)

    db.session.commit()


def try_get_company(name):
    company = Company.query.filter_by(name=name.strip()).first()
    if not company:
        raise ValueError('cannot find company "%s"' % name)
    return company


if __name__ == '__main__':
    init_db()
